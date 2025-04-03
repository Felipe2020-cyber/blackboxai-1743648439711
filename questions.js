// Quiz questions about world facts
const questions = [
    {
        question: "What is the largest country in the world?",
        hint: "It spans across Europe and Asia",
        answer: "Россия",
        english: "Russia"
    },
    {
        question: "What is the longest river in the world?",
        hint: "Located in Africa",
        answer: "Нил",
        english: "Nile"
    },
    {
        question: "What is the capital of France?",
        hint: "City of love",
        answer: "Париж",
        english: "Paris"
    }
];

// Game variables
let currentQuestion = 0;
let score = 0;
let lives = 3;
let recognition;
let isListening = false;
let currentUser = null;

// DOM elements
const loginSection = document.getElementById('login-section');
const quizSection = document.getElementById('quiz-section');
const questionEl = document.getElementById('question');
const hintEl = document.getElementById('hint');
const answerEl = document.getElementById('russian-answer');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const feedbackEl = document.getElementById('feedback');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Initialize speech synthesis
const synth = window.speechSynthesis;

// Speak Russian text
function speakRussian(text) {
    if (synth.speaking) synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    synth.speak(utterance);
}

// Load question
function loadQuestion(index) {
    if (index >= questions.length) {
        endGame(true);
        return;
    }

    const q = questions[index];
    questionEl.textContent = q.question;
    hintEl.textContent = q.hint;
    answerEl.textContent = q.answer;
    feedbackEl.textContent = '';
    feedbackEl.className = 'mt-4 text-center font-semibold';
}

// Initialize speech recognition
function initRecognition() {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
        const userAnswer = event.results[0][0].transcript.trim();
        checkAnswer(userAnswer);
    };

    recognition.onerror = (event) => {
        feedbackEl.textContent = 'Error in recognition. Try again.';
        feedbackEl.className += ' text-red-500';
        stopListening();
    };
}

// Check answer
function checkAnswer(userAnswer) {
    const correctAnswer = questions[currentQuestion].answer.toLowerCase();
    const similarity = stringSimilarity(userAnswer.toLowerCase(), correctAnswer);
    
    if (similarity > 0.7) {
        correctAnswer();
    } else {
        wrongAnswer();
    }
}

// String similarity function
function stringSimilarity(str1, str2) {
    const len = Math.max(str1.length, str2.length);
    const distance = levenshteinDistance(str1, str2);
    return (len - distance) / len;
}

// Levenshtein distance algorithm
function levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i-1) === a.charAt(j-1)) {
                matrix[i][j] = matrix[i-1][j-1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i-1][j-1] + 1,
                    matrix[i][j-1] + 1,
                    matrix[i-1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

// Handle correct answer
function correctAnswer() {
    score += 10;
    scoreEl.textContent = `Score: ${score}`;
    feedbackEl.textContent = 'Correct! Well done!';
    feedbackEl.className += ' text-green-500';
    stopListening();
    nextBtn.classList.remove('hidden');
    updateScore(10);
}

// Handle wrong answer
function wrongAnswer() {
    lives--;
    updateLives();
    feedbackEl.textContent = `Incorrect. Try again! (Correct: ${questions[currentQuestion].english})`;
    feedbackEl.className += ' text-red-500';
    stopListening();
    
    if (lives <= 0) {
        endGame(false);
    } else {
        startBtn.classList.remove('hidden');
    }
}

// Update lives display
function updateLives() {
    livesEl.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        livesEl.innerHTML += '<i class="fas fa-heart text-red-500"></i>';
    }
}

// End game
function endGame(won) {
    if (won) {
        feedbackEl.textContent = 'Congratulations! You completed all questions!';
    } else {
        feedbackEl.textContent = 'Game Over! Try again!';
    }
    nextBtn.classList.add('hidden');
    startBtn.classList.add('hidden');
}

// Start listening
function startListening() {
    if (!isListening) {
        recognition.start();
        isListening = true;
        startBtn.textContent = 'Stop Listening';
        feedbackEl.textContent = 'Listening...';
        feedbackEl.className = 'mt-4 text-center font-semibold';
    }
}

// Stop listening
function stopListening() {
    if (isListening) {
        recognition.stop();
        isListening = false;
        startBtn.textContent = 'Start Answering';
    }
}

// Update score on server
function updateScore(points) {
    if (!currentUser) return;
    
    fetch('http://localhost:5000/update_score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: currentUser.id,
            points: points
        })
    });
}

// User authentication
loginBtn.addEventListener('click', async () => {
    const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: usernameInput.value,
            password: passwordInput.value
        })
    });
    const data = await response.json();
    
    if (data.success) {
        currentUser = data;
        loginSection.classList.add('hidden');
        quizSection.classList.remove('hidden');
        loadQuestion(0);
        scoreEl.textContent = `Score: ${data.score}`;
    } else {
        alert('Login failed: ' + data.error);
    }
});

registerBtn.addEventListener('click', async () => {
    const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: usernameInput.value,
            password: passwordInput.value
        })
    });
    const data = await response.json();
    
    if (data.success) {
        alert('Registration successful! Please login.');
    } else {
        alert('Registration failed: ' + data.error);
    }
});

// Answer click to hear pronunciation
answerEl.addEventListener('click', () => {
    speakRussian(answerEl.textContent);
});

// Start button
startBtn.addEventListener('click', () => {
    if (!isListening) {
        if (!recognition) initRecognition();
        startListening();
    } else {
        stopListening();
    }
});

// Next question
nextBtn.addEventListener('click', () => {
    currentQuestion++;
    nextBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    loadQuestion(currentQuestion);
});

// Initialize
updateLives();