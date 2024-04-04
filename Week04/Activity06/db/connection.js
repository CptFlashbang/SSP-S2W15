'use strict'
// Imports
import { MongoClient } from "mongodb";

// Module Constants
const dbName = "SSP";
const dbUName = encodeURIComponent("CallumYates");
const dbPass = encodeURIComponent("C@bbage9829");
const url = `mongodb+srv://${dbUName}:${dbPass}@ssp.slyivjn.mongodb.net/?retryWrites=true&w=majority&appName=SSP`;

// Module Objects
const dbClient = new MongoClient(url);
// Module Variables
let conn;
let db;

try
{
conn = await dbClient.connect();
}
catch(err)
{
console.error(err);
}
db = conn.db(dbName);

export default db;