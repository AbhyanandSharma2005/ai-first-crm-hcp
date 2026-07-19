import json
import redis

from utils.logger import logger


class RedisService:

    def __init__(self):

        try:

            self.client = redis.Redis(
                host="localhost",
                port=6379,
                db=0,
                decode_responses=True
            )

            self.client.ping()

            logger.info("Redis connected successfully.")

        except Exception as e:

            logger.exception(
                f"Redis connection failed: {e}"
            )

            self.client = None

    # -------------------------------------------------
    # Set cache
    # -------------------------------------------------

    def set(
        self,
        key: str,
        value,
        expire: int = 300
    ):

        if not self.client:
            return

        try:

            self.client.set(
                key,
                json.dumps(value),
                ex=expire
            )

        except Exception as e:

            logger.exception(e)

    # -------------------------------------------------
    # Get cache
    # -------------------------------------------------

    def get(
        self,
        key: str
    ):

        if not self.client:
            return None

        try:

            value = self.client.get(key)

            if value:

                return json.loads(value)

            return None

        except Exception as e:

            logger.exception(e)

            return None

    # -------------------------------------------------
    # Delete single key
    # -------------------------------------------------

    def delete(
        self,
        key: str
    ):

        if not self.client:
            return

        try:

            deleted = self.client.delete(key)

            logger.info(f"Deleted cache key: {key} ({deleted})")

        except Exception as e:

            logger.exception(e)

    # -------------------------------------------------
    # Delete keys by pattern
    # -------------------------------------------------

    def delete_pattern(
        self,
        pattern: str
    ):

        if not self.client:
            return

        try:

            keys = self.client.keys(pattern)

            if not keys:

                logger.info(f"No cache keys found for pattern: {pattern}")

                return

            self.client.delete(*keys)

            logger.info(
                f"Deleted {len(keys)} cache keys matching '{pattern}'"
            )

        except Exception as e:

            logger.exception(e)

    # -------------------------------------------------
    # Clear database
    # -------------------------------------------------

    def clear(self):

        if not self.client:
            return

        try:

            self.client.flushdb()

            logger.info("Redis cache cleared.")

        except Exception as e:

            logger.exception(e)

    # -------------------------------------------------
    # Check existence
    # -------------------------------------------------

    def exists(
        self,
        key: str
    ):

        if not self.client:
            return False

        return bool(self.client.exists(key))


redis_service = RedisService()