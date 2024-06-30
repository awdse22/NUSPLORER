require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const roomRouter = require('./routes/room');
const serverless = require('serverless-http');

const userPagesRouter = require('./routes/userPages');

const PORT = 3000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('db connected');
  })
  .catch((error) => console.log(error.message));

app.use(express.json({ limit: '100mb' }));
app.use(usersRouter);
app.use('/rooms', roomRouter);
app.use(
  '/:userId',
  (req, res, next) => {
    req.userId = req.params.userId;
    next();
  },
  userPagesRouter,
);

app.get('/', (req, res) => {
  res.json('api is running');
})

app.get('/test', (req, res) => {
  res.send({ message: 'Server is running'});
});

if (process.env.ENVIRONMENT == 'LAMBDA') {
  module.exports.handler = serverless(app);
} else {
  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
}





