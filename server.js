const express = require("express");
const app = express();
const routes = require("./routes/index");
const auth = require("./routes/auth");
const axios = require("axios");
const port = process.env.PORT || 3000;

//run dotenv package to pull in important variables from .env file
require("dotenv").config();

//add in routes
app.use("/", routes);
app.use("/login", auth);

authenticate();

function authenticate() {
  let url = `https://www.strava.com/oauth/token?client_id=${
    process.env.CLIENT_ID
  }&client_secret=${process.env.CLIENT_SECRET}&code=${
    process.env.RESPONSE_CODE
  }&grant_type=authorization_code`;

  console.log(`got code, now calling ${url}`);

  axios
    .post(url)
    .then(function(response) {
      authenticated = true;
      console.log("we are authenticated!");
      global.token = response.data.access_token;
    })
    .catch(function(err) {});
}

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
