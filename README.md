# Notes
Make sure you have the spacy "en_core_web_lg"

### The application needs the following python packages to be installed and configured.
In app/Python run:
```
pip install instagram_private_api
pip install -U spacy
python -m spacy download en_core_web_lg


```

In the file where your instagram ping package is saved, in instagram_web_api/client.py
replace the code in line 311 with:

```python
def _extract_rhx_gis(html):
        tmp_str = ':{"id":"'+f'{random.randint(10000000,99999999)}'+'"}'
        return hashlib.md5(b'tmp_str')
```

# Adonis fullstack application

This is the fullstack boilerplate for AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Session
3. Authentication
4. Web security middleware
5. CORS
6. Edge template engine
7. Lucid ORM
8. Migrations and seeds

## Setup

Use the adonis command to install the blueprint

```bash
adonis new yardstick
```

or manually clone the repo and then run `npm install`.


### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run
```
# socialWebGroup19

