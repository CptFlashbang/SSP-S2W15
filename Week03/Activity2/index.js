'use strict' 

// Imports 
import express from "express"; 

// Application Constants 
const app = express();
const port = 2319;

// Configuration 
app.disable("x-powered-by"); 
app.set("view engine", "ejs");

// Serve static files from "Activity 2"
app.use(express.static('.'));

// Attempt to serve favicon.ico specifically
app.use("/favicon.ico", express.static("assets/ico/SSP.ico"));

// Application Listen
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});