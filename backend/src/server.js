const dotenv = require("dotenv");
dotenv.config();

const debug = require("debug")("app:startup");
const app = require("./app");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  debug(`Listening on port ${PORT}`);
});
