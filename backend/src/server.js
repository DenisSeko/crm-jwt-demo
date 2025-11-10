import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import auth from './routes/auth.js';
import client from './routes/client.js';
import note from './routes/note.js';
import { pool, testConnection } from './config/database.js';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Test database connection on startup
testConnection().then(success => {
  if (!success) {
    console.log('⚠️  Database not ready, but starting server anyway...');
  }
});

// JAVNE rute (bez autentifikacije)
app.get('/api/public/notes', async (req, res) => {
  try {
    const { client_id } = req.query;
    let query = `
      SELECT n.*, u.name as user_name, c.name as client_name 
      FROM notes n 
      LEFT JOIN users u ON n.user_id = u.id 
      LEFT JOIN clients c ON n.client_id = c.id
    `;
    let params = [];
    
    if (client_id) {
      query += ' WHERE n.client_id = $1';
      params.push(client_id);
    }
    
    query += ' ORDER BY n.created_at DESC';
    console.log('Executing public notes query:', query);
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching public notes:', error);
    
    // Ako tablica ne postoji, vrati prazan array
    if (error.code === '42P01') {
      return res.json([]);
    }
    
    res.status(500).json({ 
      error: 'Server error',
      details: error.message,
      code: error.code
    });
  }
});

app.get('/api/public/clients', async (req, res) => {
  try {
    console.log('Fetching public clients...');
    const result = await pool.query('SELECT * FROM clients ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching public clients:', error);
    
    // Ako tablica ne postoji, vrati prazan array
    if (error.code === '42P01') {
      return res.json([]);
    }
    
    res.status(500).json({ 
      error: 'Server error',
      details: error.message,
      code: error.code
    });
  }
});

// ZAŠTIĆENE rute (s autentifikacijom)
app.use('/api/auth', auth);
app.use('/api/clients', client);
app.use('/api/notes', note);

app.get('/api/health', async (req, res) => {
  try { 
    await pool.query('SELECT 1'); 
    res.json({ 
      ok: true, 
      message: 'Server and database are healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) { 
    console.error('❌ Health check failed:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Database connection failed',
      details: error.message
    });
  }
});

// Favicon – 204 No Content
app.get('/favicon.ico', (req, res) => res.status(204).end());

// 404 za sve ostalo
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('🚨 Global error handler:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: error.message,
    path: req.path
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend pokrenut: http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});
