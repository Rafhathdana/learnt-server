const orderRepository = require("../adapters/gateway/order.repository");
const courseRepository = require("../adapters/gateway/course.repository");
const transactionService = require("./transaction.service");
const AppError = require("../frameworks/web/utils/app.error.util");
const createOrder = async ({ courseId, userId, user }) => {
  const { price, title: courseTitle } = await courseRepository.findCourseById(
    courseId
  );

  if (!price) {
    console.log("price was not foundfor the course : " + courseId);
    throw AppError.database();
  }
  const { _id: orderId } = await orderRepository.createOrder({
    userId: userId,
    courseId: courseId,
    status: "pending",
    price: price,
  });
  const orderDetails = await transactionService.generateRazorPayOrder({
    price,
    userId,
    user,
    courseTitle,
    courseId,
    orderId: orderId.toString(),
  });
  return { ...orderDetails, orderId };
};
const updateOrderStatus = async (orderId) => {
  const status = "completed";
  const isUpdated = await orderRepository.updateOrderStatusById(
    orderId,
    status
  );
  return isUpdated;
};
const getAllOrders = async (userId) => {
  const orders = await orderRepository.findOrdersByUserId(userId);
  if (!orders.length) {
    console.log("no transaction found for the user :", userId);
  }
  console.log("total orders by users:", userId);
  return orders;
};
module.exports = {
  createOrder,
  updateOrderStatus,
  getAllOrders,
};
