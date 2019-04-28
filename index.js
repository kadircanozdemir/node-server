const restify = require("restify");
const mongoose = require("mongoose");
const config = require("./config");
const corsMiddleware = require("restify-cors-middleware");

const server = restify.createServer();

const cors = corsMiddleware({
  origins: ["http://localhost:8000"]
});
server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.jsonBodyParser({ mapParams: true }));
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser({ mapParams: true }));
server.use(restify.plugins.fullResponse());

server.listen(config.PORT, () => {
  mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true });
});

const db = mongoose.connection;

db.on("error", err => {
  console.log(err);
});

db.once("open", () => {
  require("./routes/News")(server);
  require("./routes/User")(server);
  console.log(`Server started on port ${config.PORT}`);
});
