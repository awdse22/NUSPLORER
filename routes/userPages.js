// route for user specific pages or actions
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

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
      const usernameAvailable = await User.isUsernameAvailable(newUsername);
      if (!usernameAvailable) {
        return res.status(401).json({ message: 'The username is in use' });
      }
      await User.updateOne({ _id: req.userId }, { username: newUsername }, { runValidators: true });
      return res.status(200).json({ message: 'Username updated successfully' });
    }
    return res.status(404).json({ message: 'No data found' });
  } catch (error) {
    console.error('Error querying database', error);
    return res.status(500).json({ message: error.message });
  }
});

router.delete('/deleteAccount', authenticateToken, async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.userId });
    const { password } = req.body;

    if (userData) {
      const isPasswordMatch = await bcrypt.compare(password, userData.password);
      if (isPasswordMatch) {
        await User.deleteOne({ _id: req.userId });
        return res.status(200).json({ message: 'Account deleted successfully' });
      }
      return res.status(401).json({ message: 'Invalid password' });
    }
    return res.status(404).json({ message: 'No data found' });
  } catch (error) {
    console.error('Error querying database', error);
    return res.status(500).json({ message: 'Error deleting account' });
  }
});

router.put('/updatePassword', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userData = await User.findOne({ _id: req.userId });

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    if (userData) {
      const isPasswordMatch = await bcrypt.compare(currentPassword, userData.password);
      if (isPasswordMatch) {
        userData.password = await bcrypt.hash(newPassword, 10);
        await User.updateOne({ _id: req.userId }, { password: userData.password });
        return res.status(200).json({ message: 'Password updated successfully' });
      }
      return res.status(500).json({ message: 'Invalid password' });
    }
    return res.status(404).json({ message: 'No data found' });
  } catch (error) {
    console.error('Error querying database', error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
