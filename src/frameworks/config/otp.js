const OTP = async (mobile, otp) => {
  return new Promise((resolve, reject) => {
    var unirest = require("unirest");
    var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
    req.headers({
      authorization: process.env.AUTH,
      "Content-Type": "application/json",
    });
    req.form({
      variables_values: otp,
      route: "otp",
      numbers: mobile,
    });

    req.end(function (res) {
      if (res.error) {
        console.log("error");
        reject(res.error);
      } else {
        resolve(res.body);
      }
    });
  });
};
module.exports = OTP;
