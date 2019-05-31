var express = require("express");
var app = express();

var mongoose = require("mongoose");

var helpers = require('handlebars-helpers')();

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var PORT = process.env.PORT || 3000;

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoBaseballNews";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false }, error => {
    if (error) {
        console.log(error);
    } else {
        console.log("Mongoose has connected to the db!");
    }
});

var apiRoutes = require("./controllers/apiRoutes.js");
app.use(apiRoutes);

var htmlRoutes = require("./controllers/htmlRoutes.js");
app.use(htmlRoutes);

app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT + ".");
});
