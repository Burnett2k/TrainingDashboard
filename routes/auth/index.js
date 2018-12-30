const auth = require("express").Router();

auth.get("/login", (req, res) => {
  res.send("hitting the route!");
});

module.exports = auth;

//todo move authentication code to this section
// export default function checkIfAuthenticated() {
//   console.log("testing");
// }
