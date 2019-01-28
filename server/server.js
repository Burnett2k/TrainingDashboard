const express = require("express");
const app = express();
const routes = require("../routes/index");
const auth = require("./auth");
const port = process.env.PORT || 3000;

//run dotenv package to pull in important variables from .env file
require("dotenv").config();

//add in routes
app.use("/", routes);

//attempt to authenticate with Strava if environment variables are set
auth.authenticate();

//adding in 404 error as a fallback if no other routes are hit
app.get("*", (req, res) => {
  res.status(404);
  if (req.accepts("json")) {
    res.send({ error: "Not found" });
    return;
  }

  res.type("txt").send("Not found");
});

app.listen(port, () => console.log(`listening on port ${port}!`));
