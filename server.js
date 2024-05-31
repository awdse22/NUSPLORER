const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const pool = require('./dbConfig');
const e = require('express');

const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("testing");
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let response = {
        success: false,
    };
    
    if (!email || !password) {
        response.message = 'Please fill in the email and password';
        return res.json(response);
    }
    
    const searchEmail = await pool.query(
        `SELECT * FROM users WHERE email = $1`, [email]
    );

    const user = searchEmail.rows[0];
    if (!user) {
        response.message = 'Invalid email address';
        return res.json(response);
    } else {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            response.message = 'The password is incorrect';
            return res.json(response);
        } else {
            response.success = true;
            return res.json(response);
        }
    }
})

app.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    let response = {
        success: false,
    };

    if (!username || !email || !password || !confirmPassword) {
        response.message = 'Please fill in all entries';
    } else if (username.length < 3 || username.length > 16) {
        response.message = 'Your username should be 3 to 16 characters long';
    } else if (password.length < 8) {
        response.message = 'Your password should be at least 8 characters long';
    } else if (password != confirmPassword) {
        response.message = 'The passwords do not match';
    }

    if (response.message != null) {
        return res.json(response);
    }

    response.email = email;
    const hashedPassword = await bcrypt.hash(password, 5);
    const checkEmail = await pool.query(
        `SELECT * FROM users
        WHERE email = $1`, [email]
    );
    // check if there are any users registered with the given email
    if (checkEmail.rows.length > 0) {
        response.message = 'The email has already been registered';
        return res.json(response);
    } else {
        // no users registered
        await pool.query(
            `INSERT INTO users (user_name, email, password) 
            VALUES ($1, $2, $3) RETURNING id, email, password`,
            [username, email, hashedPassword], (err, results) => {
                if (err) {
                    console.log(err);
                }
            }
        );
        response.success = true;
        response.message = 'Registration success';
        response.info = req.body;
        return res.json(response);
    }
})

app.listen(PORT, () =>  {
    console.log(`Server running on port http://localhost:${PORT}`);
})