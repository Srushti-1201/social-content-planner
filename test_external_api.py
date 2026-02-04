#!/usr/bin/env python
"""
Test script for the External Quote API endpoint
"""
import requests

def test_external_quote():
    # Test direct access to quotable.io
    print("Testing direct access to quotable.io...")
    try:
        response = requests.get("https://api.quotable.io/random", timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        print(f"Response: {response.text[:500]}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test through our backend
    print("\n\nTesting through our backend...")
    try:
        response = requests.get("http://127.0.0.1:8000/api/external/quote/")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_external_quote()
