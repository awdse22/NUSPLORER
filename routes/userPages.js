// route for user specific pages or actions
const express = require('express');
const router = express.Router();
const authenticateToken = require('../tokenAuthMiddleware');
const User = require('../models/user');

router.get("/userDetails", authenticateToken, async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.userId })

        if (userData) {
            return res.status(200).json({ userData: userData });
        } else {
            return res.status(404).json({ message: 'No data found' });
        }
    } catch (error) {
        console.error('Error querying database', error);
        return res.status(500).json({ message: 'Error retrieving data'});
    }
})

module.exports = router;
