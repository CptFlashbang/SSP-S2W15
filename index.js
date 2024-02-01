"use strict";
import * as http from "http";
const port = 8080;
http.createServer((req, res) => 
{ 
    res.end("Hello World"); 
}).listen(port);