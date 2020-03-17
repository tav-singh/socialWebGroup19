from instagram_web_api import Client, ClientCompatPatch, ClientError, ClientLoginError
import json
import sys
import re

#1518284433 -  rober downey jr
# 30588147,
def cleanText(text):
    # ret = regex.sub(" ", text)
    ret = re.sub("[#,!,?]", "", text)
    new_str = ""
    doc = ret.encode('ascii',errors='ignore').decode()
    if "@" in doc:
        for word in doc.split(" "):
            if "@" in word:
                continue
            else:
                new_str = new_str + word + " "
    else:
        new_str = new_str + doc
    ret = new_str.strip()
    ret = re.sub("[\n,/,\\\]", "", ret)
    # ret = ret.replace("  ", " ")
    return ret

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python3 get_feed.py [query] ')
        sys.exit(0)

    query = sys.argv[1]

    api = Client(auto_patch=True, drop_incompat_keys=False)

    user_feed = api.user_feed(query, count=10)

    feed_data = {
        "username": user_feed[0]["node"]["owner"]["username"],
        "user_id": user_feed[0]["node"]["owner"]["id"],
        "media": []
    }

    for photo in user_feed:

        media_shortcode = photo["node"]["shortcode"]
        data = photo["node"]


        media_data = {
            "media_shortcode": media_shortcode,
            "photo_url": data["display_url"],
            "caption": None,
            "comment_count": None,
            "like_count": None,
            "comments": []
        }

        api_comments = Client(auto_patch=True, drop_incompat_keys=False)
        comments_1 = api_comments.media_comments(media_shortcode, count = 50)
        comments_2 = api_comments.media_comments(media_shortcode, count = 50, end_cursor = comments_1[0]["id"] )

        comments = comments_1 + comments_2
        comments_filtered = []

        # regex = re.compile('[^a-zA-Z0-9.]')
        for item in comments:
            text = cleanText(item["text"])
            if text != "":
                comments_filtered.append(text)

        media_data["comments"] = comments_filtered
        media_data["caption"] = cleanText(data["caption"]["text"])
        media_data["comment_count"] = data["comments"]["count"]
        media_data["like_count"] = data["likes"]["count"]

        feed_data["media"].append(media_data)

    print(json.dumps(feed_data))
    sys.stdout.flush()
