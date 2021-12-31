const tiles = document.querySelectorAll("*[id^='cell']");
const board = Array.from(tiles).map(function(cell) {
  return cell.id;
});
const tileCount = tiles.length;
const defaultTiles = Array.from({
  length: tileCount
}, (_, i) => i + 1).map(i => "tile" + i);
let defaultNumbering, randomNumbering;
const gridWidth = Math.sqrt(tileCount);
const buttons = document.querySelectorAll(".options button");
const numberOfButtons = buttons.length;
const element1 = element2 = {
  x: null,
  y: null,
};
let rightOrLeft = "";
let customBG = document.createElement("style");
customBG.type = "text/css";
document.getElementsByTagName("head")[0].appendChild(customBG);

for (let i = 0; i < tileCount; i++) {
  document.querySelectorAll(".puzzle div")[i].classList.add(defaultTiles[i]);
  tiles[i].addEventListener("click", function() {
    clickTile(this.id)
  }, false);
}

for (let i = 0; i < numberOfButtons; i++) {
  buttons[i].addEventListener("click", function() {
    document.getElementsByName(this.name)[0].focus();
    if (this.name == "New Game") {
      new_game();
    } else if (this.name == "Reset Board") {
      reset_game();
    } else {
      change_bg();
    }
    setTimeout(function() {
      document.activeElement.blur();
    }, 100);
  }, false);
}

function mySplit(array) {
  array = array.split(/(?=\d+)/);
  return array;
}

function transition(cell1, cell2, position) {
  cell1.classList.add("transition");
  cell2.classList.add("transition");
  element1.x = cell1.getBoundingClientRect().left - cell2.getBoundingClientRect().left;
  element1.y = cell2.getBoundingClientRect().top - cell1.getBoundingClientRect().top;
  element2.x = cell2.getBoundingClientRect().left - cell1.getBoundingClientRect().left;
  element2.y = cell1.getBoundingClientRect().top - cell2.getBoundingClientRect().top;
  if (position === "right" || position === "left") {
    rightOrLeft = "-";
  }
  cell1.style.transform = `translate(${element1.x}px, ${- element1.y}px)`;
  cell2.style.zIndex = "-1";
  cell2.style.transform = `translate(${rightOrLeft + element2.x}px, ${element2.y}px)`;
  cell1.style.zIndex = "1";
  setTimeout(() => {
    swapTiles(cell1, cell2);
    cell1.classList.remove("transition");
    cell2.classList.remove("transition");
    cell2.style.removeProperty("transform");
    cell2.style.removeProperty("z-index");
    cell1.style.removeProperty("transform");
    cell1.style.removeProperty("z-index");
    if (cell1.getAttribute("style") == "") {
      cell1.removeAttribute("style");
    }
    if (cell2.getAttribute("style") == "") {
      cell2.removeAttribute("style");
    }
  }, 100);
  rightOrLeft = "";
}

function swapTiles(cell1, cell2) {
  const temp = cell1.className;
  cell1.className = cell2.className;
  cell2.className = temp;
}

function new_game() {
  let currentIndex = tileCount - 1;
  for (let i = 0; i < tileCount; i++) {
    const row1 = (currentIndex % gridWidth) + 1;
    const column1 = Math.floor(currentIndex / gridWidth) + 1;
    const row2 = Math.floor(Math.random() * gridWidth + 1);
    const column2 = Math.floor(Math.random() * gridWidth + 1);
    const cell1ID = document.getElementById("cell" + row1 + column1);
    const cell2ID = document.getElementById("cell" + row2 + column2);
    if (cell1ID.style.hasOwnProperty("transform") || cell1ID.style.hasOwnProperty("z-index")) {
      cell1ID.style.removeProperty("transform");
      cell1ID.style.removeProperty("z-index");
      cell1ID.classList.remove("transition");
      if (cell1ID.getAttribute("style") == "") {
        cell1ID.removeAttribute("style");
      }
    } else if (cell2ID.style.hasOwnProperty("transform") || cell2ID.style.hasOwnProperty("z-index")) {
      cell2ID.style.removeProperty("transform");
      cell2ID.style.removeProperty("z-index");
      cell2ID.classList.remove("transition");
      if (cell2ID.getAttribute("style") == "") {
        cell2ID.removeAttribute("style");
      }
    }
    swapTiles(cell1ID, cell2ID);
    currentIndex--;
  }
  isSolvable();
}

