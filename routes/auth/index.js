const auth = require("express").Router();

auth.get("/", (req, res) => {
  res.send("hitting the route!");
});

module.exports = auth;
