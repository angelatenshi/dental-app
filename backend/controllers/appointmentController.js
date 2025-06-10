const pool = require('../database/database');

// All appointments
const getAppointments = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `
      SELECT 
        a.id,
        a.appointment_date,
        a.time_slot,
        a.status,
        d.name AS dentist_name,
        d.specialty
      FROM appointments a
      JOIN dentists d ON a.dentist_id = d.id
      WHERE a.user_id = $1
      ORDER BY a.appointment_date, a.time_slot
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get appointments', error: err.message });
  }
};

// Create
const createAppointment = async (req, res) => {
  const { user_id, dentist_id, appointment_date, time_slot } = req.body;
  try {
    await pool.query(
      'INSERT INTO appointments (user_id, dentist_id, appointment_date, time_slot) VALUES ($1, $2, $3, $4)',
      [user_id, dentist_id, appointment_date, time_slot]
    );
    res.status(201).json({ message: 'Appointment created' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create appointment', error: err.message });
  }
};

// Update
const updateAppointment = async (req, res) => {
  const id = req.params.id;
  const { appointment_date, time_slot } = req.body;
  try {
    await pool.query(
      'UPDATE appointments SET appointment_date = $1, time_slot = $2 WHERE id = $3',
      [appointment_date, time_slot, id]
    );
    res.json({ message: 'Appointment updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update appointment', error: err.message });
  }
};

// Delete
const deleteAppointment = async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM appointments WHERE id = $1', [id]);
    res.json({ message: 'Appointment cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel appointment', error: err.message });
  }
};

module.exports = {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};