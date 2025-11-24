// controllers/accountController.js

const bcrypt = require("bcryptjs")
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")

/* ***************************
 *  Deliver login view
 * **************************/
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    success: req.flash("success") || null,
    error: req.flash("error") || null,
    errors: null,
    account_email: null,
  })
}

/* ***************************
 *  Deliver registration view
 * **************************/
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    success: req.flash("success") || null,
    error: req.flash("error") || null,
    errors: null,
    account_firstname: null,
    account_lastname: null,
    account_email: null,
  })
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } =
    req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    )
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      success: null,
      error: req.flash("notice"),
    })
  }

  // Enregistrer dans la base
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      success: req.flash("notice"),
      error: null,
      account_email: account_email,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    return res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      success: null,
      error: req.flash("notice"),
    })
  }
}

/* ****************************************
 *  Temporary Login Process (activity step)
 * *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  // Pour cette activité, ils demandent juste d’afficher un texte.
  res.send("login process")
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
}
