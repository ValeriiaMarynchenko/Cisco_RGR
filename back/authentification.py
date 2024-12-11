import sqlite3
import bcrypt

conn = sqlite3.connect("users.sqlite")
cursor = conn.cursor()

cursor.execute("""CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(32) NOT NULL);""")


def hashing(password):
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed_password


def add_new_user(username, hashed_pass):
    cursor.execute("SELECT username FROM Users WHERE username = ?",  (username,))
    user_exist = cursor.fetchall()
    if len(user_exist) == 0:
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_pass))
        conn.commit()
        return username, hashed_pass
    else:
        return "user exist"

def check_credentials(username, hashed_pass):
    cursor.execute("SELECT username FROM Users WHERE username = ? AND password = ?",  (username, hashed_pass))
    db_answer = cursor.fetchone()
    return db_answer


