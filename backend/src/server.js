const config = require("config");
const debug = require("debug")("app:startup");
const app = require("./app");

const port = config.get("server.port");
app.listen(port, () => {
  debug(`Listening on port ${port}`);
});
