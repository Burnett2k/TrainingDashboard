module.exports = {
  generateWeeksOfYear: function(data) {
    //goal: generate a list of sums of miles ridden separated by week.
    //Ex: week 1 (1/1 - 1/6) : 22
    //Ex: week 2 (1/7 - 1/13) : 39
    //2 options, we could loop through and create a list of each week and do a HTTP call
    //for each, or we could get the data for the whole year with a single http call
    // and then loop through all of it to summarize it.
    //the second option would require fewer network requests, so it is probably for the best
    //todo, HTTP call to get data for the entire year, Loop through the data and summarize each entry into what week it fits in.
  },

  generateWeeklyData: function() {
    console.log("generateWeeklyData");
  },

  generateDailyData: function() {},

  createObjectWithDates: function(type, payload) {
    let response = {};
    switch (type) {
      case "daily":
        break;
      case "weekly":
        response = weeklyDataMock(payload);
        break;
      case "monthly":
        break;
      case "yearly":
      default:
        response = summarizeDistance(payload);
        console.log("no querystring parameter added! defaulting to blah");
        break;
    }
    return response;
  }
};

//weeks go from Sunday to Saturday typically
function weeklyDataMock() {
  return {
    startDate: "1/1/2019",
    endDate: "1/6/2019",
    totalMiles: 82,
    totalRides: 3,
    totalElevation: 2012
  };
}

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
