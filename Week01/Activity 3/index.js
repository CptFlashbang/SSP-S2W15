import express from 'express';

const app = express();
const port = 2319;

app.get('/login', (req, res) => {
    res.send('<h1>Login Page</h1>');
});

