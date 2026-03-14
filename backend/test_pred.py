import urllib.request
import json
req = urllib.request.Request(
    'https://eko-twin.onrender.com/api/predict', 
    data=b'{"horizon":"24h"}', 
    headers={'Content-Type': 'application/json'}
)
try:
    print(urllib.request.urlopen(req).read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))
