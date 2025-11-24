const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  const data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ****************************************
 * Middleware For Handling Errors
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

/* **************************************
 * Build the classification grid HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach((vehicle) => {
      grid += "<li>"
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += "<hr />"
      grid += "<h2>"
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>"
      grid += "</h2>"
      grid += "<span>$"
      grid += new Intl.NumberFormat("en-US").format(vehicle.inv_price)
      grid += "</span>"
      grid += "</div>"
      grid += "</li>"
    })
    grid += "</ul>"
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
 * Build the vehicle detail view HTML
 * ************************************ */
Util.buildInvDetail = function (vehicle) {
  let detail = '<section id="inv-detail">'
  detail += '<div class="inv-detail-img">'
  detail +=
    '<img src="' +
    vehicle.inv_image +
    '" alt="Image of ' +
    vehicle.inv_make +
    " " +
    vehicle.inv_model +
    ' on CSE Motors" />'
  detail += "</div>"
  detail += '<div class="inv-detail-info">'
  detail +=
    '<h2 class="inv-detail-title">' +
    vehicle.inv_year +
    " " +
    vehicle.inv_make +
    " " +
    vehicle.inv_model +
    "</h2>"
  detail +=
    '<p class="inv-detail-price">Price: $' +
    new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
    "</p>"
  detail +=
    '<p class="inv-detail-miles">Mileage: ' +
    new Intl.NumberFormat("en-US").format(vehicle.inv_miles) +
    " miles</p>"
  detail +=
    '<p class="inv-detail-color">Color: ' + vehicle.inv_color + "</p>"
  detail += '<p class="inv-detail-desc">' + vehicle.inv_description + "</p>"
  detail += "</div>"
  detail += "</section>"
  return detail
}

// alias
Util.buildDetailView = Util.buildInvDetail

/* **************************************
 * Build only the <option> list
 * ************************************ */
Util.buildClassificationList = async function (selectedId = null) {
  const data = await invModel.getClassifications()
  let options = '<option value="">Select a classification</option>'

  data.rows.forEach((row) => {
    options += `<option value="${row.classification_id}"`
    if (selectedId == row.classification_id) {
      options += " selected"
    }
    options += `>${row.classification_name}</option>`
  })

  return options
}

module.exports = Util
