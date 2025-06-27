from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import json
import random
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Path to data directory
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')

@app.route('/')
def home():
    return jsonify({
        "message": "Welcome to One Concept Today API",
        "endpoints": {
            "topics": "/api/topics",
            "flashcard": "/api/flashcard/<topic>"
        }
    })

@app.route('/api/topics')
def get_topics():
    """Get all available topics"""
    topics = []
    try:
        for filename in os.listdir(DATA_DIR):
            if filename.endswith('.json'):
                topic_name = filename[:-5]  # Remove .json extension
                topics.append({
                    "name": topic_name,
                    "display_name": topic_name.title(),
                    "url": f"/api/flashcard/{topic_name}"
                })
    except FileNotFoundError:
        pass
    
    return jsonify(topics)

@app.route('/api/flashcard/<topic>')
@app.route('/api/flashcard/<topic>/<difficulty>')
def get_random_flashcard(topic, difficulty=None):
    """Get a random flashcard for the specified topic and optional difficulty"""
    try:
        file_path = os.path.join(DATA_DIR, f"{topic}.json")
        
        if not os.path.exists(file_path):
            return jsonify({"error": f"Topic '{topic}' not found"}), 404
        
        with open(file_path, 'r') as file:
            flashcards = json.load(file)
        
        if not flashcards:
            return jsonify({"error": f"No flashcards found for topic '{topic}'"}), 404
        
        # Filter by difficulty if specified
        if difficulty:
            filtered_flashcards = [card for card in flashcards if card.get('difficulty', 'basic') == difficulty]
            if not filtered_flashcards:
                return jsonify({"error": f"No {difficulty} flashcards found for topic '{topic}'"}), 404
            flashcards = filtered_flashcards
        
        # Select a random flashcard
        random_card = random.choice(flashcards)
        
        # Handle both old format (question/answer/explanation) and new format (options/correct_option_index)
        response = {
            "topic": topic,
            "question": random_card["question"],
            "explanation": random_card["explanation"]
        }
        
        # Check if it's the new multiple choice format
        if "options" in random_card and "correct_option_index" in random_card:
            response.update({
                "options": random_card["options"],
                "correct_option_index": random_card["correct_option_index"],
                "answer": random_card["options"][random_card["correct_option_index"]],
                "format": "multiple_choice"
            })
        else:
            # Old format with direct answer
            response.update({
                "answer": random_card["answer"],
                "format": "simple"
            })
        
        # Add reference URL if available
        if "reference_url" in random_card:
            response["reference_url"] = random_card["reference_url"]
        
        return jsonify(response)
    
    except json.JSONDecodeError:
        return jsonify({"error": f"Invalid JSON in {topic}.json"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/flashcard/<topic>/all')
def get_all_flashcards(topic):
    """Get all flashcards for a topic (for future use)"""
    try:
        file_path = os.path.join(DATA_DIR, f"{topic}.json")
        
        if not os.path.exists(file_path):
            return jsonify({"error": f"Topic '{topic}' not found"}), 404
        
        with open(file_path, 'r') as file:
            flashcards = json.load(file)
        
        return jsonify({
            "topic": topic,
            "flashcards": flashcards,
            "count": len(flashcards)
        })
    
    except json.JSONDecodeError:
        return jsonify({"error": f"Invalid JSON in {topic}.json"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
