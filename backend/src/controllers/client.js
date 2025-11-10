import { pool } from '../config/database.js';

export const get = async (_req, res) => {
  try {
    const clients = (await pool.query('SELECT * FROM clients ORDER BY created_at DESC')).rows;
    res.json(clients);
  } catch (error) {
    console.error('❌ Error fetching clients:', error);
    
    // Ako tablica ne postoji, vrati prazan array
    if (error.code === '42P01') {
      console.log('Clients table does not exist yet, returning empty array');
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
    const { name, email, company } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
    const owner = req.user.id;
    const client = (await pool.query(
      'INSERT INTO clients (name,email,company,owner_id) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, email, company || null, owner]
    )).rows[0];
    res.json(client);
  } catch (error) {
    console.error('❌ Error creating client:', error);
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
    const { name, email, company } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
    const owner = req.user.id;
    const result = await pool.query(
      'UPDATE clients SET name=$1, email=$2, company=$3 WHERE id=$4 AND owner_id=$5 RETURNING *',
      [name, email, company || null, id, owner]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Client not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error updating client:', error);
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
    const owner = req.user.id;
    const result = await pool.query('DELETE FROM clients WHERE id = $1 AND owner_id = $2', [id, owner]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Client not found' });
    res.json({ ok: true });
  } catch (error) {
    console.error('❌ Error deleting client:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message,
      code: error.code
    });
  }
};
