// Russian phrases with translations
const phrases = [
    // Greetings and Introductions
    { russian: "Привет", english: "Hello" },
    { russian: "Здравствуйте", english: "Hello (formal)" },
    { russian: "Меня зовут", english: "My name is" },
    { russian: "Имя", english: "First name" },
    { russian: "Фамилия", english: "Last name" },
    { russian: "Господин", english: "Mr." },
    { russian: "Госпожа", english: "Mrs." },
    { russian: "Рад познакомиться", english: "Nice to meet you (m)" },
    { russian: "Рада познакомиться", english: "Nice to meet you (f)" },
    { russian: "Очень приятно", english: "Very nice to meet you" },
    
    // Pronouns
    { russian: "Я", english: "I" },
    { russian: "Ты", english: "You (informal)" },
    { russian: "Вы", english: "You (formal/plural)" },
    { russian: "Он", english: "He" },
    { russian: "Она", english: "She" },
    { russian: "Мы", english: "We" },
    { russian: "Они", english: "They" },
    
    // Questions
    { russian: "Где", english: "Where" },
    { russian: "Откуда", english: "From where" },
    { russian: "Кто", english: "Who" },
    { russian: "Что", english: "What" },
    { russian: "Как", english: "How" },
    { russian: "Возраст", english: "Age" },
    { russian: "Лет", english: "Years old" },
    { russian: "Год", english: "Year" },
    
    // Nationalities and Countries
    { russian: "Бразилия", english: "Brazil" },
    { russian: "Россия", english: "Russia" },
    { russian: "Город", english: "City" },
    { russian: "Страна", english: "Country" },
    { russian: "Национальность", english: "Nationality" },
    { russian: "Бразилец", english: "Brazilian (m)" },
    { russian: "Бразильянка", english: "Brazilian (f)" },
    { russian: "Русский", english: "Russian (m)" },
    { russian: "Русская", english: "Russian (f)" },
    
    // Languages
    { russian: "Английский", english: "English" },
    { russian: "Французский", english: "French" },
    { russian: "Испанский", english: "Spanish" },
    { russian: "Немецкий", english: "German" },
    { russian: "Язык", english: "Language" },
    { russian: "Учить", english: "To learn" },
    { russian: "Говорить", english: "To speak" },
    { russian: "Понимать", english: "To understand" },
    
    // Professions
    { russian: "Работать", english: "To work" },
    { russian: "Профессия", english: "Profession" },
    { russian: "Преподаватель", english: "Teacher" },
    { russian: "Студент", english: "Student (m)" },
    { russian: "Студентка", english: "Student (f)" },
    { russian: "Университет", english: "University" },
    { russian: "Школа", english: "School" },
    { russian: "Учеба", english: "Studies" },
    { russian: "Работа", english: "Work" },
    { russian: "Офис", english: "Office" },
    { russian: "Компания", english: "Company" },
    { russian: "Коллега", english: "Colleague" },
    { russian: "Инженер", english: "Engineer" },
    { russian: "Программист", english: "Programmer" },
    { russian: "Врач", english: "Doctor" },
    { russian: "Художник", english: "Artist" },
    { russian: "Актер", english: "Actor" },
    { russian: "Музыкант", english: "Musician" },
    { russian: "Спортсмен", english: "Athlete" },
    
    // Hobbies and Interests
    { russian: "Любить", english: "To like/love" },
    { russian: "Интересоваться", english: "To be interested in" },
    { russian: "Чтение", english: "Reading" },
    { russian: "Книга", english: "Book" },
    { russian: "Музыка", english: "Music" },
    { russian: "Фильм", english: "Movie" },
    { russian: "Искусство", english: "Art" },
    { russian: "История", english: "History" },
    { russian: "Технологии", english: "Technology" },
    { russian: "Спорт", english: "Sports" },
    { russian: "Путешествовать", english: "To travel" },
    { russian: "Готовить", english: "To cook" },
    { russian: "Дружить", english: "To be friends" },
    { russian: "Встречаться", english: "To meet" },
    { russian: "Позвонить", english: "To call" },
    
    // Common Expressions
    { russian: "Вопрос", english: "Question" },
    { russian: "Ответ", english: "Answer" },
    { russian: "Интересно", english: "Interesting" },
    { russian: "Правда", english: "Truth" },
    { russian: "Ложь", english: "Lie" },
    { russian: "Да", english: "Yes" },
    { russian: "Нет", english: "No" },
    { russian: "Может быть", english: "Maybe" },
    { russian: "Уже", english: "Already" },
    { russian: "Еще", english: "Still/Yet" },
    { russian: "Всегда", english: "Always" },
    { russian: "Никогда", english: "Never" },
    { russian: "Иногда", english: "Sometimes" },
    { russian: "Сегодня", english: "Today" },
    { russian: "Завтра", english: "Tomorrow" },
    { russian: "Вчера", english: "Yesterday" },
    { russian: "Сейчас", english: "Now" },
    { russian: "Потом", english: "Later" }
];

// Game variables
let currentPhraseIndex = 0;
let lives = 3;
let countdown = 20;
let countdownInterval;
let recognition;
let isListening = false;
let synth = window.speechSynthesis;

// DOM elements
const russianPhraseEl = document.getElementById('russianPhrase');
const translationEl = document.getElementById('translation');
const livesEl = document.getElementById('lives');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const feedbackEl = document.getElementById('feedback');
const countdownEl = document.getElementById('countdown');
const correctSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3');
const wrongSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3');

// Initialize game
function initGame() {
    currentPhraseIndex = 0;
    lives = 5;
    updateLivesDisplay();
    loadPhrase(currentPhraseIndex);
    startBtn.classList.remove('hidden');
    restartBtn.classList.add('hidden');
    startListening(); // Auto-start recognition
}

