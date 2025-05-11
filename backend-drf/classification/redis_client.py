
import redis
from django.conf import settings

# Create a single Redis connection instance
if getattr(settings, 'ENABLE_RECENT_IMAGES_FEATURE', False):
    redis_client = redis.Redis(
        host=getattr(settings, 'REDIS_HOST', 'localhost'),
        port=getattr(settings, 'REDIS_PORT', 6379),
        db=0,
        decode_responses=True
    )
else:
    redis_client = None


