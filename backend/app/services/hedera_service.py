import os
import json
from typing import Tuple
import logging
from hedera import (
    Client, AccountId, PrivateKey, TopicId,
    TopicCreateTransaction, TopicMessageSubmitTransaction,
    TransactionReceipt, ReceiptStatusException
)

logger = logging.getLogger(__name__)

class HederaService:
    def __init__(self):
        # Initialize with DER encoded credentials
        self.account_id = AccountId.fromString(os.environ["HEDERA_ACCOUNT_ID"])
        self.private_key = PrivateKey.fromString(os.environ["HEDERA_PRIVATE_KEY"])
        
        # Configure testnet client with operator
        self.client = Client.forTestnet()
        self.client.setOperator(self.account_id, self.private_key)
        logger.info(f"Hedera client initialized for account {self.account_id}")

    def create_content_topic(self) -> str:
        """Create a new HCS topic for content registration"""
        try:
            # Create a new topic transaction
            transaction = TopicCreateTransaction()
            
            # Submit the transaction to the Hedera network
            transaction_response = transaction.execute(self.client)
            
            # Get the receipt to ensure successful execution and get the topic ID
            receipt = transaction_response.getReceipt(self.client)
            topic_id = receipt.topicId.toString()
            
            logger.info(f"Created new content topic: {topic_id}")
            return topic_id
            
        except Exception as e:
            logger.error(f"Topic creation failed: {str(e)}")
            raise RuntimeError(f"HCS topic creation error: {str(e)}")

    def register_content(self, content_data: str, topic_id: str) -> Tuple[str, str]:
        """Submit content to HCS topic with enhanced validation"""
        try:
            # Validate input parameters
            if not content_data or len(content_data) > 1024:
                raise ValueError("Invalid content data payload")

            # Parse topic ID string to TopicId object
            try:
                topic_id_obj = TopicId.fromString(topic_id)
            except Exception as parse_error:
                logger.error(f"Invalid topic ID format: {topic_id}")
                raise ValueError(f"Invalid topic ID format: {topic_id}")

            # Submit message to specified topic
            transaction = TopicMessageSubmitTransaction()
            transaction.setTopicId(topic_id_obj)
            transaction.setMessage(content_data.encode("utf-8"))
            
            # Execute the transaction
            transaction_response = transaction.execute(self.client)
            
            # Get the receipt to confirm the transaction was successful
            receipt = transaction_response.getReceipt(self.client)
            
            # Get the record to access the consensus timestamp
            record = transaction_response.getRecord(self.client)
            
            # Convert Java Instant to ISO format string
            # First get seconds and nanos separately
            timestamp_seconds = record.consensusTimestamp.getEpochSecond()
            timestamp_nanos = record.consensusTimestamp.getNano()
            
            # Format as ISO string manually
            timestamp_str = f"{timestamp_seconds}.{timestamp_nanos:09d}Z"
            
            return (
                str(transaction_response.transactionId),
                timestamp_str
            )

        except ValueError as e:
            # Re-raise ValueError exceptions
            raise RuntimeError(str(e))
        except Exception as e:
            # Simplified exception handling
            logger.error(f"Content submission error: {str(e)}")
            if "INVALID_TOPIC_ID" in str(e):
                raise RuntimeError(f"Invalid topic ID: {topic_id}")
            else:
                raise RuntimeError(f"HCS message submission failed: {str(e)}")

    def close(self):
        """Clean up client connections"""
        if self.client:
            self.client.close()
            logger.info("Hedera client connection closed")
