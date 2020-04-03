# SocialWebGroup19

## Installation & Configuration
You will need node and npm to be able to run this project.
The versions that this project was developed on were:
```
npm == 6.13.4
node == 12.16.1
```

Run ```npm install``` to install the npm dependencies.

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
### Running the app
After doing the steps above, run the following command on your console to run the app.
```
adonis serve --dev
```
