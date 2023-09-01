const { createCategorySchema } = require("../../entities/category.validator");
const AppError = require("../../frameworks/web/utils/app.error.util");
const asyncHandler = require("../../frameworks/web/utils/async.handler.util");
const categoryService = require("../../usecases/category.service");

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  return res.status(200).json({ message: "Categories Found ", categories });
});
const createCategory = asyncHandler(async (req, res) => {
  const { value, error } = createCategorySchema.validate(req.body);
  if (error) {
    throw AppError.validation(error.details[0].message);
  }
  const category = await categoryService.createCategory(value);
  return res.status(200).json({ message: "category created successfully" });
});
module.exports = {
  getAllCategories,
  createCategory,
};
