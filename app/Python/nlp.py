import spacy, sys
import json
import re
import string
import copy

nlp = spacy.load("en_core_web_lg")
punctuations = string.punctuation
stopwords = spacy.lang.en.stop_words.STOP_WORDS


def tokenise_text(doc):
  doc = doc.encode('ascii', errors='ignore').decode()

  doc = nlp(doc, disable=['parser', 'ner'])
  tokens = [tok.lemma_.lower().strip() for tok in doc if tok.lemma_ != '-PRON-' and (tok.pos_ == 'NOUN' or
                                                                                     tok.pos_ == 'PROPN')]
  return tokens


def get_entity_dict(entities_dict, test_string):
  test_string = re.sub("[#,@,!,?]", "", test_string)
  test_string = test_string.encode('ascii', errors='ignore').decode()
  if (len(test_string) < 1):
    return {}
  entities_doc = nlp(test_string)
  for ent in entities_doc.ents:
    if (ent.text, ent.label_) in entities_dict:
      entities_dict[(ent.text, ent.label_)] = entities_dict[(ent.text, ent.label_)] + 1
    else:
      entities_dict[(ent.text, ent.label_)] = 1
  return entities_dict


if __name__ == '__main__':

  user_json = json.loads(sys.argv[1])
  # print(file)
  # test_string = "@finnley young no one cares. This is not the YouTube comment section."
  ret_json = []

  media_list = user_json["media"]
  for media in media_list:
    post_dict = {}
    comment_tokens = []
    caption = media["caption"]
    comments_list = media["comments"]

    caption_tokens = tokenise_text(caption)
    post_dict["caption"] = copy.deepcopy(caption_tokens)

    for comments in comments_list:
      info_text = tokenise_text(comments)
      if info_text and len(info_text) > 1:
        comment_tokens = comment_tokens + info_text
    post_dict["comments"] = copy.deepcopy(comment_tokens)
    ret_json.append(post_dict)
  print(json.dumps(ret_json))
  sys.stdout.flush()
