import openai
from flask import Flask, request, jsonify, session, make_response
import random
import configparser
import authentification
import jwt
import datetime

config = configparser.ConfigParser()
config.read('gpt_config.ini')
openai_api_key = config["gpt"]["gpt_api_key"]

app = Flask(__name__)
app.secret_key = config["authentification"]["secret_key"]
# Set your OpenAI API key
openai.api_key = openai_api_key

# Prompt template for economic joke predictions
prompt_template = """
Generate a funny economic prediction that sounds humorous and absurd:
1. It should involve financial terms, economic trends, or markets.
2. Keep it light and creative.

Here is an example:
"The stock market will rise by 10%, but only for companies selling inflatable couches."

Now, generate one:
"""
def generate_token(username):
    payload = {
        "username": username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, app.secret_key, algorithm="HS256")
    return token

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.json
        username = data.get("username")
        password = data.get("password")
        if authentification.check_credentials(username,authentification.hashing(password)) == username:
            session['username'] = username
            token = generate_token(username)
            response = make_response(jsonify({"token": token}))
            response.set_cookie("session_token", token, httponly=True)
            return response
        else:
            return jsonify({"message": "Невірний логін або пароль"}), 401


@app.route('/api/', methods=['GET'])
def get_economic_prediction():
    # Call OpenAI's API
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt_template,
        max_tokens=60,
        n=1,
        stop=None,
        temperature=0.7,
    )
    # Extract the prediction from the response
    prediction = response.choices[0].text.strip()
    return jsonify({"prediction": prediction})

if __name__ == '__main__':
    app.run(debug=True)