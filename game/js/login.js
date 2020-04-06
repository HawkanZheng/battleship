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

    // Grabs dom element references.
    let theEmail = document.getElementById('userName');
    let pass = document.getElementById('password');

    // Sets the values for the email and password.
    let email = theEmail.value;
    let password = pass.value;

    auth.createUserWithEmailAndPassword(email, password).then(function () {

        // Gives authorization to log in if the email and password are valid.
        auth.signInWithEmailAndPassword(email, password).then(function () {

            // reference to firebase authentication.
            let user = firebase.auth().currentUser;

            if (user == null) {
                // User not signed in.
                console.log("not logged in");
            } else {
                // user is signed in, send to game page.
                window.location.replace('landingPage.html');
            }
        }).catch(function (error) {
            window.alert(error.message);
        });

    }).catch(function (error) {
        // Handle Errors here.
        if (password.length < 6) {
            window.alert('Password needs to be at least 6 characters.');
        }
        window.alert(error.message);
    });
}

//------------------------------------------------------
// Send new User to database
//------------------------------------------------------ 

// Reference to the authentication in firestore.
let user = firebase.auth().currentUser;

// Declares variables used to store user info in the database.
let email;
const START_WINS = 0;
const START_LOSSES = 0;

// Checks for changes in the signed in user.
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        let checkUser = true;
        db.collection('Users').get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                if(doc.data().UID == user.uid){
                    checkUser = false;
                }
            });
        });
        console.log(checkUser);
        if (checkUser) {
            // Grabs user info from firestore.
            email = user.email;
            uid = user.uid;

            // Add the user info to the database.
            db.collection('Users').doc(uid).set({
                'email': email,
                'UID': uid, // Unique ID created when signup
                'wins': START_WINS, // Starts at zero wins
                'losses': START_LOSSES // starts at zero losses
            }).then(function () {
                console.log('Doc successfully written!');
            }).catch(function (error) {
                console.error('Error writing document: ', error);
            });
        } else {
            // No user is signed in.
            console.log('not logged in');
        }
    }
});

//------------------------------------------------------
// Login 
//------------------------------------------------------ 

// Function to handle login for user.
function login() {

    // Grabs the DOM elements.
    let theEmail = document.getElementById('userName');
    let pass = document.getElementById('password');

    // Stores the typed in info into variables.
    let email = theEmail.value;
    let password = pass.value;

    // Gives authorization to log in if the email and password are valid.
    auth.signInWithEmailAndPassword(email, password).then(function () {

        // reference to firebase authentication.
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
        window.alert(error.message);
    });
}