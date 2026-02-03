import requests

url = 'http://127.0.0.1:8000/api/posts/'
data = {
    "title": "Test Post",
    "content": "This is a test",
    "platform": "Facebook",
    "status": "Draft"
}

response = requests.post(url, json=data)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")
