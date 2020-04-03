// Go to the game page.
function playGame() {
    location.replace('game.html'); // Sent to game page.
}

//------------------------------------------------------------
// Welcome message 
//------------------------------------------------------------

// Create a users reference.
let ref = db.collection('Users');

function welcome() {
    let user = auth.currentUser;

    ref.get().then(function(doc) {
        console.log(doc.data());
    })

    let message = document.getElementById('welcome');

    message.innerHTML = 'Welcome to Battle Ship ' + user.email;
}

//------------------------------------------------------------
// Leaderboards
//------------------------------------------------------------

// Max number of players to display on leaderboard.
const TOP_PLAYERS = 10;

// Create a leaderboards reference.
let leaders = db.collection('Leaderboards');

// Get leaderboard element.
let boards = document.getElementById('leaderboards');

function leaderboard() {
    let topTen = db.collection('Leaderboards').orderBy('wins', 'desc').limit(TOP_PLAYERS);

    let i = 1;

    topTen.get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            let players = doc.data();

            let row = document.createElement('tr');

            let header = document.createElement('th');

            header.scope = 'row';
            header.innerHTML = i;
            i++;

            // Create the list item.
            let userName = document.createElement('td');
            userName.innerHTML = players.email;

            // Create radio buttons
            let score = document.createElement('td');
            score.innerHTML = players.wins;

            // Add item to list.
            boards.appendChild(row);
            boards.appendChild(header);
            boards.appendChild(userName);
            boards.appendChild(score);
        })
    });
}

leaderboard();

//------------------------------------------------------------
// Add Game to the users account.
//------------------------------------------------------------

function addGame() {
    // Grab the 'creators' information.
    let user = auth.currentUser;
    let id = user.uid;

    console.log(id);

    // Create a time stamp for the game.
    let date = new Date();
    let timestamp = date.getTime();

    // Create a game object.
    let game = {
        timestamp: timestamp,
        wins: 0,
        losses: 0
    };

    // Check if the user won or lost their game.
    // If won wins +=1;
    // Else losses +=1;

    // Push the game into the database.
    ref.doc(id).update({
        'Games.gameId': game.timestamp,
        'wins': 0, // will be the up-to-date wins
        'losses': 0 // will be the up-to-date losses
    }).then(function () {
        console.log('Game Complete!');

        // log an error in the console.
    }).catch(function (error) {
        console.error('Error creating game: ', error);
    });
}

