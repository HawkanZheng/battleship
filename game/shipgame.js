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

//Battle ship coordinates
let coorArr = [];

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
    //syntax: [start row, start column, end column, end row]
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
function createShip(coor, size){
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
    console.log(ship5.isCorrectSize());
    //Create 4 unit ships
    ship4A = createShip(coor4A, SIZE4);
    console.log(ship4A.isCorrectSize());
    ship4B = createShip(coor4B, SIZE4);
    console.log(ship4B.isCorrectSize());
    //Create 3 unit ships
    ship3A = createShip(coor3A, SIZE3);
    console.log(ship3A.isCorrectSize());
    ship3B = createShip(coor3B, SIZE3); 
    console.log(ship3B.isCorrectSize());

    //Check for valid ship sizes, if valid start game
    if(ship5.isCorrectSize() && ship4A.isCorrectSize() && ship4B.isCorrectSize() 
        && ship3A.isCorrectSize() && ship3B.isCorrectSize()){
            //Generate 2D array representing ship placement
            createPostitionArr();

            //Generate grid with ships placed
            gridCreate();

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
    //Invalid input of first char
    if (colArr.indexOf(startX) == -1) {
        window.alert("Invalid input. Please re-enter coordinates.");
        return;
    } else {
        coorArr.push(startX.charCodeAt(0) - OFFSET);
    }
    return (startX.charCodeAt(0) - OFFSET);
}

//Get y coordinate from input
function getYCoor(str, index) {
    //Start point y cooridinate
    let startY = parseInt(str[index]);
    if (startY < 1 || startY > 9) {
        window.alert("Invalid input. Please re-enter coordinates.");
        return;
    } else {
        coorArr.push(startY);
    }
    return startY;
}


//Generate of 2D array of 0s and 1s. 1 represents the battleship
function createPostitionArr() {
    for (let i = 1; i < T_HEIGHT; i++) {
        userArr[i] = new Array(T_WIDTH);
        for (let j = 1; j < T_WIDTH; j++) {

            //Position Ship 1
            if (((i >= coorArr[1] && i <= coorArr[3]) || (i <= coorArr[1] && i >= coorArr[3])) &&
                ((j >= coorArr[0] && j <= coorArr[2]) || (j <= coorArr[0] && j >= coorArr[2]))) {
                userArr[i][j] = 1;
            }

            //Position Ship 2
            else if (((i >= coorArr[5] && i <= coorArr[7]) || (i <= coorArr[5] && i >= coorArr[7])) &&
                ((j >= coorArr[4] && j <= coorArr[6]) || (j <= coorArr[4] && j >= coorArr[6]))) {
                userArr[i][j] = 1;
            }

            //Position Ship 3
            else if (((i >= coorArr[9] && i <= coorArr[11]) || (i <= coorArr[9] && i >= coorArr[11])) &&
                ((j >= coorArr[8] && j <= coorArr[10]) || (j <= coorArr[8] && j >= coorArr[10]))) {
                userArr[i][j] = 1;
            }

            //Position Ship 4
            else if (((i >= coorArr[13] && i <= coorArr[15]) || (i <= coorArr[13] && i >= coorArr[15])) &&
                ((j >= coorArr[12] && j <= coorArr[14]) || (j <= coorArr[12] && j >= coorArr[14]))) {
                userArr[i][j] = 1;
            }
            //Position Ship 5
            else if (((i >= coorArr[17] && i <= coorArr[19]) || (i <= coorArr[17] && i >= coorArr[19])) &&
                ((j >= coorArr[16] && j <= coorArr[18]) || (j <= coorArr[16] && j >= coorArr[18]))) {
                userArr[i][j] = 1;
            } else {
                userArr[i][j] = 0;
            }
        }
    }
}

//Hide startup info
function hideStartup() {
    placeBtn.style.display = "none";
    placeText5.style.display = "none";
    placeText4A.style.display = "none";
    placeText4B.style.display = "none";
    placeText3A.style.display = "none";
    placeText3B.style.display = "none";

    //hide initial grid
    document.getElementById("grid").style.display = "none";

    //hide initial instructions
    document.getElementById("enterInstruct").style.display = "none";
}

placeBtn.onclick = setBoard;


function Ship(size, location) {

    //Ship size, how many spaces it spans
    this.size = size;

    //Coordinates of the ship in the 2D array, an array with for ints
    //syntax: [start row, start column, end column, end row]
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