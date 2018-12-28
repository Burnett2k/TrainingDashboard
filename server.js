const express = require("express");
const axios = require("axios");
const app = express();
require("dotenv").config();
const port = 3000;
const mock = true;

const authorizeUrl = `https://www.strava.com/oauth/authorize?client_id=${
  process.env.CLIENT_ID
}&response_type=code&redirect_uri=http://127.0.0.1:3000&scope=activity:read_all&approval_prompt=force`;

const initialCall = `https://www.strava.com/api/v3/athletes/${
  process.env.ATHLETE_ID
}?access_token=${process.env.TOKEN}`;

const statsCall = `https://www.strava.com/api/v3/athletes/${
  process.env.ATHLETE_ID
}/stats/?access_token=${process.env.TOKEN}`;

//https://www.strava.com/oauth/authorize?client_id=31073&response_type=code&redirect_uri=http://strava.com&approval_prompt=force

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

let config = {
  headers: { accept: "application/json" }
};

let bearer = {
  headers: { authorization: "Bearer " }
};

let authenticated = false;
let token = "";

app.get("/", (req, res) => {
  checkIfAuthenticated();
  console.log("we are in mocking mode!");
  console.log(`calling ${authorizeUrl}`);

  if (authenticated) {
    axios
      .get(initialCall)
      .then(function(response) {
        //console.log(response);
        res.send(response.data);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  }

  if (checkIfAuthenticated) {
    res.send(
      "we are now authenticated! localhost:3000/?code=kafdk234234ksdfk234k234"
    );
  } else if (req.query.code) {
    authenticated = true;
    token = req.query.code;

    res.json({ status: "authenticated!", token });
  } else {
    res.json({ authenticate: authorizeUrl });
  }
});

function checkIfAuthenticated() {
  //see if we are authenticated
  console.log(`authenticated : ${mock}`);
  if (mock) {
    return true;
  } else {
    return false;
  }
}

app.get("/stats", (req, res) => {
  console.log(`calling ${statsCall}`);
  if (mock) {
    res.json(stats);
  } else {
    axios
      .get(statsCall, {}, config)
      .then(function(response) {
        console.log(response);
        res.json(response.data);
      })
      .catch(function(err) {
        console.log(err);
      });
  }
});

app.get("/activities", (req, res) => {
  //todo get sample response for activities
  const activities2Call = `https://www.strava.com/api/v3/athlete/activities?per_page=30?access_token=${token}`;

  axios
    .get(activities2Call, {}, config)
    .then(function(response) {
      console.log(response);
      res.json(response.data);
    })
    .catch(function(err) {
      console.log(err);
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
