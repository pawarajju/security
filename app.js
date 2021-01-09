//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

let userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET

mongoose.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

let User = mongoose.model("User", userSchema);


app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});
app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    let newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", function(req, res) {
    const username = req.body.username
    const password = req.body.password

    User.findOne({ email: username }, function(err, foundResult) {
        if (err) {
            console.log(err);
        } else {
            if (foundResult) {
                if (foundResult.password === password) {
                    res.render("secrets");
                } else {
                    res.send("please check username or password");
                }
            } else {
                res.send("please check username or password");
            }
        }
    });

});


app.listen(3000, function(err) {
    if (!err) {
        console.log("server started succesfully");
    }
});