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

//------------------------------------------------------------
// Leaderboards
//------------------------------------------------------------

// Max number of players to display on leaderboard.
const TOP_PLAYERS = 10;

// Create a leaderboards reference.
let leaders = db.collection('Users');

// Get leaderboard element.
let boards = document.getElementById('leaderboards');

// Populate leaderboard.
function leaderboard() {
    let topTen = leaders.orderBy('wins', 'desc').limit(TOP_PLAYERS);

    // Create table for leaderboard
    let table = document.createElement('table');
    let tbdy = document.createElement('tbody');
    let rank = 1;
    topTen.get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            
            // Assign users data to a variable.
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
    // Append the table to board
    boards.appendChild(table);
}

// Call the function
leaderboard();
