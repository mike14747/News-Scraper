"use strict";

var mongoose = require("mongoose");

var schema = new mongoose.Schema({ text: String });
var Note = mongoose.model('Note', schema);

module.exports = Note;