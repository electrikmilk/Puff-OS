// Clock

setInterval(startClock, 1000);

function startClock() {
  var dat;
  var time;
  var date = new Date();
  // Weekday
  var weekday = new Array(7);
  if (system.storage.get("weekday") === "short") {
    weekday[0] = "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tue";
    weekday[3] = "Wed";
    weekday[4] = "Thu";
    weekday[5] = "Fri";
    weekday[6] = "Sat";
  } else {
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
  }
  var day = weekday[date.getDay()];
  var d = date.getDate();
  // Month
  var m = date.getMonth();
  var month = new Array();
  if (system.storage.get("month") === "short") {
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sept";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
  } else {
    month[0] = "January";
    month[1] = "Febrary";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
  }
  var n = month[date.getMonth()];
  var year = date.getFullYear();
  if (system.storage.get("dateFormat") === "md") {
    var dat = n + " " + d;
  } else {
    var dat = d + " " + n;
  }
  if (system.storage.get("showWeekday") === "true") {
    var dat = day + ", " + dat;
  }
  if (system.storage.get("showYear") === "true") {
    dat += ", " + year;
  }
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = "";
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  if (system.storage.get("showSeconds") === "true") {
    var seconds = ":" + date.getSeconds();
    seconds = seconds < 10 ? '0' + seconds : seconds;
  }
  if (system.storage.get("timeFormat") === "12") {
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    $(".clock").html(dat + "&nbsp;&nbsp;" + hours + ":" + minutes + seconds + " " + ampm);
  } else {
    $(".clock").html(dat + "&nbsp;&nbsp;" + hours + ":" + minutes + seconds);
  }
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i
  }; // add zero in front of numbers < 10
  return i;
}