const mongoose = require("mongoose")
const Bookmark = require('./bookmark_model.js')

const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie"}]
})

listSchema.pre('remove', async function(next) {
  try {
    await Bookmark.deleteMany({ listId: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('List', listSchema);
