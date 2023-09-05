router = require("express").Router();
const orderController = require("../../controller/order.controller");
const isAuth = require("../../middleware/user.auth");
router.use(isAuth);
router.route("/").get(orderController.getAllOrders);
router.route("/create").post(orderController.createOrder);
router.route("/payment/verify").post(orderController.verifyPayment);
module.exports = router;
