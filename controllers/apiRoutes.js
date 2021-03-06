"use strict";

const express = require("express");
const router = express.Router();

const db = require("../models/index.js");

router.post("/api/note", (req, res) => {
    db.Note.create(req.body)
        .then(dbNote => db.Article.findOneAndUpdate({ _id: req.body.article_id }, { note: dbNote._id }, { new: true }))
        .then((dbArticle) => res.json(dbArticle))
        .catch(error => res.status(500).send({ error: error }));
});

router.put("/api/note/update", (req, res) => {
    db.Note.findOneAndUpdate({_id: req.body.note_id}, { text: req.body.text })
        .then(dbNote => res.send("success"))
        .catch(error => res.status(500).send({ error: error }));
});

router.delete("/api/note/delete", (req, res) => {
    db.Note.findByIdAndRemove(req.body.note_id)
        .then(dbNote => res.send("success"))
        .catch(error => res.status(500).send({ error: error }));
});

router.delete("/api/article/delete", (req, res) => {
    db.Article.findByIdAndRemove(req.body.article_id)
        .then(dbArticle => db.Note.findByIdAndRemove(dbArticle.note))
        .then(dbNote => res.send("success"))
        .catch(error => res.status(500).send({ error: error }));
});

router.delete("/api/articles/delete", (req, res) => {
    db.Article.deleteMany({})
        .then(dbArticle => db.Note.deleteMany({}))
        .then(dbNote => res.send("success"))
        .catch(error => res.status(500).send({ error: error }));
});

module.exports = router;