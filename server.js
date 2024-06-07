const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const pool = require('./dbConfig');
const jwt = require('jsonwebtoken');

const PORT = 3000;
const JWT_SECRET = '!Qk@#9ZpP$#XcX0wZq%wA2*eX&ZkUz9B*J7!Rk&ZnLk$Yx7T4*Mp%U9K!NqP2&#';

app.use(express.json());

app.get('/', (req, res) => {
    res.send("testing");
})

/*
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({error: 'No token provided'});
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({error: 'Invalid token'});
    }
}
*/

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let response = {
        success: false,
    };
    
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
            const token = jwt.sign({ email: user.email, username: user.username}, JWT_SECRET);

            if (res.status(201)) {
                response.success = true;
                response.token = token;
                return res.json(response);
            } else {
                response.message = 'Error signing token';
                return res.json(response);
            }
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

app.post("/userdetails", async (req, res) => {
    const { token } = req.body;
    let response = {
        success: true
    };

    if (!token) {
        response.success = false;
        response.message = 'No token found';
        return res.json(response);
    }
    
    try {
        const user = jwt.verify(token, JWT_SECRET)
        const userData = await pool.query(
            `SELECT * FROM users WHERE email = $1`, [user.email]
        );

        if (userData.rows[0]) {
            response.userData = userData.rows[0];
            return res.json(response);
        } else {
            response.success = false;
            response.message = 'No data found';
            return res.json(response);
        }
    } catch (err) {
        console.error('Token verification failed', err);
        response.message = 'Token verification failed';
        response.success = false;
        return res.json(response);
    }
})

app.listen(PORT, () =>  {
    console.log(`Server running on port http://localhost:${PORT}`);
})