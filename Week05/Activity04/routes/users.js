'use strict'

// Imports
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import multer from "multer";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import admin from "firebase-admin";
import * as path from "path"; import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Router Constants 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const data = require(path.join(__dirname, "../key.json"));

const firebaseConfig = {
    apiKey: "AIzaSyB_q2Czzwc63A-gR9gD3h_i6taVxtHOq5w",
    authDomain: "ssp-nodejs-13ac2.firebaseapp.com",
    projectId: "ssp-nodejs-13ac2",
    storageBucket: "ssp-nodejs-13ac2.appspot.com",
    messagingSenderId: "313657043897",
    appId: "1:313657043897:web:4ad29cf21374065b652468"
};

// Router Objects 
const firebaseApp = initializeApp(firebaseCfg);
const firebaseAuth = getAuth();
const router = express.Router();
const upload = multer();

admin.initializeApp(
    {
        credential: admin.credential.cert(data)
    }
);

// Middleware for This Router 
router.use(bodyParser.json()); 
router.use(bodyParser.urlencoded({extended: true})); 
router.use(cookieParser()); 
router.use(upload.array());