const express = require("express");
const app = express();
const routes = require("./routes");
const auth = require("./routes/auth");

require("dotenv").config();
const port = 3000;

//https://www.strava.com/oauth/authorize?client_id=31073&response_type=code&redirect_uri=http://strava.com&approval_prompt=force

//TODO these need to get moved out into another file quickly

let config = {
  headers: { accept: "application/json" }
};

let bearer = {
  headers: { authorization: "Bearer " }
};

let authenticated = false;
let token = "";

app.use("/login", auth);
app.use("/", routes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
