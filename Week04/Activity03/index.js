'use strict'
// Imports
import express from "express";
import * as path from "path";
import { fileURLToPath } from "url";
import userRouter from "./routes/users.js";

// Application Objects
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);