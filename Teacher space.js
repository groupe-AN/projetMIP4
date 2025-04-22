// Génération du lien unique d'examen
document.getElementById("examForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const titre = document.getElementById("examTitle").value;
    const lien = "https://examen.app/exam/" + crypto.randomUUID().slice(0, 8);
    document.getElementById("generatedLink").textContent = "🔗 Lien généré : " + lien;
  });
  
  // Affichage dynamique des champs selon le type de question
  document.getElementById("questionType").addEventListener("change", function () {
    const type = this.value;
    document.getElementById("qcmOptions").classList.toggle("hidden", type !== "qcm");
    document.getElementById("directeFields").classList.toggle("hidden", type !== "directe");
  });
  
  const form = document.getElementById("questionForm");
  const list = document.getElementById("questionList");
  
  let questions = [];
  let editIndex = -1;
  
  form.addEventListener("submit", function (e) {
    e.preventDefault();
  
    const text = document.getElementById("questionText").value;
    const reponse = document.getElementById("questionReponse").value;
    const note = document.getElementById("questionNote").value;
  
    const question = { text, reponse, note };
  
    if (editIndex === -1) {
      // Ajout
      questions.push(question);
    } else {
      // Modification
      questions[editIndex] = question;
      editIndex = -1;
      form.querySelector("button").textContent = "Ajouter Question";
    }
  
    form.reset();
    renderList();
  });
  
  function renderList() {
    list.innerHTML = "";
  
    questions.forEach((q, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${q.text}</strong><br>
        Réponse : ${q.reponse}<br>
        Note : ${q.note}
        <div class="question-actions">
          <button onclick="editQuestion(${i})">✏️ Modifier</button>
          <button onclick="deleteQuestion(${i})">🗑️ Supprimer</button>
        </div>
      `;
      list.appendChild(li);
    });
  }
  
  window.editQuestion = function (index) {
    const q = questions[index];
    document.getElementById("questionText").value = q.text;
    document.getElementById("questionReponse").value = q.reponse;
    document.getElementById("questionNote").value = q.note;
  
    editIndex = index;
    form.querySelector("button").textContent = "Modifier Question";
  };
  
  window.deleteQuestion = function (index) {
    questions.splice(index, 1);
    renderList();
  };
  
  