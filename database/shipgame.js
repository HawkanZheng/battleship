//Table height and width
const T_HEIGHT = 10;
const T_WIDTH = 12;

//Number to needed to conver char to corresponding int
const OFFSET = 64;
//Battle ship placement input text and button
let placeText1 = document.getElementById("setup1");
let placeText2 = document.getElementById("setup2");
let placeText3 = document.getElementById("setup3");
let placeText4 = document.getElementById("setup4");
let placeText5 = document.getElementById("setup5");
let placeBtn = document.getElementById("place");

//Array of string values for the columns
let colArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

//Battle ship coordinates
let coorArr = [];

//2D Array for user coordinates
var userArr = new Array(T_HEIGHT);

//Generate initial 11x9 Grid
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
                if(i > 0 && j > 0 && userArr[i][j] == 1){
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

//Setup board with ships in place
function setBoard() {
    //coorArr = [];
    //Get input string
    let coor = placeText1.value + placeText2.value + placeText3.value +
        placeText4.value + placeText5.value;

    //Ship 1
    getXCoor(coor, 0);
    getYCoor(coor, 1);
    getXCoor(coor, 3);
    getYCoor(coor, 4);
    //Ship 2
    getXCoor(coor, 5);
    getYCoor(coor, 6);
    getXCoor(coor, 8);
    getYCoor(coor, 9);
    //Ship 3
    getXCoor(coor, 10);
    getYCoor(coor, 11);
    getXCoor(coor, 13);
    getYCoor(coor, 14);
    //Ship 4
    getXCoor(coor, 15);
    getYCoor(coor, 16);
    getXCoor(coor, 18);
    getYCoor(coor, 19);
    //Ship 5
    getXCoor(coor, 20);
    getYCoor(coor, 21);
    getXCoor(coor, 23);
    getYCoor(coor, 24);
    
    //Generate 2D array representing ship placement
    createPostitionArr();

    //Generate grid with ships placed
    gridCreate();

    //Hide startup stuff
    hideStartup();
}

//Get x coordinate from input
function getXCoor(str, index) {
    //Start point x cooridinate
    let startX = str[index];
    //Invalid input of first char
    if (colArr.indexOf(startX) == -1) {
        window.alert("Invalid input.");
        return;
    } else {
        coorArr.push(startX.charCodeAt(0) - OFFSET);
    }
}

//Get y coordinate from input
function getYCoor(str, index) {
    //Start point y cooridinate
    let startY = parseInt(str[index]);
    if (startY < 1 || startY > 9) {
        window.alert("Invalid input.");
        return;
    } else {
        coorArr.push(startY);
    }
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
            } 

            else {
                userArr[i][j] = 0;
            }
        }
    }
}

//Hide startup info
function hideStartup() {
    placeBtn.style.display = "none";
    placeText1.style.display = "none";
    placeText2.style.display = "none";
    placeText3.style.display = "none";
    placeText4.style.display = "none";
    placeText5.style.display = "none";

    //hide initial grid
    document.getElementById("grid").style.display = "none";

    //hide initial instructions
    document.getElementById("enterInstruct").style.display = "none";
}

placeBtn.onclick = setBoard;

// Database reference "db"

//------------------------------------------------------
// Passing the 2-D Array 
//------------------------------------------------------



//------------------------------------------------------
// Send Whether the ship is 'HIT' / 'MISSED'
//------------------------------------------------------ 



//------------------------------------------------------
// Send 'NEXT TURN' 
//------------------------------------------------------ 



//------------------------------------------------------
// Send 'SUNK SHIP'
//------------------------------------------------------ 
