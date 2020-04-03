// //--------------------------------------------------------------
// // Create a new game.
// //--------------------------------------------------------------

// // boolean for creator.
// let create = false;

// // reference to games in database.
// ref = db.collection('Games');

// let STATE = {
//     OPEN: 1,
//     JOINED: 2
// };

// let game = {
//     'creator': {
//         'userName': 'Daichi Keber',
//         'uid': 'sadasd12312dsa'
//     },
//     'joiner': {
//         'userName': 'Steve Sidhu',
//         'uid': 'sadasd1e12e12'
//     },
//     'state': 2 // JOINED
// }

// // Create the game.
// function createGame() {
//     // Grab the 'creators' information.
//     let user = auth.currentUser;

//     // Create a game object.
//     let currentGame = {
//         creator: {
//             uid: user.uid,
//             userName: user.email
//         },
//         joiner: {
//             uid: null,
//             userName: null
//         },
//         state: STATE.OPEN
//     };

//     // Push the game into the database.
//     ref.doc('' + uid).set({
//         gameId: uid,
//         creator: currentGame.creator,
//         joiner: currentGame.joiner,
//         state: currentGame.state
//     }).then(function () {
//         console.log('Game created!');
//         // Joins game they created.
//         location.replace('game.html');


//     }).catch(function (error) {
//         console.error('Error creating game: ', error);
//     });
//     create = true;
// }

// getRoomStatus();

// ref.doc('state').get().then(function (doc) {
//     if (doc.exists) {
//         console.log("Document data:", doc.data());
//     } else {
//         // doc.data() will be undefined in this case
//         console.log("No such document!");
//     }
// }).catch(function (error) {
//     console.log("Error getting document:", error);
// });

// function getRoomStatus() {
//     ref.where("state", "==", STATE.JOINED)
//     .get()
//     .then(function(querySnapshot) {
//         querySnapshot.forEach(function(doc) {
//             // doc.data() is never undefined for query doc snapshots
//             console.log(doc.id, " => ", doc.data());

//             // get the value of the room 
//             if (doc.data().state == STATE.JOINED) {
//                 window.alert('Someone Joined your game!');
//             }
//         });
//     })
//     .catch(function(error) {
//         console.log("Error getting documents: ", error);
//     });
// }

// ref.update({
//     board: userArr,
//     ready: true
// }).then(function () {
//     console.log('Board is now Set!'); // feedback - board is set
    
// }).catch(function (error) {
//     console.error('Error joining game: ', error);
// });



//gameFull();

// Call display games.
// displayGames();

// let stateRef = ref.doc(uid);

// stateRef.get('state').then(function (doc) {
//     if (doc.exists) {
//         console.log("Document data:", doc.data());
//     } else {
//         // doc.data() will be undefined in this case
//         console.log("No such document!");
//     }
// }).catch(function (error) {
//     console.log("Error getting document:", error);
// });


//--------------------------------------------------------------
// Display List of Games
//--------------------------------------------------------------
// function displayGames() {

//     let games = document.getElementById('opengames');

//     // get the open games.
//     ref.get().then((snapshot) => {
//         snapshot.docs.forEach(doc => {
//             let openGames = doc.data();

//             // Create the list item.
//             let item = document.createElement('ul');

//             // Create radio buttons
//             let btn = document.createElement('button');

//             // Set id for button
//             btn.id = openGames.gameId;

//             // Give buttons inner html value.
//             btn.innerHTML = 'Game Against ' + openGames.creator.userName;

//             // Onclick event
//             btn.onclick = joinGame;

//             // Set it's content
//             item.appendChild(btn);

//             // Add item to list.
//             games.appendChild(item);
//         })
//     });
// }

//--------------------------------------------------------------
// Join a game.
//--------------------------------------------------------------
// let gridRef = db.collection('Games');

// // To determine if they are not the creator 
// function joinGame() {

//     // Get current user info
//     let user = auth.currentUser;

//     // To determine if they are not the creator 
//     if (user.uid != this.id) {

//         // Reference the game Id
//         let gameRef = ref.doc(this.id);

//         // The Game oject for the game being joined.
//         let joiner = {
//             joiner: {
//                 uid: user.uid,
//                 userName: user.email
//             },
//             state: STATE.JOINED
//         };

//         // Add the joiner into the game.
//         gameRef.update({
//             joiner: joiner.joiner,
//             state: joiner.state,
//         }).then(function () {
//             console.log('Joined Game!');
//             location.replace('game.html');
//         }).catch(function (error) {
//             console.error('Error joining game: ', error);
//         });
//     }
// }

// // // reference to games in database.
// // ref = db.collection('Games');



// gridRef.get().then(function (doc) {
//     if (doc.exists) {
//         console.log('Document data: ', doc.data());
//     } else {
//         // undefined
//         console.log('No such document.')
//     }
// }).catch(function (error) {
//     console.log('Error getting document: ', error);
// });



//--------------------------------------------------------------
// Send Board Value
//--------------------------------------------------------------

// function monitorOpponent() {
//     oppGrid.onSnapshot(function (doc) {
//         if (doc.data() == undefined) {
//             // Go to home page.
//             window.location.replace('game.html');
//             return;
//         } else {
//             // Update the board 

//         }
//     });
// }
