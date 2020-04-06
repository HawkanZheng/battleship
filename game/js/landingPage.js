//------------------------------------------------------
// Enter Game
//------------------------------------------------------ 
function playGame(){
    location.replace('game.html');
}

//------------------------------------------------------
// Logout
//------------------------------------------------------ 

// Function to deal with logging out.
function logout() {
    firebase.auth().signOut().then(function () {
        // Send to login page.
        location.replace('index.html');
    }).catch(displayError);
}