// Load a phrase
function loadPhrase(index) {
    if (index >= phrases.length) {
        endGame(true);
        return;
    }

    const phrase = phrases[index];
    russianPhraseEl.textContent = phrase.russian;
    translationEl.textContent = phrase.english;
    feedbackEl.textContent = '';
    feedbackEl.className = 'text-center text-lg font-semibold';
    resetCountdown();
}

// Speak Russian phrase
function speakPhrase() {
    if (synth.speaking) synth.cancel();
    const utterance = new SpeechSynthesisUtterance(phrases[currentPhraseIndex].russian);
    utterance.lang = 'ru-RU';
    synth.speak(utterance);
}

// Update lives display
function updateLivesDisplay() {
    livesEl.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        livesEl.innerHTML += '<i class="fas fa-heart text-red-500 text-2xl"></i>';
    }
}

// Start countdown
function startCountdown() {
    countdown = 20;
    countdownEl.textContent = countdown;
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        countdown--;
        countdownEl.textContent = countdown;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            wrongAnswer();
        }
    }, 1000);
}

// Reset countdown
function resetCountdown() {
    clearInterval(countdownInterval);
    countdown = 20;
    countdownEl.textContent = countdown;
}

// Initialize speech recognition
function initSpeechRecognition() {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript.trim();
        checkPronunciation(speechResult);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        feedbackEl.textContent = 'Error in recognition. Try again.';
        feedbackEl.className = 'text-center text-lg font-semibold text-red-500';
        stopListening();
    };
}

// Check pronunciation
function checkPronunciation(userSpeech) {
    const currentPhrase = phrases[currentPhraseIndex].russian.toLowerCase();
    const userPhrase = userSpeech.toLowerCase();
    
    if (userPhrase === currentPhrase.toLowerCase()) {
        correctAnswer();
    } else {
        wrongAnswer();
    }
}

// Handle correct answer
function correctAnswer() {
    feedbackEl.textContent = 'Correct! Good job!';
    feedbackEl.className = 'text-center text-lg font-semibold text-green-500';
    correctSound.play();
    clearInterval(countdownInterval);
    stopListening();
    
    setTimeout(() => {
        currentPhraseIndex++;
        loadPhrase(currentPhraseIndex);
        startListening();
    }, 1500);
}

// Handle wrong answer
function wrongAnswer() {
    feedbackEl.textContent = 'Try again!';
    feedbackEl.className = 'text-center text-lg font-semibold text-red-500';
    wrongSound.play();
    lives--;
    updateLivesDisplay();
    stopListening();
    
    if (lives <= 0) {
        endGame(false);
    } else {
        setTimeout(() => {
            startListening();
        }, 1000);
    }
}

// End game
function endGame(won) {
    clearInterval(countdownInterval);
    stopListening();
    
    if (won) {
        feedbackEl.textContent = 'Congratulations! You completed all phrases!';
        feedbackEl.className = 'text-center text-lg font-semibold text-green-500';
    } else {
        feedbackEl.textContent = 'Game Over! Try again!';
        feedbackEl.className = 'text-center text-lg font-semibold text-red-500';
    }
    
    startBtn.classList.add('hidden');
    restartBtn.classList.remove('hidden');
}

// Start listening
function startListening() {
    if (!isListening) {
        recognition.start();
        isListening = true;
        startBtn.textContent = 'Stop Listening';
        startCountdown();
    }
}

// Stop listening
function stopListening() {
    if (isListening) {
        recognition.stop();
        isListening = false;
        startBtn.textContent = 'Start Pronunciation Check';
    }
}

// Event listeners
startBtn.addEventListener('click', () => {
    if (!isListening) {
        if (!recognition) initSpeechRecognition();
        startListening();
    } else {
        stopListening();
        resetCountdown();
    }
});

restartBtn.addEventListener('click', initGame);

russianPhraseEl.addEventListener('mouseover', () => russianPhraseEl.classList.add('text-red-500'));
russianPhraseEl.addEventListener('mouseout', () => russianPhraseEl.classList.remove('text-red-500'));
russianPhraseEl.addEventListener('click', speakPhrase);

// Initialize the game
if (!recognition) initSpeechRecognition();

// Initialize based on current page
if (window.location.pathname.endsWith('index.html')) {
    initGame();
} else if (window.location.pathname.endsWith('practice.html')) {
    // Get current category phrases
    const category = localStorage.getItem('practiceCategory');
    const categoryPhrases = {
        'greetings': phrases.slice(0, 10),
        'pronouns': phrases.slice(10, 18),
        'questions': phrases.slice(18, 26),
        'countries': phrases.slice(26, 35),
        'languages': phrases.slice(35, 43),
        'professions': phrases.slice(43, 58),
        'hobbies': phrases.slice(58, 73),
        'expressions': phrases.slice(73)
    };
    
    // Shuffle and set current phrases
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    window.currentPhrases = shuffleArray([...categoryPhrases[category]]);
    window.currentPhraseIndex = 0;
    loadPhrase(0);
}

// Modified loadPhrase for practice.html
function loadPhrase(index) {
    const phrasesList = window.currentPhrases || phrases;
    if (index >= phrasesList.length) {
        endGame(true);
        return;
    }

    const phrase = phrasesList[index];
    russianPhraseEl.textContent = phrase.russian;
    translationEl.textContent = phrase.english;
    feedbackEl.textContent = '';
    feedbackEl.className = 'text-center text-lg font-semibold';
    
    if (window.location.pathname.endsWith('practice.html')) {
        startBtn.classList.remove('hidden');
        nextBtn.classList.add('hidden');
    }
}
