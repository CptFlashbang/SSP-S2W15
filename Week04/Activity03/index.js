'use strict'
// Imports
import express from "express";
import * as path from "path";
import { fileURLToPath } from "url";
import userRouter from "./routes/users.js";

// Application Objects
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

// Application Objects
const app = express();

// Configuration
app.disable("x-powered-by");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Preroute MIDDLEWARE -------------------------------------------------------
app.use(express.static(path.join(__dirname,"public")));
app.use("/favicon.ico", express.static("public/assets/ico/favicon.ico"));

// ROUTERS -------------------------------------------------------------------
app.use("/users", userRouter);

// ROUTE ---------------------------------------------------------------------
app.get("/", (req, res) =>
{
console.log("Redirect to users router");
res.redirect("/users/welcome");
});

// START SERVER --------------------------------------------------------------
app.listen(8080, () =>
{
console.log("The server is listening...");
});