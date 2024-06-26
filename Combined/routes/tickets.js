'use strict'
// Imports
import bodyParser from "body-parser";
import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

// Application Objects
const router = express.Router();

let collection = await db.collection("Rides");
let results = await collection.find({}).toArray();
const ridesList = results.map(ride =>
{
    return {
        id: ride._id,
        name: ride.name,
        fast_track_cost: ride.fast_track_cost,
        min_height: ride.min_height
    };
});


// Middleware for This Router
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Routes for This Router (all routes /tickets onwards)
// router.get('/', (req, res) => {
//     res.render("tickets");
// });

router.get('/buy-tickets', async (req, res) =>
{
    // Local Variables 

    res.render("buy-tickets", { ridesList: ridesList });
});

router.post("/buy-tickets", async (req, res, next) =>
{
    let collection = await db.collection("Orders");
    let newDoc = {
        date_booked: new Date(),
        visit_date: req.body.visitDate,
        fastPasses: ridesList.map(ride => ({
            name: ride.name,
            selected: req.body.fastPasses.includes(ride.name)
        }))
    };

    // console.log("Document to be inserted:", newDoc);

    result = await collection.insertOne(newDoc);

    res.render("tickets-bought");
});

// View Orders by ID --- But we might want to limit this to only if the user has access!
router.get("/orders/:orderId", async (req, res, next) =>
{
    // Local Variables
    let findID;
    let collection = await db.collection("Orders");
    let result;

    try {
        findID = new ObjectId(req.params.orderId);
        result = await collection.findOne({ "_id": findID });

        // Check if we have that result, if not 404
        if (!result) {
            next();
        }
        else {
            res.render("order", { order: result });
        }
    }
    catch (err) {
        // Express cannot catch a thrown error in an async function therefore we pass to next and handle it, this error is from a badly formed ID
        next(err);
    }
});


router.post("/orders/:orderId", async (req, res, next) =>
{
    // Local Variables 
    let collection = await db.collection("Orders");
    let findID = new ObjectId(req.params.orderId);
    let result; console.log(req.body);
    result = await collection.updateOne(
        { "_id": findID },
        { "$set": { "order.$[element].used": true } },
        { arrayFilters: [{ "element.name": { $eq: req.body.usedtoken } }] });
    result = await collection.findOne({ "_id": findID });
    res.render("order", { order: result });
});


export default router;