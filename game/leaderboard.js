//Leaderboard width
const WIDTH = 3;

//--------------------------------------------------------------
// Your web app's Firebase configuration
//--------------------------------------------------------------
let config = {
    apiKey: "AIzaSyARIbY2NZNNKeDI9znuuc3uGusKQTKieM4",
    authDomain: "battleship-bd087.firebaseapp.com",
    databaseURL: "https://battleship-bd087.firebaseio.com",
    projectId: "battleship-bd087",
    storageBucket: "battleship-bd087.appspot.com",
    messagingSenderId: "284023123174",
    appId: "1:284023123174:web:6891c643a73cffa7765f27"
};
// Initialize Firebase
firebase.initializeApp(config);

// Get a reference to the database server.
let db = firebase.firestore();
let auth = firebase.auth();

// Go to the game page.
function playGame() {
    location.replace('game.html'); // Sent to game page.
}

// Get a reference to the database server.

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
let leaders = db.collection('Users');

// Get leaderboard element.
let boards = document.getElementById('leaderboards');

function leaderboard() {
    let topTen = leaders.orderBy('wins', 'desc').limit(TOP_PLAYERS);

    // Create a row element
    let list = document.createElement('ol');
    list.setAttribute('list-style-type', 'none');
    let table = document.createElement('table');
    //table.setAttribute('border', '1', 'solid', 'black');
    let tbdy = document.createElement('tbody');
    let rank = 1;
    topTen.get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            let players = doc.data();
            let tr = document.createElement('tr');        
            for(let i = 0; i < WIDTH; i++){
                let td = document.createElement('td');
                switch(i){
                    case 0:
                        td.innerHTML = rank + ".";
                        break;
                    case 1:
                        td.innerHTML = players.email;
                        break;
                    case 2:
                        td.innerHTML = "Wins: " + players.wins;
                }
                tr.appendChild(td);
            }
            rank++;
            tbdy.appendChild(tr);
        });
        table.appendChild(tbdy);
    });
    
    // Append the list.
    boards.appendChild(table);
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

