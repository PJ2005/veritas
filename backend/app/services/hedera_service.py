import os
import json
from typing import Tuple
import logging
from hedera import (
    Client, AccountId, PrivateKey,
    TopicCreateTransaction, TopicMessageSubmitTransaction,
    TransactionReceipt
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
            tx = TopicCreateTransaction().execute(self.client)
            receipt = tx.getReceipt(self.client)
            topic_id = receipt.topicId.toString()
            logger.info(f"Created new content topic: {topic_id}")
            return topic_id
            
        except Exception as e:
            logger.error(f"Topic creation failed: {str(e)}")
            raise RuntimeError("HCS topic creation error")

    def register_content(self, content_data: str, topic_id: str) -> Tuple[str, str]:
        """Submit content to HCS topic with enhanced validation"""
        try:
            # Validate input parameters
            if not content_data or len(content_data) > 1024:
                raise ValueError("Invalid content data payload")

            # Submit message to specified topic
            transaction = (TopicMessageSubmitTransaction()
                .setTopicId(topic_id)
                .setMessage(content_data.encode("utf-8"))
                .execute(self.client))

            receipt = transaction.getReceipt(self.client)
            return (
                str(transaction.transactionId),
                str(receipt.consensusTimestamp)
            )
            
        except Exception as e:
            logger.error(f"Content submission error: {str(e)}")
            raise RuntimeError("HCS message submission failed")

    def close(self):
        """Clean up client connections"""
        if self.client:
            self.client.close()
            logger.info("Hedera client connection closed")
