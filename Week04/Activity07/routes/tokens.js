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

export default router;