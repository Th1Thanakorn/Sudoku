document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('sudoku-board');
    const size = 9;

    // Create an empty Sudoku board
    const sudokuBoard = Array.from({ length: size }, () => Array(size).fill(0));

    // Function to check if a number can be placed in a particular cell
    const isSafe = (num, row, col) => {
        // Check if the number is not present in the current row and column
        for (let i = 0; i < size; i++) {
            if (sudokuBoard[row][i] === num || sudokuBoard[i][col] === num) {
                return false;
            }
        }

        // Check if the number is not present in the current 3x3 grid
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (sudokuBoard[startRow + i][startCol + j] === num) {
                    return false;
                }
            }
        }

        return true;
    };

    // Function to solve the Sudoku puzzle using backtracking
    const solveSudoku = () => {
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (sudokuBoard[row][col] === 0) {
                    for (let num = 1; num <= size; num++) {
                        if (isSafe(num, row, col)) {
                            sudokuBoard[row][col] = num;

                            if (solveSudoku()) {
                                return true; // If the puzzle is solved, stop further exploration
                            }

                            sudokuBoard[row][col] = 0; // Backtrack if the current configuration is not valid
                        }
                    }

                    return false; // No valid number can be placed in the current cell
                }
            }
        }

        return true; // The entire board is filled
    };

    // Function to remove numbers from the solved Sudoku board to create a puzzle
    const createPuzzle = () => {
        const numberOfCellsToRemove = Math.floor(Math.random() * 15) + 55; // Adjust the range based on difficulty

        for (let i = 0; i < numberOfCellsToRemove; i++) {
            const row = Math.floor(Math.random() * size);
            const col = Math.floor(Math.random() * size);

            if (sudokuBoard[row][col] !== 0) {
                sudokuBoard[row][col] = 0;
            } else {
                i--; // Try again if the selected cell is already empty
            }
        }
    };

    // Function to render the Sudoku board
    const renderBoard = () => {
        board.innerHTML = '';

        if (solveSudoku()) {
            createPuzzle();
        } else {
            console.error('Unable to generate a solvable Sudoku puzzle.');
        }

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = document.createElement('input');
                cell.type = 'text';
                cell.className = 'cell';
                cell.maxLength = 1;

                if (sudokuBoard[i][j] !== 0) {
                    cell.value = sudokuBoard[i][j];
                    cell.readOnly = true;
                }

                board.appendChild(cell);
            }
        }
    };

    // Initial render
    renderBoard();
});
