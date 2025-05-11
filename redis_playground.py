

# File name: redis_playground.py 

import redis

# Connect to the Redis server (assuming it's running locally on port 6379)
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

# =========================
# Example 1: Set and Get
# =========================
# Save a simple key-value pair
r.set('test_key', 'hello Redis')

# Retrieve the value
value = r.get('test_key')
print(f'Value from Redis: {value}')
print("")

# =========================
# Example 2: Recent Searches List
# =========================
# Define the Redis key for storing recent searches
search_key = 'recent_searches'

# List of image search results to add
recent_searches = ['image1.jpg', 'image2.jpg', 'image3.jpg']

# Push items to the beginning of the list (LPUSH)
r.lpush(search_key, *recent_searches)

# Trim the list to keep only the 10 most recent items
r.ltrim(search_key, 0, 9)

# Read all items from the list (LRANGE)
recent_searches = r.lrange(search_key, 0, -1)
print("Recent Searches (Global):", recent_searches)
print("")

# =========================
# Example 3: Per-User Recent Searches
# =========================

# Function to add a new search term to a user's recent searches
def add_recent_search(user_id: str, search_term: str, max_items: int = 5):
    """
    Add a new search term to a user's recent searches list.
    Keeps only the 'max_items' most recent terms.
    """
    key = f"user:{user_id}:recent_searches"
    
    # Add the new term to the start of the list (LPUSH)
    r.lpush(key, search_term)
    
    # Keep only the most recent `max_items` terms (LTRIM)
    r.ltrim(key, 0, max_items - 1)

# Function to retrieve a user's recent searches
def get_recent_searches(user_id: str):
    """
    Retrieve a user's recent searches.
    """
    key = f"user:{user_id}:recent_searches"
    return r.lrange(key, 0, -1)

# Example usage of the functions
if __name__ == "__main__":
    user_id = "123"  # Simulated user ID
    
    # Add searches for the user
    add_recent_search(user_id, "Leaf Spot")
    add_recent_search(user_id, "Mildew")
    add_recent_search(user_id, "Anthracnose")

    # Retrieve and print the recent searches
    searches = get_recent_searches(user_id)
    print(f"Recent searches for user {user_id}: {searches}")
    print("")

# =========================
# Example 4: List Operations
# =========================
# Creating a list and adding items
r.lpush('my_list', 'apple', 'banana', 'cherry')

# Retrieving all items from the list
my_list = r.lrange('my_list', 0, -1)
print("List values:", my_list)

# Removing an item from the list (LREM)
r.lrem('my_list', 1, 'banana')  # Only removes one occurrence of 'banana'
my_list = r.lrange('my_list', 0, -1)
print("List after removal:", my_list)

# Popping an item from the list (LPOP)
item = r.lpop('my_list')
print("Popped item:", item)
print("List after pop:", r.lrange('my_list', 0, -1))

# =========================
# Example 5: Set Operations
# =========================
# Creating a set and adding items
r.sadd('my_set', 'apple', 'banana', 'cherry')

# Retrieving all items from the set (SMEMBERS)
my_set = r.smembers('my_set')
print("Set values:", my_set)

# Trying to add an item that already exists (no duplicate allowed in sets)
r.sadd('my_set', 'apple')  # This will not add 'apple' again

# Removing an item from the set (SREM)
r.srem('my_set', 'banana')
print("Set after removal:", r.smembers('my_set'))

# =========================
# Example 6: Hash Operations
# =========================
# Creating a hash and adding fields
r.hset('user:123', 'name', 'John')
r.hset('user:123', 'email', 'john@example.com')

# Retrieving all fields from the hash (HGETALL)
user = r.hgetall('user:123')
print("User hash:", user)

# Retrieving a specific field from the hash (HGET)
name = r.hget('user:123', 'name')
print("User name:", name)

# Updating a field in the hash (HSET)
r.hset('user:123', 'email', 'new_email@example.com')
print("Updated user hash:", r.hgetall('user:123'))

# =========================
# Example 7: Sorted Set Operations
# =========================
# Creating a sorted set and adding items with scores
r.zadd('user_scores', {'John': 100, 'Alice': 200, 'Bob': 150})

# Retrieving all items from the sorted set (ZRANGE)
sorted_users = r.zrange('user_scores', 0, -1, withscores=True)
print("Sorted users:", sorted_users)

# Retrieving the score of a specific user (ZSCORE)
score = r.zscore('user_scores', 'Alice')
print("Alice's score:", score)

# Removing an item from the sorted set (ZREM)
r.zrem('user_scores', 'Bob')
print("Sorted users after removal:", r.zrange('user_scores', 0, -1, withscores=True))

# =========================
# Example 8: Queue Operations
# =========================
# Creating a queue (using a list) and adding tasks
queue_name = 'task_queue'
r.rpush(queue_name, 'task1')
r.rpush(queue_name, 'task2')
r.rpush(queue_name, 'task3')

# Retrieving and processing a task from the front of the queue (LPOP)
task = r.lpop(queue_name)
print("Processed task:", task)

# Retrieving remaining tasks in the queue
remaining_tasks = r.lrange(queue_name, 0, -1)
print("Remaining tasks:", remaining_tasks)

# =========================
# Example 9: Expiring Keys
# =========================
# Setting a key with an expiration time of 10 seconds (SETEX)
r.setex('temporary_key', 10, 'This will expire in 10 seconds')

# Reading the value before expiration
value = r.get('temporary_key')
print("Value before expiry:", value)

# Waiting for 11 seconds (to ensure the key expires)
import time
time.sleep(11)

# Reading the value after expiration
value = r.get('temporary_key')
print("Value after expiry:", value)

# =========================
# Example 10: Counter Operations
# =========================
# Creating a counter and incrementing its value
r.set('counter', 0)
r.incr('counter')
print("Counter value after increment:", r.get('counter'))

# Decrementing the counter value
r.decr('counter')
print("Counter value after decrement:", r.get('counter'))
