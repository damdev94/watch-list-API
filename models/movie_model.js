const mongoose = require("mongoose")

const movieSchema = new mongoose.Schema ({
  title: { type:String, required: true },
  overview: { type:String, required: true },
  poster_url: { type:String, required: true },
  rating: { type:Number, required: true }
})

module.exports = mongoose.model('Movie', movieSchema)
