const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  )
}

module.exports = { getClassifications }

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get inventory item detail by inv_id
 * ************************** */
async function getInventoryByInvId(inv_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1",
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryByInvId error " + error)
  }
}



async function addClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO public.classification (classification_name)
      VALUES ($1)
      RETURNING classification_id, classification_name;
    `
    const data = await pool.query(sql, [classification_name])
    return data.rows[0]
  } catch (error) {
    console.error("addClassification query error", error)
    return null
  }
}

async function addInventory(data) {
  try {
    const sql = `
      INSERT INTO public.inventory
      (inv_make, inv_model, inv_year, inv_description,
       inv_image, inv_thumbnail,
       inv_price, inv_miles, inv_color, classification_id)
      VALUES
      ($1, $2, $3, $4,
       '/images/no-image.png', '/images/no-image.png',
       $5, $6, $7, $8)
      RETURNING inv_id;
    `

    const values = [
      data.inv_make,
      data.inv_model,
      data.inv_year,
      data.inv_description,
      data.inv_price,
      data.inv_miles,
      // comme le formulaire n’a pas de champ couleur,
      // on envoie une valeur par défaut
      data.inv_color || "Unspecified",
      data.classification_id
    ]

    const result = await pool.query(sql, values)
    return result.rows[0]
  } catch (error) {
    console.error("addInventory error", error)
    // on laisse remonter l’erreur pour que le middleware handleErrors la gère
    throw error
  }
}



module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInvId,
  addClassification,
  addInventory
}
