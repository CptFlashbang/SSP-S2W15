'use strict'

// Imports 
import express from "express";
import * as path from "path";
import { fileURLToPath } from "url";

// Application Constants 
const app = express();
const port = 2319;

// Use File Location of Index and Get Dir 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration 
app.disable("x-powered-by");
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "public")));
app.use("/favicon.ico", express.static("public/assets/ico/SSP.ico"));

app.get('/test', (req, res) => {
  res.send('Server is working!');
});

//throw an error which triggers an automatic 500 code
app.get('/break-it', (req, res) => {
  throw new Error("Broken It");
});

//throw an error with a status specified as 401
app.get('/unauth-it', (req, res) => {
  const error = new Error("Unauthorized Access");
  error.status = 401;
  throw error;
});

app.get('/tickets', (req, res) => {
  let fakeDatabase = [
    { name: "Hell Swimmers 2", price: 39.0 },
    { name: "Palglobe", price: 29.0 },
    { name: "Defense of the Retirees", price: 53.0 },
  ];

  res.render("tickets", { user: "Callum", data: fakeDatabase });
});

app.get("/", (req, res) => { res.render("index"); });

app.use((err, req, res, next) => {
  switch (err.status) {
    case 401: handle_401(req, res, next);
      break;
    default: handle_500(req, res, next);
      break;
  }
  console.error("You sent me: " + err.stack);
});

function handle_401(req, res, next) {
  res.status(401)
  res.format(
    {
      html: () => {
        res.render("401", { url: req.protocol + "://" + req.hostname + req.originalUrl });
      },
      json: () => {
        res.json({ error: "Authorisation required" });
      },
      default: () => {
        res.type("txt").send("Authorisation required");
      }
    }
  )
}

function handle_500(req, res, next) {
  res.status(500)
  res.format(
    {
      html: () => {
        res.render("500", { url: req.protocol + "://" + req.hostname + req.originalUrl });
      },
      json: () => {
        res.json({ error: "Internal server error" });
      },
      default: () => {
        res.type("txt").send("Internal server error");
      }
    }
  )
}

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