"use strict";

var express = require("express");
var router = express.Router();

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("../models/index.js");

router.get("/", function (req, res) {
    res.render("index");
});

// route to scrape articles from baseball america and add them to the db
router.get("/scrape/baseballamerica", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.baseballamerica.com/").then(function (response) {
        var $ = cheerio.load(response.data);
        var results = [];
        $("li.headline").each(function (i, element) {
            var title = $(element).children().text();
            var link = $(element).find("a").attr("href");
            if (!link.startsWith("http")) {
                link = "https://www.baseballamerica.com" + link
            }
            var website = "Baseball America";
            results.push({
                title: title,
                link: link,
                website: website
            });
        });
        db.Article.create(results)
            .then(function (dbArticle) {
                console.log(dbArticle);
            })
            .catch(function (err) {
                console.log(err);
            });
        res.json(results);
    });
});

router.get("/scrape/fangraphs", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.fangraphs.com/").then(function (response) {
        var $ = cheerio.load(response.data);
        var results = [];
        $("div.intro-headline-title").each(function (i, element) {
            var title = $(element).children().text();
            var link = $(element).find("a").attr("href");
            var website = "Fangraphs";
            results.push({
                title: title,
                link: link,
                website: website
            });
        });
        db.Article.create(results)
            .then(function (dbArticle) {
                console.log(dbArticle);
            })
            .catch(function (err) {
                console.log(err);
            });
        res.json(results);
    });
});

router.get("/scrape/mlb", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.mlb.com/").then(function (response) {
        var $ = cheerio.load(response.data);

        var results = [];
        $("div.l-grid__content--lg-hidden li.p-headline-stack__headline").each(function (i, element) {
            var title = $(element).text();
            var link = $(element).find("a").attr("href");
            var website = "MLB";
            results.push({
                title: title,
                link: link,
                website: website
            });
        });
        db.Article.create(results)
            .then(function (dbArticle) {
                console.log(dbArticle);
            })
            .catch(function (err) {
                console.log(err);
            });
        res.json(results);
    });
});

router.get("/articles", function (req, res) {
    db.Article.find({})
        .populate("note")
        .then(function (dbArticle) {
            res.render("articles", { dbArticle });
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.get("/article/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// catch all for undefined routes that goes to our 404 error page
router.get("*", (req, res) => {
    res.render("error");
});

module.exports = router;