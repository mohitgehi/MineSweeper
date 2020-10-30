let cellObj = {};
let count = 0;
const getId = (i, j) => {
  return i.toString() + j.toString();
};

function Cell(row, column, clicked, mined, mineCount) {
  this.id = getId(row, column);
  this.clicked = clicked;
  this.mined = mined;
  this.mineCount = mineCount;
}

let  reset=()=> {
  cellObj = {};
  count = 0;
  init();
}

let neighbouringZeros = (i, j) => {
  if (cellObj[getId(i, j)].clicked === true) {
    return;
  }

  cellObj[getId(i, j)].clicked = true;
  let neighbors = getNeighbors(getId(i, j));
  let cell = document.getElementById(getId(i, j));

  cell.classList.add("zero");
  for (let index = 0; index < neighbors.length; index++) {
    cell = document.getElementById(neighbors[index]);
    let obj = cellObj[neighbors[index]];
    if (obj.clicked === false) {
      count++;
    }
    if (obj.mineCount === 0) {
      cell.innerHTML = "";
      cell.classList.add("zero");

      neighbouringZeros(
        parseInt(neighbors[index][0], 10),
        parseInt(neighbors[index][1], 10)
      );
    } else {
      cell.innerHTML = `${obj.mineCount}`;
      cell.classList.add("safe");
      obj.clicked = true;
    }
  }
};

let handleClick = (el, i, j) => {
  let cell = el;

  let obj = cellObj[getId(i, j)];
  if (obj.clicked === true) {
    return;
  }

  if (obj.mined === true) {
    cell.innerHTML = "M";
    cell.classList.add("bomb");
    obj.clicked = true;
    return gameOver(cell, count);
  } else {
    if (obj.mineCount !== undefined) {
      if (obj.mineCount === 0) {
        neighbouringZeros(i, j);
      } else {
        cell.innerHTML = `${obj.mineCount}`;
        cell.classList.add("safe");
      }
    } else {
      cell.innerHTML = "S";
    }
  }
  obj.clicked = true;
  count++;
  if (count >= 90) {
    return gameOver(cell, count);
  }
};

let gameOver = (cell, count) => {
  if (count < 90) {
    document.getElementById("game-status").innerHTML = "Game Over";
  } else {
    document.getElementById("game-status").innerHTML = "You Won";
  }

  for (let i = 0; i < 100; i++) {
    let temp1 = Math.floor(i / 10);
    let temp2 = i % 10;

    let old_element = document.getElementById(getId(temp1, temp2));
    let new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
    if (cellObj[getId(temp1, temp2)].mined === true) {
      document.getElementById(getId(temp1, temp2)).innerHTML = "M";
      document.getElementById(getId(temp1, temp2)).classList.add("bomb");
    }
  }
};

let getNeighbors = function (id) {
  let row = parseInt(id[0], 10);
  let column = parseInt(id[1], 10);
  let neighbors = [];
  neighbors.push(row - 1 + "" + (column - 1));
  neighbors.push(row - 1 + "" + column);
  neighbors.push(row - 1 + "" + (column + 1));
  neighbors.push(row + "" + (column - 1));
  neighbors.push(row + "" + (column + 1));
  neighbors.push(row + 1 + "" + (column - 1));
  neighbors.push(row + 1 + "" + column);
  neighbors.push(row + 1 + "" + (column + 1));

  for (let i = 0; i < neighbors.length; i++) {
    if (neighbors[i].length > 2) {
      neighbors.splice(i, 1);
      i--;
    }
  }

  return neighbors;
};

let isMined = function (id) {
  let cell = cellObj[id];
  let mined = 0;
  if (typeof cell !== "undefined") {
    mined = cell.mined ? 1 : 0;
  }
  return mined;
};

let neighbouringMineCount = () => {
  let cell;
  let neighborMineCount = 0;
  for (let i = 0; i < 100; i++) {
    let temp1 = Math.floor(i / 10);
    let temp2 = i % 10;
    let id = getId(temp1, temp2);
    cell = cellObj[id];
    if (!cell.mined) {
      let neighbors = getNeighbors(id);
      neighborMineCount = 0;
      for (let i = 0; i < neighbors.length; i++) {
        neighborMineCount += isMined(neighbors[i]);
      }
      cell.mineCount = neighborMineCount;
    }
  }
};

let assignMines = () => {
  let arr = [];
  while (arr.length < 10) {
    let r = Math.floor(Math.random() * 99) + 1;
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  for (let i = 0; i < arr.length; i++) {
    let temp1 = Math.floor(arr[i] / 10);
    let temp2 = arr[i] % 10;
    cellObj[getId(temp1, temp2)].mined = true;
  }
};

let rightClick = (cell) => {
  cell.innerHTML = "F";
};

const init = () => {
  document.getElementById("game-status").innerHTML = "";
  for (let i = 0; i < 100; i++) {
    let temp1 = Math.floor(i / 10);
    let temp2 = i % 10;
    let cell = document.getElementById(getId(temp1, temp2));
    cellObj[getId(temp1, temp2)] = new Cell(temp1, temp2, false, false, 0);
    cell.addEventListener("click", () => handleClick(cell, temp1, temp2));
    cell.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
    cell.addEventListener("contextmenu", () => rightClick(cell));
    cell.className = "cell center";
    cell.innerHTML = "";
  }
  assignMines();
  neighbouringMineCount();
};

const initBoard = () => {
  let board = document.getElementById("board");
  let c = 0;
  for (let i = 0; i < 10; i++) {
    let rowEl = document.createElement("div");
    rowEl.className = "row";

    //cellObj.push([]);
    for (let j = 0; j < 10; j++) {
      let temp1 = Math.floor(c / 10);
      let temp2 = c % 10;
      let cellEl = document.createElement("div");
      cellEl.setAttribute("id", getId(temp1, temp2));
      cellEl.className = "cell center";

      rowEl.appendChild(cellEl);
      c++;
    }
    board.appendChild(rowEl);
  }
  init();
};
initBoard();
// for (let i = 0; i < 81; i++) {
// }
