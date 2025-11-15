// routes/errorRoute.js
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const errorController = require("../controllers/errorController")

// Route that will intentionally trigger a 500-type error
router.get(
  "/trigger-error",
  utilities.handleErrors(errorController.triggerError)
)

module.exports = router
