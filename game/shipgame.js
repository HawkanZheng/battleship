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
        //check if any ships are overlapped
        if (!overlap()) {

            //Array of ships
            let ships = [ship5, ship4A, ship4B, ship3A, ship3B];

            //Generate 2D array representing user ship placement
            //Generate grid with ships placed
            userArr = createPositionArr(ships)
            gridCreate(userArr, 0);

            //Generate 2D array representing computer opponent ship placement
            //Generate computer opponent grid
            computerArr = createPositionArr(loadOpponentShips());
            console.log(computerArr);
            gridCreate(computerArr, 1);

            //Hide startup stuff
            hideStartup();
            showPlay();
        } else {
            window.alert("One or more ships are overlapping. Please re-enter coordinates.")
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

//Generate random ship object of specified size
function randomShipGenerator(size) {
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
    return new Ship(size, locArr);
}

//Generate all computer opponent ships
function loadOpponentShips() {
    //comparison array
    let compArr = [];
    //Generate 3 unit ship
    compShip3A = randomShipGenerator(SIZE3);
    compArr.push(compShip3A);
    //Generate 3 unit ship
    compShip3B = randomShipGenerator(SIZE3);
    //Generate new ship until not overlapping
    while (compareCoor(compShip3B, compArr)) {
        compShip3B = randomShipGenerator(SIZE3);
    }
    compArr.push(compShip3B);
    //Generate 4 unit ship
    compShip4A = randomShipGenerator(SIZE4);
    //Generate new ship until not overlapping
    while (compareCoor(compShip4A, compArr)) {
        compShip4A = randomShipGenerator(SIZE3);
    }
    compArr.push(compShip4A);
    //Generate 4 unit ship
    compShip4B = randomShipGenerator(SIZE4);
    //Generate new ship until not overlapping
    while (compareCoor(compShip4B, compArr)) {
        compShip4B = randomShipGenerator(SIZE4);
    }
    compArr.push(compShip4B);
    //Generate 5 unit ship
    let compShip5 = randomShipGenerator(SIZE5);
    //Generate new ship until not overlapping
    while (compareCoor(compShip5, compArr)) {
        compShip5 = randomShipGenerator(SIZE5);
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
}

//Starts the game
function userFire() {
    // if (turn) {
    hit(computerArr);
    //turn = false;
    //} else {
    //window.alert("Your opponent is playing, please wait for your turn!")
    // }
}

//Gets the targeted coordinates
function getTarget() {
    let targetValue = targetIn.value;
    if (targetValue.length == 2) {
        let targetX = getXCoor(targetValue, 0);
        let targetY = getYCoor(targetValue, 1);
        if (targetX >= 1 && targetX <= 11 && targetY >= 1 && targetY <= 9) {
            let targetCoor = [targetX, targetY];
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

        if (arr[hitLocation[1]][hitLocation[0]] == 1) {

            arr[hitLocation[1]][hitLocation[0]] = 0;
            cellId.style.backgroundColor = "red";
            window.alert("Hit!");
        } else {
            if (cellId.style.backgroundColor == "red") {
                window.alert("Miss!");
            } else {
                cellId.style.backgroundColor = "blue";
                window.alert("Miss!");
            }
        }
    }
}

fireBtn.onclick = userFire;
placeBtn.onclick = setBoard;