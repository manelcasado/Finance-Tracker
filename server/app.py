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

conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()

@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify({"message": "Hello from Flask!"})

# Database setup
@app.route("/api/transactions", methods=["GET"])
def get_transactions():
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM transactions")
    results = cursor.fetchall()
    cursor.close()
    return jsonify(results)

@app.route("/api/transactions", methods=["POST"])
def add_transaction():
    data = request.get_json()
    amount = data.get("amount", 0)
    description = data.get("description", "")
    date_str = data.get("date", "")
    category = data.get("category", "")
 
    cursor = conn.cursor()
    sql = "INSERT INTO transactions (amount, description, date, category) VALUES (%s, %s, %s, %s)"
    cursor.execute(sql, (amount, description, date_str, category))
    conn.commit()
    cursor.close()
    return jsonify({"message": "Transaction added"}), 201

@app.route("/api/transactions", methods=["DELETE"])
def delete_transactions():
    cursor  = conn.cursor(dictionary=True)
    cursor.execute("DELETE FROM transactions")
    cursor.close()
    return jsonify({"message": "Transactions deleted"}), 201

if __name__ == "__main__":
    app.run(port=5000, debug=True)