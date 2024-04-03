'use strict'
// Imports
import { MongoClient } from "mongodb";

// Module Constants
const dbName = "SSP";
const dbUName = encodeURIComponent("<your_username>");
const dbPass = encodeURIComponent("<your_password>");
const url = `mongodb+srv://${dbUName}:${dbPass}@<your_link>`;