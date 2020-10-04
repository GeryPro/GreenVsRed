// DOM Variables needed
const header = document.getElementById('header');
const colNum = document.getElementById('columns');
const rowNum = document.getElementById('rows');
const mainForm = document.getElementById('main-form');
const modal = document.getElementById('modal');
const gameGrid = document.getElementById('game-grid');
const cellXCoor = document.getElementById('cell-x-input');
const cellYCoor = document.getElementById('cell-y-input');
const iterationN = document.getElementById('iteration-input');
const goBtn = document.getElementById('iteration-submit');
const restartGameBtn = document.getElementById('restart-game');
const chosenCell = document.getElementById('chosen-cell');

// Arrays
const firstGrid = [];  //Filled with the initial grid
let nextGrid = [];  //Filled with the dynamically changed grid for each iteration
let newGrid = [];
const greens = [];

// Variables
let cols;
let rows;
let chosenRow;
let chosenCol;
let index;

// Iteration variables
let iterations;

// Function to get the needed data to create the grid
function getGridData(e) {
    e.preventDefault();

    modal.classList.add('hidden');
    header.classList.add('show');

    cols = +(colNum.value.trim());
    rows = +(rowNum.value.trim());

    createCells(rows, cols);

    const gameWidth = `${colNum.value * 50}px`;
    gameGrid.style.maxWidth = gameWidth;
      
}

// Function to create the grid 
function createCells(rows, cols) {
    gameGrid.style.setProperty('--grid-rows', rows);
    gameGrid.style.setProperty('--grid-cols', cols);

    for(x = 0; x < cols*rows; x++) {
        
        let cell = document.createElement("div");
      
        const cellValue = getRandomInt(2);

        gameGrid.appendChild(cell).className = "grid-item";
      
      
        if(cellValue === 1) {
            cell.setAttribute("data-value", 1);
        } else {
            cell.setAttribute("data-value", 0);
        }
        
        firstGrid.push(cellValue);
    }

    nextGrid = [...firstGrid];
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getGenN() {
    chosenCol = +(cellXCoor.value.trim());
    chosenRow = +(cellYCoor.value.trim());
    index = (chosenRow - 1) * cols + (chosenCol - 1);

    iterations = +(iterationN.value.trim());
    
    checkEnteredInfo(chosenCol, chosenRow, iterations, index);

    
}

function checkEnteredInfo(col,row, n, index) {
    if(row <= rows) {
        if (col <= cols) {
            if(n > 0) {            
                if(firstGrid[index] === 1) {
                    setMessage("In Gen 0 the chosen cell's color is green", 2000);
                    greens.push(1);
                } else {
                    setMessage("In Gen 0 the chosen cell's color is red", 2000);
                }   
                changeColor(n,index);
            } else {
                setMessage('Please enter a valid number of iterations!', 2500);
            }
        } else {
            setMessage(`Ooops, we have only ${cols} columns, please enter a new column number`, 2500);
        }
    } else {
        setMessage(`Ooops, we have only ${rows} rows, please enter a new row number`, 2500);
    }
}



function setMessage(message, time) {
    chosenCell.innerText = message;
    setTimeout( () => chosenCell.innerText='', time);
}

const sleep = ms => {
    return new Promise(res => setTimeout(res, ms));
}

const changeColor = async (iter,index) => {
    for(i = 1; i <= iter; i++) {
        await sleep(500);
        nextGrid = [...nextGrid];
        newGrid = [];
        
        nextGrid.forEach((val, i) => {
            let total = 0;
            if(nextGrid[i -cols -1] != undefined) {
                total += nextGrid[i -cols -1];
            } else {
                total += 0;
            }

            if(nextGrid[i -cols] != undefined) {
                total += nextGrid[i -cols];
            } else {
                total += 0;
            }

            if(nextGrid[i -cols +1] != undefined) {
                total += nextGrid[i -cols +1];
            } else {
                total += 0;
            }

            if(nextGrid[i -1] != undefined) {
                total += nextGrid[i -1];
            } else {
                total += 0;
            }

            if(nextGrid[i +1] != undefined) {
                total += nextGrid[i +1];
            } else {
                total += 0;
            }

            if(nextGrid[i +cols -1] != undefined) {
                total += nextGrid[i +cols -1];
            } else {
                total += 0;
            }

            if(nextGrid[i +cols] != undefined) {
                total += nextGrid[i +cols];
            } else {
                total += 0;
            }

            if(nextGrid[i +cols +1] != undefined) {
                total += nextGrid[i +cols +1];
            } else {
                total += 0;
            }

            if(val === 0) {
                if(total === 3 || total === 6) {
                   newGrid.push(1); // Array to keep track of greens during the iterations
                    //Next gen will be green  
                } else {
                    newGrid.push(0);
                    // Next gen will be red
                }
        
            } else if (val === 1) {
                if(total === 2 || total === 3 || total === 6) {
                    newGrid.push(1);
                    // Next gen will be green
                } else {
                    newGrid.push(0);
                    // Next gen will be red
                }
            }

        })
        const cells = document.querySelectorAll('.game-grid > div');
        
        cells.forEach((cell, i) => {
            cell.removeAttribute("data-value");
            cell.setAttribute("data-value", newGrid[i]);
        })

        if(newGrid[index] === 1) {
            greens.push(1);
        }

        nextGrid = [...newGrid];
    }

    showResult(iter,index);
}

function showResult(iter,index) {
    cellXCoor.value = '';
    cellYCoor.value = '';
    iterationN.value = '';
    goBtn.disabled = true;

    if(newGrid[index] === 1) {
        setMessage(`In Gen ${iter} the chosen cell's color is green, it has been green for ${greens.length} generations`, 5000);
    } else {
        setMessage(`In Gen ${iter} the chosen cell's color is red, it has been green for ${greens.length} generations`, 5000);
    }
}

// Restart Game
function restartGame(e) {
    e.preventDefault();

    location.reload();
}

// Event Listeners
mainForm.addEventListener('submit', getGridData);
goBtn.addEventListener('click', getGenN);
restartGameBtn.addEventListener('click', restartGame);