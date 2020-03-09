from instagram_private_api import Client, ClientCompatPatch
import json
import sys

user_name = 'socialweb554'
password = 'socialweb554.'

#1518284433 -  rober downey jr

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python3 get_feed.py [query] [file_result]')
        sys.exit(0)

    query = sys.argv[1]

    api = Client(user_name, password)

    user_feed = api.user_feed(query)

    feed_data = []

    for photo in user_feed["items"]:

        media_id = photo["pk"]

        media = api.media_n_comments(media_id, n=5)

        media_data = {
            "media_id": media_id,
            "username": None,
            "full_name": None,
            "caption": None,
            "comment_count": None,
            "like_count": None,
            "comments": []
        }

        for comment in media:
            # print(comment['text'])
            media_data["comments"].append(comment['text'])

        media_data["caption"] = photo["caption"]["text"]
        media_data["comment_count"] = photo["comment_count"]
        media_data["like_count"] = photo["like_count"]
        media_data["username"] = photo["user"]["username"]
        media_data["full_name"] = photo["user"]["full_name"]

        feed_data.append(media_data)

    print(json.dumps(feed_data))
    sys.stdout.flush()