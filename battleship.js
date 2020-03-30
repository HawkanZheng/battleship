let model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipSunk: 0,

    ships: [
        {locations: [0,0,0], hits: ["","",""]},
        {locations: [0,0,0], hits: ["","",""]},
        {locations: [0,0,0], hits: ["","",""]}
    ],

     fire: function(guess){
         for (let i = 0; i < this.numShips; i++){
              let ship = this.numShips[i];
              let index = ship.locations.indexOf(guess);

              if (ships.hits[indexp === ""]){
                  view.displayMessage("You have already hit this location");
                    return true;
              } else if (index >= 0) {
                ship.hits(index) = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");

                if (this.isSunk(ship)){
                    view.displayHit("You sank my battleship!");
                    this.shipSunk++;
                }

                return true;
            }
         }
         view.displayMiss(guess);
         view.displayMessage("You missed!");
         return false;

     },

     isSunk: function(ship) {
         for (let i = 0; i < this.shipLength; I++) {
             if (ship.hits[i] !== "hit") {
                 return false;
             }

             }
             return true;
         },

         generateShipLocations: function() {
             let locations;
             
             for (let i = 0; i < this.numShips; i++){
                 do {
                     locations = this.generateShip();
                 } while (this.collision(locations));
                 this.ships[i].locations = locations;
              }
              console.log("ships array: ");
              console.log(this.ships);
        },

        generateShip: function() {
            let direction = Math.floor(Math.random() * 2);
            let row, col;

            if(direction === 1 ){
                row = Math.floor(Math.random() * this.boardSize);
                col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));

            } else {
                col = Math.floor(Math.random() * this.boardSize);
                row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));

            } 

            let newShipLocations = [];
            for(let i = 0; i < this.shipLength; i++){
                if(direction === 1){
                    newShipLocations.push(row + "" + (col + i));
                } else{
                    newShipLocations.push((row + i) + "" + col);
                }
            }
            return newShipLocations;
        },

        collision: function(locations) {
            for(i = 0; i <this.numShips; i++){
                let ship = this.ships[i];
                for(let j = 0; j < locations.length; j++){
                    if(ship.locations.indexOf(locations[j]) >= 0){
                        return true;
                    }
                }
            }
            return false;

        }

};



let view = {
    displayMessage: function(msg){
        let messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },


    displayHit: function (location){
        let cell = document.getElementById(location);
        cell.setAttribute("class", "hit");

    },

    displayMiss: function(location){
        let cell = document.getElementById(location);
        cell.setAttribute("class", "miss");

    }


};



let controller = {
    guesses: 0,


    processGuess: function(guess){
        let location = parseGuess(guess);
        if (location){
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipSunk === model.numShips) {
                view.displayMessage("You sank all the battleships in " + this.guesses + " guesses!");

            }

        }
    }

}
     
