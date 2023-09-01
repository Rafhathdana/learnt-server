const categoryRepository = require("../adapters/gateway/category.repository");
const getAllCategories = async () => {
  const categories = await categoryRepository.getAllCategories();
  if (!categories.length) {
    console.log("no category found");
  }
  return categories;
};
const createCategory = async (newCategory) => {
  const category = await categoryRepository.createCategory(newCategory);
  return category;
};
module.exports = {
  createCategory,
  getAllCategories,
};
