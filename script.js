const grid = document.getElementById('matrix');
let input = "ADD";

function getRandomNumber(min = 11, max = 999) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createGrid(rows, cols, command) {
  grid.innerHTML = "";
  const topRow = [];
  const leftCol = [];

  for (let i = 1; i <= rows * cols; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';

    // Top row headers
    if (i < 8) {
      const col = i;
      cell.id = `1-${col}`;
      if (col === 1) {
        cell.textContent = command;
        cell.classList.add("no-interaction");
      } else {
        const num = (command === "MUL") ? getRandomNumber(11, 99) : getRandomNumber(11, 999);
        cell.textContent = num;
        topRow.push(num);
        cell.classList.add("no-interaction");
      }
    }

    // Left column headers
    else if ((i - 1) % 7 === 0) {
      const row = Math.floor((i - 1) / 7) + 1;
      cell.id = `${i}-1`;
      const num = (command === "MUL") ? getRandomNumber(11, 99) : getRandomNumber(11, 999);
      cell.textContent = num;

      if (row >= 2) {
        leftCol.push(num);
      }

      cell.classList.add("no-interaction");
    }

    // Inner input cells
    else {
      const row = Math.floor((i - 1) / 7);
      const col = (i - 1) % 7;

      cell.id = `${row + 1}-${col + 1}`;

      const inputBox = document.createElement("input");
      inputBox.type = "number";
      inputBox.classList.add("answer-box");
      inputBox.dataset.row = row - 1;
      inputBox.dataset.col = col - 1;

      cell.appendChild(inputBox);
    }

    grid.appendChild(cell);
  }

  // Save for checking later
  window.currentGrid = {
    topRow,
    leftCol,
    command
  };
}

function checkAnswers() {
  const { topRow, leftCol, command } = window.currentGrid;

  document.querySelectorAll("input.answer-box").forEach(input => {
    const row = parseInt(input.dataset.row);
    const col = parseInt(input.dataset.col);

    const top = topRow[col];
    const left = leftCol[row];

    let expected;
    if (command === "ADD") {
      expected = top + left;
    } else if (command === "SUB") {
      expected = Math.abs(left - top); // ✅ Always positive
    } else if (command === "MUL") {
      expected = top * left;
    }

    const userValue = parseInt(input.value);
    const parentCell = input.parentElement;

    // Remove previous feedback
    parentCell.classList.remove("correct", "wrong");
    const oldSpan = parentCell.querySelector(".correct-answer");
    if (oldSpan) oldSpan.remove();

    if (userValue === expected) {
      parentCell.classList.add("correct");
    } else {
      parentCell.classList.add("wrong");

      const span = document.createElement("span");
      span.className = "correct-answer";
      span.textContent = expected; // ✅ Only shows positive
      parentCell.appendChild(span);
    }
  });
}

function clearGridInputs() {
  document.querySelectorAll("input.answer-box").forEach(input => {
    input.value = "";
    input.parentElement.classList.remove("correct", "wrong");
    const span = input.parentElement.querySelector(".correct-answer");
    if (span) span.remove();
  });
}

function addition() {
  input = "ADD";
  createGrid(7, 7, input);
}

function subtraction() {
  input = "SUB";
  createGrid(7, 7, input);
}

function multiplication() {
  input = "MUL";
  createGrid(7, 7, input);
}

createGrid(7, 7, input); // load default on start
