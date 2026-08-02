let timeInSeconds = 18 * 60; // 18 मिनट
let timerInterval = null;
let isSubmitted = false;

// 'Start Test' बटन दबाते ही यह फ़ंक्शन चलेगा
function startQuiz() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('quiz-section').classList.remove('hidden');
    
    renderQuestions();
    startTimer();
}

function renderQuestions() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';

    if (typeof questions === 'undefined' || questions.length === 0) {
        quizContainer.innerHTML = '<p style="color:red; text-align:center;">प्रश्न लोड नहीं हो पाए! कृपया questions.js चेक करें।</p>';
        return;
    }

    questions.forEach((q, index) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.id = question-${index};

        let optionsHTML = '';
        q.options.forEach((opt, optIndex) => {
            optionsHTML += `
                <label class="option-label" id="label-${index}-${optIndex}">
                    <input type="radio" name="q${index}" value="${optIndex}">
                    ${String.fromCharCode(65 + optIndex)}) ${opt}
                </label>
            `;
        });

        card.innerHTML = `
            <div class="question-text">Q${index + 1}. ${q.question}</div>
            <div class="options-list">${optionsHTML}</div>
            <div class="explanation-box hidden" id="exp-${index}">
                <strong>व्याख्या:</strong> ${q.explanation}
            </div>
        `;

        quizContainer.appendChild(card);
    });
}

function startTimer() {
    const timeDisplay = document.getElementById('time-display');

    timerInterval = setInterval(() => {
        if (timeInSeconds <= 0) {
            clearInterval(timerInterval);
            alert("समय समाप्त हो गया है! आपका टेस्ट स्वतः सबमिट हो रहा है।");
            submitQuiz();
            return;
        }

        timeInSeconds--;
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;

        timeDisplay.textContent = 
            ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')};
    }, 1000);
}

function submitQuiz() {
    if (isSubmitted) return;

    clearInterval(timerInterval);
    isSubmitted = true;

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = "सबमिट हो गया";
    submitBtn.style.backgroundColor = "#757575";

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    questions.forEach((q, index) => {
        const selectedInput = document.querySelector(input[name="q${index}"]:checked);
        const expBox = document.getElementById(exp-${index});
        
        const allInputs = document.querySelectorAll(input[name="q${index}"]);
        allInputs.forEach(i => i.disabled = true);

        if (expBox) expBox.classList.remove('hidden');

        const correctLabel = document.getElementById(label-${index}-${q.answer});
        if (correctLabel) correctLabel.classList.add('correct-option');

        if (selectedInput) {
            const userAns = parseInt(selectedInput.value);
            if (userAns === q.answer) {
                correctCount++;
            } else {
                wrongCount++;
                const wrongLabel = document.getElementById(label-${index}-${userAns});
                if (wrongLabel) wrongLabel.classList.add('wrong-option');
            }
        } else {
            skippedCount++;
        }
    });

    document.getElementById('total-q').textContent = questions.length;
    document.getElementById('correct-q').textContent = correctCount;
    document.getElementById('wrong-q').textContent = wrongCount;
    document.getElementById('skipped-q').textContent = skippedCount;
    document.getElementById('final-score').textContent = correctCount;
    document.getElementById('max-score').textContent = questions.length;

    const resultBox = document.getElementById('result-box');
    resultBox.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}