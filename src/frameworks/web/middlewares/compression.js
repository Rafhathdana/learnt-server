const compression = require("compression");
//Apply Compression only for text-based responses
function customComression(req, res, next) {
  const shouldCompress = (req, res) => {
    //don't need to compress if below request header is presnet
    if (req.headers["x-no-compression"]) {
      return false;
    }
    //fallback to standard compression
    return compression.filter(req, res);
  };
  compression({
    filter: shouldCompress,
    threshold: "1kb",
  })(req, res, next);
}
module.exports = customComression;
