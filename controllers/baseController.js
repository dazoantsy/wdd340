const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

/* ***************************
 *  Intentional error generator for testing middleware
 * ************************** */
baseController.triggerError = async function (req, res, next) {
  throw new Error("Intentional server error for testing purposes.")
}

module.exports = baseController
