'use strict'
// Imports
import express from "express";
import * as path from "path";
import { fileURLToPath } from "url";
import userRouter from "./routes/users.js";
import ticketsRouter from "./routes/tickets.js";
import db from "./db/connection.js";

// Application Objects
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Application Objects
const app = express();

// Configuration
app.disable("x-powered-by");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Preroute MIDDLEWARE -------------------------------------------------------
app.use(express.static(path.join(__dirname, "public")));

// ROUTERS -------------------------------------------------------------------
app.use("/users", userRouter);
app.use("/tickets", ticketsRouter);

// ROUTES ---------------------------------------------------------------------
app.get('/', async (req, res) => {
    // Local Variables 
    let collection = await db.collection("Rides");
    let results = await collection.find({}).toArray();
    res.render("home_unlogged", { rides: results });
});

// START SERVER --------------------------------------------------------------
const PORT = process.env.PORT || 2319;
app.listen(PORT, () => 
{
    console.log(`Server running on port ${PORT}`)
});