import spacy, sys
import json
import re
import  string


nlp = spacy.load("en_core_web_lg")
punctuations = string.punctuation
stopwords = spacy.lang.en.stop_words.STOP_WORDS

def cleanup_text(doc):

  doc = doc.encode('ascii',errors='ignore').decode()

  doc = nlp(doc, disable=['parser', 'ner'])
  # for token in doc:
  #   print(token.text, token.lemma_, token.pos_, token.tag_, token.dep_,
  #         token.shape_, token.is_alpha, token.is_stop)
  tokens = [tok.lemma_.lower().strip() for tok in doc if tok.lemma_ != '-PRON-' and (tok.pos_ == 'NOUN' or
                                                                                     tok.pos_ == 'PROPN')]
  # print(tokens)
  return tokens

def get_entity_dict(entities_dict, test_string):

  test_string = re.sub("[#,@,!,?]", "", test_string)
  test_string = test_string.encode('ascii',errors='ignore').decode()
  if(len(test_string) < 1):
    return {}
  entities_doc = nlp(test_string)
  for ent in entities_doc.ents:
    if (ent.text, ent.label_) in entities_dict:
      entities_dict[(ent.text, ent.label_)] = entities_dict[(ent.text, ent.label_)] + 1
    else:
      entities_dict[(ent.text, ent.label_)] = 1
  return entities_dict

if __name__ == '__main__':
  if len(sys.argv) < 2:
    print('Usage: python3 nlp.py [file]')
    sys.exit(-1)

  file = sys.argv[1]
  print(file)
  # test_string = "@finnley young no one cares. This is not the YouTube comment section."
  # test_string = "This 180 degree thing isn't much of a selling point. Your laptop will never be in this position for any" \
  #               " reason other than testing it out just to see if it can."
  # test_string = "Anyone know how long the standard iPad cable is"
  # cleanup_text(test_string)
  # sys.exit(-1)
  with open(file) as json_file:
    user_json = json.load(json_file)
    media_list = user_json["media"]
    post_list = []
    for media in media_list:
      comments_list = media["comments"]
      caption = media["caption"]
      # caption_entities = {}
  #     caption_entities = get_entity_dict(caption_entities, caption)
      test_list = []
      for comments in comments_list:
        info_text = cleanup_text(comments)
        if info_text and len(info_text) > 1:
          test_list.append(info_text)
      post_list.append(test_list)
      break
  #     post_list.append(test_list)
  #     # sorted_comment_entities = sorted(comment_entities.items(), key=lambda kv: kv[1], reverse=True)
  #     # print(sorted_comment_entities)
  #     # break
    print(post_list)
