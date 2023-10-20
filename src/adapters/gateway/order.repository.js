const Order = require("../data/models/orders.model");
const AppError = require("../../frameworks/web/utils/app.error.util");
const createOrder = async ({ userId, courseId, status, price }) => {
  const order = new Order({
    user: userId,
    course: courseId,
    status,
    price,
  });
  return order
    .save()
    .then((response) => response)
    .catch((error) => {
      console.log("Error while creating new order : ", error);
      throw AppError.database();
    });
};
const updateOrderStatusById = async (_id, status) =>
  await Order.findByIdAndUpdate({ _id }, { status });
const findOrdersByUserId = async (userId) =>
  await Order.find({ user: userId })
    .select("-__v -updatedAt")
    .populate("course", "title tagline price");
module.exports = {
  createOrder,
  updateOrderStatusById,
  findOrdersByUserId,
};
