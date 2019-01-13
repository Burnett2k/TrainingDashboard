const router = require("express").Router();
const mock = false;
const axios = require("axios");
const path = require("path");

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

  let bearer = {
    headers: { Authorization: `Bearer ${global.token}` }
  };

  axios
    .get(athleteUrl, bearer)
    .then(function(response) {
      res.json(response.data);
    })
    .catch(function(err) {
      res.status(500);
      res.json({ error: err.message });
    });
});

router.get("/stats", (req, res) => {
  if (!global.token) {
    res.send("we are not authenticated yet");
    return;
  }

  let bearer = {
    headers: { authorization: `Bearer ${global.token}` }
  };

  let statsCall = `https://www.strava.com/api/v3/athletes/${
    process.env.ATHLETE_ID
  }/stats`;
  console.log(`calling ${statsCall}`);

  if (mock) {
    res.json(stats);
  } else {
    axios
      .get(statsCall, bearer)
      .then(function(response) {
        console.log("received a successful response");
        res.json(response.data);
      })
      .catch(function(err) {
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
  const activities2Call = `https://www.strava.com/api/v3/athlete/activities?per_page=30&after=${beginningOfYear}`;

  let bearer = {
    headers: { authorization: `Bearer ${global.token}` }
  };

  axios
    .get(activities2Call, bearer)
    .then(function(response) {
      console.log("received a successful response");
      res.json(summarizeDistance(response.data));
    })
    .catch(function(err) {
      res.status(500);
      res.json({ error: err.message });
    });
});

function summarizeDistance(data) {
  let totalDistance = 0;
  let totalElevation = 0;
  const totalRides = data.length;
  for (let i = 0; i < data.length; i++) {
    totalDistance += data[i].distance;
    totalElevation += data[i].total_elevation_gain;
  }
  return {
    totalMiles: totalDistance * 0.000621371192,
    totalRides,
    totalElevation
  };
}

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
