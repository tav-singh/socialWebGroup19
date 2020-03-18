from instagram_web_api import Client, ClientCompatPatch, ClientError, ClientLoginError
import json
import sys
import re

#1518284433 -  rober downey jr
# 30588147,
if __name__ == '__main__':
    if len(sys.argv) < 1:
        print('Usage: python3 get_user.py [query] ')
        sys.exit(0)

    query = sys.argv[1]

    api = Client(auto_patch=True, drop_incompat_keys=False)

    user = api.user_info2(query)

    retval = {
        "posts": user["counts"]["media"],
        "followers": user["counts"]["followed_by"],
        "following": user["counts"]["follows"],
        "is_verified": user["is_verified"],
        "fullname": user["full_name"],
        "profile_pic_url": user["profile_pic_url_hd"]
    }

    print(json.dumps(retval))
    sys.stdout.flush()