import { pool } from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;
const exp = process.env.JWT_EXPIRES_IN || '7d';

// Demo users sa NOVIM hash-om
const DEMO_USERS = {
  'demo@demo.com': {
    id: 1,
    email: 'demo@demo.com',
    name: 'Demo User',
    password_hash: '$2b$10$ZDbMMunC5KeZjUCG4qJTA.SNBB3ypob3LIU.34jAIXpoORFDY.D/C'
  },
  'ivan.horvat@example.com': {
    id: 2,
    email: 'ivan.horvat@example.com', 
    name: 'Ivan Horvat',
    password_hash: '$2b$10$ZDbMMunC5KeZjUCG4qJTA.SNBB3ypob3LIU.34jAIXpoORFDY.D/C'
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email);
    
    // Prvo provjeri demo usere
    if (DEMO_USERS[email]) {
      console.log('Using demo user:', email);
      const user = DEMO_USERS[email];
      const isValid = await bcrypt.compare(password, user.password_hash);
      
      if (isValid) {
        const token = jwt.sign({ userId: user.id }, secret, { expiresIn: exp });
        return res.json({ 
          token, 
          user: { 
            id: user.id, 
            email: user.email, 
            name: user.name 
          } 
        });
      }
    }
    
    // Ako nije demo user, probaj iz baze
    console.log('Trying database for:', email);
    const user = (await pool.query('SELECT * FROM users WHERE email = $1', [email])).rows[0];
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Provjeri lozinku iz baze
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: exp });
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      } 
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = (await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1,$2,$3) RETURNING id,email,name',
      [email, hash, name]
    )).rows[0];
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: exp });
    res.status(201).json({ token, user });
  } catch (e) {
    if (e.code === '23505') return res.status(400).json({ error: 'Email already exists' });
    console.error('Register error:', e);
    res.status(500).json({ error: 'Server error during registration' });
  }
};
