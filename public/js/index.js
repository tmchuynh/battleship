// set grid rows and columns and the size of each square
var rows = 10;
var cols = 10;
var squareSize = 50;
var hitCount = 0;
var gameBoard;

// create the 2d array that will contain the status of each square on the board
// and place ships on the board (later, create function for random placement!)
// 0 = empty, 1 = part of a ship, 2 = a sunken part of a ship, 3 = a missed shot

// get the container element
var gameBoardContainer = document.getElementById("gameboard");

// make the grid columns and rows
function createBoard() {
  // Create and add column labels (letters)
  for (var i = 0; i < cols; i++) {
    var columnLabel = document.createElement("div");
    columnLabel.style.width = squareSize + "px";
    columnLabel.style.height = squareSize + "px";
    columnLabel.style.top = "0";
    columnLabel.style.left = (i + 1) * squareSize + "px";
    columnLabel.style.textAlign = "center";
    columnLabel.style.lineHeight = squareSize + "px";
    columnLabel.innerText = String.fromCharCode(65 + i); // Convert 0-9 to A-J
    gameBoardContainer.appendChild(columnLabel);
  }

  // Create and add row labels (numbers)
  for (var j = 0; j < rows; j++) {
    var rowLabel = document.createElement("div");
    rowLabel.style.position = "absolute";
    rowLabel.style.top = (j + 1) * squareSize + "px"; // Offset to match the left column position
    rowLabel.style.left = "0";
    rowLabel.style.width = squareSize + "px";
    rowLabel.style.height = squareSize + "px";
    rowLabel.style.textAlign = "center";
    rowLabel.style.verticalAlign = "middle";
    rowLabel.style.lineHeight = squareSize + "px";
    rowLabel.innerText = j + 1; // Convert 0-9 to 1-10
    gameBoardContainer.appendChild(rowLabel);
  }

  // Create the grid squares
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      // create a new div HTML element for each grid square and make it the right size
      var square = document.createElement("div");
      gameBoardContainer.appendChild(square);

      // give each div element a unique id based on its row and column, like "s00"
      square.id = "s" + j + i;

      // set each grid square's coordinates: multiples of the current row or column number
      var topPosition = (j + 1) * squareSize; // Offset by one square for labels
      var leftPosition = (i + 1) * squareSize; // Offset by one square for labels

      // use CSS absolute positioning to place each grid square on the page
      square.style.position = "absolute";
      square.style.top = topPosition + "px";
      square.style.left = leftPosition + "px";
      square.style.width = squareSize + "px";
      square.style.height = squareSize + "px";
      square.style.border = "1px solid #000"; // Add border to squares
    }
  }
}

// there are 17 hits to be made in order to win the game:
//    Carrier     - 5 hits
//    Battleship  - 4 hits
//    Destroyer   - 3 hits
//    Submarine   - 3 hits
//    Patrol Boat - 2 hits

function randomizeBoard() {
  gameBoard = Array.from({ length: rows }, () => Array(cols).fill(0));

  var ships = [
    { size: 5, name: "Carrier" },
    { size: 4, name: "Battleship" },
    { size: 3, name: "Destroyer" },
    { size: 3, name: "Submarine" },
    { size: 2, name: "Patrol Boat" }
  ];

  ships.forEach((ship) => {
    placeShip(ship.size);
  });
}

function placeShip(size) {
  var placed = false;

  while (!placed) {
    var isHorizontal = Math.random() >= 0.5;
    var startRow = Math.floor(
      Math.random() * (isHorizontal ? rows : rows - size)
    );
    var startCol = Math.floor(
      Math.random() * (isHorizontal ? cols - size : cols)
    );

    if (canPlaceShip(startRow, startCol, size, isHorizontal)) {
      for (var i = 0; i < size; i++) {
        if (isHorizontal) {
          gameBoard[startRow][startCol + i] = 1;
        } else {
          gameBoard[startRow + i][startCol] = 1;
        }
      }
      placed = true;
    }
  }
}

function canPlaceShip(row, col, size, isHorizontal) {
  for (var i = 0; i < size; i++) {
    if (isHorizontal) {
      if (gameBoard[row][col + i] === 1) {
        return false;
      }
    } else {
      if (gameBoard[row + i][col] === 1) {
        return false;
      }
    }
  }
  return true;
}

