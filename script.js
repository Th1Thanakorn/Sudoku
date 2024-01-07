document.addEventListener('DOMContentLoaded', () => {

    // Do not adjust this
    const board = document.getElementById('sudoku-board');
    const size = 9;

    const initialBoard = Array.from({length: size}, () => Array(size).fill(0)); // The initial puzzle
    const sudokuBoard = Array.from({length: size}, () => Array(size).fill(0)); // The gameplay board
    const solvedSudoku = Array.from({length: size}, () => Array(size).fill(0)); // The solved board

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
                            solvedSudoku[row][col] = num;

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
        const numberOfCellsToRemove = Math.floor(Math.random() * 15) + 55;

        for (let i = 0; i < numberOfCellsToRemove; i++) {
            const row = Math.floor(Math.random() * size);
            const col = Math.floor(Math.random() * size);

            if (sudokuBoard[row][col] !== 0) {
                sudokuBoard[row][col] = 0;
            } else {
                i--; // Try again if the selected cell is already empty
            }
        }

        // Store initial board according to current board
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                initialBoard[i][j] = sudokuBoard[i][j];
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

                // Insert dataset into cell component
                cell.dataset.row = i;
                cell.dataset.col = j;


                if (sudokuBoard[i][j] !== 0) {
                    cell.value = sudokuBoard[i][j];
                    cell.readOnly = true;
                }

                board.appendChild(cell);

                // Render horizontal lines
                if ((i === 2 || i === 5) && j === 8) {
                    const horizontalLine = document.createElement('div');
                    horizontalLine.className = 'horizontal-line';
                    board.appendChild(horizontalLine);
                }
            }
        }
    };

    // Render utility buttons
    const renderButtons = () => {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        const validateButton = document.createElement('button');
        validateButton.textContent = 'Validate';
        validateButton.addEventListener('click', validateBoard);
        buttonContainer.appendChild(validateButton);

        const marksButton = document.createElement('button');
        marksButton.textContent = 'Marks';
        marksButton.addEventListener('click', markBoard);
        buttonContainer.appendChild(marksButton);

        board.appendChild(buttonContainer);
    };

    // Check whether each cell contains correct/wrong number
    const validateBoard = () => {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {

                // Horizontal glitch (This fixed horizontal line index)
                let factor = 0;
                let cellNumber = i * size + j

                if (cellNumber >= 27) {
                    factor++;
                }
                if (cellNumber >= 54) {
                    factor++;
                }

                const cell = board.children[cellNumber + factor];
                const inputValue = parseInt(cell.value) || 0;

                // Checking
                if (initialBoard[i][j] === 0) {
                    if (cell.value === "") {
                        cell.style.backgroundColor = '#ffffff'; // White
                    } else if (inputValue !== solvedSudoku[i][j]) {
                        cell.style.backgroundColor = '#ff8080'; // Red
                    } else {
                        cell.style.backgroundColor = '#80c7ff'; // Blue
                    }
                }
            }
        }
    };

    // Function to make the marks to all cells
    const markBoard = () => {
        clearMarks();

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (sudokuBoard[i][j] === 0) {
                    const marks = getPossibleMarks(i, j);
                    markCell(i, j, marks);
                }
            }
        }
    };

    // Function to remove all marks
    const clearMarks = () => {
        document.querySelectorAll('.mark').forEach(mark => {
            mark.remove();
        })
    };

    // Mark cell
    const markCell = (row, col, marks) => {
        // Horizontal glitch (This fixed horizontal line index)
        let factor = 0;
        const cellNumber = row * size + col;

        if (cellNumber >= 27) {
            factor++;
        }
        if (cellNumber >= 54) {
            factor++;
        }

        const currentCell = board.children[cellNumber + factor];

        // Create a new span and align to cell position
        const span = document.createElement('span');
        span.textContent = marks.join('');
        span.className = 'mark';
        span.style.position = 'absolute';
        span.style.top = `${currentCell.offsetTop}px`;
        span.style.left = `${currentCell.offsetLeft}px`;
        span.style.fontSize = '9px'; // Adjusting the font size

        document.querySelector('.board').appendChild(span);
    };

    // Function to get all possible marks to each cell
    const getPossibleMarks = (row, col) => {
        const marks = [];
        for (let num = 1; num <= size; num++) {
            if (isSafe(num, row, col, sudokuBoard)) {
                marks.push(num);
            }
        }
        return marks;
    };

    // Function to handle keyboard inputs
    const handleCellInput = (event) => {
        const cell = event.target;
        const value = parseInt(cell.value);
        const row = cell.dataset.row;
        const col = cell.dataset.col;

        if (cell.value === '') {
            console.log('deleted');
            sudokuBoard[row][col] = 0;
        }

        if (Number.isInteger(value)) {
            sudokuBoard[row][col] = value;
        }
    };

    // Initial render
    renderBoard();
    renderButtons();

    // Event Handler
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('input', handleCellInput);
    });
});