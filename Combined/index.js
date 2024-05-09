'use strict'
// Imports
import express from "express";
import * as path from "path";
import { fileURLToPath } from "url";
import userRouter from "./routes/users.js";
import ticketsRouter from "./routes/tickets.js";
import db from "./db/connection.js";
import cookieParser from "cookie-parser";

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
app.use(express.json());  // Middleware to parse JSON
app.use(express.urlencoded({ extended: true }));  // Middleware to parse URL-encoded bodies
app.use(cookieParser());  // Add cookie-parser middleware here

// ROUTERS -------------------------------------------------------------------
app.use("/users", userRouter);
app.use("/tickets", ticketsRouter);

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

    res.render("home", { ridesList: ridesList });
});

const port = 2319;
app.listen(port, () =>
{
    console.log(`The server is listening on port ${port}.`);
});