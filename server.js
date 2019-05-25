var express = require("express");
var app = express();

var mongoose = require("mongoose");

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var PORT = process.env.PORT || 3000;

// mongoose.connect('mongodb://localhost/mongoHeadlines', { useNewUrlParser: true });
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, function (error) {
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

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT + ".");
});
