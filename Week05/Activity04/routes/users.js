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