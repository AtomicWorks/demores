from __future__ import annotations

import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory
import psycopg2
import psycopg2.extras
from datetime import datetime
import uuid

load_dotenv()

DB_CONFIG = {
    "host": os.getenv("PGHOST", "localhost"),
    "port": int(os.getenv("PGPORT", "5432")),
    "user": os.getenv("PGUSER", "postgres"),
    "password": os.getenv("PGPASSWORD", ""),
    "dbname": os.getenv("PGDATABASE", "terracotta_tales"),
}

app = Flask(__name__, static_folder=".", static_url_path="")


def get_connection() -> psycopg2.extensions.connection:
    return psycopg2.connect(**DB_CONFIG)


@app.route("/")
def index():
    return send_from_directory(".", "index.html")


@app.route("/api/menu")
def menu():
    try:
        with get_connection() as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
                cur.execute(
                    """
                    SELECT
                        c.id AS category_id,
                        c.name AS category_name,
                        c.sort_order,
                        i.id AS item_id,
                        i.name AS item_name,
                        i.description AS item_description,
                        i.price_cents
                    FROM menu_categories c
                    LEFT JOIN menu_items i
                        ON i.category_id = c.id
                        AND i.is_available = TRUE
                    WHERE c.is_active = TRUE
                    ORDER BY c.sort_order, c.name, i.name;
                    """
                )
                rows = cur.fetchall()
    except Exception as exc:
        return jsonify({"error": "database_unavailable", "detail": str(exc)}), 500

    categories = {}
    for row in rows:
        category_id = row["category_id"]
        if category_id not in categories:
            categories[category_id] = {
                "id": category_id,
                "name": row["category_name"],
                "sort_order": row["sort_order"],
                "items": [],
            }
        if row["item_id"] is not None:
            categories[category_id]["items"].append(
                {
                    "id": row["item_id"],
                    "name": row["item_name"],
                    "description": row["item_description"],
                    "price_cents": row["price_cents"],
                }
            )

    payload = sorted(categories.values(), key=lambda item: item["sort_order"])
    return jsonify({"categories": payload})


@app.route("/api/checkout", methods=["POST"])
def checkout():
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 400

    data = request.get_json() or {}
    customer = data.get("customer") or {}
    items = data.get("items") or []

    name = (customer.get("name") or "").strip()
    phone = (customer.get("phone") or "").strip()
    address = (customer.get("address") or "").strip()

    if not name or not phone or not address:
        return jsonify({"error": "Missing customer information"}), 400

    if not items:
        return jsonify({"error": "Cart is empty"}), 400

    total_cents = 0
    for item in items:
        try:
            price_cents = int(item.get("price_cents"))
            qty = int(item.get("qty"))
        except (TypeError, ValueError):
            return jsonify({"error": "Invalid cart data"}), 400
        if price_cents < 0 or qty <= 0:
            return jsonify({"error": "Invalid cart data"}), 400
        total_cents += price_cents * qty

    return jsonify(
        {
            "status": "success",
            "transaction_id": f"BKASH-{uuid.uuid4().hex[:10].upper()}",
            "amount_cents": total_cents,
            "currency": "BDT",
            "processed_at": datetime.utcnow().isoformat() + "Z",
        }
    )


if __name__ == "__main__":
    app.run(debug=True, port=8000)
