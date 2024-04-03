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
router.use(bodyParser.urlencoded({extended: true}));
