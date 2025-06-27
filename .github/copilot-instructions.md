<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# One Concept Today - Educational Portal

This is an educational web portal called "One Concept Today" designed to help users learn technology concepts through interactive flashcards.

## Project Structure
- `frontend/` - HTML, CSS, JavaScript frontend files
- `backend/` - Flask API server with Python
- `data/` - JSON files containing flashcard questions and answers

## Tech Stack
- **Backend**: Python Flask with CORS support
- **Frontend**: Vanilla HTML, CSS, JavaScript (no frameworks)
- **Data**: JSON files for flashcard content
- **Styling**: Modern CSS with Flexbox/Grid, responsive design
- **Icons**: Font Awesome for icons

## Key Features
- Homepage listing available tech topics
- Topic-specific flashcard pages
- "Surprise Me" functionality for random questions
- Progressive reveal: Question → Answer → Explanation
- Responsive design for mobile and desktop
- Beautiful modern UI with gradients and animations

## API Endpoints
- `GET /api/topics` - List all available topics
- `GET /api/flashcard/<topic>` - Get random flashcard for topic
- `GET /api/flashcard/<topic>/all` - Get all flashcards for topic

## Code Style Guidelines
- Use semantic HTML elements
- Follow BEM CSS methodology where applicable
- Use modern JavaScript (ES6+) features
- Maintain consistent indentation and naming
- Add comprehensive error handling
- Include loading states and user feedback

## Data Format
Each topic has a JSON file in `/data/` with this structure:
```json
[
  {
    "question": "Question text",
    "answer": "Answer text", 
    "explanation": "Detailed explanation"
  }
]
```

## Development Notes
- Flask server runs on port 5000
- Frontend can be served statically or via Flask
- CORS is enabled for local development
- Responsive design supports mobile devices
- Keyboard shortcuts available (Space, Escape, R)
