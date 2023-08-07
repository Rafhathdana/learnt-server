const verifyToken = require("../../frameworks/web/utils/auth.util");
const isAuth = async (req, res, next) => {
  const accessToken = req.cookies["accessToken"];
  if (!accessToken)
    return res
      .status(401)
      .json({ err: "token is missing", name: "TokenMissingError" });
  verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET)
    .then((response) => {
      if (response.user.role !== "user") {
        return res.status(403).json({ message: "Not Authorized" });
      }
      console.log("token verified", response.user.name);
      req.user = response.user;
      next();
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json({ err });
    });
};
module.exports = isAuth;
