// make gameboard IIFE with getter functioner, makeMove function and resetBoard function

const gameBoard = (() => {
    let board =  ["","","","","","","","",""];

    const getBoard = () => board;

    const makeMove = (position, playerName ,  marker) => {
        if (!board[position]){
            board[position] = marker;
            console.log(`${playerName} places ${marker} in position ${position}`)
            return true;
        }else {
            console.log("This position is invalid!");
            return false;
        }
    };
    const resetBoard = () => {
        for (let i = 0; i < board.length; i++){
            board[i] = "";
        }
    };



    return {
        getBoard, 
        makeMove, 
        resetBoard}
    
})();


// define createPlayer factory function


const createPlayer = function(name, marker){
    return {name, marker};
}

// create two player with creator function


const playerOne = createPlayer(prompt('Your name please'), prompt("which marker would you prefer (X/O)"));
const playerTwoMarker = playerOne.marker === "X" ? "O" : "X";  
const playerTwo = createPlayer(prompt('Your name please'), playerTwoMarker);



const game = ((playerOne, playerTwo) => {
    let currentPlayer = playerOne;
    let gameOver = false;

    const reset = () => {
        gameBoard.resetBoard();
        currentPlayer = playerOne
        gameOver = false;
    }

    const playRound = (position) => {
        if (gameOver) {
            console.log("Game Over, please reset the board.");
            return false;
        }

        if (gameBoard.makeMove(position, currentPlayer.name, currentPlayer.marker)) {
            if (checkWinner()){
                console.log(`${currentPlayer.name} wins!`);
                gameOver = true;
                return 'win';
            } else if (checkTie()){
                console.log("it's a tie!");
                gameOver = true;
                return 'tie';
            } else {
                currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
                console.log(`${currentPlayer.name}'s turn.`);
                return true;
            }
        }
        return false;
    }



    const checkWinner = () => {

    
        const board = gameBoard.getBoard();
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]              // Diagonals
        ];
    
        for (let combination of winningCombinations){
            const [a,b,c] = combination;
            if (board[a] && board[a] === board[b] && board[b] === board[c]){
                return true;
            }
        }
        
        return false;
    }
    const checkTie = () => {
        return !checkWinner() &&gameBoard.getBoard().every(cell => cell !== "");
    };

    const getCurrentPlayer = () => currentPlayer;


    return { playRound, reset, getCurrentPlayer };
})(playerOne, playerTwo);



// display controller, display in DOM

const displayController = (()=>{
    const boardElement = document.querySelector('.gameBoard')
    const messageElement = document.querySelector('.message');
    const restartButton = document.querySelector('.restart');


    const renderBoard = () => {
        boardElement.innerHTML = '';
        const board = gameBoard.getBoard();

        board.forEach((cell,index)=>{
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.dataset.index = index;
            cellElement.textContent = cell;
            boardElement.appendChild(cellElement);
        })  
    }
    
    const updateMessage = (text) => {
        messageElement.textContent =  text;
    };
    const initializeGame = () => {
        renderBoard();

        boardElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('cell') && !e.target.textContent) {
                const position = parseInt(e.target.dataset.index);
                const result = game.playRound(position);
                renderBoard();

                renderBoard();

                if (result === 'win'){
                    updateMessage(`${game.getCurrentPlayer().name} wins!`);
                }else if (result === 'tie'){
                    updateMessage("It's a tie!")
                }else if (result === true) {
                    updateMessage(`${game.getCurrentPlayer().name}'s turn.`)
                }
            }
        })

        restartButton.addEventListener('click', () => {
            game.reset();
            renderBoard();
            updateMessage(`${game.getCurrentPlayer().name}'s turn`);
        })

        updateMessage(`${game.getCurrentPlayer().name}'s turn`);
    };
    return {initializeGame};
})()

// Intialize the game

displayController.initializeGame();

















