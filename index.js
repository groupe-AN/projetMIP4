const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // تحميل المتغيرات من .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Raccorder les routes
const authRoutes = require('./routes/auth');
const examRoutes = require('./routes/examens');

app.use('/api/auth', authRoutes);
app.use('/api/examens', examRoutes);

app.get('/', (req, res) => {
  res.send('✅ API Plateforme Examen fonctionne !');
});

// Connexion à MongoDB avant de lancer le serveur
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connecté à MongoDB');

  app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ Erreur de connexion à MongoDB:', err);
});
app.use(express.static('front-end'));
