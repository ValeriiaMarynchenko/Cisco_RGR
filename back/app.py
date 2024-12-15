import requests
from flask import Flask, request, jsonify, session, make_response
import configparser
import authentification
import jwt
import datetime
import time

config = configparser.ConfigParser()
config.read('config.ini')

app = Flask(__name__)
app.secret_key = config["authentification"]["secret_key"]

exchange_api_key = config["exchange"]["exchange_api_key"]


def generate_token(username):
    payload = {
        "username": username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, app.secret_key, algorithm="HS256")
    return token


def get_exchangeratesapi():
    response = requests.get(f"https://v6.exchangerate-api.com/v6/{exchange_api_key}/latest/USD")
    if response.status_code == 200:
        all_data = response.json()
        data = all_data["conversion_rates"]
        new_data = {"USD": data["USD"], "EUR":data["EUR"], "UAH":data["UAH"]}
        return jsonify({"message": new_data}), 201
    else:
        print(f"Error: {response.status_code}")
        return jsonify({"message": response.status_code})


@app.route('/sign_up', methods=['POST'])
def sign_up():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "missed username or password"}), 400

    if authentification.add_new_user(username, password) == "user exist":
        return jsonify({"message": "user exists"}), 409

    return jsonify({"message": "success"}), 201


@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.json
        username = data.get("username")
        password = data.get("password")
        if authentification.check_credentials(username, password) is not None:
            token = generate_token(username)
            session['username'] = username
            session['token'] = token
            response = make_response(jsonify({"token": token}))
            response.set_cookie("session_token", token, httponly=True)
            return response
        else:
            return jsonify({"message": "bad credentials"}), 401


# @app.route('/api/', methods=['GET'])
def get_economic_prediction():
    try:
        response = requests.get("https://v2.jokeapi.dev/joke/Programming")
        prediction = response.json()
        if prediction["type"] == "single":
            prediction = prediction["joke"]
        elif prediction["type"] == "twopart":
            prediction = str (prediction["setup"] + "\n" + prediction["delivery"])
        return jsonify({"prediction": prediction}), 200

    except Exception as e:
        return jsonify({"error": e}), 429

@app.route('/home', methods=['GET', 'POST'])
def main():
    # 1. Отримання токена з заголовка запиту
    token = request.headers.get('Authorization')  # Токен передається в заголовку Authorization
    if not token:
        return jsonify({"message": "Token is missing"}), 401

    # Видаляємо можливий префікс "Bearer"
    if token.startswith("Bearer "):
        token = token.split(" ")[1]

    # 2. Перевірка токена
    try:
        decoded = jwt.decode(token, app.secret_key, algorithms=["HS256"])
        username = decoded.get("username")  # Витягуємо ім'я користувача із токена
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401

    # 3. Звернення до функції get_economic_prediction()
    economic_prediction_response = get_economic_prediction()
    economic_prediction_data = economic_prediction_response[0].json

    # 4. Звернення до функції get_exchangeratesapi()
    exchange_rate_response = get_exchangeratesapi()
    exchange_rate_data = exchange_rate_response[0].json

    # 5. Передача об'єднаних даних на фронтенд
    return jsonify({
        "username": username,
        "economic_prediction": economic_prediction_data.get("prediction"),
        "exchange_rates": exchange_rate_data.get("message"),
    })


if __name__ == '__main__':
    app.run(debug=True)