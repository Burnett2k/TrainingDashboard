const router = require("express").Router();
const mock = false;
const axios = require("axios");
let token = "";
//todo create a consts file?
const authorizeUrl = `https://www.strava.com/oauth/authorize?client_id=${
  process.env.CLIENT_ID
}&response_type=code&redirect_uri=http://127.0.0.1:3000&scope=read_all,activity:read_all&approval_prompt=auto`;

const initialCall = `https://www.strava.com/api/v3/athletes/${
  process.env.ATHLETE_ID
}`;

let config = {
  headers: { accept: "application/json" }
};

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
  let authorizeUrl = `https://www.strava.com/oauth/authorize?client_id=${
    process.env.CLIENT_ID
  }&response_type=code&redirect_uri=http://127.0.0.1:3000&scope=activity:read_all&approval_prompt=force`;
  console.log(`calling ${authorizeUrl}`);
  console.log(`token ${token}`);

  // if (checkIfAuthenticated()) {
  //   axios
  //     .get(initialCall)
  //     .then(function(response) {
  //       //console.log(response);
  //       res.json(response.data);
  //     })
  //     .catch(function(err) {
  //       res.json(err);
  //     });
  // }

  if (checkIfAuthenticated()) {
    res.send(
      "we are now authenticated! localhost:3000/?code=kafdk234234ksdfk234k234"
    );
  } else if (req.query.code) {
    let authCode = req.query.code;

    let url = `https://www.strava.com/oauth/token?client_id=${
      process.env.CLIENT_ID
    }&client_secret=${
      process.env.CLIENT_SECRET
    }&code=${authCode}&grant_type=authorization_code`;

    console.log(`got code, now calling ${url}`);

    axios
      .post(url)
      .then(function(response) {
        authenticated = true;
        console.log("we are authenticated!");
        token = response.data.access_token;
      })
      .catch(function(err) {
        res.send(err);
      });

    res.json({ status: "code from redirect!", authCode });
  } else {
    res.json({ authenticate: authorizeUrl });
  }
});

router.get("/athlete", (req, res) => {
  let athleteUrl = "https://www.strava.com/api/v3/athlete";

  let bearer = {
    headers: { Authorization: `Bearer ${token}` }
  };

  axios
    .get(athleteUrl, bearer)
    .then(function(response) {
      res.json(response.data);
    })
    .catch(function(err) {
      //console.log(err);
      res.json(err.message);
    });
});

router.get("/stats", (req, res) => {
  if (!token) {
    res.send("we are not authenticated yet");
  }

  let bearer = {
    headers: { authorization: "Bearer ${token}" }
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
        res.send(err);
      });
  }
});

router.get("/activities", (req, res) => {
  //todo get sample response for activities
  const activities2Call = `https://www.strava.com/api/v3/athlete/activities?per_page=30?access_token=${token}`;

  axios
    .get(activities2Call, config)
    .then(function(response) {
      console.log(response);
      res.json(response.data);
    })
    .catch(function(err) {
      console.log(err);
    });
});

function checkIfAuthenticated() {
  //see if we are authenticated
  if (mock) {
    return true;
  } else if (token) {
    return true;
  } else {
    return false;
  }
}

module.exports = router;
