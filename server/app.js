require("dotenv").config();
const express = require("express");
//const { default: mongoose } = require("mongoose");
const app = express();
const mongoose = require("mongoose");
require("./db/conn");
const cookieparser = require("cookie-parser");

const Products = require('./models/productsSchema'); // Import the Product model

const DefaultData = require("./defaultdata");
const cors = require("cors");
const router = require("./routes/router");


app.use(express.json());
app.use(cookieparser(""));
app.use(cors());
app.use(router);

const port = process.env.PORT || 8005;

if(process.env.NODE_ENV === "production"){
    app.use(express.static("client/build"))
}

app.listen(port,()=>{
    console.log(`server is running on port number ${port}`);
});

DefaultData();