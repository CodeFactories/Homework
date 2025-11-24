import * as readline from 'readline';

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Ask the user for input
function askQuestion(query: string): Promise<string> {
    return new Promise(resolve => rl.question(query, resolve));
}

// Display the board
function displayBoard(board: string[]): void {
    console.log();
    console.log(` ${board[0]} | ${board[1]} | ${board[2]}`);
    console.log(` ${board[3]} | ${board[4]} | ${board[5]}`);
    console.log(` ${board[6]} | ${board[7]} | ${board[8]}`);
    console.log();
}

// Check if a player has won
function checkWin(board: string[], player: string): boolean {
    const winCombinations = [
        [0,1,2], [3,4,5], [6,7,8], // Rows
        [0,3,6], [1,4,7], [2,5,8], // Columns
        [0,4,8], [2,4,6]           // Diagonals
    ];
    return winCombinations.some(combo => combo.every(i => board[i] === player));
}

// Check if board is full
function isDraw(board: string[]): boolean {
    return board.every(cell => cell === 'X' || cell === 'O');
}

// Player move
async function userMove(board: string[], player: string): Promise<void> {
    while (true) {
        const move = await askQuestion(`Player ${player}: Enter a number (1-9): `);
        const index = parseInt(move) - 1;

        if (!isNaN(index) && index >= 0 && index <= 8 && board[index] !== 'X' && board[index] !== 'O') {
            board[index] = player;
            break;
        } else {
            console.log(" Invalid move. Please choose an available number.\n");
        }
    }
}

// Play one full game
async function playGame(): Promise<void> {
    console.log("\nWelcome to Tic-Tac-Toe!\n");

    let board = ['1','2','3','4','5','6','7','8','9'];
    let currentPlayer = 'X';

    while (true) {
        displayBoard(board);
        await userMove(board, currentPlayer);

        if (checkWin(board, currentPlayer)) {
            displayBoard(board);
            console.log(` Player ${currentPlayer} wins!\n`);
            break;
        }

        if (isDraw(board)) {
            displayBoard(board);
            console.log(" It's a draw!\n");
            break;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

// Main program loop
async function main() {
    while (true) {
        await playGame();

        const answer = (await askQuestion("Do you want to play again? (yes/no): "))
            .trim()
            .toLowerCase();

        if (answer === "yes") {
            console.log("\nRestarting the game...\n");
            continue;
        }
        else if (answer === "no") {
            console.log("Thanks for playing!");
            rl.close();
            break;
        }
        else {
            console.log("Invalid answer. Exiting .");
            rl.close();
            break;
        }
    }
}

main();
