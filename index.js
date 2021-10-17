const express = require('express')
const app = express();
const PORT = 3000;



function handlehome(req, res){
    res.send("hello");
}

app.get("/", handlehome);

