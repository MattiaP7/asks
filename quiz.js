document.addEventListener('DOMContentLoaded', function () {
	// Carichiamo il file JSON
	fetch('asks.json')
	  .then(response => response.json())
	  .then(quizData => {
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
  
		  return randomQuestions; // Restituiamo le domande selezionate
		}
  
		function calculateScore(selectedQuestions) {
		  let score = 0;
		  const incorrectQuestions = [];
  
		  // Controlla le risposte dell'utente
		  selectedQuestions.forEach(index => {
			const question = quizData.questions[index];
			const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
  
			if (selectedOption) {
			  if (selectedOption.value === question.correct) {
				score++;
			  } else {
				// Aggiungi la domanda sbagliata
				incorrectQuestions.push({
				  question: question.question,
				  selected: selectedOption.value,
				  correct: question.correct
				});
			  }
			} else {
			  // Se non risponde, considera errata
			  incorrectQuestions.push({
				question: question.question,
				selected: "Nessuna risposta",
				correct: question.correct
			  });
			}
		  });
  
		  // Calcola il voto in decimi
		  const vote = (score / 16) * 10;
  
		  // Mostra il punteggio
		  const resultElem = document.getElementById('result');
		  resultElem.textContent = `Il tuo punteggio è: ${score}/16 (Voto: ${vote.toFixed(1)})`;
  
		  // Mostra le risposte errate
		  const incorrectElem = document.getElementById('incorrect');
		  incorrectElem.innerHTML = '<h3>Domande errate:</h3>';
		  if (incorrectQuestions.length === 0) {
			incorrectElem.innerHTML += '<p>Tutte le risposte sono corrette! Ottimo lavoro!</p>';
		  } else {
			incorrectQuestions.forEach(item => {
			  incorrectElem.innerHTML += `
				<div>
				  <p><strong>Domanda:</strong> ${item.question}</p>
				  <p><strong>Risposta selezionata:</strong> ${item.selected}</p>
				  <p><strong>Risposta corretta:</strong> ${item.correct}</p>
				</div>
				<hr>
			  `;
			});
		  }
		}
  
		// Genera il quiz e salva le domande selezionate
		const selectedQuestions = generateQuiz();
  
		// Gestisci il click sul pulsante di invio
		document.getElementById('submit-btn').addEventListener('click', function () {
		  calculateScore(selectedQuestions);
		});
	  })
	  .catch(error => console.error('Errore nel caricare il file JSON:', error));
  });
  