function isSolvable() {
  defaultNumbering = defaultTiles.map(function(tile) {
    return parseInt(tile.replace("tile", ""));
  });
  randomNumbering = Array.from(document.querySelectorAll("*[class^='tile']")).map(function(tile) {
    return parseInt(tile.className.replace("tile", ""));
  });
  let inversions = 0;
  const rowOfEmptyTile = parseInt(mySplit(document.getElementsByClassName("tile16")[0].id)[1]);
  for (let i = 0; i <= randomNumbering.length; i++) {
    const numberOfTile = randomNumbering[i];
    const numbersAfterTile = randomNumbering.slice(i + 1);
    if (numbersAfterTile.some(value => value < numberOfTile) == true && numberOfTile !== defaultNumbering[15]) {
      numbersAfterTile.forEach((value) => (value < numberOfTile && inversions++));
    }
  }
  if (Math.abs(inversions % 2) == 1 && Math.abs(rowOfEmptyTile % 2) == 1) {
    //do nothing
  } else if (inversions % 2 == 0 && rowOfEmptyTile % 2 == 0) {
    //do nothing
  } else {
    new_game();
  }
}

function reset_game() {
  for (let i = 0; i < tileCount; i++) {
    const splitID = mySplit(board[i]);
    const row = parseInt(splitID[1]);
    const column = parseInt(splitID[2]);
    const currentClass = document.getElementById("cell" + row + column).className;
    document.getElementById("cell" + row + column).classList.replace(currentClass, defaultTiles[i]);
  }
}

function clickTile(clicked_id) {
  const splitID = mySplit(clicked_id);
  const row = parseInt(splitID[1]);
  const column = parseInt(splitID[2]);
  const currentCell = "cell" + row + column;
  const currentCellID = document.getElementById(currentCell);
  const tile = currentCell.className;
  const rightCellID = document.getElementById("cell" + row + (column + 1));
  const leftCellID = document.getElementById("cell" + row + (column - 1));
  const aboveCellID = document.getElementById("cell" + (row - 1) + column);
  const belowCellID = document.getElementById("cell" + (row + 1) + column);
  if (tile !== "tile16") {
    if (column < gridWidth) {
      if (rightCellID.className == "tile16") {
        transition(currentCellID, rightCellID, "right");
      }
    }
    if (column > 1) {
      if (leftCellID.className == "tile16") {
        transition(currentCellID, leftCellID, "left");
      }
    }
    if (row > 1) {
      if (aboveCellID.className == "tile16") {
        transition(currentCellID, aboveCellID, "above");
      }
    }
    if (row < gridWidth) {
      if (belowCellID.className == "tile16") {
        transition(currentCellID, belowCellID, "below");
      }
    }
  }
}

function change_bg() {
  let imagePath = prompt("Provide image url or type " + '"random"/' + '"default":');
  const sheet = document.querySelector("link[rel='stylesheet'][href='CSS/style.css']").sheet.cssRules;
  for (var i = 0; i < sheet.length; i++) {
    let findRule = '[class^="tile"]';
    if (sheet[i].selectorText == findRule) {
      if (imagePath == "random") {
        imagePath = "https://picsum.photos/360?random&t=" + new Date().getTime();
        sheet[i].style.backgroundImage = "url(" + imagePath + ")";
      } else if (imagePath == "default") {
        sheet[i].style.backgroundImage = "url(../images/flower.png)";
      } else {
        const e = i;
        load(imagePath).then(() => {
          sheet[e].style.backgroundImage = `url(${imagePath})`;
        });
      }
    }
  }
}

function load(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", resolve);
    image.addEventListener("error", reject);
    image.src = src;
  });
}
