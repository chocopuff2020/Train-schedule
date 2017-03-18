var database = firebase.database();
var trainName;
var destination;
var firstTrain ;
var frequency;
var convert;

$('#submit').on('click', function(event) {
            event.preventDefault();
            trainName = $('#train-name').val().trim();
            destination = $('#destination').val().trim();
            firstTrain = $('#first-train').val().trim();
            frequency = $('#frequency').val().trim();
            database.ref().push({
                trainName: trainName,
                destination:destination,
                firstTrain: firstTrain,
                frequency: frequency,
                // totalBilled: totalBilled,
                dataAdded: firebase.database.ServerValue.TIMESTAMP
            });

            $("#train-name").val("");
            $("#destination").val("");
            $("#first-train").val("");
            $("#frequency").val("");
});


/*========================================
=            TIME CALCULATION            =
========================================*/
database.ref().on('child_added', function(snap) {
      trainName = snap.val().trainName;
      destination = snap.val().destination;
      frequency = snap.val().frequency;
      convert = moment(firstTrain, "HH:mm");
        var difference = moment().diff((convert), "minutes");
        var timeLeft = difference % frequency;
        var minutesAway = frequency - timeLeft;
        var nextArrival = moment().add(minutesAway, "minutes").format("LT");

      $('tbody').append(`
                <tr>
                    <td> ${trainName}</td>
                    <td> ${destination} </td>
                    <td> ${frequency}</td>
                    <td> ${nextArrival} </td>
                    <td> ${timeLeft}</td>
                </tr>
            `);
      $('#train-name').empty();
});


/*=====  End of TIME CALCULATION  ======*/
