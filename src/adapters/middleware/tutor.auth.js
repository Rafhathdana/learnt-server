const AppError = require("../../frameworks/web/utils/app.error.util");
const verifyToken = require("../../frameworks/web/utils/auth.util");
const isAuthTutor = async (req, res, next) => {
  console.log("\ntutor isAuth Middleware accessed");
  const accessToken = req.cookies["accessTokenTutor"];
  const refreshToken = req.cookies["refreshTokenTutor"];
  if (!accessToken && !refreshToken)
    return res.status(400).json({ err: "token is missing" });
  verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET)
    .then((response) => {
      if (response.user.role !== "tutor") {
        console.log("role is not a tutor");
        return res.status(403).json({ messsage: "Not Authorized" });
      } else {
        req.tutor = response.user;
        next();
      }
    })
    .catch((err) => {
      console.error("token error");
      if (err?.name == "TokenExpiredError") console.log("token expired");
      else console.log(err);
      return res.status(403).json({ messsage: "Not Authorized" });
      throw AppError.authentication(err?.message);
    });
};
module.exports = isAuthTutor;
