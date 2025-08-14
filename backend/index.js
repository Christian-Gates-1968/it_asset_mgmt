const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const  db = require('./db'); // DB connection exported
const assetsRouter = require('./routes/assets'); // Assets routes
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ? AND user_role = ?',
      [username, role]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    res.json({
      success: true,
      user: {
        username: user.username,
        user_role: user.user_role
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//  Use external asset routes
app.use('/api/assets', assetsRouter);
//use complaints routes
const complaintsRoutes = require('./routes/complaints');
app.use('/api/complaints', complaintsRoutes);


//  Start the server
app.listen(5000, () => {
  console.log('✅ Backend running on http://localhost:5000');
});