// set event listener for all elements in gameboard, run fireTorpedo function when square is clicked
gameBoardContainer.addEventListener("click", fireTorpedo, false);

function fireTorpedo(e) {
  if (e.target !== e.currentTarget) {
    // extract row and column # from the HTML element's id
    var row = e.target.id.substring(1, 2);
    var col = e.target.id.substring(2, 3);

    // if player clicks a square with no ship, change the color and change square's value
    if (gameBoard[row][col] == 0) {
      e.target.innerHTML =
        '<svg fill="#ff0000" width="800px" height="800px" viewBox="0 0 200 200" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" stroke="#ff0000">' +
        '<g id="SVGRepo_bgCarrier" stroke-width="0"></g>' +
        '<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>' +
        '<g id="SVGRepo_iconCarrier">' +
        "<title></title>" +
        '<path d="M114,100l49-49a9.9,9.9,0,0,0-14-14L100,86,51,37A9.9,9.9,0,0,0,37,51l49,49L37,149a9.9,9.9,0,0,0,14,14l49-49,49,49a9.9,9.9,0,0,0,14-14Z"/>' +
        "</g>" +
        "</svg>";

      // set this square's value to 3 to indicate that they fired and missed
      gameBoard[row][col] = 3;

      // if player clicks a square with a ship, change the color and change square's value
    } else if (gameBoard[row][col] == 1) {
      e.target.style.background = "lightgray"; // Color to indicate ship presence
      e.target.innerHTML =
        '<svg fill="#0000FF" width="50px" height="50px" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
        "<title>boat-solid</title>" +
        '<path d="M34,31c-1.1-0.1-2.1-0.5-3-1.2c-0.5-0.5-1.2-0.8-2-0.8c-0.7,0-1.5,0.3-2,0.8c-0.9,0.8-2,1.1-3.1,1.1c-1.2,0-2.4-0.4-3.3-1.1c-1.2-1.1-3-1.1-4.1,0c-0.9,0.8-2.1,1.2-3.4,1.2c-1.2,0-2.3-0.4-3.2-1.2c-0.6-0.5-1.3-0.8-2-0.8c-0.8,0-1.7,0.3-2.3,0.8c-1,0.8-2.3,1.2-3.5,1.1V29c0.8,0,1.7-0.3,2.3-0.9c1-0.8,2.2-1.2,3.4-1.1c1.2,0,2.4,0.4,3.3,1.2c1.2,1.1,3,1.1,4.2,0c1.9-1.6,4.7-1.6,6.5,0c1.2,1.1,3,1.1,4.1,0c0.9-0.8,2.1-1.2,3.3-1.2c1.1,0,2.2,0.4,3,1.2C32.8,28.7,33,29,34,29L34,31z" class="clr-i-solid clr-i-solid-path-1"></path>' +
        '<path d="M4.1,26.2c0.6-0.5,1.2-0.8,1.9-1V23c0-0.6,0.4-1.1,1-1.1h25L28.4,25h0.2c0.8,0,1.6,0.2,2.2,0.5l2.5-2.2l0.2-0.2c0.7-0.9,0.5-2.1-0.4-2.8C32.9,20.1,32.4,20,32,20H7c-1.7,0-3,1.3-3,3L4.1,26.2L4.1,26.2z" class="clr-i-solid clr-i-solid-path-2"></path>' +
        '<path d="M14.9,18.9H8.9c-1.1,0-2-0.9-2-2c0-0.4,0.1-0.8,0.4-1.2l4.1-5.8c0.6-0.9,1.9-1.1,2.8-0.5c0.5,0.4,0.8,1,0.8,1.6V18.9z" class="clr-i-solid clr-i-solid-path-3"></path>' +
        '<path d="M24.3,18.9H16V6.4c0-1.1,0.9-2,2-2c0.7,0,1.3,0.4,1.7,1L26,15.8c0.6,1,0.2,2.2-0.7,2.7C25,18.7,24.6,18.8,24.3,18.9L24.3,18.9z" class="clr-i-solid clr-i-solid-path-4"></path>' +
        '<rect x="0" y="0" width="36" height="36" fill-opacity="0"/>' +
        "</svg>";
      // set this square's value to 2 to indicate the ship has been hit
      gameBoard[row][col] = 2;

      // increment hitCount each time a ship is hit
      hitCount++;
      // this definitely shouldn't be hard-coded, but here it is anyway. lazy, simple solution:
      if (hitCount == 17) {
        alert("All enemy battleships have been defeated! You win!");
      }

      // if player clicks a square that's been previously hit, let them know
    } else if (gameBoard[row][col] > 1) {
      alert("Stop wasting your torpedos! You already fired at this location.");
    }
  }
  e.stopPropagation();
}

