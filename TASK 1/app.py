from flask import Flask, render_template, request, jsonify, redirect, url_for
import sqlite3
import json
import os

app = Flask(__name__)

# Load chatbot rules
rules_path = os.path.join(os.path.dirname(__file__), 'rules.json')
try:
    with open(rules_path, 'r') as f:
        rules = json.load(f)
except FileNotFoundError:
    print("rules.json not found! Ensure it exists in the same directory as app.py.")
    rules = {}

# Database functions
def save_to_db(session_id, sender, message):
    conn = sqlite3.connect('chat_history.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO chat_history (session_id, sender, message)
        VALUES (?, ?, ?)
    ''', (session_id, sender, message))
    conn.commit()
    conn.close()

def get_all_chats():
    conn = sqlite3.connect('chat_history.db')
    cursor = conn.cursor()
    cursor.execute('SELECT sender, message FROM chat_history ORDER BY id ASC')
    rows = cursor.fetchall()
    conn.close()
    return [{"sender": row[0], "message": row[1]} for row in rows]

def clear_all_chats():
    conn = sqlite3.connect('chat_history.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM chat_history')
    conn.commit()
    conn.close()

# Flask routes
@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        session_id = request.cookies.get('session_id', 'default_session')
        user_input = request.form['user_input']
        save_to_db(session_id, 'user', user_input)
        response = generate_response(user_input)
        save_to_db(session_id, 'chatbot', response)
        return jsonify({"user_input": user_input, "response": response})
    return render_template('index.html')

@app.route('/history', methods=['GET'])
def history():
    return render_template('history.html')

@app.route('/get_history', methods=['GET'])
def get_history():
    return jsonify(get_all_chats())

@app.route('/clear_history', methods=['POST'])
def clear_history():
    clear_all_chats()
    return jsonify({"status": "Chat history cleared successfully!"})

@app.route('/back_to_chat', methods=['GET'])
def back_to_chat():
    return redirect(url_for('home'))

def generate_response(user_input):
    user_input_lower = user_input.lower()
    return rules.get(user_input_lower, rules.get("default", "I don't understand yet, but I will learn more!"))

if __name__ == '__main__':
    # Initialize database
    conn = sqlite3.connect('chat_history.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            sender TEXT,
            message TEXT
        )
    ''')
    conn.commit()
    conn.close()
    app.run(debug=True)
