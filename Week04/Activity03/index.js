import * as path from "path";
import {fileURLToPath} from "url";
import tokenRouter from "./routes/tokens.js";

// Use File Location of Index and Get Dir -------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Preroute MIDDLEWARE -------------------------------------------------------
app.use(express.static(path.join(__dirname,"public")));
app.use("/favicon.ico", express.static("public/assets/ico/SSP.ico"));

// ROUTER -------------------------------------------------------
app.use("/tokens", tokenRouter);