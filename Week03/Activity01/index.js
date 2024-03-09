'use strict' 

// Imports 
import express from "express"; 

// Application Constants 
const app = express();
const port = 2319;

// Configuration 
app.disable("x-powered-by"); 
app.set("view engine", "ejs");

// Application Listen
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});