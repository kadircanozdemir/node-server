const errors = require("restify-errors");
const News = require("../models/News");
const User = require("../models/User");
const { Expo } = require("expo-server-sdk");
const expo = new Expo();

module.exports = server => {
  server.get("/news", async (req, res, next) => {
    try {
      const news = await News.find(req.query);
      console.log(req.query);
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
      await pushNotify(newsNew);
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
      const savedNew = await News.findById(req.params.id);
      res.send(savedNew);
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

const pushNotify = async data => {
  const tokens = await User.find();
  let tokenss = [];
  await tokens.map(tok => tokenss.push(tok.token));
  let messages = [];
  for (let pushToken of tokenss) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }
    messages.push({
      to: pushToken,
      sound: "default",
      title: "Yeni haber yayınlandı",
      body: data.title,
      data: data
    });
  }
  let chunks = expo.chunkPushNotifications(messages);
  (async () => {
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        console.error(error);
      }
    }
  })();
};
