const express = require("express")
const router = express.Router()
const listsController = require("../controller/lists.controller")
const bookmarksController = require("../controller/bookmarks.controller")

router.post("/lists", listsController.create)
router.get("/lists", listsController.index)
router.get("/lists/:id", listsController.show)
router.get("/lists/:id/bookmarks/new", bookmarksController.new)
router.post("/lists/:id/bookmarks/new", bookmarksController.create)
router.delete("/lists/:id", listsController.delete)
router.delete("/bookmarks/:id", bookmarksController.delete)

router.get("/", (req, res) => {
  res.redirect("/lists")
});

module.exports = router
