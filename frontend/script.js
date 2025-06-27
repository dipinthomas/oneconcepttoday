// Configuration
const API_BASE_URL = 'http://localhost:5002/api';

// Global state
let currentTopic = '';
let currentDifficulty = '';
let currentFlashcard = null;
let selectedOptionIndex = null;
let hasAnswered = false;

// DOM elements
const homePageEl = document.getElementById('home-page');
const difficultyPageEl = document.getElementById('difficulty-page');
const topicPageEl = document.getElementById('topic-page');
const aboutPageEl = document.getElementById('about-page');
const topicsGridEl = document.getElementById('topics-grid');
const topicTitleEl = document.getElementById('topic-title');
const difficultyTitleEl = document.getElementById('difficulty-title');
const flashcardEl = document.getElementById('flashcard');
const questionTextEl = document.getElementById('question-text');
const optionsSectionEl = document.getElementById('options-section');
const optionsContainerEl = document.getElementById('options-container');
const answerTextEl = document.getElementById('answer-text');
const explanationTextEl = document.getElementById('explanation-text');
const answerSectionEl = document.getElementById('answer-section');
const explanationSectionEl = document.getElementById('explanation-section');
const referenceSectionEl = document.getElementById('reference-section');
const referenceLinkEl = document.getElementById('reference-link');
const revealBtnEl = document.getElementById('reveal-btn');
const newQuestionBtnEl = document.getElementById('new-question-btn');
const loadingEl = document.getElementById('loading');

// Topic icons mapping
const topicIcons = {
    'kubernetes': 'fas fa-dharmachakra',
    'default': 'fas fa-code'
};

// Topic descriptions
const topicDescriptions = {
    'kubernetes': 'Master container orchestration concepts and best practices with Kubernetes',
    'default': 'Learn technology concepts and best practices'
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadTopics();
    showHome();
});

// Navigation functions
function showHome() {
    hideAllPages();
    homePageEl.classList.add('active');
    loadTopics();
    trackPageView('/');
}

function showTopic(topic, difficulty = '') {
    currentTopic = topic;
    currentDifficulty = difficulty;
    hideAllPages();
    topicPageEl.classList.add('active');
    
    // Update topic title with difficulty
    const difficultyText = difficulty ? ` - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}` : '';
    topicTitleEl.textContent = `${topic.charAt(0).toUpperCase() + topic.slice(1)}${difficultyText}`;
    
    resetFlashcard();
    trackPageView(`/${topic}${difficulty ? '/' + difficulty : ''}`);
    trackEvent('topic_selected', 'Navigation', `${topic}${difficulty ? '_' + difficulty : ''}`);
}

// New function to show difficulty selection
function showDifficultySelection(topic) {
    hideAllPages();
    difficultyPageEl.classList.add('active');
    difficultyTitleEl.textContent = `${topic.charAt(0).toUpperCase() + topic.slice(1)} - Choose Your Level`;
    trackPageView(`/${topic}/difficulty`);
    trackEvent('difficulty_page_shown', 'Navigation', topic);
}

function showAbout() {
    hideAllPages();
    aboutPageEl.classList.add('active');
    trackPageView('/about');
}

function hideAllPages() {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
}

// API functions
async function loadTopics() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/topics`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const topics = await response.json();
        displayTopics(topics);
    } catch (error) {
        console.error('Error loading topics:', error);
        showError('Failed to load topics. Please make sure the backend server is running.');
    } finally {
        hideLoading();
    }
}

async function getRandomFlashcard() {
    if (!currentTopic) return;
    
    try {
        showLoading();
        const url = currentDifficulty 
            ? `${API_BASE_URL}/flashcard/${currentTopic}/${currentDifficulty}`
            : `${API_BASE_URL}/flashcard/${currentTopic}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const flashcard = await response.json();
        displayFlashcard(flashcard);
        trackFlashcardEvent('question_loaded', currentTopic);
    } catch (error) {
        console.error('Error loading flashcard:', error);
        showError('Failed to load flashcard. Please try again.');
    } finally {
        hideLoading();
    }
}

