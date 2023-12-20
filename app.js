const express = require("express");
const app = express();

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.send("hello world");
});

app.listen(3000, () => {
    console.log("3000 port");
    //express 실행: node app.js
});