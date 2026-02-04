#!/usr/bin/env python
"""
Test script for CRUD operations on the Social Media Planner API
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def print_response(response, operation):
    print(f"\n{'='*50}")
    print(f"OPERATION: {operation}")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print(f"{'='*50}\n")

# Test 1: CREATE Post
print("Testing CREATE Post...")
create_data = {
    "title": "Test Post",
    "content": "This is a test post content",
    "platform": "facebook",
    "status": "draft",
    "scheduled_time": None,
    "image_url": "",
    "engagement_score": 0
}

try:
    response = requests.post(f"{BASE_URL}/posts/", json=create_data)
    print_response(response, "CREATE Post")
    post_id = response.json().get('id')
except Exception as e:
    print(f"CREATE failed: {e}")
    post_id = None

# Test 2: READ Posts List
print("Testing READ Posts List...")
try:
    response = requests.get(f"{BASE_URL}/posts/")
    print_response(response, "READ Posts List")
except Exception as e:
    print(f"READ List failed: {e}")

# Test 3: READ Single Post
if post_id:
    print(f"Testing READ Single Post (ID: {post_id})...")
    try:
        response = requests.get(f"{BASE_URL}/posts/{post_id}/")
        print_response(response, "READ Single Post")
    except Exception as e:
        print(f"READ Single failed: {e}")

# Test 4: UPDATE Post
if post_id:
    print(f"Testing UPDATE Post (ID: {post_id})...")
    update_data = {
        "title": "Updated Post",
        "content": "Updated content",
        "platform": "instagram",
        "status": "published",
        "scheduled_time": None,
        "image_url": "",
        "engagement_score": 50
    }
    try:
        response = requests.put(f"{BASE_URL}/posts/{post_id}/", json=update_data)
        print_response(response, "UPDATE Post")
    except Exception as e:
        print(f"UPDATE failed: {e}")

# Test 5: Analytics Endpoint
print("Testing Analytics Endpoint...")
try:
    response = requests.get(f"{BASE_URL}/posts/analytics/")
    print_response(response, "Analytics")
except Exception as e:
    print(f"Analytics failed: {e}")

# Test 6: External Quote Endpoint
print("Testing External Quote Endpoint...")
try:
    response = requests.get(f"{BASE_URL}/external/quote/")
    print_response(response, "External Quote")
except Exception as e:
    print(f"External Quote failed: {e}")

# Test 7: DELETE Post (cleanup)
if post_id:
    print(f"Testing DELETE Post (ID: {post_id})...")
    try:
        response = requests.delete(f"{BASE_URL}/posts/{post_id}/")
        print_response(response, "DELETE Post")
    except Exception as e:
        print(f"DELETE failed: {e}")

print("\n" + "="*50)
print("All CRUD Operations Tested!")
print("="*50)
