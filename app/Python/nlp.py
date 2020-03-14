import spacy, sys
import json

nlp = spacy.load("en_core_web_md")

def get_entity_dict(entities_dict, test_string):
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
  with open(file) as json_file:
    comment_json = json.load(json_file)
    for comment_info in comment_json:
      caption_entities = {}
      caption = comment_info["caption"]
      caption_entities = get_entity_dict(caption_entities, caption)
      comments_list = comment_info["comments"]
      comment_entities = {}
      for comments in comments_list:
        comment_entities = get_entity_dict(comment_entities, comments)

      sorted_comment_entities = sorted(comment_entities.items(), key=lambda kv: kv[1], reverse=True)
      print(sorted_comment_entities)
      break
