document.addEventListener('DOMContentLoaded', function () {
  // Carichiamo il file JSON
  fetch('asks.json')
    .then(response => response.json())
    .then(quizData => {
      // Funzione per generare domande casuali
      function generateQuiz() {
        const questionsContainer = document.getElementById('quiz-form');
        const randomQuestions = [];

        // Scegliamo 16 domande casuali da un pool di domande
        while (randomQuestions.length < 16) {
          const randIndex = Math.floor(Math.random() * quizData.questions.length);
          if (!randomQuestions.includes(randIndex)) {
            randomQuestions.push(randIndex);
          }
        }

        // Popoliamo il form con le domande casuali
        randomQuestions.forEach(index => {
          const question = quizData.questions[index];
          const questionElem = document.createElement('div');
          questionElem.classList.add('question');
          questionElem.innerHTML = `
            <p>${question.question}</p>
            <div>
              ${question.options.map(option => `
                <label>
                  <input type="radio" name="question-${index}" value="${option[0]}">
                  ${option}
                </label>
              `).join('')}
            </div>
          `;
          questionsContainer.appendChild(questionElem);
        });
      }

      // Funzione per calcolare il punteggio e dare un voto in decimi
      function calculateScore() {
        let score = 0;
        quizData.questions.forEach((question, index) => {
          const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
          if (selectedOption && selectedOption.value === question.correct) {
            score++;
          }
        });

        const resultElem = document.getElementById('result');
        const vote = (score / 16) * 10; // Voto in decimi

        resultElem.textContent = `Il tuo punteggio è: ${score}/16 (Voto: ${vote.toFixed(1)})`;
      }

      // Gestiamo il click sul pulsante submit
      document.getElementById('submit-btn').addEventListener('click', calculateScore);

      // Carica il quiz all’avvio
      generateQuiz();
    })
    .catch(error => console.error('Errore nel caricare il file JSON:', error));
});
