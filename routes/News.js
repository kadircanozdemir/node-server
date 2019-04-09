const errors = require("restify-errors");
const News = require("../models/News");
const config = require("../config");

module.exports = server => {
  server.get("/news", async (req, res, next) => {
    try {
      const news = await News.find({});
      console.log(req.params);
      res.send(news);
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });

  // Get Single News
  server.get("/news/:id", async (req, res, next) => {
    try {
      const sNew = await News.findById(req.params.id);
      res.send(sNew);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no news with the id of ${req.params.id}`
        )
      );
    }
  });

  // Add Customer
  server.post("/news", async (req, res, next) => {
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }

    const {
      image,
      title,
      content,
      category,
      authors,
      link,
      release,
      likes,
      dislikes,
      views
    } = req.body;

    const sNew = new News({
      image,
      title,
      content,
      category,
      authors,
      link,
      release,
      likes,
      dislikes,
      views
    });

    try {
      const newsNew = await sNew.save();
      res.send(201);
      next();
    } catch (err) {
      return next(new errors.InternalError(err.message));
    }
  });

  // Update Customer
  server.put("/news/:id", async (req, res, next) => {
    // Check for JSON
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }

    try {
      const sNew = await News.findOneAndUpdate(
        { _id: req.params.id },
        req.body
      );
      res.send(200);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no news with the id of ${req.params.id}`
        )
      );
    }
  });

  // Delete Customer
  server.del("/news/:id", async (req, res, next) => {
    try {
      const sNew = await News.findOneAndRemove({
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
