const errors = require("restify-errors");

module.exports = server => {
  server.get("/customers", (req, res, next) => {
    res.send({ msg: "test" });
    next();
  });
};
