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

app.get('/home_logged', async (req, res) => {
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

    res.render("home_logged", { ridesList: ridesList });
});

app.post('/checkout', (req, res) => {
    const order = req.body;
    // You might want to add order validation here

    // Save order in session or database
    req.session.order = order;  // Assuming you have session middleware set up

    // Respond with a JSON object that includes the redirect URL
    res.json({ redirectUrl: '/confirmation' });
});

// START SERVER --------------------------------------------------------------
const PORT = process.env.PORT || 2319;
app.listen(PORT, () => 
{
    console.log(`Server running on port ${PORT}`)
});