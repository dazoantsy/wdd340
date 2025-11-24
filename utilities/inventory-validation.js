const { body, validationResult } = require("express-validator")
const utilities = require(".")

const invValidate = {}

/* Règles pour le nom de classification */
invValidate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name must not contain spaces or special characters.")
  ]
}

/* Vérification des données et renvoi au formulaire s'il y a des erreurs */
invValidate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.status(400).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors.array(),
      classification_name
    })
  }
  next()
}

invValidate.inventoryRules = () => {
  return [
    body("inv_make").trim().isLength({ min: 1 }).withMessage("Please provide a make."),
    body("inv_model").trim().isLength({ min: 1 }).withMessage("Please provide a model."),
    body("inv_year").isInt({ min: 1900, max: 2100 }).withMessage("Provide a valid year."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Price must be a valid number."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be a valid number."),
    body("classification_id")
      .isInt({ min: 1 })
      .withMessage("Select a classification.")
  ]
}

invValidate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)

    return res.status(400).render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      errors: errors.array(),
      classificationList,
      ...req.body
    })
  }
  next()
}


module.exports = invValidate
