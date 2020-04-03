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

//------------------------------------------------------
// SignUp
//------------------------------------------------------ 
function createUser() {

    let theEmail = document.getElementById('userName');
    let pass = document.getElementById('password');

    let email = theEmail.value;
    let password = pass.value;

    auth.createUserWithEmailAndPassword(email, password).then(function () {

        // Send them to the landing page.
        location.replace('game.html');

    }).catch(function (error) {
        // Handle Errors here.
        if (password.length < 6) {
            window.alert('Password needs to be at least 6 characters.');
        }
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
}

//------------------------------------------------------
// Login 
//------------------------------------------------------ 
function login() {

    let theEmail = document.getElementById('userName');
    let pass = document.getElementById('password');

    let email = theEmail.value;
    let password = pass.value;

    auth.signInWithEmailAndPassword(email, password).then(function () {
        let user = firebase.auth().currentUser;
        if (user == null) {
            // User not signed in.
            console.log("not logged in");
        } else {
            // user is signed in, send to game page.
            window.location.replace('landingPage.html');
        }
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        window.alert('Not a valid log in.');
        var errorMessage = error.message;
        // ...
    });
    // Store the users information into the database.
}

//------------------------------------------------------
// Logout
//------------------------------------------------------ 
function logout() {
    firebase.auth().signOut().then(function () {
        window.location.replace('login.html');
    }).catch(displayError);
}

//------------------------------------------------------
// Send new User to database
//------------------------------------------------------ 

let user = firebase.auth().currentUser;
let email, curentGame;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    // User is signed in.
    console.log('logged in');

    // user information 
    userEmail = user.email;
    uid = user.uid;

    // Add the user info to the database.
    db.collection('Users').doc(uid).set({
        // CurrGameId: currentGame,
        email: userEmail,
        UID: uid
    }).then(function() {
        console.log('Doc successfully written!');
    }).catch(function(error) {
        console.error('Error writing document: ', error);
    })

    } else {
      // No user is signed in.
      console.log('not logged in');
    }
  });

//------------------------------------------------------
// Login Anonymous (OPTIONAL)
//------------------------------------------------------ 

// Allow user to sign in as guest.
firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });

  let anon;

  // Get Guest user data 
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      anon = user.isAnonymous;
      uid = user.uid;
      // ...
    } else {
      // User is signed out.
      console.log('No User logged in.')
    }
  });