// reset game board
function resetGame() {
  hitCount = 0;
  gameBoardContainer.innerHTML = ""; // clear previous board

  var squares = document.querySelectorAll("#gameboard div");
  squares.forEach((square) => {
    square.innerHTML = "";
  });
  
  randomizeBoard();
  createBoard();
}

function revealShips() {
  var squares = document.querySelectorAll("#gameboard div");

  squares.forEach(function (square) {
    var id = square.id;

    if (id) {
      var row = parseInt(id.substring(1, 2), 10);
      var col = parseInt(id.substring(2, 3), 10);

      // Ensure the indices are within the valid range
      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        if (gameBoard[row] && gameBoard[row][col] !== undefined) {
          if (gameBoard[row][col] == 1) {
            square.style.background = "lightgray"; // Color to indicate ship presence
            square.innerHTML =
              '<svg fill="#0000FF" width="50px" height="50px" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
              "<title>boat-solid</title>" +
              '<path d="M34,31c-1.1-0.1-2.1-0.5-3-1.2c-0.5-0.5-1.2-0.8-2-0.8c-0.7,0-1.5,0.3-2,0.8c-0.9,0.8-2,1.1-3.1,1.1c-1.2,0-2.4-0.4-3.3-1.1c-1.2-1.1-3-1.1-4.1,0c-0.9,0.8-2.1,1.2-3.4,1.2c-1.2,0-2.3-0.4-3.2-1.2c-0.6-0.5-1.3-0.8-2-0.8c-0.8,0-1.7,0.3-2.3,0.8c-1,0.8-2.3,1.2-3.5,1.1V29c0.8,0,1.7-0.3,2.3-0.9c1-0.8,2.2-1.2,3.4-1.1c1.2,0,2.4,0.4,3.3,1.2c1.2,1.1,3,1.1,4.2,0c1.9-1.6,4.7-1.6,6.5,0c1.2,1.1,3,1.1,4.1,0c0.9-0.8,2.1-1.2,3.3-1.2c1.1,0,2.2,0.4,3,1.2C32.8,28.7,33,29,34,29L34,31z" class="clr-i-solid clr-i-solid-path-1"></path>' +
              '<path d="M4.1,26.2c0.6-0.5,1.2-0.8,1.9-1V23c0-0.6,0.4-1.1,1-1.1h25L28.4,25h0.2c0.8,0,1.6,0.2,2.2,0.5l2.5-2.2l0.2-0.2c0.7-0.9,0.5-2.1-0.4-2.8C32.9,20.1,32.4,20,32,20H7c-1.7,0-3,1.3-3,3L4.1,26.2L4.1,26.2z" class="clr-i-solid clr-i-solid-path-2"></path>' +
              '<path d="M14.9,18.9H8.9c-1.1,0-2-0.9-2-2c0-0.4,0.1-0.8,0.4-1.2l4.1-5.8c0.6-0.9,1.9-1.1,2.8-0.5c0.5,0.4,0.8,1,0.8,1.6V18.9z" class="clr-i-solid clr-i-solid-path-3"></path>' +
              '<path d="M24.3,18.9H16V6.4c0-1.1,0.9-2,2-2c0.7,0,1.3,0.4,1.7,1L26,15.8c0.6,1,0.2,2.2-0.7,2.7C25,18.7,24.6,18.8,24.3,18.9L24.3,18.9z" class="clr-i-solid clr-i-solid-path-4"></path>' +
              '<rect x="0" y="0" width="36" height="36" fill-opacity="0"/>' +
              "</svg>";
          } else if (gameBoard[row][col] == 3) {
            // Optionally, mark missed shots
            square.style.background = "#f00"; // Example style for missed shots
          }
        }
      }
    }
  });
}

// Add event listener to reveal button
document.getElementById("revealButton").addEventListener("click", revealShips);

// add event listener to reset button
document.getElementById("resetButton").addEventListener("click", resetGame);

// initialize game board
resetGame();
