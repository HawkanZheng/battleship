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

//--------------------------------------------------------------
// Create a new game.
//--------------------------------------------------------------

let STATE = {OPEN: 1, JOINED: 2};

let game = {
    'creator': {'userName': 'Daichi Keber', 'uid': user.uid},
    'joiner': {'userName': 'Steve Sidhu', 'uid': user.uid},
    'state': 2 // JOINED
}

// reference to games in database.
ref = db.collection('Games');

// Create the game.
function createGame() {
    // Grab the 'creators' information.
    let user = auth.currentUser;

    // Create a game object.
    let currentGame = {
        creator: {uid: user.uid, userName: user.email},
        state: STATE.OPEN
    };

    // Push the game into the database.
    ref.doc().set({
        gameId: currentGame
    }).then(function() {
        console.log('Game created!');
    }).catch(function(error) {
        console.error('Error creating game: ', error);
    })
}

//--------------------------------------------------------------
// Join a game.
//--------------------------------------------------------------
function joinGame(key) {
    let user = auth.currentUser;
    let gameRef = ref.child(key);

    gameRef.transation(function(game) {
        if (!game.joiner) {
            game.state = STATE.JOINED;
            game.joiner = {uid: user.uid, userName: user.email}
        }
        return game;
    })
}

//--------------------------------------------------------------
// Show a list of open games.
//--------------------------------------------------------------
let openGames = ref.orderBy('state').equalTo(STATE.OPEN);

//--------------------------------------------------------------
// Show a list of open games.
//--------------------------------------------------------------

// Get the values of the users board.
let gridRef = ref.doc(gameId).collection('user').doc('board');

// Get the values of the opponents board.
let oppGrid = ref.doc(gameId).collection('user').doc('board');

function monitorOpponent() {
    oppGrid.onSnapshot(function (doc) {
      if (doc.data() == undefined) {
        // Go to home page.
        window.location.replace('game.html');
        return;
      } else {
        // Update the board 

      }     
    });
  }

// Update Opponents Board
function updateBoard() {

}

// Update your board.
function getBoard() {

}

// Check if you hit or missed opponent ship.
function hit() {

}
