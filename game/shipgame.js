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

//Table height and width
const T_HEIGHT = 10;
const T_WIDTH = 12;

//Ship sizes
const SIZE5 = 5;
const SIZE4 = 4;
const SIZE3 = 3;

//Number to needed to conver char to corresponding int
const OFFSET = 64;
//Battle ship placement input text and button
let placeText5 = document.getElementById("setup1");
let placeText4A = document.getElementById("setup2");
let placeText4B = document.getElementById("setup3");
let placeText3A = document.getElementById("setup4");
let placeText3B = document.getElementById("setup5");
let placeBtn = document.getElementById("place");

//Array of string values for the columns
let colArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

//2D Array for user coordinates
var userArr = new Array(T_HEIGHT);

//Ship object variables
let ship5;
let ship4A;
let ship4B;
let ship3A;
let ship3B;

//Constructor for ship object
function Ship(size, location) {

    //Ship size, how many spaces it spans
    this.size = size;

    //Coordinates of the ship in the 2D array, an array with for ints
    //syntax: [start column, start row, end column, end row]
    this.location = location;

    //Boolean that determines if ship is sunk or not
    this.sunk = false;

    //Returns true is boat is correct size
    this.isCorrectSize = function () {
        let correct = false;

        //If ship is horizontal
        if (location[0] == location[2]) {
            if (this.size == (Math.abs(location[1] - location[3]) + 1)) {
                correct = true;
            }

            //If ship is vertical
        } else if (location[1] == location[3]) {
            if (this.size == (Math.abs(location[0] - location[2]) + 1))
                correct = true;
        }
        return correct;
    }
}

//Generate initial 11x9 Grid with ships in placed in green
function gridCreate() {
    let body = document.getElementsByTagName('body')[0];
    let tbl = document.createElement('table');
    tbl.setAttribute('border', '1');
    let tbdy = document.createElement('tbody');

    //Generate rows
    for (let i = 0; i < T_HEIGHT; i++) {
        let tr = document.createElement('tr');

        //Generate columns
        for (let j = 0; j < T_WIDTH; j++) {
            let td = document.createElement('td');

            //Vertical labels
            if (i == 0 && !(j == 0)) {

                td.innerHTML = String.fromCharCode('A'.charCodeAt(0) + j - 1);

                //Horizontal labels
            } else if (j == 0 && !(i == 0)) {
                td.innerHTML = i;
            } else {

                //Give unique IDs to cells
                td.id = String.fromCharCode('A'.charCodeAt(0) + j - 1) + i;

                //Make battleships green
                if (i > 0 && j > 0 && userArr[i][j] == 1) {
                    td.style.backgroundColor = "green";
                }
            }


            tr.appendChild(td)
        }
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl)
}

//Create a ship
function createShip(coor, size) {
    //Get coordinates ship
    let shipX1 = getXCoor(coor, 0);
    let shipY1 = getYCoor(coor, 1);
    let shipX2 = getXCoor(coor, 3);
    let shipY2 = getYCoor(coor, 4);
    let location = [shipX1, shipY1, shipX2, shipY2];
    //Create ship
    return new Ship(size, location);

}

//Setup board with ships in place
function setBoard() {

    //Get input strings
    //Coordinates for 5 unit ship
    let coor5 = placeText5.value;
    //Coordinates for 4 unit ships
    let coor4A = placeText4A.value;
    let coor4B = placeText4B.value;
    //Coordinates for 4 unit ships
    let coor3A = placeText3A.value;
    let coor3B = placeText3B.value

    //Create 5 unit ship
    ship5 = createShip(coor5, SIZE5);
    //Create 4 unit ships
    ship4A = createShip(coor4A, SIZE4);
    ship4B = createShip(coor4B, SIZE4);
    //Create 3 unit ships
    ship3A = createShip(coor3A, SIZE3);
    ship3B = createShip(coor3B, SIZE3);

    //Check for valid ship sizes, if valid start game
    if (ship5.isCorrectSize() && ship4A.isCorrectSize() && ship4B.isCorrectSize() &&
        ship3A.isCorrectSize() && ship3B.isCorrectSize()) {
        //Generate 2D array representing ship placement
        createPostitionArr();

        //Generate grid with ships placed
        gridCreate();

        // Send board to datebase.
        sendBoard();

        //Hide startup stuff
        hideStartup();
    } else {
        window.alert("Ship coordinates are invalid. Please re-enter coordinates.");
    }

}

