const express = require('express');
const path = require('path');
const ejs = require('ejs');
const app = express();

const pathStaticDir = path.join(__dirname, "/public");

app.use(express.static(pathStaticDir));
app.set("view engine", "ejs");


app.listen(3000 , (req, res) => {
    console.log("server Ranning...");
})

let cnt = 0;

app.get('/', (req, res) => {
    cnt++;
    res.render("index",{
        timesShown: cnt
    });
})