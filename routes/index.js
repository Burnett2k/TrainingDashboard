const router = require("express").Router();
const mock = false;
const axios = require("axios");

const stats = {
  biggest_ride_distance: 42823.1,
  biggest_climb_elevation_gain: 255.80000000000007,
  recent_ride_totals: {
    count: 14,
    distance: 111125.00109863281,
    moving_time: 1205169,
    elapsed_time: 1212506,
    elevation_gain: 204.2032346725464,
    achievement_count: 29
  },
  ytd_ride_totals: {
    count: 120,
    distance: 550663,
    moving_time: 1288887,
    elapsed_time: 1313353,
    elevation_gain: 562
  },
  all_ride_totals: {
    count: 141,
    distance: 858384,
    moving_time: 1381551,
    elapsed_time: 1422873,
    elevation_gain: 4931
  }
};

//actual id in .env file
const athlete = {
  id: 7777777,
  username: null,
  resource_state: 2,
  firstname: "James",
  lastname: "Brown",
  city: "Phoenix",
  state: "Arizona",
  country: "United States",
  sex: "M",
  premium: false,
  summit: false,
  created_at: "2015-01-31T16:10:55Z",
  updated_at: "2018-12-20T01:29:13Z",
  badge_type_id: 0,
  profile_medium:
    "https://dgalywyr863hv.cloudfront.net/pictures/athletes/7777777/3348140/1/medium.jpg",
  profile:
    "https://dgalywyr863hv.cloudfront.net/pictures/athletes/7777777/3348140/1/large.jpg",
  friend: null,
  follower: null,
  email: "sawyerburnett@gmail.com"
};

router.get("/", (req, res) => {
  if (global.token) {
    res.json({ status: "we are authenticated!" });
  } else {
    res.sendFile("public/index.html");
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
        console.log(response);
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

  //todo get sample response for activities
  const activities2Call = `https://www.strava.com/api/v3/athlete/activities?per_page=30`;

  let bearer = {
    headers: { authorization: `Bearer ${global.token}` }
  };

  axios
    .get(activities2Call, bearer)
    .then(function(response) {
      console.log(response);
      res.json(response.data);
    })
    .catch(function(err) {
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
