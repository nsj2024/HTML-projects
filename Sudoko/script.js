document.addEventListener("DOMContentLoaded", () => {
    const boardSize = 9;
    const board = document.getElementById("sudoku-board");

    // Define the initial puzzle (0 represents empty cells)
    const initialPuzzle = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    // Create the Sudoku board
    function createBoard() {
        for (let row = 0; row < boardSize; row++) {
            const tr = document.createElement("tr");
            for (let col = 0; col < boardSize; col++) {
                const td = document.createElement("td");
                const input = document.createElement("input");
                input.type = "text";
                input.maxLength = 1;
                input.addEventListener("input", handleInput);
                if (initialPuzzle[row][col] !== 0) {
                    input.value = initialPuzzle[row][col];
                    input.disabled = true; // Make pre-filled cells read-only
                }
                td.appendChild(input);
                tr.appendChild(td);
            }
            board.appendChild(tr);
        }
    }

    function handleInput(event) {
        const input = event.target;
        if (input.value && !/^[1-9]$/.test(input.value)) {
            input.value = "";
        }
    }

    function solveSudoku() {
        const grid = getGrid();
        if (solve(grid)) {
            setGrid(grid);
        } else {
            alert("No solution exists!");
        }
    }

    function getGrid() {
        const grid = [];
        for (let row = 0; row < boardSize; row++) {
            const rowArray = [];
            for (let col = 0; col < boardSize; col++) {
                const value = board.rows[row].cells[col].querySelector("input").value;
                rowArray.push(value ? parseInt(value) : 0);
            }
            grid.push(rowArray);
        }
        return grid;
    }

    function setGrid(grid) {
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                board.rows[row].cells[col].querySelector("input").value = grid[row][col] || "";
            }
        }
    }

    function isValidMove(grid, row, col, num) {
        for (let x = 0; x < boardSize; x++) {
            if (grid[row][x] === num || grid[x][col] === num) {
                return false;
            }
        }
        const startRow = row - (row % 3);
        const startCol = col - (col % 3);
        for (let r = startRow; r < startRow + 3; r++) {
            for (let d = startCol; d < startCol + 3; d++) {
                if (grid[r][d] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    function solve(grid) {
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if (grid[row][col] === 0) {
                    for (let num = 1; num <= boardSize; num++) {
                        if (isValidMove(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (solve(grid)) {
                                return true;
                            }
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    function resetBoard() {
        const inputs = document.querySelectorAll("#sudoku-board input");
        inputs.forEach(input => {
            if (!input.disabled) {
                input.value = "";
            }
        });
    }

    createBoard();

    document.getElementById("solve-button").addEventListener("click", solveSudoku);
    document.getElementById("reset-button").addEventListener("click", resetBoard);
});
