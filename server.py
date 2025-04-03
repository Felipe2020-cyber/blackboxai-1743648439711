from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import speech_recognition as sr
import difflib

app = Flask(__name__)
CORS(app)

# Database setup
def init_db():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                 username TEXT UNIQUE,
                 password TEXT,
                 score INTEGER DEFAULT 0)''')
    conn.commit()
    conn.close()

# Pronunciation analysis
def analyze_pronunciation(audio_file, expected_text):
    r = sr.Recognizer()
    with sr.AudioFile(audio_file) as source:
        audio = r.record(source)
    try:
        user_text = r.recognize_google(audio, language='ru-RU')
        similarity = difflib.SequenceMatcher(None, user_text.lower(), expected_text.lower()).ratio()
        return {'success': True, 'similarity': similarity, 'user_text': user_text}
    except Exception as e:
        return {'success': False, 'error': str(e)}

# API routes
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    try:
        c.execute("INSERT INTO users (username, password) VALUES (?, ?)",
                 (data['username'], data['password']))
        conn.commit()
        return jsonify({'success': True})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'error': 'Username already exists'})
    finally:
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE username=? AND password=?", 
             (data['username'], data['password']))
    user = c.fetchone()
    conn.close()
    if user:
        return jsonify({'success': True, 'user_id': user[0], 'score': user[3]})
    return jsonify({'success': False, 'error': 'Invalid credentials'})

@app.route('/update_score', methods=['POST'])
def update_score():
    data = request.json
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute("UPDATE users SET score = score + ? WHERE id = ?",
             (data['points'], data['user_id']))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

if __name__ == '__main__':
    init_db()
    app.run(port=5000)