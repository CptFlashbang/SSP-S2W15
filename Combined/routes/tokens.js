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

// Routes for This Router (all routes /tokens onwards)
router.get('/', (req, res) => {
    res.render("tokens");
});

router.get('/buy-tokens', async (req, res) => {
    // Local Variables 
    let collection = await db.collection("Tokens");
    let results = await collection.find({}).toArray();
    res.render("buy-tokens", { games: results });
});

router.post("/buy-tokens", async (req, res, next) => {
    // Local Variables 
    let findID;
    let collection = await db.collection("orders");
    let newDoc = {}; let result;
    // Demo what's in the body 
    console.log(req.body);
    newDoc.order = [];
    newDoc.date = new Date();
    Object.keys(req.body).forEach(key => {
        newDoc.order.push({ "name": key, "used": false });
    });
    result = await collection.insertOne(newDoc);
    res.render("tokens-bought");
});

// View Orders by ID --- But we might want to limit this to only if the user has access!
router.get("/orders/:orderId", async (req, res, next) => {
    // Local Variables
    let findID;
    let collection = await db.collection("orders");
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


router.post("/orders/:orderId", async (req, res, next) => {
    // Local Variables 
    let collection = await db.collection("orders");
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