const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const pool = require('./dbConfig');
const jwt = require('jsonwebtoken');

const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("testing");
})


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

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill in all entries'});
    }

    let searchEmail;
    
    try {
        searchEmail = await pool.query(
            `SELECT * FROM users WHERE email = $1`, [email]
        );
    } catch {
        console.error('Error querying database', err);
        return res.status(500).json({ message: 'Internal server error'});
    }

    const user = searchEmail.rows[0];
    if (!user) {
        return res.status(400).json({ message: 'Invalid email address'});
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Incorrect password'});
    }

    try {
        const token = jwt.sign({ email: user.email, username: user.username}, process.env.JWT_SECRET);
        res.status(200).json({ token: token });
    } catch (error) {
        console.error('Error signing token: ', error);
        return res.status(500).json({ message: 'Error signing token'});
    }
})

app.post('/register', async (req, res) => {
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
        const checkEmail = await pool.query(
            `SELECT * FROM users
            WHERE email = $1`, [email]
        );
        if (checkEmail.rows.length > 0) {
            return res.status(401).json({ message: 'The email has already been registered'});
        }

        await pool.query(
            `INSERT INTO users (username, email, password) 
            VALUES ($1, $2, $3) RETURNING id, email, password`,
            [username, email, hashedPassword]);
        res.status(201).json({
            message: 'Registration success',
        });
        console.log('reached');
    } catch (err) {
        console.error('Error querying database', err);
        res.status(500).json({ message: 'Internal server error'});
    }
})

app.get("/userdetails", authenticateToken, async (req, res) => {
    try {
        const userData = await pool.query(
            `SELECT * FROM users WHERE email = $1`, [req.user.email]
        );

        if (userData.rows[0]) {
            return res.status(200).json({ userData: userData.rows[0] });
        } else {
            return res.status(404).json({ message: 'No data found' });
        }
    } catch (err) {
        console.error('Error querying database', err);
        return res.status(500).json({ message: 'Error retrieving data'});
    }
})

app.listen(PORT, () =>  {
    console.log(`Server running on port http://localhost:${PORT}`);
})