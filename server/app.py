from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)  # Enable CORS so React can talk to Flask

# Database connection
load_dotenv()
db_config = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASS"),
    "database": os.getenv("DB_NAME"),
    "port": os.getenv("DB_PORT")
}

# Function to get a fresh database connection
def get_db_connection():
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except mysql.connector.Error as err:
        print(f"Error connecting to MySQL: {err}")
        return None

# Initial connection
conn = get_db_connection()

@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify({"message": "Hello from Flask!"})

# Database setup
@app.route("/api/transactions", methods=["GET"])
def get_transactions():
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM transactions")
        results = cursor.fetchall()
        cursor.close()
        return jsonify(results)
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {err}"}), 500
    finally:
        if connection.is_connected():
            connection.close()

@app.route("/api/transactions", methods=["POST"])
def add_transaction():
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        data = request.get_json()
        amount = data.get("amount", 0)
        description = data.get("description", "")
        date_str = data.get("date", "")
        category = data.get("category", "")

        cursor = connection.cursor()
        sql = "INSERT INTO transactions (amount, description, date, category) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (amount, description, date_str, category))
        connection.commit()
        cursor.close()
        return jsonify({"message": "Transaction added"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {err}"}), 500
    finally:
        if connection.is_connected():
            connection.close()

@app.route("/api/transactions", methods=["DELETE"])
def delete_transactions():
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("DELETE FROM transactions")
        connection.commit()
        cursor.close()
        return jsonify({"message": "Transactions deleted"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {err}"}), 500
    finally:
        if connection.is_connected():
            connection.close()

@app.route("/api/transactions/<int:id>", methods=["DELETE"])
def delete_transaction(id):
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = connection.cursor()
        sql = "DELETE FROM transactions WHERE id = %s"
        cursor.execute(sql, (id,))
        connection.commit()
        cursor.close()
        return jsonify({"message": f"Transaction {id} deleted"}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {err}"}), 500
    finally:
        if connection.is_connected():
            connection.close()

@app.route("/api/transactions/<int:id>", methods=["PUT"])
def update_transaction(id):
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        data = request.get_json()
        amount = data.get("amount", 0)
        description = data.get("description", "")
        date_str = data.get("date", "")
        category = data.get("category", "")

        cursor = connection.cursor()
        sql = "UPDATE transactions SET amount = %s, description = %s, date = %s, category = %s WHERE id = %s"
        cursor.execute(sql, (amount, description, date_str, category, id))
        connection.commit()
        cursor.close()
        return jsonify({"message": f"Transaction {id} updated"}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {err}"}), 500
    finally:
        if connection.is_connected():
            connection.close()

@app.route("/api/category-totals", methods=["GET"])
def get_category_totals():
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT category, SUM(amount) as total FROM transactions GROUP BY category")
        results = cursor.fetchall()
        cursor.close()
        return jsonify(results)
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {err}"}), 500
    finally:
        if connection.is_connected():
            connection.close()

if __name__ == "__main__":
    app.run(port=5000, debug=True)