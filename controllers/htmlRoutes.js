"use strict";

const express = require("express");
const router = express.Router();

const axios = require("axios");
const cheerio = require("cheerio");

const db = require("../models/index.js");

router.get("/", (req, res) => res.render("index"));

router.get("/scrape/baseballamerica", (req, res) => {
    axios.get("https://www.baseballamerica.com/").then(response => {
        const $ = cheerio.load(response.data);
        const results = [];
        $("li.headline").each(function (i, element) {
            const title = $(element).children().text();
            let link = $(element).find("a").attr("href");
            if (!link.startsWith("http")) {
                link = `https://www.baseballamerica.com${link}`;
            }
            const website = "Baseball America";
            results.push({
                title: title,
                link: link,
                website: website
            });
            if (i === 9) {
                return false;
            }
        });
        db.Article.create(results)
            .then(dbArticle => console.log(dbArticle))
            .catch(err => console.log(err));
        res.redirect("/articles");
    });
});

router.get("/scrape/fangraphs", (req, res) => {
    axios.get("https://www.fangraphs.com/").then(response => {
        const $ = cheerio.load(response.data);
        const results = [];
        $("div.intro-headline-title").each((i, element) => {
            const title = $(element).children().text();
            const link = $(element).find("a").attr("href");
            const website = "Fangraphs";
            results.push({
                title: title,
                link: link,
                website: website
            });
            if (i === 9) {
                return false;
            }
        });
        db.Article.create(results)
            .then(dbArticle => console.log(dbArticle))
            .catch(err => console.log(err));
        res.redirect("/articles");
    });
});

router.get("/scrape/mlb", (req, res) => {
    axios.get("https://www.mlb.com/").then(response => {
        const $ = cheerio.load(response.data);
        const results = [];
        $("div.l-grid__content--lg-hidden li.p-headline-stack__headline").each((i, element) => {
            const title = $(element).text();
            const link = $(element).find("a").attr("href");
            const website = "MLB";
            results.push({
                title: title,
                link: link,
                website: website
            });
            if (i === 9) {
                return false;
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