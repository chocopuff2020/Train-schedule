// While it may not seem imperative for smaller programs, 
// you should get in the habit of wrapping your js code in either a 

// $(document).ready(function(){
//  // code goes here
// })

// or an IIFE (immediately invoked function expression)

// ;(function(){
//  // code goes here
// })()

// One of the most important reasons for that is security - because right now your global variables (ie `database`)
// can be tampered with through the console by a malicious visitor to your train schedule app 😮

var database = firebase.database();

// by setting the following variables on the global scope you end up with some unexpected behavior caused by 
// variable collisions. You should try to keep variables contained within the smallest functional scope you can
// so that you can avoid quirky bugs.
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
      // the following line would've helped to solve your Minutes Away
      // being `NaN` for all the previously stored train schedules.
      // var firstTrain = snap.val().firstTrain;
      convert = moment(firstTrain, "HH:mm");
      // another useful thing to do to prevent negative minutes away values
      // is to subtract time from the converted first train time so that it's
      // guaranteed to be parsed as in the past by moment. Could just be:
      // convert = convert.subtract(1, 'day')

        // other than the issues stemming from your reliance on global variables, this was 
        // very well thought through logic 👌
        var difference = moment().diff((convert), "minutes");
        var timeLeft = difference % frequency;
        var minutesAway = frequency - timeLeft;
        var nextArrival = moment().add(minutesAway, "minutes").format("LT");

      // very glad you know about es6 template strings and I think this is an apt use of them
      // and will have a lot of passover when we get to react. However, the bigger your template 
      // strings get, the less maintainable your code becomes. Another option would be to add 
      // all the row elements to an array and dynamically build the row using a loop like so:

      // var tableRow = $('<tr>')
      // var rowElements = [trainName, destination, frequency, nextArrival, timeLeft]
      
      // rowElements.forEach(function(element) {
      //   var td = $('<td>')
      //   td.text(element)
      //   tableRow.append(td)
      // })
      
      // $("tbody").append(tableRow);

      $('tbody').append(`
                <tr>
                    <td> ${trainName}</td>
                    <td> ${destination} </td>
                    <td> ${frequency}</td>
                    <td> ${nextArrival} </td>
                    <td> ${timeLeft}</td>
                </tr>
            `);
      // the following is actually taken care of in your click handler above, so it can safely be removed
      $('#train-name').empty();
});


/*=====  End of TIME CALCULATION  ======*/
