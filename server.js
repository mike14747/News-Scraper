const express = require("express");
const app = express();

const mongoose = require("mongoose");

const helpers = require('handlebars-helpers')();

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoBaseballNews";
mongoose.connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }, error => {
    if (error) {
        console.log(error);
    } else {
        console.log("Mongoose has connected to the db!");
    }
});

const apiRoutes = require("./controllers/apiRoutes.js");
app.use(apiRoutes);

const htmlRoutes = require("./controllers/htmlRoutes.js");
app.use(htmlRoutes);

app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}.`);
});
