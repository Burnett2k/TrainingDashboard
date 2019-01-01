const express = require("express");
const app = express();
const routes = require("./routes/index");
const auth = require("./routes/auth");
const port = process.env.PORT || 3000;

//run dotenv package to pull in important variables from .env file
require("dotenv").config();

//https://www.strava.com/oauth/authorize?client_id=31073&response_type=code&redirect_uri=http://strava.com&approval_prompt=force

app.use("/", routes);
app.use("/login", auth);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
