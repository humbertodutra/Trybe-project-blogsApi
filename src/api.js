const express = require('express');
const login = require('./controllers/login');
const validate = require('./token/validateJWT');
const user = require('./controllers/user');
const category = require('./controllers/categories');
const post = require('./controllers/post');

// ...

const app = express();

app.use(express.json());

app.post('/login', login.userLogin);
app.post('/user', user.createUser);
app.get('/user', validate, user.getAllUsers);
app.get('/user/:id', validate, user.userById);
app.post('/categories', validate, category.createCategory);
app.get('/categories', validate, category.getAll);
app.get('/post', validate, post.getAll);
app.get('/post/:id', validate, post.getById);
app.post('/post', validate, post.newPost);
// app.put('/post/:id', validate, post.editPost);

// ...

// É importante exportar a constante `app`,
// para que possa ser utilizada pelo arquivo `src/server.js`
module.exports = app;
