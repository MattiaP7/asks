document.addEventListener('DOMContentLoaded', function () {
  // Carichiamo il file JSON
  fetch('asks.json')
    .then(response => response.json())
    .then(quizData => {
      // Funzione per generare domande casuali
      function generateQuiz() {
        const questionsContainer = document.getElementById('quiz-form');
        const randomQuestions = [];

        // Scegliamo 16 domande casuali
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

        return randomQuestions;
      }

      // Funzione per calcolare il punteggio e mostrare gli errori
      function calculateScore(randomQuestions) {
        let score = 0;
        const wrongAnswers = []; // Array per tracciare le risposte sbagliate

        randomQuestions.forEach(index => {
          const question = quizData.questions[index];
          const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);

          if (selectedOption) {
            if (selectedOption.value === question.correct) {
              score++;
            } else {
              // Aggiungi la domanda e le risposte errate/corrette all'array
              wrongAnswers.push({
                question: question.question,
                correct: question.correct,
                selected: selectedOption.value
              });
            }
          } else {
            // Nessuna risposta selezionata
            wrongAnswers.push({
              question: question.question,
              correct: question.correct,
              selected: "Nessuna risposta"
            });
          }
        });

        const resultElem = document.getElementById('result');
        const vote = (score / 16) * 10; // Voto in decimi

        // Mostra il risultato
        resultElem.innerHTML = `
          <p>Il tuo punteggio è: ${score}/16 (Voto: ${vote.toFixed(1)})</p>
        `;

        // Mostra le risposte sbagliate
        const wrongAnswersElem = document.getElementById('wrong-answers');
        if (wrongAnswers.length > 0) {
          wrongAnswersElem.innerHTML = `
            <h3>Risposte Errate:</h3>
            <ul>
              ${wrongAnswers.map(wrong => `
                <li>
                  <strong>Domanda:</strong> ${wrong.question}<br>
                  <strong>Risposta corretta:</strong> ${wrong.correct}<br>
                  <strong>Risposta data:</strong> ${wrong.selected}
                </li>
              `).join('')}
            </ul>
          `;
        } else {
          wrongAnswersElem.innerHTML = '<p>Non hai sbagliato nessuna domanda!</p>';
        }
      }

      // Genera le domande e traccia l'ordine casuale
      const randomQuestions = generateQuiz();

      // Gestiamo il click sul pulsante submit
      document.getElementById('submit-btn').addEventListener('click', function () {
        calculateScore(randomQuestions);
      });
    })
    .catch(error => console.error('Errore nel caricare il file JSON:', error));
});
