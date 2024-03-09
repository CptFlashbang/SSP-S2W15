import express from 'express';
import colors from 'colors';

const app = express();
const port = 2319;

// Route for module code
app.get('/COMP50016', (req, res) => {
    res.send('<h1 style="color: blue;">Module Title</h1>');
});

// Route for favicon request
app.get('/favicon.ico', (req, res) => {
    res.send('<h1 style="color: green;">Favicon request</h1>');
});

// Default route
app.get('/', (req, res) => {
    console.log('No route was used.'.yellow);
    res.send('<h1 style="color: red;">Hello World</h1>');
});

// Existing routes with added colors
app.get('/login', (req, res) => {
    res.send('<h1 style="color: purple;">Login Page</h1>');
});

app.get('/tickets', (req, res) => {
    res.send('<h1 style="color: orange;">Tickets Page</h1>');
});

app.get('/users', (req, res) => {
    res.send('<h1 style="color: pink;">Users Page</h1>');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});