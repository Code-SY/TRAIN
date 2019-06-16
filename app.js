var config = {
  apiKey: "AIzaSyBVQMAgWGoYX5wpK1yrfEyk5t-MKUDr2K8",
  authDomain: "train-f0f7c.firebaseapp.com",
  databaseURL: "https://train-f0f7c.firebaseio.com",
  projectId: "train-f0f7c",
  storageBucket: "",
  messagingSenderId: "212891169117",
  appId: "1:212891169117:web:97d2d4be01d355e6"
};

firebase.initializeApp(config);

var database = firebase.database();

var trainName = "";
var destination = "";
var startTime = "";
var frequency = 0;

function currentTime() {
  var current = moment().format("LT");
  $("#currentTime").html(current);
  setTimeout(currentTime, 1000);
}

$(".form-field").on("keyup", function() {
  var traintemp = $("#train-name")
    .val()
    .trim();
  var citytemp = $("#destination")
    .val()
    .trim();
  var timetemp = $("#first-train")
    .val()
    .trim();
  var freqtemp = $("#frequency")
    .val()
    .trim();

  sessionStorage.setItem("train", traintemp);
  sessionStorage.setItem("city", citytemp);
  sessionStorage.setItem("time", timetemp);
  sessionStorage.setItem("freq", freqtemp);
});

$("#train-name").val(sessionStorage.getItem("train"));
$("#destination").val(sessionStorage.getItem("city"));
$("#first-train").val(sessionStorage.getItem("time"));
$("#frequency").val(sessionStorage.getItem("freq"));

$("#submit").on("click", function(event) {
  event.preventDefault();

  if (
    $("#train-name")
      .val()
      .trim() === "" ||
    $("#destination")
      .val()
      .trim() === "" ||
    $("#first-train")
      .val()
      .trim() === "" ||
    $("#frequency")
      .val()
      .trim() === ""
  ) {
    alert("Please fill in all details");
  } else {
    trainName = $("#train-name")
      .val()
      .trim();
    destination = $("#destination")
      .val()
      .trim();
    startTime = $("#first-train")
      .val()
      .trim();
    frequency = $("#frequency")
      .val()
      .trim();

    $(".form-field").val("");

    database.ref().push({
      trainName: trainName,
      destination: destination,
      frequency: frequency,
      startTime: startTime,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    sessionStorage.clear();
  }
});

database.ref().on("child_added", function(childSnapshot) {
  var startTimeConverted = moment(
    childSnapshot.val().startTime,
    "hh:mm"
  ).subtract(1, "years");
  var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
  var timeRemain = timeDiff % childSnapshot.val().frequency;
  var minToArrival = childSnapshot.val().frequency - timeRemain;
  var nextTrain = moment().add(minToArrival, "minutes");
  var key = childSnapshot.key;

  var newrow = $("<tr id='" + key + "'>");
  newrow.append($("<td>" + childSnapshot.val().trainName + "</td>"));
  newrow.append($("<td>" + childSnapshot.val().destination + "</td>"));
  newrow.append(
    $("<td class='text-center'>" + childSnapshot.val().frequency + "</td>")
  );
  newrow.append(
    $("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>")
  );
  newrow.append($("<td class='text-center'>" + minToArrival + "</td>"));
  newrow.append(
    $(
      "<td class='text-center'><button class='close removeTrain' data-key='" +
        key +
        "'>&times;  &nbsp &nbsp &nbsp</button>&nbsp &nbsp</td>"
    )
  );

  $("#train-table-rows").append(newrow);
});

$(document).on("click", ".removeTrain", function() {
  var key = $(this).attr("data-key");

  database
    .ref()
    .child(key)
    .remove();

  $("#" + key).remove();
});

currentTime();
