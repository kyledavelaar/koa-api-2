const mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema(
  {
    title: { type: String },
    length: { type: Number },
  },
  { timestamps: true }
);

const Movie = mongoose.model('Movie', MovieSchema)

module.exports = Movie;
