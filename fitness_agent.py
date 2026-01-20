"""
Fitness AI Agent - Personalized gym and nutrition recommendations
Uses Claude AI to generate customized routines based on user metrics
"""

import os
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv
import anthropic

load_dotenv()

class FitnessAgent:
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        self.model = "claude-3-5-sonnet-20241022"
        
    def get_user_profile(self, weight_kg: float, height_cm: float, age: int, 
                        goal: str, experience_level: str, dietary_restrictions: list = None) -> dict:
        """
        Calculate BMI and nutritional baseline for the user
        """
        bmi = weight_kg / ((height_cm / 100) ** 2)
        
        # Calculate daily caloric needs (using Mifflin-St Jeor equation)
        # Assuming average activity level
        if height_cm and weight_kg and age:
            bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5  # For males
            daily_calories = bmr * 1.55  # Moderate activity
        else:
            daily_calories = 2000
            
        return {
            "weight_kg": weight_kg,
            "height_cm": height_cm,
            "age": age,
            "bmi": round(bmi, 1),
            "daily_calories": round(daily_calories),
            "goal": goal,
            "experience_level": experience_level,
            "dietary_restrictions": dietary_restrictions or []
        }
    
    def generate_weekly_routine(self, user_profile: dict) -> dict:
        """
        Generate personalized weekly gym and nutrition routine using Claude AI
        """
        prompt = f"""
        Create a comprehensive weekly fitness and nutrition plan for someone with these metrics:
        
        User Profile:
        - Weight: {user_profile['weight_kg']} kg
        - Height: {user_profile['height_cm']} cm
        - Age: {user_profile['age']} years
        - BMI: {user_profile['bmi']}
        - Daily Caloric Need: {user_profile['daily_calories']} kcal
        - Goal: {user_profile['goal']}
        - Experience Level: {user_profile['experience_level']}
        - Dietary Restrictions: {', '.join(user_profile['dietary_restrictions']) if user_profile['dietary_restrictions'] else 'None'}
        
        Please provide:
        1. A 7-day gym/exercise routine with specific exercises, sets, and reps for each day
        2. A 7-day meal plan with breakfast, lunch, dinner, and snacks
        3. Macro breakdown (proteins, carbs, fats)
        4. Pre-workout and post-workout nutrition tips
        5. Weekly progress tracking metrics
        
        Format the response as valid JSON with these keys:
        - exercise_routine (array of 7 daily plans)
        - meal_plan (array of 7 daily plans)
        - macro_breakdown (object with daily targets)
        - nutrition_tips (object with pre/post workout advice)
        - tracking_metrics (array of metrics to track)
        
        Make it specific, actionable, and motivating.
        """
        
        message = self.client.messages.create(
            model=self.model,
            max_tokens=4096,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        
        try:
            # Try to extract JSON from the response
            response_text = message.content[0].text
            # Find JSON in the response
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            if json_start != -1 and json_end > json_start:
                json_str = response_text[json_start:json_end]
                routine = json.loads(json_str)
            else:
                routine = {"raw_response": response_text}
        except json.JSONDecodeError:
            routine = {"raw_response": message.content[0].text}
        
        return routine
    
    def generate_personalized_advice(self, user_profile: dict, concern: str) -> str:
        """
        Generate specific advice for a particular fitness concern
        """
        prompt = f"""
        As a fitness expert, provide personalized advice for someone with these metrics:
        
        Weight: {user_profile['weight_kg']} kg, Height: {user_profile['height_cm']} cm
        Goal: {user_profile['goal']}
        Experience: {user_profile['experience_level']}
        
        Specific Concern: {concern}
        
        Provide actionable, scientific-backed advice tailored to their situation.
        """
        
        message = self.client.messages.create(
            model=self.model,
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        
        return message.content[0].text
    
    def generate_meal_prep_guide(self, user_profile: dict) -> str:
        """
        Generate a meal prep guide for the week
        """
        prompt = f"""
        Create a detailed meal prep guide for {user_profile['daily_calories']} daily calories.
        
        Requirements:
        - Dietary Restrictions: {', '.join(user_profile['dietary_restrictions']) if user_profile['dietary_restrictions'] else 'None'}
        - Goal: {user_profile['goal']}
        
        Include:
        1. Shopping list with quantities
        2. Prep schedule for the week
        3. Container portioning guide
        4. Storage tips and shelf-life info
        5. Quick recipes for each meal category
        
        Make it practical and easy to follow.
        """
        
        message = self.client.messages.create(
            model=self.model,
            max_tokens=2048,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        
        return message.content[0].text


# Example usage
if __name__ == "__main__":
    agent = FitnessAgent()
    
    # Example user
    user_profile = agent.get_user_profile(
        weight_kg=80,
        height_cm=180,
        age=28,
        goal="muscle gain",
        experience_level="intermediate",
        dietary_restrictions=[]
    )
    
    print("=== User Profile ===")
    print(json.dumps(user_profile, indent=2))
    
    print("\n=== Generating Weekly Routine ===")
    routine = agent.generate_weekly_routine(user_profile)
    print(json.dumps(routine, indent=2))
    
    print("\n=== Personalized Advice ===")
    advice = agent.generate_personalized_advice(user_profile, "How to prevent injuries during heavy lifting?")
    print(advice)
