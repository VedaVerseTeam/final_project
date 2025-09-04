import os
from flask_cors import CORS
from dotenv import load_dotenv
from flask import Flask, request, jsonify
import requests
import mysql.connector

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app) 

# --- Configuration from .env ---
API_KEY = os.getenv("API_KEY")
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

# --- Database Connection Helper ---
def get_db_connection():
    """Establishes and returns a database connection."""
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        return conn
    except mysql.connector.Error as err:
        print(f"Error connecting to database: {err}")
        return None

# --- Function to query the Gemini AI  ---
def query_veda_verse(user_input):
    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": API_KEY
    }
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": user_input}
                ]
            }
        ]
    }
    response = requests.post(GEMINI_URL, headers=headers, json=payload)
    response.raise_for_status()
    return response.json()

# --- Route to handle chatbot requests ---
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data.get("message", "")

    if not user_input:
        return jsonify({"reply": "No message received."}), 400

    try:
        response_data = query_veda_verse(user_input)
        reply = response_data["candidates"][0]["content"]["parts"][0]["text"]
    except requests.exceptions.RequestException as e:
        print(f"Request to Gemini API failed: {e}")
        return jsonify({"reply": "⚠️ Network Error. Veda AI is unreachable."}), 503
    except (KeyError, IndexError) as e:
        print(f"Gemini API response format error: {e}")
        return jsonify({"reply": "Sorry 🙏, I could not process that right now."}), 500
    except Exception as e:
        print(f"An unexpected error occurred in chat: {e}")
        return jsonify({"reply": "An unexpected error occurred."}), 500

    return jsonify({"reply": reply})


# --- Route to fetch a specific verse from the database ---
@app.route("/get_verse/<int:chapter_num>/<int:verse_num>", methods=["GET"])
def get_verse(chapter_num, verse_num):
    conn = None
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT shloka, shlok_meaning  # <-- Changed 'shlok' to 'shloka' here
            FROM scripture
            WHERE scrip_name = 'Gita' AND chapter = %s AND verse = %s
        """
        cursor.execute(query, (chapter_num, verse_num))
        verse_data = cursor.fetchone()

        if verse_data:
            return jsonify({
                "chapter": chapter_num,
                "verse": verse_num,
                "shlok": verse_data["shloka"],        # <-- Changed 'shlok' to 'shloka' here
                "meaning": verse_data["shlok_meaning"] # This one was correct
            })
        else:
            return jsonify({"error": "Verse not found"}), 404

    except mysql.connector.Error as err:
        print(f"Database query error: {err}")
        return jsonify({"error": f"Database error: {err}"}), 500
    except Exception as e:
        print(f"An unexpected error occurred while fetching verse: {e}")
        return jsonify({"error": "An unexpected server error occurred."}), 500
    finally:
        if conn:
            conn.close()



if __name__ == "__main__":
    try:
        app.run(debug=True, port=5000)
    except Exception as e:
        print(f"FAILED TO START FLASK APP: {e}")
        import traceback
        traceback.print_exc()