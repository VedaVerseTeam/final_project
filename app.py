import os
import mysql.connector
from flask import Flask, render_template, jsonify
from dotenv import load_dotenv

# Load environment variables from .env file for local development
load_dotenv()

app = Flask(__name__)

def get_db_connection():
    """
    Establishes a connection to the database.
    It first tries to use Railway-provided environment variables,
    then falls back to local environment variables from the .env file.
    """
    try:
        host = os.getenv("DB_HOST")
        user = os.getenv("DB_USER")
        password = os.getenv("DB_PASSWORD")
        database = os.getenv("DB_NAME")
        port = os.getenv("DB_PORT") # Use the local port

        # Connect to the database
        conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database,
            port=port
        )
        return conn
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        print("Failed to connect to the database. Please check your environment variables.")
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/verses')
def get_verses():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Could not connect to the database."}), 500

    cursor = connection.cursor(dictionary=True)
    
    # Select a random verse from the 'verses' table
    query = "SELECT verse_text FROM verses ORDER BY RAND() LIMIT 1"
    
    try:
        cursor.execute(query)
        verse = cursor.fetchone()
        if verse:
            return jsonify(verse)
        else:
            return jsonify({"error": "No verses found in the database."}), 404
    except Exception as e:
        print(f"An error occurred while fetching the verse: {e}")
        return jsonify({"error": "An error occurred while fetching the verse."}), 500
    finally:
        cursor.close()
        connection.close()

if __name__ == '__main__':
    # When deploying to Railway, the port is provided by the environment
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
