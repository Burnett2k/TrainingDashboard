module.exports = {
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
        response = generateWeeklyData(payload);
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

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

//weeks go from Sunday to Saturday typically
function generateWeeklyData(payload) {
  //get date for first day of the year (where we begin looping from)
  let firstDay = new Date("2019-01-01 (MST)"); //.setUTCHours(23, 59, 59, 999);

  //create a variable to store the beginning of the week
  let startOfWeek = new Date("2019-01-01 (MST)"); //.setUTCHours(0, 0, 0, 0);

  //create a variable to store the current date so we know when to stop looping
  const today = new Date();

  //weeks array will store our js objects with start & end date as well as metrics associated with that date
  let weeks = [];

  //week start with Sunday and then end on Saturday
  //loop starting at the beginning of the year
  //first week will be from 1st of the year until the next Saturday
  let weekEstablished = false;
  while (firstDay <= today) {
    if (weekEstablished) {
      console.log("week established");
      firstDay = addDays(firstDay, 6);
      weeks.push({ startDate: startOfWeek, endDate: firstDay });
      firstDay = addDays(firstDay, 1);
      startOfWeek = firstDay;
    } else {
      //if we are on a saturday, then add that week to the weeks array and set the start date for the next week
      if (firstDay.getDay() === 6) {
        weekEstablished = true;
        weeks.push({ startDate: startOfWeek, endDate: firstDay });
        firstDay = addDays(firstDay, 1);
        startOfWeek = firstDay;
      } else {
        //it isn't saturday, so increment by a day
        firstDay = addDays(firstDay, 1);
      }
    }
  }

  weeks = summarizeWeeklyDistance(payload, weeks);

  return {
    weeks
  };
}

function summarizeWeeklyDistance(data, weeks) {
  let totalDistance = 0;
  let totalElevation = 0;
  //const totalRides = data.length;

  let j = 0;

  for (var i = 0; i < weeks.length; i++) {
    let weekStart = weeks[i].startDate;
    let weekEnd = weeks[i].endDate;

    //initialize to 0
    weeks[i].totalDistance = 0;
    weeks[i].distanceUnits = "mi";
    weeks[i].totalElevation = 0;
    weeks[i].elevationUnits = "ft";

    while (j < data.length) {
      let rideStartDate = new Date(data[j].start_date);

      if (rideStartDate >= weekStart && rideStartDate <= weekEnd) {
        //we are still in the same week so continue counting
        totalDistance += data[j].distance * 0.000621371192;
        totalElevation += data[j].total_elevation_gain;
        j++;

        if (j === data.length) {
          weeks[i].totalDistance = totalDistance;
          weeks[i].totalElevation = totalElevation;
        }
      } else {
        //we are in a new week so reset the counters

        weeks[i].totalDistance = totalDistance;
        weeks[i].totalElevation = totalElevation;

        totalDistance = 0;
        totalElevation = 0;
        break;
      }
    }
  }

  return weeks;
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
