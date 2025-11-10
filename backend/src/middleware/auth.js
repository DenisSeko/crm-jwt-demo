import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

export const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = (await pool.query('SELECT id, email, name FROM users WHERE id = $1', [userId])).rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
