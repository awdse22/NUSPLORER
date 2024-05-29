const express = require('express');
const app = express();

const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello aaaaaaaa");
})

app.post('/login', async (req, res) => {
    res.json(req.body);
})

app.listen(PORT, () =>  {
    console.log(`Server running on port http://localhost:${PORT}`);
})