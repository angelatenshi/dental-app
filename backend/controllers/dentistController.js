const pool = require('../database/database');

const getDentists = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dentists');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get dentists', error: err.message });
  }
};

module.exports = { getDentists };