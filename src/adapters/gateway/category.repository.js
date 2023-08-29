const AppError = require("../../frameworks/web/utils/app.error.util");
const Category = require("../data/models/category.model");
const getAllCategories = async () => {
  const categories = await Category.find({}, "-__v").catch((err) => {
    console.log(err);
    throw AppError.database(err.message);
  });
  console.log("total categories found - ", categories.length);
  return categories;
};
const createCategory = async (newCategory) => {
  const category = new Category(newCategory);
  const response = await category.save().catch((err) => {
    console.log(err);
    throw AppError.database(err.message);
  });
  console.log("category created successfully - ", response.title);
  return response;
};
const getAllCategoriesTitle = async () => {
  const categories = await getAllCategories();
  const categoriesTitle = categories.map((category) => {
    return category.title;
  });
  return categoriesTitle;
};
module.exports = {
  createCategory,
  getAllCategories,
  getAllCategoriesTitle,
};
