// route for user specific pages or actions
const express = require('express');
const router = express.Router();
const authenticateToken = require('../tokenAuthMiddleware');
const User = require('../models/user');

router.get('/userDetails', authenticateToken, async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.userId });

    if (userData) {
      return res.status(200).json({ userData: userData });
    }
    return res.status(404).json({ message: 'No data found' });
  } catch (error) {
    console.error('Error querying database', error);
    return res.status(500).json({ message: 'Error retrieving data' });
  }
});

router.put('/updateUsername', authenticateToken, async (req, res) => {
  try {
    const { newUsername } = req.body;
    const userData = await User.findOne({ _id: req.userId });

    if (userData) {
      userData.username = newUsername;
      await userData.save();
      return res.status(200).json({ message: 'Username updated successfully' });
    }
    return res.status(404).json({ message: 'No data found' });
  } catch (error) {
    console.error('Error querying database', error);
    return res.status(500).json({ message: 'Error updating username' });
  }
});

router.delete('/deleteAccount', authenticateToken, async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.userId });

    if (userData) {
      await User.deleteOne({ _id: req.userId });
      return res.status(200).json({ message: 'Account deleted successfully' });
    }
    return res.status(404).json({ message: 'No data found' });
  } catch (error) {
    console.error('Error querying database', error);
    return res.status(500).json({ message: 'Error deleting account' });
  }
});

module.exports = router;
