'use strict'

// Imports 
import express from "express";

// Application Constants 
const app = express();
const port = 2319;

// Configuration 
app.disable("x-powered-by");
app.set("view engine", "ejs");

app.use(express.static('public'));
app.use("/favicon.ico", express.static("public/assets/ico/SSP.ico"));

app.get('/test', (req, res) => {
  // res.send('Server is working!');
  res.status(404); res.format(
    {
      html: () => {
        res.render("test");
      }
    });
});

app.use((req, res, next) => {
  res.status(404); res.format(
    {
      html: () => {
        res.render("404", { url: req.protocol + "://" + req.hostname + req.originalUrl });
      },
      json: () => {
        res.json({ error: "Not found" });
      },
      default: () => {
        res.type("txt").send("Not found");
      }
    });
});

// Application Listen
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});