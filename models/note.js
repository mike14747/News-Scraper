"use strict";

const mongoose = require("mongoose");

const schema = new mongoose.Schema({ text: String });
const Note = mongoose.model('Note', schema);

module.exports = Note;