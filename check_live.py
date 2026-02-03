import requests

urls = [
    'https://srushti.onrender.com/',
    'https://srushti.onrender.com/api/posts/',
    'https://srushti.onrender.com/api/posts/analytics/',
    'https://srushti.onrender.com/admin/',
]

for url in urls:
    try:
        response = requests.get(url)
        print(f"{url}: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.text[:200]}...")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"{url}: Error - {e}")
    print()
