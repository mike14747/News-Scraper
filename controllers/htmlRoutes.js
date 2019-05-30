"use strict";

var express = require("express");
var router = express.Router();

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("../models/index.js");

router.get("/", (req, res) => res.render("index"));

router.get("/scrape/baseballamerica", (req, res) => {
    let counter = 0;
    axios.get("https://www.baseballamerica.com/").then(response => {
        var $ = cheerio.load(response.data);
        var results = [];
        $("li.headline").each(function (i, element) {
            var title = $(element).children().text();
            var link = $(element).find("a").attr("href");
            if (!link.startsWith("http")) {
                link = "https://www.baseballamerica.com" + link
            }
            var website = "Baseball America";
            counter++;
            if (counter < 10) {
                results.push({
                    title: title,
                    link: link,
                    website: website
                });
            }
        });
        db.Article.create(results)
            .then(dbArticle => console.log(dbArticle))
            .catch(err => console.log(err));
        res.redirect("/articles");
    });
});

router.get("/scrape/fangraphs", (req, res) => {
    let counter = 0;
    axios.get("https://www.fangraphs.com/").then(response => {
        var $ = cheerio.load(response.data);
        var results = [];
        $("div.intro-headline-title").each((i, element) => {
            var title = $(element).children().text();
            var link = $(element).find("a").attr("href");
            var website = "Fangraphs";
            counter++;
            if (counter < 10) {
                results.push({
                    title: title,
                    link: link,
                    website: website
                });
            }
        });
        db.Article.create(results)
            .then(dbArticle => console.log(dbArticle))
            .catch(err => console.log(err));
        res.redirect("/articles");
    });
});

router.get("/scrape/mlb", (req, res) => {
    let counter = 0;
    axios.get("https://www.mlb.com/").then(response => {
        var $ = cheerio.load(response.data);
        var results = [];
        $("div.l-grid__content--lg-hidden li.p-headline-stack__headline").each((i, element) => {
            var title = $(element).text();
            var link = $(element).find("a").attr("href");
            var website = "MLB";
            counter++;
            if (counter < 10) {
                results.push({
                    title: title,
                    link: link,
                    website: website
                });
            }
        });
        db.Article.create(results)
            .then(dbArticle => console.log(dbArticle))
            .catch(err => console.log(err));
        res.redirect("/articles");
    });
});

router.get("/articles", (req, res) => {
    db.Article.find({}).sort({ "date": -1 })
        .populate("note")
        .then(dbArticle => res.render("articles", { dbArticle }))
        .catch(err => res.json(err));
});

// this route populates the add note modal with the details about the article
router.get("/article/:id", (req, res) => {
    db.Article.findOne({ _id: req.params.id })
        .then(dbArticle => res.json(dbArticle))
        .catch(err => res.json(err));
});

// catch all for undefined routes that goes to the 404 error page
router.get("*", (req, res) => res.render("error"));

module.exports = router;