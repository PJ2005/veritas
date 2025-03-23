# common/redis_client.py
import redis

def get_redis_connection():
    """Creates a connection to the local Redis instance"""
    return redis.Redis(host='localhost', port=6379, db=0)

def test_redis_connection():
    """Tests if Redis connection is working"""
    client = get_redis_connection()
    try:
        response = client.ping()
        print(f"Redis connection successful: {response}")
        return True
    except redis.ConnectionError:
        print("Failed to connect to Redis. Is Redis running locally?")
        return False

if __name__ == "__main__":
    test_redis_connection()
