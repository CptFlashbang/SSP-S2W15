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
app.use(express.static(path.join(__dirname,"public")));

// ROUTERS -------------------------------------------------------------------
app.use("/users", userRouter);

// ROUTE ---------------------------------------------------------------------
app.get('/', async (req, res) => {
    // Local Variables 
    let collection = await db.collection("Rides");
    let results = await collection.find({}).toArray();
    const ridesList = results.map(ride => {
        return {
            id: ride._id,
            name: ride.name,
            fast_track_cost: ride.fast_track_cost,
            min_height: ride.min_height
        };
    });

    res.render("home_unlogged", { ridesList: ridesList });
});

// START SERVER --------------------------------------------------------------
app.listen(2319, () =>
{
console.log("The server is listening...");
});