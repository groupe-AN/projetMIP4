const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['teacher', 'student'], required: true },
  sexe: { type: String, enum: ['male', 'female'], required: true },
  dateNaissance: { type: Date, required: true },
  etablissement: { type: String, required: true },
  course: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
