const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Please fill in all entries'});
    } else if (username.length < 3 || username.length > 16) {
        return res.status(400).json({ message: 'Your username should be 3 to 16 characters long'});
    } else if (password.length < 8) {
        return res.status(400).json({ message: 'Your password should be at least 8 characters long'});
    } else if (password != confirmPassword) {
        return res.status(400).json({ message: 'The passwords do not match'});
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    try {
        const usernameAvailable = await User.isUsernameAvailable(username);
        if (!usernameAvailable) {
            return res.status(401).json({ message: 'The username is in use'})
        }
        const emailAvailable = await User.isEmailAvailable(email);
        if (!emailAvailable) {
            return res.status(401).json({ message: 'The email has already been registered'})
        }

        const newUser = await User({
            username: username,
            email: email,
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({
            message: 'Registration success',
            data: newUser
        });
        console.log('reached');
    } catch (err) {
        console.error('Error querying database', err);
        res.status(500).json({ message: 'Internal server error'});
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill in all entries'});
    }

    let user;

    try {
        user = await User.findOne({ email: email});
        if (!user) {
            return res.status(400).json({ message: 'Invalid email address'});
        }
        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password'});
        }
    } catch (error) {
        console.error('Error validating user', error);
        return res.status(500).json({ message: 'Internal server error'});
    }

    try {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.status(200).json({ token: token });
    } catch (error) {
        console.error('Error signing token: ', error);
        return res.status(500).json({ message: 'Authentication error'});
    }
})

module.exports = router;