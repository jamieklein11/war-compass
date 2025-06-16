document.addEventListener('DOMContentLoaded', () => {
    const questionsContainer = document.querySelector('.questions-container');
    const quizForm = document.getElementById('quiz-form');
    
    // Shuffle questions
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    
    // Create question elements
    shuffledQuestions.forEach(question => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question';
        questionElement.innerHTML = `
            <p class="question-text">${question.text}</p>
            <div class="likert-scale">
                <div class="likert-option">
                    <input type="radio" name="q${question.id}" value="1" id="q${question.id}_1" required>
                    <label for="q${question.id}_1">Strongly Disagree</label>
                </div>
                <div class="likert-option">
                    <input type="radio" name="q${question.id}" value="2" id="q${question.id}_2">
                    <label for="q${question.id}_2">Disagree</label>
                </div>
                <div class="likert-option">
                    <input type="radio" name="q${question.id}" value="3" id="q${question.id}_3">
                    <label for="q${question.id}_3">Neutral</label>
                </div>
                <div class="likert-option">
                    <input type="radio" name="q${question.id}" value="4" id="q${question.id}_4">
                    <label for="q${question.id}_4">Agree</label>
                </div>
                <div class="likert-option">
                    <input type="radio" name="q${question.id}" value="5" id="q${question.id}_5">
                    <label for="q${question.id}_5">Strongly Agree</label>
                </div>
            </div>
        `;
        questionsContainer.appendChild(questionElement);
    });
    
    // Handle form submission
    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const scores = {
            strategicEthics: { total: 0, count: 0 },
            moralScope: { total: 0, count: 0 },
            strategicOrientation: { total: 0, count: 0 },
            epistemicTrust: { total: 0, count: 0 }
        };
        
        // Calculate scores
        shuffledQuestions.forEach(question => {
            const value = parseInt(document.querySelector(`input[name="q${question.id}"]:checked`).value);
            const score = question.reverseScored ? 6 - value : value;
            
            // Handle questions that map to multiple axes
            const axes = Array.isArray(question.axis) ? question.axis : [question.axis];
            axes.forEach(axis => {
                scores[axis].total += score;
                scores[axis].count++;
            });
        });
        
        // Calculate averages
        const results = {};
        for (const axis in scores) {
            results[axis] = scores[axis].total / scores[axis].count;
        }
        
        // Store results in localStorage
        localStorage.setItem('warCompassResults', JSON.stringify(results));
        
        // Redirect to results page
        window.location.href = 'results.html';
    });
}); 