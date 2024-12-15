import sqlite3
import bcrypt
from flask import g

conn = sqlite3.connect("users.db")
cursor = conn.cursor()

cursor.execute("""CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL);""")
conn.commit()
DATABASE = "users.db"

# Підключення до бази даних
def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row  # Для доступу до результатів через імена колонок
    return g.db

# Закриття підключення після запиту
def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

# Хешування пароля
def hashing(password):
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed_password.decode('utf-8')  # Повертаємо рядок для зберігання у БД

# Додавання нового користувача
def add_new_user(username, password):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT username FROM Users WHERE username = ?", (username,))
    user_exist = cursor.fetchone()
    password = hashing(password)
    if not user_exist:
        cursor.execute("INSERT INTO Users (username, password) VALUES (?, ?)", (username, password))
        db.commit()
        return username, password
    else:
        return "user exist"

# Перевірка облікових даних
def check_credentials(username, password):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT password FROM Users WHERE username = ?", (username,))
    db_answer = cursor.fetchone()
    if db_answer:
        stored_password = db_answer["password"]  # Збережений хеш пароля
        # Порівняння введеного пароля з хешем
        if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
            return username
    return None
