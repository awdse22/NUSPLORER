require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const usersRouter = require('./routes/users');

const PORT = 3000;
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('db connected');
}).catch(error => console.log(error.message));

app.use(express.json());
app.use(usersRouter);

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized request' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            return res.status(403).json({ message: 'Forbidden request' });
        }
        req.user = user;
        next();
    })
}

app.get("/userdetails", authenticateToken, async (req, res) => {
    try {
        const userData = await User.findOne({ email: req.user.email})

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

app.listen(PORT, () =>  {
    console.log(`Server running on port http://localhost:${PORT}`);
})