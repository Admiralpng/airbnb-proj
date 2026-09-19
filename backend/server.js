const express = require("express");
const appRoutes = require("../src/App");
const mongoose = require("mongoose");

const app = express();

app.get("/", (req, res) => {

});

PORT=3000;

MONG_URI="mongodb+srv://anch8vy0_db_user:wemjaCvdRZsBxMgT@zaiocustomairbnb.ammcsi5.mongodb.net/?appName=zaiocustomairbnb"

mongoose.connect(process.MONGO_URI)
.then(() => {
    app.listen(process.PORT, () => {
        console.log("yayyuhh", process.PORT)
    })
})
.catch((error) => {
    console.log(error)
})