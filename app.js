// Initialize Firebase
var config = {
    apiKey: "AIzaSyA9pDXPVgNdilPkwMX0CNJgtnfMXVYzlQU",
    authDomain: "trains-6e7bf.firebaseapp.com",
    databaseURL: "https://trains-6e7bf.firebaseio.com",
    projectId: "trains-6e7bf",
    storageBucket: "trains-6e7bf.appspot.com",
    messagingSenderId: "1061125723646"
  };
  
    firebase.initializeApp(config);
  var database = firebase.database();
  // Initial Variables
  var trainname;
  var destination;
  var frequency;
  var arrival;
  var away;
  
  // OBJECT
  var scheduler = {
  
    addTrain: function(){
      $("#addTrain").on("click", function(){
        event.preventDefault();
      
        trainname = $("#inputName").val().trim();
        destination = $("#inputDestination").val().trim();
        frequency = $("#inputFrequency").val().trim();
        arrival = $("#inputTime").val().trim();
        console.log(trainname);
      
        database.ref().push({
          name: trainname,
          destination: destination,
          frequency: frequency,
          arrival: arrival,
          dateAdded: firebase.database.ServerValue.TIMESTAMP,
        })
      })
    },
    addInfo: function(){
      database.ref().on("child_added", function(childSnapshot) {
        var childTime;
        var parseTime;
        var childFrequency;
        var parseFrequency;
        var now;
        var firstTimeConverted;
        var diffTime;;
        var timeRemainder;
        var minutesAway;
  
        function countTime(){
        childTime = childSnapshot.val().arrival; //first arrival time
        parseTime = moment(childTime, "HH:mm"); // time in miliseconds
        childFrequency = childSnapshot.val().frequency;
        parseFrequency = moment(childFrequency, "m");
      
        now = moment();
        firstTimeConverted = moment(childTime, "HH:mm").subtract(1, "years"); // First Time (pushed back 1 year to make sure it comes before current time)
        diffTime = moment().diff(moment(firstTimeConverted), "minutes"); // Difference between the times
          
        timeRemainder = diffTime % childFrequency;// Time apart (remainder)
        minutesAway = childFrequency - timeRemainder; // Minutes Until Next Train
  
        childTime = moment().add(minutesAway, "minutes").format("LT"); // Next Arrival Time
        console.log("ARRIVAL TIME: " + moment(childTime, "LT").format("LT"));
        }
        countTime();
        
        $("#trainInfo").append(`
            <tr>
            <td>${childSnapshot.val().name}</td>
            <td>${childSnapshot.val().destination}</td>
            <td>${childSnapshot.val().frequency}</td>
            <td id="${childSnapshot.val().dateAdded}arrival">${childTime}</td>
            <td id="${childSnapshot.val().dateAdded}">${minutesAway}</td>
            </tr>
        
        `)
        function updateTime() { //now we are updating minutesAway and childTime variables on screen every minute
          countTime();
          var grabId = childSnapshot.val().dateAdded;
          document.getElementById(grabId).innerHTML=minutesAway;
          
          var grabArrivalId = childSnapshot.val().dateAdded;
          document.getElementById(grabId + "arrival").innerHTML=childTime;
  
          setTimeout(updateTime, 60000);
        }
        updateTime();
        
        // If any errors are experienced, log them to console.
        }, function(errorObject) {
          console.log("The read failed: " + errorObject.code);
      });
    },
  }
  
  scheduler.addTrain();
  scheduler.addInfo();