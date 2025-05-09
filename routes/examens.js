const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const Examen = require('../models/Examen');

// ✅ إنشاء امتحان جديد
router.post('/create', verifyToken, async (req, res) => {
  const { titreExam, description, dateExam, questions } = req.body;

  try {
    const newExam = new Examen({
      titreExam,
      description,
      dateExam,
      questions,
      createdBy: req.user.id
    });

    await newExam.save();

    res.status(201).json({ message: "Examen créé avec succès !", examen: newExam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

// ✅ عرض جميع الامتحانات
router.get('/all', verifyToken, async (req, res) => {
  try {
    const examens = await Examen.find();
    res.json({ examens });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

// ✅ حذف امتحان
router.delete('/delete/:id', verifyToken, async (req, res) => {
  const examId = req.params.id;

  try {
    const exam = await Examen.findById(examId);

    if (!exam) {
      return res.status(404).json({ message: "Examen non trouvé." });
    }

    if (exam.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Vous n'avez pas la permission de supprimer cet examen." });
    }

    await exam.remove();

    res.json({ message: "Examen supprimé avec succès." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

// ✅ إرسال إجابات الطالب وتصحيح مفصل
router.post('/submit/:examId', verifyToken, async (req, res) => {
  const examId = req.params.examId;
  const { answers } = req.body;

  try {
    const examen = await Examen.findById(examId);

    if (!examen) {
      return res.status(404).json({ message: "Examen non trouvé." });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Les réponses sont requises." });
    }

    const corrections = [];
    let bonnesReponses = 0;

    examen.questions.forEach((question, index) => {
      const studentAnswer = answers[index] || "";
      const correctAnswer = question.reponseCorrecte;

      const isCorrect = studentAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

      if (isCorrect) bonnesReponses++;

      corrections.push({
        question: question.question,
        studentAnswer: studentAnswer,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect
      });
    });

    const totalQuestions = examen.questions.length;
    const scoreFinal = `${bonnesReponses}/${totalQuestions}`;

    res.json({
      message: "Examen corrigé avec détails 🧠",
      corrections: corrections,
      score: scoreFinal,
      bonnesReponses: bonnesReponses,
      totalQuestions: totalQuestions
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;
