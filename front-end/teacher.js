document.addEventListener('DOMContentLoaded', () => {
  const examForm = document.querySelector('.examForm');
  const questionForm = document.querySelector('.questionForm');
  const questionList = document.getElementById('questionList');
  const examTableBody = document.querySelector('#examTable tbody');

  let questions = [];
  let currentEditIndex = -1;

 
  questionForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const text = document.getElementById("questionText").value;
    const reponse = document.getElementById("directAnswer").value;
    const duration = document.getElementById("questionDuration").value;
    const score = document.getElementById("questionScore").value;

    const question = { text, reponse, duration, score };

    if (currentEditIndex === -1) {
      questions.push(question);
    } else {
      questions[currentEditIndex] = question;
      currentEditIndex = -1;
      document.getElementById("submitQuestion").textContent = "➕ Add Question";
    }

    questionForm.reset();
    renderQuestions();
  });

 
  function renderQuestions() {
    questionList.innerHTML = "";
    questions.forEach((q, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${q.text}</strong><br>
        Réponse : ${q.reponse}, Note : ${q.score}, Durée : ${q.duration}s
        <div>
          <button onclick="editQuestion(${index})">✏ Modifier</button>
          <button onclick="deleteQuestion(${index})">🗑 Supprimer</button>
        </div>
      `;
      questionList.appendChild(li);
    });
  }

  window.editQuestion = function (index) {
    const q = questions[index];
    document.getElementById("questionText").value = q.text;
    document.getElementById("directAnswer").value = q.reponse;
    document.getElementById("questionDuration").value = q.duration;
    document.getElementById("questionScore").value = q.score;
    currentEditIndex = index;
    document.getElementById("submitQuestion").textContent = "✅ Modifier";
  };

  
  window.deleteQuestion = function (index) {
    questions.splice(index, 1);
    renderQuestions();
  };

  examForm.addEventListener("submit", async function (e) {
    e.preventDefault();
   const titreExam = document.getElementById("titreExam").value;
   const description = document.getElementById("description").value;
   const dateExam = document.getElementById("dateExam").value;
   const examAudience= document.getElementById("examAudience").value;
   const token = localStorage.getItem("token");

    if (!titreExam || !description || !dateExam || questions.length === 0) {
      alert("Veuillez remplir toutes les informations de l'examen.");
      return;
    }

    
    try {
      console.log({
          titreExam,
         description,
         dateExam,
         questions
});

      const response = await fetch("http://localhost:3000/api/examens/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
       body: JSON.stringify({
           titreExam,
           description,
           dateExam,
           questions
         })
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Examen enregistré !");
        document.getElementById("generatedLink").innerHTML = `
          🔗 Lien généré : <a href="student.html?exam=${data.exam._id}" target="_blank">
          Accéder à l'examen</a>`;
        renderExamRow(data.exam);
        examForm.reset();
        questions = [];
        renderQuestions();
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion au serveur.");
    }
  });

  function renderExamRow(exam) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${exam.titreExam}</td>
      <td>${exam.description}</td>
      <td>${exam.audience}</td>
      <td>${exam.questions.length}</td>
    `;
    examTableBody.appendChild(row);
  }
});
