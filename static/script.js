
var queueSize = 0;
var singedSongs = 0;
var songsQueue = [];
var songsSinged = [];

function moveObjectBetweenLists(objectToRemove, sourceList, destinationList) {
    // Find the index of the object to remove in the source list
    const indexToRemove = sourceList.findIndex(obj => obj === objectToRemove);

    // If the object is found in the source list
    if (indexToRemove !== -1) {
        // Remove the object from the source list
        const removedObject = sourceList.splice(indexToRemove, 1)[0];

        // Add the removed object to the destination list
        destinationList.push(removedObject);

        // Optionally, you can return the removed object
        return removedObject;
    } else {
        console.warn('Object not found in the source list');
        return null; // Object not found
    }
}


// Function to update the singed songs counter
function incrementSingedCounter() {
    queueSize -= 1;
    singedSongs += 1;
    document.getElementById('queueSize').innerHTML = queueSize;
    document.getElementById('singedSongs').innerHTML = singedSongs;
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
    
    saveSong(guestName, songName);

    // Clear the form fields
    document.getElementById('guestName').value = '';
    document.getElementById('songName').value = '';

    incrementQueueCounter();
}

// Function to move a row from the queue to the singed table
function moveToSinged(button) {
    var row = button.parentNode.parentNode;
    var submittedTime = row.cells[0].innerHTML;
    var guestName = row.cells[1].innerHTML;
    var songName = row.cells[2].innerHTML;

    checkSong(guestName, songName);

    moveObjectBetweenLists({guest: guestName, song: songName, songsQueue, songsSinged});
    incrementSingedCounter();
}

function saveSong(guest, song) {
    var apiUrl = '/song/save?guest=' + encodeURIComponent(guest) + '&song=' + encodeURIComponent(song);

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

function checkSong(guest, song) {
    var apiUrl = '/song/check?guest=' + encodeURIComponent(guest) + '&song=' + encodeURIComponent(song);

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

    songsQueue.forEach(element => {
        var row = queueTable.insertRow(-1);
        var timeCell = row.insertCell(0);
        var guestCell = row.insertCell(1);
        var songCell = row.insertCell(2);
        var actionCell = row.insertCell(3);
    
        var currentTime = new Date();
        timeCell.innerHTML = currentTime.toLocaleTimeString();
        guestCell.innerHTML = element["guest"];
        songCell.innerHTML = element["song"];
        actionCell.innerHTML = '<button onclick="moveToSinged(this)">Check</button>';
    });

    songsSinged.forEach(element => {
        // Create a new row for the singed table
        var singedRow = singedTable.insertRow(0);
        var submittedTimeCell = singedRow.insertCell(0);
        var guestCell = singedRow.insertCell(1);
        var songCell = singedRow.insertCell(2);
        var checkedTimeCell = singedRow.insertCell(3);

        var currentTime = new Date();
        var checkedTime = currentTime.toLocaleTimeString();

        submittedTimeCell.innerHTML = submittedTime;
        guestCell.innerHTML = guestName;
        songCell.innerHTML = songName;
        checkedTimeCell.innerHTML = checkedTime;

        // Add a class to style the checked rows differently
        singedRow.classList.add('checked-row');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Function to make the initial API call
    function initialApiCall() {
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
                singedSongs = data.singed;
                renderSongs();
                console.log('Initial API Response:', data);
            })
            .catch(error => {
                console.error('Error during initial API request:', error);
            });
    }

    // Function to continuously update the API call every second
    function updateApiCall() {
        // Replace 'https://example.com/api/endpoint' with your actual API URL
        var apiUrl = 'https://example.com/api/endpoint';

        setInterval(function () {
            initialApiCall();
        }, 1000); // Update every 1000 milliseconds (1 second)
    }

    // Make the initial API call when the page loads
    initialApiCall();

    // Start continuously updating the API call every second
    updateApiCall();
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
    }, 1000); // Update every 1000 milliseconds (1 second)
}
// Helper function to format time values with leading zeros
function formatTime(value) {
    return value < 10 ? '0' + value : value;
}

updateCountdown();
