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
//let db = firebase.firestore();
//let auth = firebase.auth();

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
//Target coordinate input text and fire button
let targetIn = document.getElementById("target");
let fireBtn = document.getElementById("fire");
//Sunk ships counter display
let sunkUser = document.getElementById("userSunk");
let sunkComp = document.getElementById("compSunk");

//Array of string values for the columns
let colArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

//2D Array for user coordinates
let userArr;

//2D Array for computer coordinates
let computerArr;

//Boolean variable for turn
let turn = true;

//Ship object variables
let ship5;
let ship4A;
let ship4B;
let ship3A;
let ship3B;

//Opponent ship object variables
let compShip5;
let compShip4A;
let compShip4B;
let compShip3A;
let compShip3B;

//Sunk count
let userShipsSunk = 0;
let compShipsSunk = 0;

//Active ship arrays
let activeUserShips;
let activeCompShips;

//Play music
let music = document.getElementById("music");
music.volume = 0.5;
music.loop = true;
music.play();

//Sunk explosion sfx
let sunkSFX = document.getElementById("destroyed");

//Constructor for ship object
function Ship(size, location, index) {

    //Ship size, how many spaces it spans
    this.size = size;

    //Coordinates of the ship in the 2D array, an array with for ints
    //syntax: [start column, start row, end column, end row]
    this.location = location;

    //Boolean that determines if ship is sunk or not
    this.sunk = false;

    //Index of position in active ships
    this.index = index;

    //Returns true is boat is correct size
    this.isCorrectSize = function () {
        let correct = false;

        //If ship is vertical
        if (location[0] == location[2]) {
            if (this.size == (Math.abs(location[1] - location[3]) + 1)) {
                correct = true;
            }

            //If ship is horizontal
        } else if (location[1] == location[3]) {
            if (this.size == (Math.abs(location[0] - location[2]) + 1))
                correct = true;
        }
        return correct;
    }
}

//Generate initial 11x9 Grid with ships in placed in green
//Parameters: 2D array and int called type respresenting user(0) or computer opponent(1)
function gridCreate(arr, type) {
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

            //Label Grids
            if (i == 0 && j == 0) {
                if (type == 0) {
                    td.innerHTML = "Player Grid";
                } else {
                    td.innerHTML = "Enemy Grid";
                }

            }
            //Vertical labels
            if (i == 0 && !(j == 0)) {

                td.innerHTML = String.fromCharCode('A'.charCodeAt(0) + j - 1);

                //Horizontal labels
            } else if (j == 0 && !(i == 0)) {
                td.innerHTML = i;
            } else {

                if (type == 0) {
                    //Give unique IDs to cells, user
                    td.id = "" + j + i;
                    //Make battleships green
                    if (i > 0 && j > 0 && arr[i][j] == 1) {
                        td.style.backgroundColor = "green";
                    }
                } else {
                    //Give unique IDs to cells, computer
                    td.id = "" + 0 + j + i;
                }
            }
            tr.appendChild(td)
        }
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl)
}

