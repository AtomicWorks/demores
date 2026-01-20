"""
Flask backend for Fitness AI Agent
RESTful API endpoints for fitness recommendations
"""

from __future__ import annotations

import os
import json
from datetime import datetime
from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory
from fitness_agent import FitnessAgent
import psycopg2
import psycopg2.extras
from functools import wraps

load_dotenv()

# Database configuration
DB_CONFIG = {
    "host": os.getenv("PGHOST", "localhost"),
    "port": int(os.getenv("PGPORT", "5432")),
    "user": os.getenv("PGUSER", "postgres"),
    "password": os.getenv("PGPASSWORD", ""),
    "dbname": os.getenv("PGDATABASE", "fitness_db"),
}

app = Flask(__name__, static_folder=".", static_url_path="")
agent = FitnessAgent()


def get_connection() -> psycopg2.extensions.connection:
    """Get database connection"""
    try:
        return psycopg2.connect(**DB_CONFIG)
    except psycopg2.Error as e:
        print(f"Database connection error: {e}")
        return None


def require_json(f):
    """Decorator to require JSON content type"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400
        return f(*args, **kwargs)
    return decorated_function


# ==================== Static Routes ====================

@app.route("/")
def index():
    return send_from_directory(".", "index.html")


@app.route("/<path:filename>")
def static_files(filename):
    """Serve static files"""
    return send_from_directory(".", filename)


# ==================== Fitness AI Routes ====================

@app.route("/api/fitness/profile", methods=["POST"])
@require_json
def create_fitness_profile():
    """
    Create user fitness profile
    Expected JSON: {weight_kg, height_cm, age, goal, experience_level, dietary_restrictions}
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required = ["weight_kg", "height_cm", "age", "goal", "experience_level"]
        if not all(field in data for field in required):
            return jsonify({"error": f"Missing required fields: {required}"}), 400
        
        profile = agent.get_user_profile(
            weight_kg=float(data["weight_kg"]),
            height_cm=float(data["height_cm"]),
            age=int(data["age"]),
            goal=data["goal"],
            experience_level=data["experience_level"],
            dietary_restrictions=data.get("dietary_restrictions", [])
        )
        
        return jsonify(profile), 201
    
    except (ValueError, TypeError) as e:
        return jsonify({"error": f"Invalid input: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/fitness/routine", methods=["POST"])
@require_json
def generate_routine():
    """
    Generate personalized weekly routine
    Expected JSON: {weight_kg, height_cm, age, goal, experience_level, dietary_restrictions}
    """
    try:
        data = request.get_json()
        
        # Create profile
        profile = agent.get_user_profile(
            weight_kg=float(data["weight_kg"]),
            height_cm=float(data["height_cm"]),
            age=int(data["age"]),
            goal=data["goal"],
            experience_level=data["experience_level"],
            dietary_restrictions=data.get("dietary_restrictions", [])
        )
        
        # Generate routine
        routine = agent.generate_weekly_routine(profile)
        
        return jsonify({
            "profile": profile,
            "routine": routine,
            "generated_at": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/fitness/advice", methods=["POST"])
@require_json
def get_fitness_advice():
    """
    Get personalized fitness advice
    Expected JSON: {weight_kg, height_cm, age, goal, experience_level, concern}
    """
    try:
        data = request.get_json()
        
        profile = agent.get_user_profile(
            weight_kg=float(data["weight_kg"]),
            height_cm=float(data["height_cm"]),
            age=int(data["age"]),
            goal=data["goal"],
            experience_level=data["experience_level"],
            dietary_restrictions=data.get("dietary_restrictions", [])
        )
        
        concern = data.get("concern", "General fitness advice")
        advice = agent.generate_personalized_advice(profile, concern)
        
        return jsonify({
            "concern": concern,
            "advice": advice,
            "generated_at": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/fitness/meal-prep", methods=["POST"])
@require_json
def get_meal_prep_guide():
    """
    Get meal prep guide
    Expected JSON: {weight_kg, height_cm, age, goal, experience_level, dietary_restrictions}
    """
    try:
        data = request.get_json()
        
        profile = agent.get_user_profile(
            weight_kg=float(data["weight_kg"]),
            height_cm=float(data["height_cm"]),
            age=int(data["age"]),
            goal=data["goal"],
            experience_level=data["experience_level"],
            dietary_restrictions=data.get("dietary_restrictions", [])
        )
        
        meal_prep = agent.generate_meal_prep_guide(profile)
        
        return jsonify({
            "profile": profile,
            "meal_prep_guide": meal_prep,
            "generated_at": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/fitness/bmi-calculator", methods=["POST"])
@require_json
def calculate_bmi():
    """Calculate BMI and category"""
    try:
        data = request.get_json()
        weight_kg = float(data["weight_kg"])
        height_cm = float(data["height_cm"])
        
        bmi = weight_kg / ((height_cm / 100) ** 2)
        
        if bmi < 18.5:
            category = "Underweight"
        elif bmi < 25:
            category = "Normal weight"
        elif bmi < 30:
            category = "Overweight"
        else:
            category = "Obese"
        
        return jsonify({
            "weight_kg": weight_kg,
            "height_cm": height_cm,
            "bmi": round(bmi, 1),
            "category": category
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "fitness-ai-agent"}), 200


# ==================== Error Handlers ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found"}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
