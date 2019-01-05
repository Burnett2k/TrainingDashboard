const express = require("express");
const app = express();
const routes = require("./routes/index");
const auth = require("./routes/auth");
const port = process.env.PORT || 3000;

//run dotenv package to pull in important variables from .env file
require("dotenv").config();
app.use("/", routes);
app.use("/login", auth);

//adding in 404 error as a fallback if no other routes are hit
app.get("*", function(req, res) {
  res.status(404);
  if (req.accepts("json")) {
    res.send({ error: "Not found" });
    return;
  }

  res.type("txt").send("Not found");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
