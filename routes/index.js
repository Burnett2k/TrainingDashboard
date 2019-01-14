const router = require("express").Router();
const mock = false;
const axios = require("axios");
const path = require("path");
const core = require("../core/stats");
const httpHelper = require("../core/httpHelper");

router.get("/", (req, res) => {
  if (global.token) {
    res.sendFile(path.join(__dirname, "../public", "welcome.html"));
  } else {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
  }
});

router.get("/athlete", (req, res) => {
  if (!global.token) {
    res.send("we are not authenticated yet");
    return;
  }

  let athleteUrl = "https://www.strava.com/api/v3/athlete";

  axios
    .get(athleteUrl, httpHelper.createHeader())
    .then(response => {
      res.json(response.data);
    })
    .catch(err => {
      res.status(500);
      res.json({ error: err.message });
    });
});

router.get("/stats", (req, res) => {
  if (!global.token) {
    res.send("we are not authenticated yet");
    return;
  }

  let statsCall = `https://www.strava.com/api/v3/athletes/${
    process.env.ATHLETE_ID
  }/stats`;
  console.log(`calling ${statsCall}`);

  if (mock) {
    res.json(stats);
  } else {
    axios
      .get(statsCall, httpHelper.createHeader())
      .then(response => {
        console.log("received a successful response");
        res.json(response.data);
      })
      .catch(err => {
        res.status(500);
        res.json({ error: err.message });
      });
  }
});

router.get("/activities", (req, res) => {
  if (!global.token) {
    res.send("we are not authenticated yet");
    return;
  }

  let beginningOfYear = new Date(new Date().getFullYear(), 0, 1);
  let prevSunday = new Date();
  prevSunday.setDate(prevSunday.getDate() - ((prevSunday.getDay() + 7) % 7));
  after = prevSunday.getTime() / 1000;

  beginningOfYear = beginningOfYear.getTime() / 1000;

  //todo get sample response for activities
  const activitiesCall = `https://www.strava.com/api/v3/athlete/activities?per_page=30&after=${beginningOfYear}`;

  axios
    .get(activitiesCall, httpHelper.createHeader())
    .then(response => {
      console.log("received a successful response");

      const json = core.createObjectWithDates(
        req.query.interval,
        response.data
      );

      res.json(json);
    })
    .catch(err => {
      res.status(500);
      res.json({ error: err.message });
    });
});

function checkIfAuthenticated() {
  //see if we are authenticated
  if (mock) {
    return true;
  } else if (global.token) {
    return true;
  } else {
    return false;
  }
}

module.exports = router;