//Create a ship with specific size and active ships index
function createShip(coor, size, index) {
    //Get coordinates ship
    let shipX1 = getXCoor(coor, 0);
    let shipY1 = getYCoor(coor, 1);
    let shipX2 = getXCoor(coor, 3);
    let shipY2 = getYCoor(coor, 4);
    let location = [shipX1, shipY1, shipX2, shipY2];
    //Create ship
    return new Ship(size, location, index);

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

    if (coor5.length == 5 || coor4A.length == 5 || coor4B.length == 5 ||
        coor3A.length == 5 || coor3B.length == 5) {
        //Create 5 unit ship
        ship5 = createShip(coor5, SIZE5, 0);
        //Create 4 unit ships
        ship4A = createShip(coor4A, SIZE4, 1);
        ship4B = createShip(coor4B, SIZE4, 2);
        //Create 3 unit ships
        ship3A = createShip(coor3A, SIZE3, 3);
        ship3B = createShip(coor3B, SIZE3, 4);

        //Check for valid ship sizes, if valid start game
        if (ship5.isCorrectSize() && ship4A.isCorrectSize() && ship4B.isCorrectSize() &&
            ship3A.isCorrectSize() && ship3B.isCorrectSize()) {
            //check if any ships are overlapped
            if (!overlap()) {

                //Array of ships
                let ships = [ship5, ship4A, ship4B, ship3A, ship3B];

                //Generate 2D array representing computer opponent ship placement
                //Generate computer opponent grid
                computerArr = createPositionArr(loadOpponentShips());
                console.log(computerArr);
                gridCreate(computerArr, 1);

                //Generate 2D array representing user ship placement
                //Generate grid with ships placed
                userArr = createPositionArr(ships)
                gridCreate(userArr, 0);

                //Load ships into active ships array
                activeCompShips = [compShip5, compShip4A, compShip4B, compShip3A, compShip3B];
                activeUserShips = [ship5, ship4A, ship4B, ship3A, ship3B];


                //Hide startup stuff
                hideStartup();

                //Show fire button
                showPlay();

            } else {
                window.alert("One or more ships are overlapping. Please re-enter coordinates.")
            }

        } else {
            window.alert("Ship coordinates are invalid. Please re-enter coordinates.");
        }
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
function createPositionArr(arr) {
    let arr2D = new Array(T_HEIGHT);
    for (let i = 1; i < T_HEIGHT; i++) {
        arr2D[i] = new Array(T_WIDTH);
        for (let j = 1; j < T_WIDTH; j++) {

            //Position 5 unit ship 
            if (((i >= arr[0].location[1] && i <= arr[0].location[3]) || (i <= arr[0].location[1] && i >= arr[0].location[3])) &&
                ((j >= arr[0].location[0] && j <= arr[0].location[2]) || (j <= arr[0].location[0] && j >= arr[0].location[2]))) {
                arr2D[i][j] = 1;
            }

            //Position first 4 unit ship 
            else if (((i >= arr[1].location[1] && i <= arr[1].location[3]) || (i <= arr[1].location[1] && i >= arr[1].location[3])) &&
                ((j >= arr[1].location[0] && j <= arr[1].location[2]) || (j <= arr[1].location[0] && j >= arr[1].location[2]))) {
                arr2D[i][j] = 1;
            }

            //Position second 4 unit ship
            else if (((i >= arr[2].location[1] && i <= arr[2].location[3]) || (i <= arr[2].location[1] && i >= arr[2].location[3])) &&
                ((j >= arr[2].location[0] && j <= arr[2].location[2]) || (j <= arr[2].location[0] && j >= arr[2].location[2]))) {
                arr2D[i][j] = 1;
            }

            //Position first 3 unit ship
            else if (((i >= arr[3].location[1] && i <= arr[3].location[3]) || (i <= arr[3].location[1] && i >= arr[3].location[3])) &&
                ((j >= arr[3].location[0] && j <= arr[3].location[2]) || (j <= arr[3].location[0] && j >= arr[3].location[2]))) {
                arr2D[i][j] = 1;
            }
            //Position second 3 unit ship
            else if (((i >= arr[4].location[1] && i <= arr[4].location[3]) || (i <= arr[4].location[1] && i >= arr[4].location[3])) &&
                ((j >= arr[4].location[0] && j <= arr[4].location[2]) || (j <= arr[4].location[0] && j >= arr[4].location[2]))) {
                arr2D[i][j] = 1;
            } else {
                arr2D[i][j] = 0;
            }
        }
    }
    return arr2D;
}

//Hide startup info
function hideStartup() {
    let toHide = document.getElementsByClassName("setup");

    //Hide all setup stuff
    for (i = 0; i < toHide.length; i++) {
        toHide[i].style.display = "none";
    }
}

//Check for overlap
function overlap() {
    let overlapping = false;

    //Arrays to compare overlaps
    let overlap5 = [ship4A, ship4B, ship3A, ship3B];
    let overlap4A = [ship4B, ship3A, ship3B];
    let overlap4B = [ship3A, ship3B];
    let overlap3A = [ship3B];

    if (compareCoor(ship5, overlap5) || compareCoor(ship4A, overlap4A) ||
        compareCoor(ship4B, overlap4B) || compareCoor(ship3A, overlap3A)) {
        overlapping = true;
    }

    return overlapping;
}

//Determines if a ship is vertical
function isVertical(aShip) {
    let vertical = false;
    if (aShip.location[0] == aShip.location[2]) {
        vertical = true;
    }
    return vertical;
}

//Generates an array of coordinate pairs of the ships location
//Used to compare for overlap
function generateCoordinatePairs(aShip) {
    let coorArr = [];
    let xArr = [];
    let yArr = [];
    if (isVertical(aShip)) {
        //Generate arrays of coordinate strings
        for (let i = 0; i < aShip.size; i++) {
            xArr.push("" + aShip.location[0]);
        }
        for (let i = Math.min(aShip.location[1], aShip.location[3]); i <= Math.max(aShip.location[1], aShip.location[3]); i++) {
            yArr.push("" + i);
        }

        //Combine arrays into array of coordinate pairs
        for (let i = 0; i < aShip.size; i++) {
            coorArr[i] = xArr[i] + yArr[i];
        }
        //Horizontal ship
    } else {
        for (let i = 0; i < aShip.size; i++) {
            yArr.push("" + aShip.location[1]);
        }
        for (let i = Math.min(aShip.location[0], aShip.location[2]); i <= Math.max(aShip.location[0], aShip.location[2]); i++) {
            xArr.push("" + i);
        }

        //Combine arrays into array of coordinate pairs
        for (let i = 0; i < aShip.size; i++) {
            coorArr[i] = xArr[i] + yArr[i];
        }
    }
    return coorArr;
}

//Compares a ship to an array of ships and checks for overlap
function compareCoor(aShip, shipArr) {
    let overlapping = false;
    for (let i = 0; i < shipArr.length; i++) {
        let arr1 = generateCoordinatePairs(aShip);
        let arr2 = generateCoordinatePairs(shipArr[i]);
        //compare coordinates and see if any match
        //If matching coordinates there is overlap
        arr1.forEach(function (curr) {
            //If there is a match
            if (!(arr2.indexOf(curr) == -1)) {
                overlapping = true;
            }
        });
    }
    return overlapping;
}

//Generate random ship object of specified size and active ships index
function randomShipGenerator(size, index) {
    //Location coordinate array. [startX, startY, endX, endY]
    let locArr = [0, 0, 0, 0];
    //Determine if ship is vertical or horizontal, 0 for vertical, 1 for horizontal
    let orientation = Math.floor((Math.random() * 2));

    //If vertical
    if (orientation == 0) {
        //Generate random column, x coordinate from 1 to 11
        let x = Math.floor((Math.random() * (T_WIDTH - 1)) + 1);
        locArr[0] = x;
        locArr[2] = x;
        //Generate random start point for y coordinate, from 1 to 9
        let startY = Math.floor((Math.random() * (T_HEIGHT - 1)) + 1);
        locArr[1] = startY;
        //Calculate end point for y coordinate
        let endY = startY + (size - 1);
        //if out of bounds
        if (endY >= T_HEIGHT) {
            endY = startY - (size - 1);
        }
        locArr[3] = endY;
        //If horizontal
    } else {
        //Generate random row, y coordinate from 1 to 9
        let y = Math.floor((Math.random() * (T_HEIGHT - 1)) + 1);
        locArr[1] = y;
        locArr[3] = y;
        //Generate random start point for x coordinate, from 1 to 11
        let startX = Math.floor((Math.random() * (T_WIDTH - 1)) + 1);
        locArr[0] = startX;
        //Calculate end point for x coordinate
        let endX = startX + (size - 1);
        //if out of bounds
        if (endX >= T_WIDTH) {
            endX = startX - (size - 1);
        }
        locArr[2] = endX;
    }
    //Create Ship with Location array of start and end coordinates, [Start X, Start Y, End X, End Y]
    return new Ship(size, locArr, index);
}

//Generate all computer opponent ships
function loadOpponentShips() {
    //comparison array
    let compArr = [];
    //Generate 3 unit ship
    compShip3A = randomShipGenerator(SIZE3, 3);
    compArr.push(compShip3A);
    //Generate 3 unit ship
    compShip3B = randomShipGenerator(SIZE3, 4);
    //Generate new ship until not overlapping
    while (compareCoor(compShip3B, compArr)) {
        compShip3B = randomShipGenerator(SIZE3, 4);
    }
    compArr.push(compShip3B);
    //Generate 4 unit ship
    compShip4A = randomShipGenerator(SIZE4, 1);
    //Generate new ship until not overlapping
    while (compareCoor(compShip4A, compArr)) {
        compShip4A = randomShipGenerator(SIZE4, 1);
    }
    compArr.push(compShip4A);
    //Generate 4 unit ship
    compShip4B = randomShipGenerator(SIZE4, 2);
    //Generate new ship until not overlapping
    while (compareCoor(compShip4B, compArr)) {
        compShip4B = randomShipGenerator(SIZE4, 2);
    }
    compArr.push(compShip4B);
    //Generate 5 unit ship
    compShip5 = randomShipGenerator(SIZE5, 0);
    //Generate new ship until not overlapping
    while (compareCoor(compShip5, compArr)) {
        compShip5 = randomShipGenerator(SIZE5, 0);
    }
    compArr.push(compShip5);
    return compArr;
}

//Displays the firing input elements
function showPlay() {
    let input = document.getElementsByClassName("guess");
    for (i = 0; i < input.length; i++) {
        input[i].style.display = "block";
    }
    let sunk = document.getElementsByClassName("sunk");
    sunk[0].style.display = "block";
    sunk[1].style.display = "block";
}

//Starts the game
function userFire() {
    hit(computerArr);
}

//Gets the targeted coordinates
function getTarget() {
    //Gets the value of the target input
    let targetValue = targetIn.value;
    //Validates the user input
    if (targetValue.length == 2) {
        let targetX = getXCoor(targetValue, 0);
        let targetY = getYCoor(targetValue, 1);
        if (targetX >= 1 && targetX <= 11 && targetY >= 1 && targetY <= 9) {
            let targetCoor = [targetX, targetY];
            //Returns the input coordinate
            return targetCoor;
        } else {
            window.alert("Invalid input. Please re-enter coordinate.");
            return [0, 0];
        }
    } else {
        window.alert("Invalid input. Please re-enter coordinate.");
        return [0, 0];
    }

}

//Indicates if a targeted coordinate is a hit or a miss
function hit(arr) {
    let hitLocation = getTarget();
    if (hitLocation[0] != 0) {
        let cellId = document.getElementById("" + 0 + hitLocation[0] + hitLocation[1]);
        //Cell turns red if ship is hit
        if (arr[hitLocation[1]][hitLocation[0]] == 1) {

            arr[hitLocation[1]][hitLocation[0]] = 0;

            //Check if any computer ships were sunk, if sunk ship is removed from active list
            //and computer sunk ship count is incremented
            checkCompSunk();
            cellId.style.backgroundColor = "red";
            window.alert("Hit!");
            //Update sunk counter
            sunkComp.innerHTML = "Enemy ships sunk: " + compShipsSunk;

        } else {
            //Cell turns blue or remains red or blue if ship is missed
            if (cellId.style.backgroundColor == "red" || cellId.style.backgroundColor == "blue") {
                window.alert("Miss. You have already targeted this coordinate!");
            } else {
                cellId.style.backgroundColor = "blue";
                window.alert("Miss!");
            }
        }
        //Checks if game is over
        if (!gameOver()) {
            //Computer opponent returns fire
            compHit(userArr);
        }


    }
}

//Generates random target coordinates for computer opponent
function rndCoor() {
    let rndX = Math.floor((Math.random() * (T_WIDTH - 1)) + 1);
    let rndY = Math.floor((Math.random() * (T_HEIGHT - 1)) + 1);

    let rndArr = [rndX, rndY];
    return rndArr;
}

//Indicates if a targeted coordinate is a hit or a miss for the users board
function compHit(arr) {
    let hitLocation = rndCoor();
    let cellId = document.getElementById("" + hitLocation[0] + hitLocation[1]);
    //Cell turns red if user ship is hit
    if (arr[hitLocation[1]][hitLocation[0]] == 1) {
        arr[hitLocation[1]][hitLocation[0]] = 0;
        //Check if any user ships were sunk, if sunk ship is removed from active list
        //and user sunk ship count is incremented
        checkUserSunk();
        cellId.style.backgroundColor = "red";
        window.alert("Your opponent got a hit. Your turn!");
        //Update sunk counter
        sunkUser.innerHTML = "Player ships sunk: " + userShipsSunk;
        //Checks if game is over
        gameOver();
    } else {
        //Cell turns blue or remains red if user ship is missed
        if (cellId.style.backgroundColor == "red") {
            window.alert("Your opponent missed. Your turn!");
        } else {
            cellId.style.backgroundColor = "blue";
            window.alert("Your opponent missed. Your turn!");
        }
    }
}

//Checks if ship is sunk, returns true if sunk
function isSunk(aShip, arr) {
    sunk = true;
    let coorArr = [];
    let xArr = [];
    let yArr = [];
    if (isVertical(aShip)) {
        let x = aShip.location[0];
        //Generate arrays of y coordinates
        for (let i = Math.min(aShip.location[1], aShip.location[3]); i <= Math.max(aShip.location[1], aShip.location[3]); i++) {
            yArr.push(i);
        }
        //check for if boat has remaning lives (1s)
        for (let j = 0; j < yArr.length; j++) {
            if (arr[yArr[j]][x] == 1) {
                sunk = false;
                break;
            }
        }
        //Horizontal ship
    } else {
        let y = aShip.location[1];
        //Generate arrays of x coordinates
        for (let i = Math.min(aShip.location[0], aShip.location[2]); i <= Math.max(aShip.location[0], aShip.location[2]); i++) {
            xArr.push(i);
        }
        //check for if boat has remaning lives (1s)
        for (let j = 0; j < xArr.length; j++) {
            if (arr[y][xArr[j]] == 1) {
                sunk = false;
                break;
            }
        }
    }
    return sunk;
}

//Determines if the game is over, either user or computer sunk 5 ships
function gameOver() {
    let over = false;
    if (compShipsSunk == 5) {
        //User wins
        over = true;
        window.alert("GAME OVER. YOU WIN!");
        location.replace("landingPage.html");
        addGame(0); // Call the add Game function if wins.
    } else if (userShipsSunk == 5) {
        //User loses
        over = true;
        window.alert("GAME OVER. YOU LOSE!");
        location.replace("landingPage.html");
        addGame(1); // Call the add Game function if losses.
    }
    return over;
}

//Checks if any user ships are sunk, if sunk deletes from active ships 
function checkUserSunk() {
    activeUserShips.forEach(function (curr) {
        //If ship is sunk delete from active ships
        if (curr != undefined && isSunk(curr, userArr)) {
            delete activeUserShips[curr.index];
            //play explosion
            sunkSFX.play();
            userShipsSunk++;
        }
    });
}

//Checks if any computer opponent ships are sunk, if sunk deletes from active ships 
function checkCompSunk() {
    activeCompShips.forEach(function (curr) {
        //If ship is sunk delete from active ships
        if (curr != undefined && isSunk(curr, computerArr)) {
            delete activeCompShips[curr.index];
            //play explosion
            sunkSFX.play();
            compShipsSunk++;
        }
    });
}

//Executes relative functions when the buttons are clicked 
fireBtn.onclick = userFire;
placeBtn.onclick = setBoard;

//-----------------------------------------------------------
// Database Functions. (NOT WORKING)
//-----------------------------------------------------------

function addGame(outcome) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // Get the currently signed in users UID
            let id = user.uid;

            // Create reference for database.
            let db = firebase.firestore();

            // Create reference for Users collection.
            let ref = db.collection('Users');

            // Get user data.
            ref.doc(id).get().then(function (doc) {

                let wins = doc.data().wins; // Assign the users current wins
                let losses = doc.data().losses; // Assign the users current losses

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
                if (outcome == 0) {
                    wins++; // Increment wins
                } else {
                    losses++; // Increment losses
                }

                // Update the users wins, loses, and last time played.
                ref.doc(id).update({
                    'LastTimePlayed': game.timestamp,
                    'wins': wins, 
                    'losses': losses 
                }).then(function () {
                    console.log('Game Complete!'); // Feedback.

                    // log an error in the console.
                }).catch(function (error) {
                    console.error('Error creating game: ', error);
                });
            })
        } else {
            // If no user is signed in.
            console.log('no user');
        }
    })
}