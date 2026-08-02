let timeInSeconds = 18 * 60; // 18 मिनट का टाइमर
let timerInterval = null;
let isSubmitted = false;

// पेज लोड होने पर क्विज़ और टाइमर स्टार्ट करें
window.onload = function () {
    renderQuestions();
    startTimer();
};

// प्रश्नों को HTML में रेंडर करें
function renderQuestions() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';

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

// 18 मिनट का उलटा टाइमर (Countdown Timer)
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

// टेस्ट सबमिट करने की प्रक्रिया
function submitQuiz() {
    if (isSubmitted) return;

    // टाइमर रोकें
    clearInterval(timerInterval);
    isSubmitted = true;

    // सबमिट बटन को डिसएबल करें
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = "टेस्ट सबमिट हो चुका है";
    submitBtn.style.backgroundColor = "#757575";

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    questions.forEach((q, index) => {
        const selectedInput = document.querySelector(input[name="q${index}"]:checked);
        const expBox = document.getElementById(exp-${index});
        
        // सभी इनपुट्स को डिसएबल करें
        const allInputs = document.querySelectorAll(input[name="q${index}"]);
        allInputs.forEach(i => i.disabled = true);

        // व्याख्या (Explanation) दिखाएं
        expBox.classList.remove('hidden');

        // सही उत्तर वाले लेबल को हरा (Green) करें
        const correctLabel = document.getElementById(label-${index}-${q.answer});
        if (correctLabel) correctLabel.classList.add('correct-option');

        if (selectedInput) {
            const userAns = parseInt(selectedInput.value);
            if (userAns === q.answer) {
                correctCount++;
            } else {
                wrongCount++;
                // गलत उत्तर वाले लेबल को लाल (Red) करें
                const wrongLabel = document.getElementById(label-${index}-${userAns});
                if (wrongLabel) wrongLabel.classList.add('wrong-option');
            }
        } else {
            skippedCount++;
        }
    });

    // स्कोरकार्ड अपडेट करें
    document.getElementById('total-q').textContent = questions.length;
    document.getElementById('correct-q').textContent = correctCount;
    document.getElementById('wrong-q').textContent = wrongCount;
    document.getElementById('skipped-q').textContent = skippedCount;
    document.getElementById('final-score').textContent = correctCount;
    document.getElementById('max-score').textContent = questions.length;

    // स्कोरकार्ड बॉक्स दिखाएं
    const resultBox = document.getElementById('result-box');
    resultBox.classList.remove('hidden');

    // स्क्रीन को ऊपर स्कोरकार्ड पर स्क्रॉल करें
    window.scrollTo({ top: 0, behavior: 'smooth' });
}