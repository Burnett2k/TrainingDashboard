const axios = require("axios");

module.exports = {
  authenticate: function() {
    if (
      process.env.CLIENT_ID &&
      process.env.CLIENT_SECRET &&
      process.env.RESPONSE_CODE
    ) {
      const url = `https://www.strava.com/oauth/token?client_id=${
        process.env.CLIENT_ID
      }&client_secret=${process.env.CLIENT_SECRET}&code=${
        process.env.RESPONSE_CODE
      }&grant_type=authorization_code`;

      console.log(`got code, now calling ${url}`);

      axios
        .post(url)
        .then(function(response) {
          console.log(
            `we are authenticated! token = ${response.data.access_token}`
          );

          //Here we are setting a global variable for the token value so that it can be used for Strava Api requests in any file
          global.token = response.data.access_token;
        })
        .catch(function(err) {
          console.log(err);
        });
    } else {
      console.log(
        "We cannot authenticate due to a missing environment variable"
      );
    }
  }
};