//Get x coordinate from input
function getXCoor(str, index) {
    //Start point x cooridinate
    let startX = str[index];
    //Invalid input of column coordinate
    if (colArr.indexOf(startX) == -1) {
        //window.alert("Invalid input. Please re-enter coordinates.");
        return;
    }
    return (startX.charCodeAt(0) - OFFSET);
}

//Get y coordinate from input
function getYCoor(str, index) {
    //Start point y cooridinate
    let startY = parseInt(str[index]);
    // if (startY < 1 || startY > 9) {
    //     window.alert("Invalid input. Please re-enter coordinates.");
    //     return;
    // } 
    return startY;
}


//Generate of 2D array of 0s and 1s. 1 represents the battleship
function createPostitionArr() {
    for (let i = 1; i < T_HEIGHT; i++) {
        userArr[i] = new Array(T_WIDTH);
        for (let j = 1; j < T_WIDTH; j++) {

            //Position 5 unit ship 
            if (((i >= ship5.location[1] && i <= ship5.location[3]) || (i <= ship5.location[1] && i >= ship5.location[3])) &&
                ((j >= ship5.location[0] && j <= ship5.location[2]) || (j <= ship5.location[0] && j >= ship5.location[2]))) {
                userArr[i][j] = 1;
            }

            //Position first 4 unit ship 
            else if (((i >= ship4A.location[1] && i <= ship4A.location[3]) || (i <= ship4A.location[1] && i >= ship4A.location[3])) &&
                ((j >= ship4A.location[0] && j <= ship4A.location[2]) || (j <= ship4A.location[0] && j >= ship4A.location[2]))) {
                userArr[i][j] = 1;
            }

            //Position second 4 unit ship
            else if (((i >= ship4B.location[1] && i <= ship4B.location[3]) || (i <= ship4B.location[1] && i >= ship4B.location[3])) &&
                ((j >= ship4B.location[0] && j <= ship4B.location[2]) || (j <= ship4B.location[0] && j >= ship4B.location[2]))) {
                userArr[i][j] = 1;
            }

            //Position first 3 unit ship
            else if (((i >= ship3A.location[1] && i <= ship3A.location[3]) || (i <= ship3A.location[1] && i >= ship3A.location[3])) &&
                ((j >= ship3A.location[0] && j <= ship3A.location[2]) || (j <= ship3A.location[0] && j >= ship3A.location[2]))) {
                userArr[i][j] = 1;
            }
            //Position second 3 unit ship
            else if (((i >= ship3B.location[1] && i <= ship3B.location[3]) || (i <= ship3B.location[1] && i >= ship3B.location[3])) &&
                ((j >= ship3B.location[0] && j <= ship3B.location[2]) || (j <= ship3B.location[0] && j >= ship3B.location[2]))) {
                userArr[i][j] = 1;
            } else {
                userArr[i][j] = 0;
            }
        }
    }
}

//Hide startup info
function hideStartup() {
    let toHide = document.getElementsByClassName("setup");

    //Hide all setup stuff
    for (i = 0; i < toHide.length; i++) {
        toHide[i].style.display = "none";
    }
}

placeBtn.onclick = setBoard;

//-----------------------------------------------------------------------
// Send the Grid to the database. 
//-----------------------------------------------------------------------

// Get the values of the users board.
let gridRef = db.collection('Games');

// Send board to the database.
function sendBoard() {
    
    // Get the current users UID.
    let user = firebase.auth().currentUser;
    uid = user.uid;

    gridRef.collection(uid).doc('Board').set({
        // CurrGameId: currentGame,
        board: userArr
    }).then(function () {
        console.log('Board successfully written!');
    }).catch(function (error) {
        console.error('Error sending board info: ', error);
    });
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
