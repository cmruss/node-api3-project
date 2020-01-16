const express = require('express');
const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');

const server = express();

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const { method, originalUrl,  } = req;
  console.log(`$ ${method} to ${originalUrl} @ ${Date.now()}`)
  next();
}

server.use(logger);
server.use('/api/posts', postRouter);
server.use('/api/users', userRouter);

module.exports = server;
