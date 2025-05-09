const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'exam-secret-key';

// ✅ تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
  const { username, password, role, sexe, dateNaissance, etablissement, course } = req.body;

  try {
    // التحقق من أن اسم المستخدم غير مستخدم
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur existe déjà.' });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المستخدم الجديد
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
      sexe,
      dateNaissance,
      etablissement,
      course
    });

    await newUser.save();

    res.status(201).json({ message: '✅ Utilisateur créé avec succès !' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

// ✅ تسجيل الدخول
router.post('/login', async (req, res) => {
  const { role, username, password } = req.body;

  try {
    const user = await User.findOne({ role, username });

    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Mot de passe incorrect." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: "Authentification réussie.",
      token,
      user: { id: user._id, role: user.role, username: user.username }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
});

module.exports = router;
