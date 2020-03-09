from instagram_private_api import Client, ClientCompatPatch
import json
import sys

user_name = 'gamma12101'
password = 'gamma1210'

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python3 search_user.py [query]')
        sys.exit(0)
        
    query = sys.argv[1]

    api = Client(user_name, password)

    user_search = api.search_users(query)

    print(json.dumps(user_search))
    sys.stdout.flush()