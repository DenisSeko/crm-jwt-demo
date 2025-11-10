import { pool } from '../config/database.js';

export const get = async (req, res) => {
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
    console.log('Executing notes query:', query);
    
    const notes = (await pool.query(query, params)).rows;
    res.json(notes);
  } catch (error) {
    console.error('❌ Error in notes get:', error);
    
    // Ako tablica ne postoji, vrati prazan array umjesto da crash-a
    if (error.code === '42P01') {
      console.log('Notes table does not exist yet, returning empty array');
      return res.json([]);
    }
    
    res.status(500).json({ 
      error: 'Server error',
      details: error.message,
      code: error.code
    });
  }
};

export const create = async (req, res) => {
  try {
    const { client_id, title, content } = req.body;
    if (!client_id || !title) {
      return res.status(400).json({ error: 'Client ID and title required' });
    }
    
    const user_id = req.user.id;
    const note = (await pool.query(
      'INSERT INTO notes (user_id, client_id, title, content) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, client_id, title, content || '']
    )).rows[0];
    
    res.json(note);
  } catch (error) {
    console.error('❌ Error creating note:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message,
      code: error.code
    });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const user_id = req.user.id;
    
    const result = await pool.query(
      'UPDATE notes SET title=$1, content=$2, updated_at=NOW() WHERE id=$3 AND user_id=$4 RETURNING *',
      [title, content, id, user_id]
    );
    
    if (result.rowCount === 0) return res.status(404).json({ error: 'Note not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error updating note:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message,
      code: error.code
    });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    const result = await pool.query('DELETE FROM notes WHERE id = $1 AND user_id = $2', [id, user_id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Note not found' });
    res.json({ ok: true });
  } catch (error) {
    console.error('❌ Error deleting note:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message,
      code: error.code
    });
  }
};
