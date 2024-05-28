const mongoose = require("mongoose")

const bookmarkSchema = new mongoose.Schema({
  comment: {type: String, required: true},
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true},
  listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true}
})

module.exports = mongoose.model('Bookmark', bookmarkSchema);
