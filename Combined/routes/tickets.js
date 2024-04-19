'use strict'
// Imports
import bodyParser from "body-parser";
import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

// Application Objects
const router = express.Router();


// Middleware for This Router
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Routes for This Router (all routes /tickets onwards)
// router.get('/', (req, res) => {
//     res.render("tickets");
// });

router.get('/buy-tickets', async (req, res) => {
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
    res.render("buy-tickets", { ridesList: ridesList });
});

router.post("/buy-tickets", async (req, res, next) => {
    let collection1 = await db.collection("Rides");
    let results = await collection1.find({}).toArray();
    const ridesList = results.map(ride => {
        return {
            id: ride._id,
            name: ride.name,
            fast_track_cost: parseFloat(ride.fast_track_cost),
            min_height: ride.min_height
        };
    });
    let collection2 = await db.collection("Orders");
    let newDoc = {
        date_booked: new Date(),
        visit_date: req.body.visitDate,
        fastPasses: ridesList.map(ride => ({
            name: ride.name,
            selected: req.body.fastPasses.includes(ride.name)
        })),
        cost: ridesList.reduce((acc, ride) => {
            return req.body.fastPasses.includes(ride.name) ? acc + ride.fast_track_cost : acc;
        }, 0)
    };
    console.log(req.body);
    // console.log("Document to be inserted:", newDoc);

    let result = await collection2.insertOne(newDoc);

    res.render("tickets-bought");
});

router.get("/orders/past-tickets", async (req, res, next) => {
    let collection = await db.collection("Orders");
    const currentDate = new Date().toISOString().split('T')[0];
    let results = await collection.find({
        visit_date: { $lt: currentDate }
    }).sort({ visit_date: 1 }).toArray();
    res.render("past-tickets", { orderList : results });
});

router.get("/orders/upcoming-tickets", async (req, res, next) => {
    let collection = await db.collection("Orders");
    const currentDate = new Date().toISOString().split('T')[0];
    let results = await collection.find({
        visit_date: { $gte: currentDate }
    }).sort({ visit_date: 1 }).toArray();
    res.render("upcoming-tickets", { orderList : results });
});

router.get("/orders/edit-tickets/:orderId", async (req, res, next) => {
    let collection = await db.collection("Orders");
    const orderId = req.params.orderId;
    const ObjectId = require('mongodb').ObjectId; 
    const query = { _id: new ObjectId(orderId) };
    const result = await collection.findOne(query);

    let collection2 = await db.collection("Rides");
    let results = await collection2.find({}).toArray();
    const ridesList = results.map(ride => {
        return {
            id: ride._id,
            name: ride.name,
            fast_track_cost: ride.fast_track_cost,
            min_height: ride.min_height
        };
    });

    res.render("edit-tickets", { ticket: result }, { ridesList: ridesList });
});

// View Orders by ID --- But we might want to limit this to only if the user has access!
// router.get("/orders/:orderId", async (req, res, next) => {
//     // Local Variables
//     let findID;
//     let collection = await db.collection("Orders");
//     let result;

//     try {
//         findID = new ObjectId(req.params.orderId);
//         result = await collection.findOne({ "_id": findID });

//         // Check if we have that result, if not 404
//         if (!result) {
//             next();
//         }
//         else {
//             res.render("order", { order: result });
//         }
//     }
//     catch (err) {
//         // Express cannot catch a thrown error in an async function therefore we pass to next and handle it, this error is from a badly formed ID
//         next(err);
//     }
// });


// router.post("/orders/:orderId", async (req, res, next) => {
//     // Local Variables 
//     let collection = await db.collection("Orders");
//     let findID = new ObjectId(req.params.orderId);
//     let result; console.log(req.body);
//     result = await collection.updateOne(
//         { "_id": findID },
//         { "$set": { "order.$[element].used": true } },
//         { arrayFilters: [{ "element.name": { $eq: req.body.usedtoken } }] });
//     result = await collection.findOne({ "_id": findID });
//     res.render("order", { order: result });
// });


export default router;