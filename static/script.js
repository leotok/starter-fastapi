var songsQueue = [];
var songsSinged = [];


// Function to add a new request to the queue
function addToQueue() {
    var guestName = document.getElementById('guestName').value;
    var songName = document.getElementById('songName').value;
    
    if (!guestName || !songName) {
        return;
    }

    var currentTime = new Date();
    var submittedTime = currentTime.toLocaleTimeString();

    saveSong(guestName, songName, submittedTime);

    // Clear the form fields
    document.getElementById('guestName').value = '';
    document.getElementById('songName').value = '';
}

// Function to move a row from the queue to the singed table
function moveToSinged(button) {
    var row = button.parentNode.parentNode;
    var submittedTime = row.cells[0].innerHTML;
    var guestName = row.cells[1].innerHTML;
    var songName = row.cells[2].innerHTML;
    
    var currentTime = new Date();
    var checkedTime = currentTime.toLocaleTimeString();

    checkSong(guestName, songName, checkedTime);
}

function saveSong(guest, song, submittedTime) {
    var apiUrl = '/song/save?guest=' + encodeURIComponent(guest) + '&song=' + encodeURIComponent(song) + '&submitted_time=' + encodeURIComponent(submittedTime);

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Process the data returned from the API
            console.log('API Response:', data);
        })
        .catch(error => {
            console.error('Error during API request:', error);
        });
}

function checkSong(guest, song, checkedTime) {
    var apiUrl = '/song/check?guest=' + encodeURIComponent(guest) + '&song=' + encodeURIComponent(song) + '&checked_time=' + encodeURIComponent(checkedTime);

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Process the data returned from the API
            console.log('API Response:', data);
        })
        .catch(error => {
            console.error('Error during API request:', error);
        });
}

function renderSongs() {
    var queueTable = document.getElementById('queueBody');
    queueTable.innerHTML = "";

    var singedTable = document.getElementById('singedBody');
    singedTable.innerHTML = "";

    document.getElementById('queueSize').innerHTML = songsQueue.length;
    document.getElementById('singedSongs').innerHTML = songsSinged.length;

    songsQueue.forEach(element => {
        var row = queueTable.insertRow(-1);
        var timeCell = row.insertCell(0);
        var guestCell = row.insertCell(1);
        var songCell = row.insertCell(2);
        var actionCell = row.insertCell(3);
    
        timeCell.innerHTML = element["submitted_time"];
        guestCell.innerHTML = element["guest"];
        songCell.innerHTML = element["song"];
        actionCell.innerHTML = '<button onclick="moveToSinged(this)">Já cantou!</button>';
    });

    songsSinged.forEach(element => {
        // Create a new row for the singed table
        var singedRow = singedTable.insertRow(0);
        var submittedTimeCell = singedRow.insertCell(0);
        var guestCell = singedRow.insertCell(1);
        var songCell = singedRow.insertCell(2);
        var checkedTimeCell = singedRow.insertCell(3);

        submittedTimeCell.innerHTML = element["submitted_time"];;
        guestCell.innerHTML = element["guest"];
        songCell.innerHTML = element["song"];
        checkedTimeCell.innerHTML = element["checked_time"];;

        // Add a class to style the checked rows differently
        singedRow.classList.add('checked-row');
    });
}


function updateSongs() {
    var apiUrl = '/song';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Process the data returned from the initial API call
            songsQueue = data.queue;
            songsSinged = data.singed;
            renderSongs();
        })
        .catch(error => {
            console.error('Error during initial API request:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    // Make the initial API call when the page loads
    updateSongs();

    // Start continuously updating the API call every second
    setInterval(function () {
        updateSongs();
    }, 5000);

    setInterval(function () {
        renderSongs();
    }, 1000);
});



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
    }, 1000); // Update every 1 second
}
// Helper function to format time values with leading zeros
function formatTime(value) {
    return value < 10 ? '0' + value : value;
}

updateCountdown();
