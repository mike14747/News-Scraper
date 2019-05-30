"use strict";

var express = require("express");
var router = express.Router();

var db = require("../models/index.js");

router.post("/api/note", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.body.article_id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (error) {
            res.send(error);
        });
});

router.put("/api/note/update", function (req, res) {
    db.Note.findOneAndUpdate({_id: req.body.note_id}, { text: req.body.text })
        .then(function (dbNote) {
            res.send("success");
        })
        .catch(function (error) {
            res.send("error");
        });
});

router.delete("/api/note/delete", function (req, res) {
    db.Note.findByIdAndRemove(req.body.note_id)
        .then(function (dbNote) {
            res.send("success");
        });
});

router.delete("/api/article/delete", function (req, res) {
    db.Article.findByIdAndRemove(req.body.article_id)
        .then(function (dbArticle) {
            return db.Note.findByIdAndRemove(dbArticle.note);
        })
        .then(function(dbNote) {
            res.send("success");
        });
});

module.exports = router;