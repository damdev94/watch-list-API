const mongoose = require("mongoose")
const bookmarkModel = require("../models/bookmark_model")
const movieModel = require("../models/movie_model")

exports.new = (req, res) => {

  movieModel.find()
  .exec()
  .then(movies => {
    res.json(movies)
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des films" });
  });
}

exports.create = (req, res) => {
  const newBookmark = new bookmarkModel({
    _id: new mongoose.Types.ObjectId(),
    movieId: req.body.movieId,
    listId: req.body.listId,
    comment: req.body.comment
  })

  newBookmark.save()
    .then(result => {
      console.log(result)
      res.status(201).json({ message: "Bookmark created successfully", bookmark: result })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ message: "An error occurred." })
    })
}

exports.delete = (req, res) => {
  bookmarkModel.deleteOne({_id: req.params.id})
  .exec()
  .then(() => {
    console.log("Bookmark has been deleted succefully !")
    res.status(200).json({ message: "Bookmark deleted successfully!" })
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({ message: "An error occurred." });
  })
}
