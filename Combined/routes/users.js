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

const firebaseCfg = {
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
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser());
router.use(upload.array());

// Routes for This Router (all routes /users onwards) 
// router.get('/', (req, res) =>
// {
//     res.redirect("/users/welcome");
// });

router.get('/sign-in', (req, res) =>
{
    res.render("sign-in");
});

router.post('/sign-in', sign_in, (req, res) =>
{
    res.status(200)
    res.redirect("/tickets/buy-tickets");
});

router.get('/sign-up', (req, res) =>
{
    console.log("Render Sign Up");
    res.render("sign-up", { comment: "" });
});

router.post('/sign-up', create, (req, res) =>
{
    res.status(201);
    res.redirect("/users/welcome");
});

// router.get("/welcome", allowed, (req, res) =>
// {
//     // Now supports sessions!
//     admin.auth().getUser(res.locals.uid).then((userRecord) =>
//     {
//         // Local Variables
//         const email = userRecord.email;

//         console.log("Render Welcome");
//         res.render("welcome", { email: email });
//     });
// });

router.get("/sign-out", (req, res) =>
{
    // Local Const
    const sessionCookie = req.cookies.session || "";

    res.clearCookie("session");

    admin.auth().verifySessionCookie(sessionCookie, true).then((decodedClaims) =>
    {
        admin.auth().revokeRefreshTokens(decodedClaims.sub)
    })
        .then(() =>
        {
            res.redirect("/users/sign-in");
        })
        .catch((error) =>
        {
            res.redirect("/users/sign-in");
        });
});

function create(req, res, next)
{
    createUserWithEmailAndPassword(firebaseAuth, req.body.email, req.body.password).then(async (userCredential) =>
    {
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        const idToken = await userCredential.user.getIdToken();

        admin.auth().createSessionCookie(idToken, { expiresIn }).then((sessionCookie) =>
        {
            const options = { maxAge: expiresIn, httpOnly: true };
            res.cookie("session", sessionCookie, options);
            next();
        })
            .catch((error) =>
            {
                console.error("ERROR: " + error);
            });
    })
        .catch((error) =>
        {
            const errorCode = error.code;
            const errorMessage = error.message; console.error("Failed to create user: " + req.body.email);
            res.status(409); res.render("sign-up", { comment: error.code });
        });
}

function sign_in(req, res, next)
{
    signInWithEmailAndPassword(firebaseAuth, req.body.email, req.body.password)
        .then(async (userCredential) =>
        {
            const expiresIn = 60 * 60 * 24 * 5 * 1000;
            const idToken = await userCredential.user.getIdToken();
            admin.auth().createSessionCookie(idToken, { expiresIn })
                .then((sessionCookie) =>
                {
                    const options = { maxAge: expiresIn, httpOnly: true };
                    res.cookie("session", sessionCookie, options);
                    next();
                })
                .catch((error) =>
                {
                    console.error("ERROR: " + error);
                });
        })
        .catch((error) =>
        {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Failed to sign in user: " + req.body.email);
            res.status(409);
            res.render("sign-up", { comment: error.code });
        });
}

function allowed(req, res, next)
{
    if (req.cookies.session) {
        admin.auth().verifySessionCookie(req.cookies.session, true /** checkRevoked */)
            .then((decodedClaims) =>
            {
                console.log("Allowed!: " + decodedClaims.uid);
                res.locals.uid = decodedClaims.uid;
                next();
            })
            .catch(function (error)
            {
                console.log(error);
                res.redirect(403, "/users/sign-in");
            });
    } else {
        res.redirect(401, "/users/sign-in");
    }
}
export { allowed };
export default router;