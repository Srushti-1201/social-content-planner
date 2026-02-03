import requests

base_url = 'http://127.0.0.1:8000/api/posts/'

# Test GET
print("GET posts:")
response = requests.get(base_url)
print(response.json())
print()

# Test POST with scheduled_time
print("POST with scheduled_time:")
data = {
    "title": "Test Post with scheduled_time",
    "content": "Content here",
    "platform": "Facebook",
    "scheduled_time": "2023-12-01T10:00:00Z"
}
response = requests.post(base_url, json=data)
print(f"Status: {response.status_code}")
print(response.json())
print()

# Test POST without scheduled_time
print("POST without scheduled_time:")
data2 = {
    "title": "Test Post no scheduled_time",
    "content": "Content here 2",
    "platform": "Twitter"
}
response = requests.post(base_url, json=data2)
print(f"Status: {response.status_code}")
print(response.json())
print()

# Test invalid POST
print("POST invalid (missing title):")
data3 = {
    "content": "Content here 3",
    "platform": "LinkedIn"
}
response = requests.post(base_url, json=data3)
print(f"Status: {response.status_code}")
print(response.json())
print()

# GET again to see new posts
print("GET posts after:")
response = requests.get(base_url)
print(response.json())
