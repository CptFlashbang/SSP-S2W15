'use strict' 

// Imports 
import express from "express"; 
import * as path from "path"; 
import {fileURLToPath} from "url";

// Application Constants 
const app = express();
const port = 2319;
// Use File Location of Index and Get Dir 
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

// Configuration 
app.disable("x-powered-by");
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname,"public"))); 
app.use("/favicon.ico", express.static("public/assets/ico/SSP.ico"));

app.get('/test', (req, res) => {
    res.send('Server is working!');
  });

// Application Listen
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});