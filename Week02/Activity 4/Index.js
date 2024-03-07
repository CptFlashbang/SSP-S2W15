"use strict";
import express from 'express';
const app = express();
const port = 2319;

app.get('/', (req, res) => {
    res.send(`
        <h1 style="color: red;">Hello World</h1>
        <button onclick="location.href='/tickets'">Tickets</button>
        <button onclick="location.href='/users'">Users</button>
    `);
});

app.get('/login', (req, res) => {
    res.send('<h1>Login Page</h1>');
});

// app.get('/tickets', (req, res) => {
//     res.send('<h1>Tickets Page</h1>');
// });

// app.get('/users', (req, res) => {
//     res.send('<h1>Users Page</h1>');
// });

app.get('*', (req, res) => {
    console.log('Redirecting to login...'.yellow);
    res.redirect('/login');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});