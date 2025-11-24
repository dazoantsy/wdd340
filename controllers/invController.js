const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

// Objet contrôleur
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()
    const className = data[0].classification_name

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildDetailView = async function (req, res, next) {
  try {
    const inv_id = req.params.invId
    const vehicle = await invModel.getInventoryByInvId(inv_id)

    if (!vehicle) {
      return next({ status: 404, message: "Vehicle not found." })
    }

    const detail = await utilities.buildDetailView(vehicle)
    const nav = await utilities.getNav()
    const title = vehicle.inv_make + " " + vehicle.inv_model

    res.render("./inventory/detail", {
      title,
      nav,
      detail,
    })
  } catch (error) {
    next(error)
  }
}

/* =========================
 * Inventory Management View
 * ========================= */
invCont.buildManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()

    // Le middleware qui gère les flash a déjà mis le message dans res.locals.notice
    const notice = res.locals.notice || []

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      notice,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Show add-classification form
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name: "",
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Handle add-classification POST
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body

  try {
    const result = await invModel.addClassification(classification_name)

    if (result) {
  const nav = await utilities.getNav()
  return res.status(201).render("./inventory/management", {
    title: "Inventory Management",
    nav,
    notice: ["The classification was successfully added."],
    errors: null,
  })
} else {
      const nav = await utilities.getNav()
      req.flash("notice", "Sorry, the classification could not be added.")
      return res.status(500).render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
        classification_name,
      })
    }
  } catch (error) {
    console.error("addClassification error", error)
    const nav = await utilities.getNav()
    req.flash(
      "notice",
      "Sorry, an error occurred while adding the classification."
    )
    return res.status(500).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name,
    })
  }
}

/* ***************************
 *  Show Add Inventory Form
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()

    res.render("./inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      errors: null,
      classificationList,
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_price: "",
      inv_miles: "",
      inv_description: "",
      classification_id: ""
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Process New Inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  const data = req.body

  try {
    const result = await invModel.addInventory(data)

    if (result && result.inv_id) {
      req.flash("notice", "The new inventory item was successfully added.")
      return res.redirect("/inv/")
    }

    // Si on arrive ici, l'insertion n'a pas renvoyé d'id
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(
      data.classification_id
    )

    req.flash("notice", "Sorry, the inventory item could not be added.")
    return res.status(500).render("./inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      errors: null,
      classificationList,
      ...data,
    })
  } catch (error) {
    console.error(error)
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(
      data.classification_id
    )
    req.flash("notice", "Sorry, an error occurred while adding the inventory.")
    return res.status(500).render("./inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      errors: null,
      classificationList,
      ...data,
    })
  }
}


/* Export du contrôleur complet */
module.exports = invCont
