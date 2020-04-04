// Get a reference to the database server.
//let db = firebase.firestore();
//let auth = firebase.auth();

//------------------------------------------------------------
// Play Game
//------------------------------------------------------------
function playGame() {
    location.replace('game.html'); // Sent to game page.
}


//------------------------------------------------------------
// Leaderboards
//------------------------------------------------------------

// Max number of players to display on leaderboard.
const TOP_PLAYERS = 10;

// Create a leaderboards reference.
let leaders = firebase.firestore().collection('Leaderboards');

// Get leaderboard element.
let boards = document.getElementById('leaderboards');

// Get up to 10 users and display on the leaderboards.
function leaderboard() {
    let topTen = firebase.firestore().collection('Leaderboards').orderBy('wins', 'desc').limit(TOP_PLAYERS);

    let i = 1;

    // Create a row element
    let list = document.createElement('ol');
    list.setAttribute('list-style-type', 'none');

    topTen.get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            // Access the user object and their data.
            let players = doc.data();

            // Create a cell element.
            let item = document.createElement('li');

            // item.innerHTML = i + '. ' + players.email
            // + '</br>' + 'Wins: ' + players.wins;

            // Set the contents.
            item.appendChild(document.createTextNode(players.email
                + ', ' + 'Wins: ' + players.wins));

            // Add it to the list.
            list.appendChild(item);

             // Gives each user a rank.
             i++;
        })
    });  
    // Append the list to DOM.
    boards.appendChild(list);
}

// Call the function.
leaderboard();

//------------------------------------------------------------
// Add Game to the users account.
//------------------------------------------------------------

// function addGame() {
//     // Grab the 'creators' information.
//     let user = auth.currentUser;
//     let id = user.uid;

//     console.log(id);

//     // Create a time stamp for the game.
//     let date = new Date();
//     let timestamp = date.getTime();

//     // Create a game object.
//     let game = {
//         timestamp: timestamp,
//         wins: 0,
//         losses: 0
//     };

//     // Check if the user won or lost their game.
//     // If won wins +=1;
//     // Else losses +=1;

//     // Push the game into the database.
//     ref.doc(id).update({
//         'Games.gameId': game.timestamp,
//         'wins': 0, // will be the up-to-date wins
//         'losses': 0 // will be the up-to-date losses
//     }).then(function () {
//         console.log('Game Complete!');

//         // log an error in the console.
//     }).catch(function (error) {
//         console.error('Error creating game: ', error);
//     });
// }