// Display functions
function displayTopics(topics) {
    topicsGridEl.innerHTML = '';
    
    if (topics.length === 0) {
        topicsGridEl.innerHTML = `
            <div class="topic-card">
                <div class="topic-icon">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <h3 class="topic-name">No Topics Available</h3>
                <p class="topic-description">Please check that the backend server is running and topics are configured.</p>
            </div>
        `;
        return;
    }
    
    topics.forEach(topic => {
        const topicCard = createTopicCard(topic);
        topicsGridEl.appendChild(topicCard);
    });
}

function createTopicCard(topic) {
    const card = document.createElement('div');
    card.className = 'topic-card';
    card.onclick = () => showDifficultySelection(topic.name);
    
    const iconClass = topicIcons[topic.name] || topicIcons.default;
    const description = topicDescriptions[topic.name] || `Learn ${topic.display_name} concepts and best practices`;
    
    card.innerHTML = `
        <div class="topic-icon">
            <i class="${iconClass}"></i>
        </div>
        <h3 class="topic-name">${topic.display_name}</h3>
        <p class="topic-description">${description}</p>
        <button class="topic-btn">
            <i class="fas fa-play"></i>
            Start Learning
        </button>
    `;
    
    return card;
}

function displayFlashcard(flashcard) {
    currentFlashcard = flashcard;
    selectedOptionIndex = null;
    hasAnswered = false;
    
    // Update question content
    questionTextEl.textContent = flashcard.question;
    explanationTextEl.textContent = flashcard.explanation;
    
    // Handle multiple choice format
    if (flashcard.format === 'multiple_choice' && flashcard.options) {
        // Show options section
        optionsSectionEl.style.display = 'block';
        
        // Clear and populate options
        optionsContainerEl.innerHTML = '';
        flashcard.options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'option-btn';
            optionBtn.textContent = option;
            optionBtn.onclick = () => selectOption(index);
            optionsContainerEl.appendChild(optionBtn);
        });
        
        // Update reveal button text
        revealBtnEl.innerHTML = '<i class="fas fa-check"></i> Submit Answer';
        revealBtnEl.style.display = 'none'; // Hidden until option is selected
    } else {
        // Simple format - hide options, show reveal button
        optionsSectionEl.style.display = 'none';
        revealBtnEl.innerHTML = '<i class="fas fa-eye"></i> Reveal Answer';
        revealBtnEl.style.display = 'inline-flex';
    }
    
    // Set answer text
    answerTextEl.textContent = flashcard.answer;
    
    // Reset visibility
    answerSectionEl.style.display = 'none';
    explanationSectionEl.style.display = 'none';
    referenceSectionEl.style.display = 'none';
    newQuestionBtnEl.style.display = 'none';
    
    // Handle reference URL
    if (flashcard.reference_url) {
        referenceLinkEl.href = flashcard.reference_url;
    }
    
    // Flip to back (question side)
    flashcardEl.classList.add('flipped');
}

function selectOption(index) {
    if (hasAnswered) return;
    
    selectedOptionIndex = index;
    
    // Update option button states
    const optionBtns = optionsContainerEl.querySelectorAll('.option-btn');
    optionBtns.forEach((btn, i) => {
        btn.classList.remove('selected');
        if (i === index) {
            btn.classList.add('selected');
        }
    });
    
    // Show submit button
    revealBtnEl.style.display = 'inline-flex';
    
    // Track option selection
    trackFlashcardEvent('option_selected', currentTopic);
}

