// Gameboard module. Creates the gameboard and displays played pieces in their corresponding spots on the board.
const gameboard = (() => {
    let gamePieces = ['', '', '', '', '', '', '', '', ''];
    const getGamePiece = (position) => {
        return gamePieces[position];
    }
    const resetBoard = () => {
        for(let count = 0; count < 9; count++) {
            gamePieces[count] = '';
        }
        displayBoard();
    }
    const addPieceToBoard = (squareNum, playerNum) => {
        if(playerNum === 1) {
            gamePieces[squareNum] = 'X';
        } else {
            gamePieces[squareNum] = 'O';
        }
        gameController.checkForWin();
        gameController.checkForTie();
    };
    const displayBoard = () => {
        document.getElementById("square-one").textContent = gamePieces[0];
        document.getElementById("square-two").textContent = gamePieces[1];
        document.getElementById("square-three").textContent = gamePieces[2];
        document.getElementById("square-four").textContent = gamePieces[3];
        document.getElementById("square-five").textContent = gamePieces[4];
        document.getElementById("square-six").textContent = gamePieces[5];
        document.getElementById("square-seven").textContent = gamePieces[6];
        document.getElementById("square-eight").textContent = gamePieces[7];
        document.getElementById("square-nine").textContent = gamePieces[8];
    };
    return {getGamePiece, resetBoard, addPieceToBoard, displayBoard};
})();

// Player factory. Creates players that hold moves played by them for the game.
const player = () => {
    let moves = [];
    const getMove = (position) => {
        return moves[position];
    }
    const playPiece = (squareNum, playerNum) => {
        if(gameController.getGameEnd() === 1) {
            console.log("Game has ended!");
            return false;
        }
        else if(gameController.getGameEnd() === 2) {
            console.log("Game has ended! Tie!");
            return false;
        }
        else if(gameboard.getGamePiece(squareNum) !== '') {
            console.log("Space Taken!");
            return false;
        }
        else {
            moves.push(squareNum);
            gameboard.addPieceToBoard(squareNum, playerNum);
            console.log(moves);
        }
    }
    return {getMove, playPiece};
}

// Controls flow of the game. Prepares board upon game start and checks for end of game.
const gameController = (() => {
    let currentPlayer = 1;
    let gameEnd = 0;
    let winnerPiece = '';
    let playerOneScore = 0;
    let playerTwoScore = 0;
    const squareNames = ["square-one", "square-two", "square-three", "square-four", "square-five", "square-six", "square-seven", "square-eight", "square-nine"];
    const gameStart = () => {
        for(let count = 0; count < 9; count++) {
            document.getElementById(squareNames[count]).addEventListener('click', () => {
                if(currentPlayer === 1) {
                    if(playerOne.playPiece(count, 1) === false) {
                        currentPlayer = 1;
                    } else {
                        currentPlayer = 2;
                        if(gameController.getGameEnd() === 0) {
                            document.getElementById("prompt-span").textContent = "player two, your move.";
                        }
                    }
                } else {
                    if(playerTwo.playPiece(count, 2) === false) {
                        currentPlayer = 2;
                    } else {
                        currentPlayer = 1;
                        if(gameController.getGameEnd() === 0) {
                            document.getElementById("prompt-span").textContent = "player one, your move.";
                        }
                    }
                }
                gameboard.displayBoard();
            });
        }
        document.getElementById("play-button").addEventListener('click', () => {
            document.getElementById("play-button").style.visibility = "hidden";
            if(gameEnd === 2) {
                currentPlayer = 1;
                gameEnd = 0;
                winnerPiece = '';
                gameboard.resetBoard();
                document.getElementById("prompt-span").textContent = "player one, your move.";
            }
            else if(currentPlayer === 2) {
                currentPlayer = 2;
                gameEnd = 0;
                winnerPiece = '';
                gameboard.resetBoard();
                document.getElementById("prompt-span").textContent = "player two, your move.";
            }
            else {
                currentPlayer = 1;
                gameEnd = 0;
                winnerPiece = '';
                gameboard.resetBoard();
                document.getElementById("prompt-span").textContent = "player one, your move.";
            }
        });
        document.getElementById("reset-button").addEventListener('click', () => {
            playerOneScore = 0;
            playerTwoScore = 0;
            document.getElementById("player-one-score").textContent = playerOneScore;
            document.getElementById("player-two-score").textContent = playerTwoScore;
            gameEnd = 0;
            winnerPiece = '';
            currentPlayer = 1;
            gameboard.resetBoard();
            document.getElementById("prompt-span").textContent = "game reset! player one, your move.";
        });
        gameboard.displayBoard();
    };
    const checkForWin = () => {
        const winConditions = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];
        for(let count = 0; count < 8; count++) {
            if(gameboard.getGamePiece(winConditions[count][0]) !== '') {
                if(gameboard.getGamePiece(winConditions[count][0]) === gameboard.getGamePiece(winConditions[count][1])) {
                    if(gameboard.getGamePiece(winConditions[count][0]) === gameboard.getGamePiece(winConditions[count][2])) {
                        console.log("Game End!");
                        winnerPiece = gameboard.getGamePiece(winConditions[count][0]);
                        gameEnd = 1;
                        displayWinner();
                        document.getElementById("play-button").style.visibility = "visible";
                        return true;
                    }
                }
            }
        }
    }
    const checkForTie = () => {
        let checkNum = 0;
        for(let count = 0; count < 9; count++) {
            if(gameboard.getGamePiece(count) === '') {
                break;
            }
            if(gameboard.getGamePiece(count) !== '') {
                checkNum++;
                if(checkNum === 9) {
                    console.log("Game End! Tie!");
                    gameEnd = 2;
                    return true;
                }
            }
        }
    }
    const displayWinner = () => {
        if(winnerPiece === 'X') {
            document.getElementById("player-one-score").textContent = ++playerOneScore;
            document.getElementById("prompt-span").textContent = "player one wins!";
        }
        else if(winnerPiece === 'O') {
            document.getElementById("player-two-score").textContent = ++playerTwoScore;
            document.getElementById("prompt-span").textContent = "player two wins!";
        }
    }
    const getCurrentPlayer = () => {
        return currentPlayer;
    }
    const getGameEnd = () => {
        return gameEnd;
    }
    return{gameStart, checkForWin, checkForTie, getCurrentPlayer, getGameEnd, displayWinner};
})();

// Global Code
const playerOne = player();
const playerTwo = player();
gameController.gameStart();