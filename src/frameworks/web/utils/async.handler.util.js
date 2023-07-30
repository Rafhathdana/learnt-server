const AppError = require("./app.error.util");
/**
 *
 * @param {function(req,res,next):Promise<void>} fn - The asynchronous controller function to be wrappped.
 * @returns {function(req,res,next):Promise<viod>} - The middleware function
 */
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    console.log("\nreq passed through async handler");
    await fn(req, res, next);
  } catch (error) {
    if (!(error instanceof AppError)) {
      console.log(error);
    }
    return next(error);
  }
};
module.exports = asyncHandler;
