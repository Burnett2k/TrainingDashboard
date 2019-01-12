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

function generateWeeksOfYear() {
  //goal: generate a list of sums of miles ridden separated by week.
  //Ex: week 1 (1/1 - 1/6) : 22
  //Ex: week 2 (1/7 - 1/13) : 39
  //2 options, we could loop through and create a list of each week and do a HTTP call
  //for each, or we could get the data for the whole year with a single http call
  // and then loop through all of it to summarize it.
  //the second option would require fewer network requests, so it is probably for the best
  //todo, HTTP call to get data for the entire year, Loop through the data and summarize each entry into what week it fits in.
}

//adding in 404 error as a fallback if no other routes are hit
app.get("*", (req, res) => {
  res.status(404);
  if (req.accepts("json")) {
    res.send({ error: "Not found" });
    return;
  }

  res.type("txt").send("Not found");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