function revealAnswer() {
    if (!currentFlashcard) return;
    
    hasAnswered = true;
    
    // Handle multiple choice feedback
    if (currentFlashcard.format === 'multiple_choice' && selectedOptionIndex !== null) {
        const optionBtns = optionsContainerEl.querySelectorAll('.option-btn');
        const correctIndex = currentFlashcard.correct_option_index;
        
        optionBtns.forEach((btn, i) => {
            btn.disabled = true;
            if (i === correctIndex) {
                btn.classList.add('correct');
            } else if (i === selectedOptionIndex && i !== correctIndex) {
                btn.classList.add('incorrect');
            }
        });
        
        // Update answer text with feedback
        const isCorrect = selectedOptionIndex === correctIndex;
        const feedbackIcon = isCorrect ? '✅' : '❌';
        const feedbackText = isCorrect ? 'Correct!' : 'Incorrect!';
        answerTextEl.innerHTML = `<strong>${feedbackIcon} ${feedbackText}</strong><br>${currentFlashcard.answer}`;
    }
    
    // Show answer and explanation
    answerSectionEl.style.display = 'block';
    explanationSectionEl.style.display = 'block';
    
    // Show reference link if available
    if (currentFlashcard.reference_url) {
        referenceSectionEl.style.display = 'block';
    }
    
    // Update button visibility
    revealBtnEl.style.display = 'none';
    newQuestionBtnEl.style.display = 'inline-flex';
}

function resetFlashcard() {
    // Reset to front side
    flashcardEl.classList.remove('flipped');
    
    // Clear current flashcard and state
    currentFlashcard = null;
    selectedOptionIndex = null;
    hasAnswered = false;
    
    // Reset button visibility
    revealBtnEl.style.display = 'inline-flex';
    newQuestionBtnEl.style.display = 'none';
    answerSectionEl.style.display = 'none';
    explanationSectionEl.style.display = 'none';
    optionsSectionEl.style.display = 'none';
    referenceSectionEl.style.display = 'none';
    
    // Clear options container
    optionsContainerEl.innerHTML = '';
}

function flipToFront() {
    resetFlashcard();
}

// Utility functions
function showLoading() {
    loadingEl.style.display = 'flex';
}

function hideLoading() {
    loadingEl.style.display = 'none';
}

function showError(message) {
    // Create and show error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    errorDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; color: white; margin-left: auto; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

// Add CSS for error notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Analytics and Ad Tracking
function trackEvent(action, category = 'User Interaction', label = '') {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: 1
        });
    }
}

function trackPageView(page) {
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: page
        });
    }
}

// Track flashcard interactions
function trackFlashcardEvent(action, topic) {
    trackEvent(action, 'Flashcard', topic);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Space or Enter to reveal answer or get new question
    if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (currentFlashcard && revealBtnEl.style.display !== 'none') {
            // For multiple choice, only allow if option is selected or it's simple format
            if (currentFlashcard.format !== 'multiple_choice' || selectedOptionIndex !== null) {
                revealAnswer();
            }
        } else if (currentTopic && flashcardEl.classList.contains('flipped') && hasAnswered) {
            getRandomFlashcard();
        }
    }
    
    // Number keys 1-3 for multiple choice options
    if (currentFlashcard && currentFlashcard.format === 'multiple_choice' && !hasAnswered) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 3 && num <= currentFlashcard.options.length) {
            e.preventDefault();
            selectOption(num - 1);
        }
    }
    
    // Escape to go back
    if (e.code === 'Escape') {
        if (topicPageEl.classList.contains('active')) {
            showHome();
        }
    }
    
    // R to reset/start over
    if (e.code === 'KeyR' && topicPageEl.classList.contains('active')) {
        resetFlashcard();
    }
});

// Add some helpful console messages
console.log('🎯 Kubernetes Learning Platform - Master Container Orchestration');
console.log('💡 Keyboard shortcuts:');
console.log('   Space/Enter: Reveal answer or get new question');
console.log('   1-3: Select multiple choice option');
console.log('   Escape: Go back to topics');
console.log('   R: Reset flashcard');
console.log('🚀 Make sure the Flask backend is running on port 5000!');
