
//--------------------------------------------------------------
// Create a new game.
//--------------------------------------------------------------

// reference to games in database.
ref = db.collection('Games');

let STATE = {OPEN: 1, JOINED: 2};

let game = {
    'creator': {'userName': 'Daichi Keber', 'uid': 'sadasd12312dsa'},
    'joiner': {'userName': 'Steve Sidhu', 'uid': 'sadasd1e12e12'},
    'state': 2 // JOINED
}

// Create the game.
function createGame() {
    // Grab the 'creators' information.
    let user = auth.currentUser;

    // Create a game object.
    let currentGame = {
        creator: {uid: user.uid, userName: user.email},
        state: STATE.OPEN
    };

    // Create a timestamp 
    let time = new Date();
    let timeStamp = time.getTime();

    // Push the game into the database.
    ref.doc().set({
        gameId: currentGame,
        timeStamp: timeStamp
    }).then(function() {
        console.log('Game created!');
    }).catch(function(error) {
        console.error('Error creating game: ', error);
    });

    // Display all of the games.
    displayGames();
}

//--------------------------------------------------------------
// Display List of Games
//--------------------------------------------------------------
function displayGames() {
    // get the open games.
    ref.get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            console.log(doc.data())
        })
    });
    
    // Get Open Games
    let openGames = ref.where('state', '<', STATE.OPEN).orderBy('state');

    if (openGames) {
        let games = document.getElementById('opengames');
        games.innerHTML = openGames;
    }
}

//--------------------------------------------------------------
// Join a game.
//--------------------------------------------------------------
let gridRef = db.collection('Games');

function joinGame(key) {

    let user = auth.currentUser;
    let gameRef = ref.doc(key);

    gameRef.runTransation(function(game) {
        if (!game.joiner) {
            game.state = STATE.JOINED;
            game.joiner = {uid: user.uid, userName: user.email}
        }
        return game;
    })
}

gridRef.get().then(function(doc) {
    if (doc.exists) {
        console.log('Document data: ', doc.data());
    } else {
        // undefined
        console.log('No such document.')
    }
}).catch(function(error) {
    console.log('Error getting document: ', error);
});

//--------------------------------------------------------------
// Send Board Value
//--------------------------------------------------------------

// Get the values of the users board.
// let gridRef = ref.doc(gameId).collection('user').doc('board');

// Get the values of the opponents board.
// let oppGrid = ref.doc(gameId).collection('user').doc('board');

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
