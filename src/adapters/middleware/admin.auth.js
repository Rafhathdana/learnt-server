const AppError = require("../../frameworks/web/utils/app.error.util");
const verifyToken = require("../../frameworks/web/utils/auth.util");
const isAuthAdmin = async (req, res, next) => {
  console.log("\nadmin isAuth Middleware accessed");
  const accessToken = req.cookies["accessTokenAdmin"];
  if (!accessToken) return res.status(400).json({ err: "token is missing" });
  verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET)
    .then((response) => {
      if (response.user.role !== "admin") {
        console.log("role is not a admin");
        return res.status(403).json({ messsage: "Not Authorized" });
      } else {
        req.admin = response.user;
        next();
      }
    })
    .catch((err) => {
      console.error("token error");
      if (err?.name == "TokenExpiredError") console.log("token expired");
      else console.log(err);
      throw AppError.authentication(err?.message)
    });
};
module.exports = isAuthAdmin;
