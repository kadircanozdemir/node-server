const errors = require("restify-errors");
const User = require("../models/User");
const config = require("../config");

module.exports = server => {
  server.get("/user", async (req, res, next) => {
    try {
      const users = await User.find(req.query);
      res.send(users);
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });

  // Get Single User
  server.get("/user/:id", async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      res.send(user);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no news with the id of ${req.params.id}`
        )
      );
    }
  });

  // Add User
  server.post("/user", async (req, res, next) => {
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }
    const { token } = req.body;

    const user = new User({
      token
    });
    try {
      const newUser = await user.save();
      res.send(user);
      next();
    } catch (err) {
      return next(new errors.InternalError(err.message));
    }
  });

  /*   // Update User
  server.put("/user", async (req, res, next) => {
    // Check for JSON
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }
    console.log(req.body);
    try {
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };
      const user = await User.findOneAndUpdate({}, req.body, options);
      res.send(200);
      next();
    } catch (err) {
      return next(new errors.InternalError(err.message));
    }
  }); */

  // Delete User
  server.del("/user/:id", async (req, res, next) => {
    try {
      const user = await User.findOneAndRemove({
        _id: req.params.id
      });
      res.send(204);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no news with the id of ${req.params.id}`
        )
      );
    }
  });
};
