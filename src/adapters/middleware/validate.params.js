const IdValidationSchema = require("../../entities/id.validator");
const validateParams = (req, res, next) => {
  const ObjectId = req.params.id;
  const { error } = IdValidationSchema.validate(ObjectId);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
      message: `'${ObjectId}' - Is Invalid Id`,
    });
  }
  next();
};
module.exports = { validateParams };
