const Movie = require('../models/movie');


const getMovies = async (ctx) => {
  const movies = await Movie.find({})
  ctx.body = movies;
}

async function createMovie(ctx) {
  const body = ctx.request.body;
  const newMovie = await Movie.create(body);
  ctx.body = newMovie;
}

const updateMovie = async (ctx) => {
  const id = ctx.params.id;
  const body = ctx.request.body;
  const updatedMovie = await Movie.findByIdAndUpdate(id, {$set: body}, {new: true})
  ctx.body = updatedMovie;
}

const deleteMovie = async (ctx) => {
  const id = ctx.params.id;
  const deletedMovie = await Movie.findByIdAndDelete(id);
  ctx.body = deletedMovie;
}

module.exports = {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie
}