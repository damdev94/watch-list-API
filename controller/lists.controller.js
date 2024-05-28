const listModel = require("../models/list_model")
const bookmarkModel = require("../models/bookmark_model")
const movieModel = require("../models/movie_model")
const mongoose = require("mongoose")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

//multer

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images'))
  },
  filename: (req, file, cb) => {
    const date = new Date().toISOString().replace(/:/g, '-')
    const ext = path.extname(file.originalname)
    const newName = `${date}-${Math.round(Math.random() * 10000)}${ext.toLowerCase()}`
    cb(null, newName)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error("Image format not accepted"), false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})

//functions

exports.index = (req, res) => {
  listModel.find()
    .exec()
    .then(lists => {
      res.json(lists)
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ message: "Error retrieving lists" })
    });
}

exports.show = (req, res) => {
  listModel.findById(req.params.id)
    .exec()
    .then(list => {
      if (!list) {
        return res.status(404).json({ message: "List not found" })
      }

      bookmarkModel.find({ listId: req.params.id })
        .exec()
        .then(bookmarks => {
          const movieIds = bookmarks.map(bookmark => bookmark.movieId)

          movieModel.find({ _id: { $in: movieIds } })
            .exec()
            .then(movies => {
              res.json({ list, bookmarks, movies })
            })
            .catch(err => {
              console.error(err)
              res.status(500).json({ message: "Error retrieving movies" })
            })
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ message: "Error retrieving bookmarks" })
        })
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Error retrieving list" })
    })
}

exports.new = (req, res) => {
}

exports.create = [
  upload.single("image"),
  (req, res) => {
    const newList = new listModel({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      image: req.file.path.substring(70)
    })

    newList.save()
      .then(result => {
        console.log("List created:", result)
        res.status(201).json(result)
      })
      .catch(error => {
        console.error(error)
        res.status(500).json({ message: "Error creating list" })
      })
  }
]

exports.delete = async (req, res) => {
  try {
    const list = await listModel.findById(req.params.id)
    if (!list) {
      return res.status(404).json({ message: "List not found" })
    }

    // Supprimer l'image associée à la liste du dossier public/images
    const imagePath = path.join(__dirname, '../public/images', list.image)
    fs.unlink(imagePath, async (error) => {
      if (error) {
        console.error("Error deleting image:", error);
        return res.status(500).json({ message: "An error occurred while deleting the image." })
      }

      try {
        // Supprimer les bookmarks associés à cette liste
        await bookmarkModel.deleteMany({ listId: list._id })

        // Supprimer la liste elle-même
        await listModel.findByIdAndDelete(req.params.id)

        // Suppression réussie
        res.status(200).json({ message: "List and associated bookmarks deleted successfully!" })
      } catch (error) {
        console.error("Error deleting bookmarks or list:", error)
        res.status(500).json({ message: "An error occurred while deleting the list and bookmarks." })
      }
    });
  } catch (error) {
    console.error("Error deleting list:", error)
    res.status(500).json({ message: "An error occurred while deleting the list." })
  }
};
