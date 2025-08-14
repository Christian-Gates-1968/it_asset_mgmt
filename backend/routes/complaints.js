const express = require('express');
const router = express.Router();
const  db = require('../db');
console.log('check db routes at load time:', db);

// GET all complaints (with asset name and user info if needed)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.comp_id, 
              c.asset_id, 
              a.asset_name,
              c.raised_by,
              u.username AS reported_by,
              c.issue,
              c.comp_status,
              c.creation_time,
              c.eng_assigned,
              ua.username AS assigned_to,
              c.expected_res_date,
              c.spare_req,
              c.total_time_taken,
              c.actual_res_date,
              c.comp_type,
              c.updated_at
       FROM complaints c
       JOIN assets a ON c.asset_id = a.asset_id
       JOIN users u ON c.raised_by = u.user_id
       LEFT JOIN users ua ON c.eng_assigned = ua.user_id`
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST - Add new complaint
router.post('/', async (req, res) => {
  const {
    asset_id,
    raised_by,
    issue,
    comp_status = 'Open',
    eng_assigned,
    expected_res_date,
    spare_req,
    total_time_taken,
    actual_res_date,
    comp_type
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO complaints 
        (asset_id, raised_by, issue, comp_status, creation_time, eng_assigned, expected_res_date, spare_req, total_time_taken, actual_res_date, comp_type, updated_at)
       VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, NOW())`,
      [
        asset_id,
        raised_by,
        issue,
        comp_status,
        eng_assigned,
        expected_res_date,
        spare_req,
        total_time_taken,
        actual_res_date,
        comp_type
      ]
    );
    res.json({ message: 'Complaint added', comp_id: result.insertId });
  } catch (err) {
    console.error('Error adding complaint:', err);
    res.status(500).json({ error: 'Failed to add complaint' });
  }
});

// PUT - Update complaint
router.put('/:id', async (req, res) => {
  const compId = req.params.id;
  const {
    asset_id,
    raised_by,
    issue,
    comp_status,
    eng_assigned,
    expected_res_date,
    spare_req,
    total_time_taken,
    actual_res_date,
    comp_type
  } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE complaints SET
        asset_id = ?, raised_by = ?, issue = ?, comp_status = ?, 
        eng_assigned = ?, expected_res_date = ?, spare_req = ?, 
        total_time_taken = ?, actual_res_date = ?, comp_type = ?, updated_at = NOW()
       WHERE comp_id = ?`,
      [
        asset_id,
        raised_by,
        issue,
        comp_status,
        eng_assigned,
        expected_res_date,
        spare_req,
        total_time_taken,
        actual_res_date,
        comp_type,
        compId
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json({ message: 'Complaint updated successfully' });
  } catch (err) {
    console.error('Error updating complaint:', err);
    res.status(500).json({ error: 'Failed to update complaint' });
  }
});

// DELETE - Delete complaint
router.delete('/:id', async (req, res) => {
  const compId = req.params.id;

  try {
    const [result] = await db.query('DELETE FROM complaints WHERE comp_id = ?', [compId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json({ message: 'Complaint deleted successfully' });
  } catch (err) {
    console.error('Error deleting complaint:', err);
    res.status(500).json({ error: 'Failed to delete complaint' });
  }
});

module.exports = router;
