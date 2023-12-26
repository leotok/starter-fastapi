
var queueSize = 0;
var signedSongs = 0;


// Function to update the signed songs counter
function incrementSignedCounter() {
    queueSize -= 1;
    signedSongs += 1;
    document.getElementById('queueSize').innerHTML = queueSize;
    document.getElementById('signedSongs').innerHTML = signedSongs;
}

// Function to update the queue size counter
function incrementQueueCounter() {
    queueSize += 1;
    document.getElementById('queueSize').innerHTML = queueSize;
}


// Function to add a new request to the queue
function addToQueue() {
    var guestName = document.getElementById('guestName').value;
    var songName = document.getElementById('songName').value;

    // Create a new row for the queue table
    var row = document.getElementById('queueBody').insertRow(-1);
    var timeCell = row.insertCell(0);
    var guestCell = row.insertCell(1);
    var songCell = row.insertCell(2);
    var actionCell = row.insertCell(3);

    var currentTime = new Date();
    timeCell.innerHTML = currentTime.toLocaleTimeString();
    guestCell.innerHTML = guestName;
    songCell.innerHTML = songName;
    actionCell.innerHTML = '<button onclick="moveToSigned(this)">Check</button>';

    // Clear the form fields
    document.getElementById('guestName').value = '';
    document.getElementById('songName').value = '';

    incrementQueueCounter();
}

// ... (previous JavaScript code) ...

// Function to move a row from the queue to the signed table
function moveToSigned(button) {
    var row = button.parentNode.parentNode;
    var submittedTime = row.cells[0].innerHTML;
    var guestName = row.cells[1].innerHTML;
    var songName = row.cells[2].innerHTML;

    // Create a new row for the signed table
    var signedRow = document.getElementById('signedBody').insertRow(0);
    var submittedTimeCell = signedRow.insertCell(0);
    var guestCell = signedRow.insertCell(1);
    var songCell = signedRow.insertCell(2);
    var checkedTimeCell = signedRow.insertCell(3);

    var currentTime = new Date();
    var checkedTime = currentTime.toLocaleTimeString();

    submittedTimeCell.innerHTML = submittedTime;
    guestCell.innerHTML = guestName;
    songCell.innerHTML = songName;
    checkedTimeCell.innerHTML = checkedTime;

    // Add a class to style the checked rows differently
    signedRow.classList.add('checked-row');

    // Clear the form fields
    document.getElementById('guestName').value = '';
    document.getElementById('songName').value = '';

    // Remove the row from the queue table
    row.remove();

    incrementSignedCounter();
}


// Function to update the timer countdown
function updateCountdown() {
    var targetDate = new Date("2024-01-01T00:00:00-03:00");

    // Update the countdown every second
    var countdownInterval = setInterval(function() {
        var currentDate = new Date();
        var timeDifference = targetDate - currentDate;

        if (timeDifference > 0) {
            var hours = Math.floor(timeDifference / (1000 * 60 * 60));
            var minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            document.getElementById('countdown').innerHTML = 'Contagem regressiva para a virada: ' +
                formatTime(hours) + ':' +
                formatTime(minutes) + ':' +
                formatTime(seconds);
        } else {
            clearInterval(countdownInterval); // Stop the interval when the countdown expires
            document.getElementById('countdown').innerHTML = 'Countdown expired!';
        }
    }, 1000); // Update every 1000 milliseconds (1 second)
}
// Helper function to format time values with leading zeros
function formatTime(value) {
    return value < 10 ? '0' + value : value;
}

updateCountdown();
