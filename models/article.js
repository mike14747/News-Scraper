"use strict";

const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    note: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note"
    }
});
const Article = mongoose.model('Article', schema);

module.exports = Article;