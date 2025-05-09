const mongoose = require('mongoose');

const ExamenSchema = new mongoose.Schema({
  titreExam: { type: String, required: true },
  description: { type: String, required: true },
  dateExam: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      reponseCorrecte: { type: String, required: true },
      note: { type: Number, required: true }  // ✅ تمت إضافته
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Examen', ExamenSchema);
