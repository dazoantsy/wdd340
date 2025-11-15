// controllers/errorController.js
const errorController = {}

/**
 * Route qui déclenche volontairement une erreur 500
 */
errorController.triggerError = (req, res, next) => {
  // On crée une erreur volontaire
  const err = new Error("Intentional 500 error for testing")
  err.status = 500

  // Deux possibilités : throw ou next(err)
  // L'énoncé propose de "throw", ce qui est très bien :
  throw err

  // Si tu préfères, tu pourrais aussi faire : next(err)
}

module.exports = errorController
