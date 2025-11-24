// models/account-model.js

const pool = require("../database/")

/* ***************************
 *  Check if email already exists
 * ************************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT account_email FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [account_email])
    // rowCount > 0 => email déjà présent
    return result.rowCount
  } catch (error) {
    console.error("checkExistingEmail error:", error.message)
    return null
  }
}

/* ***************************
 *  Register new account
 * ************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql = `
      INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
      )
      VALUES ($1, $2, $3, $4)
      RETURNING account_id
    `
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ])
    return data.rowCount // 1 si succès
  } catch (error) {
    console.error("registerAccount error:", error.message)
    return null
  }
}

module.exports = {
  checkExistingEmail,
  registerAccount,
}
