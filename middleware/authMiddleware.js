const jwt = require('jsonwebtoken');
const JWT_SECRET = "ma_cle_super_secrete";

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ message: "Token non fourni." });
  }

  const token = authHeader.split(' ')[1]; // فقط الجزء الثاني (بعد Bearer)

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide." });
  }
}

module.exports = verifyToken;
