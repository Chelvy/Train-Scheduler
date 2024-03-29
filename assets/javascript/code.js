  // Your web app's Firebase configuration
  var firebaseConfig = {
      apiKey: "AIzaSyDUqc_nUrJ-I72_Q2UpXAuuFaBrQkcskl8",
      authDomain: "logic-1e3b5.firebaseapp.com",
      databaseURL: "https://logic-1e3b5.firebaseio.com",
      projectId: "logic-1e3b5",
      storageBucket: "logic-1e3b5.appspot.com",
      messagingSenderId: "381000106363",
      appId: "1:381000106363:web:d57f62a92d062578"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();
  var trainNameInput = "";
  var destinationInput = "";
  var firstTrainTimeInput = "";
  var frequencyInput = "";

  $('#submit').on('click', function(event) {
      event.preventDefault();
      trainNameInput = $('#trainName-input').val().trim();
      destinationInput = $('#destination-input').val().trim();
      frequencyInput = $('#frequency-input').val().trim();
      firstTrainTimeInput = $('#firstTrainTime-input').val().trim();

      // First Time (pushed back 1 year to make sure it comes before current time)
      var firstTimeConverted = moment(firstTrainTimeInput, "HH:mm").subtract(1, "years");
      console.log(moment(firstTimeConverted).format("hh:mm"));

      // Current Time
      var currentTime = moment();
      console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);

      // Time apart (remainder)
      var tRemainder = diffTime % frequencyInput;
      console.log(tRemainder);

      // Minute Until Train
      var tMinutesTillTrain = frequencyInput - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

      // Next Train
      var nextTrainTime = moment().add(tMinutesTillTrain, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextTrainTime).format("hh:mm"));

      console.log(trainNameInput);
      console.log(destinationInput);
      console.log(firstTrainTimeInput);
      console.log(frequencyInput);

      database.ref("/data").push({
          trainName: trainNameInput,
          destination: destinationInput,
          frequency: frequencyInput,
          firstTrainTime: firstTrainTimeInput,
          nextArrival: moment(nextTrainTime).format("hh:mm"),
          minAway: tMinutesTillTrain
      });



  });



  database.ref("/data").on("child_added", function(snapshot) {
          console.log(snapshot.val());
          console.log(snapshot.val().trainName);
          console.log(snapshot.val().destination);
          console.log(snapshot.val().frequency);
          console.log(snapshot.val().nextArrival);
          console.log(snapshot.val().minAway);
          var newUpdtBtn = $('<button type="update" class="btn btn-primary" id="update">Update</button>');

          var newDltBtn = $('<button type="delete" class="btn btn-primary" id="delete">Delete</button>');
          var newtr = $('<tr>');
          newtr.append($('<td>').text(snapshot.val().trainName))
              .append($('<td>').text(snapshot.val().destination))
              .append($('<td>').text(snapshot.val().frequency))
              .append($('<td>').text(snapshot.val().nextArrival))
              .append($('<td>').text(snapshot.val().minAway))
              .append($('<td>').html(newUpdtBtn))
              .append($('<td>').html(newDltBtn))
          newtr.appendTo($('#tbody'));
          $('#tbody').on('click', '#delete', function() {
              var adaRef = firebase.database().ref('/data');
              //   adaRef.remove(this);
              $(this).closest('tr').remove();

          });
          //   $('#tbody').on('click', '#update', function() {
          //       var firstTimeConverted = moment(firstTrainTimeInput, "HH:mm").subtract(1, "years");
          //       var currentTime = moment();
          //       var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");
          //       var tRemainder = diffTime % frequencyInput;
          //       var tMinutesTillTrain = frequencyInput - tRemainder;
          //       var nextTrainTime = currentTime.add(tMinutesTillTrain, "minutes");
          //       database.ref("/data").set({
          //           nextArrival: moment(nextTrainTime).format("hh:mm"),
          //           minAway: tMinutesTillTrain
          //       });
          //       $(this).closest('tr').load(snapshot.val().nextArrival);
          //       $(this).closest('tr').load(snapshot.val().minAway);
          //   });
      },
      function(errorObject) {
          console.log("The read failed: " + errorObject.code);
      });