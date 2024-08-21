const players = (function () {
    const player1Input = document.querySelector("#player1");
    const player2Input = document.querySelector("#player2");

    function createPlayer (name, symbol){
        return {name, symbol};
    };

    const createPlayers = () => {
        const p1Name = player1Input.value == ""? "player 1" : player1Input.value;
        const p2Name = player2Input.value == ""? "player 2" : player2Input.value;

        const player1 = createPlayer(p1Name, "X");
        const player2 = createPlayer(p2Name, "O");
        return {player1, player2};
    };
    
    return {createPlayers};
})();

const gameBoard = (function() {
    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];
    let playCount = 0;
    let winner = "tie";

    const getBoard = () => board;
    const getWinner = () => winner;

    const play = (symbol, row, col) => {
        if (board[row][col]!= ""){
            return false;
        };
        board[row][col] = symbol;
        playCount++;
        return true;
    };

    const _transpose = (matrix = board) => {
        return board[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    };

    const _diagonalize = (matrix = board) => {
        const diagonals = [[],[]];
        for (let i = 0; i < 3; i++){
            diagonals[0].push(matrix[i][i]);
            diagonals[1].push(matrix[i][(2-i)]);
        };
        return diagonals;
    };

    const _checkRowsWin = (matrix = board) => {
        const regexCheck = /^(XXX|OOO)$/;
        for (let i = 0; i < matrix.length; i++){
            let rowString = matrix[i].join("");
            if (regexCheck.test(rowString)){
                winner = matrix[i][0];
                return true;
            };
        };
    };

    const checkEnd = () => {
        if (playCount < 5){
            return false;
        };

        const rowWin = _checkRowsWin();
        if (rowWin){
            return true
        }; 

        const transposedBoard = _transpose();
        colWin = _checkRowsWin(transposedBoard);
        if (colWin){
            return true;
        };

        const diagonalizedBoard = _diagonalize();
        diagonalWin = _checkRowsWin(diagonalizedBoard);
        if (diagonalWin){
            return true;
        };
        
        if (playCount < 9){
            return false;
        };
        return true;
    };

    return {getBoard, play, checkEnd, getWinner};
})();

const playGame = (function() {
    let player1 = players.createPlayers().player1;
    let player2 = players.createPlayers().player2;

    const openGame = () => {
        const postLoad = document.querySelector(".postLoad");
        const preLoad = document.querySelector(".preLoad");

        //hide preload and unhide postload (game)
        preLoad.classList.toggle("hidden");
        postLoad.classList.toggle("hidden");
        player1 = players.createPlayers().player1;
        player2 = players.createPlayers().player2;
        playerDashboard.updateTurnSym();
    };

    const startBtn = document.querySelector("#startBtn");
    startBtn.addEventListener("click", openGame);

    let play = 1;

    function activePlayer(){
        return (play % 2 == 1)? player1 : player2;
    };

    function playTurn(row, col){
        const playerTurn = activePlayer();
        if (!gameBoard.play(playerTurn.symbol, row, col)){
            return;
        };

        play ++;
        if (gameBoard.checkEnd()){
            return false;
        }
        return true;
    };

    function getWinner(){
        if (gameBoard.getWinner() === "tie"){
            return false;
        };
        if (gameBoard.getWinner() === "X"){
            return player1;
        };
        return player2;
    };

    return {getWinner, playTurn, activePlayer};
})();

const playerDashboard = (function() {
    //cache DOM
    const playerTurn = document.querySelector("#playerTurn");
    const playerSymbol = document.querySelector("#playerSymbol");
    const winnerDisplay = document.querySelector("#winner");

    function updateTurnSym(){
        console.log("sss");
        const activePlayer = playGame.activePlayer();
        playerTurn.textContent = activePlayer.name;
        playerSymbol.textContent = activePlayer.symbol;
    };

    function showWinner(){
        const winner = playGame.getWinner();
        if (winner){
            winnerDisplay.textContent = `${winner.name} (${winner.symbol})`;
        }else{
            winnerDisplay.textContent = "TIE";
        }
        gameDisplayControl.deactivate();
    }

    return {updateTurnSym, showWinner};
})();

const gameDisplayControl = (function() {
    //cache DOM
    const cells = document.querySelectorAll(".cell");
    
    //bind events
    cells.forEach((cell) => cell.addEventListener("click", _play));

    function _render() {
        playerDashboard.updateTurnSym();
        const oneDBoard = gameBoard.getBoard().flat();
        for (let i = 0; i < 9; i++){
            cells[i].textContent = oneDBoard[i];
            if (oneDBoard[i] !== ""){
                cells[i].classList.toggle('filled', true);
            };
        };
    };

    function _play(event){
        const col = event.target.getAttribute('data-col');
        const row = event.target.parentElement.getAttribute('data-row');
        if (!playGame.playTurn(row, col)){
            playerDashboard.showWinner();
        }
        _render();
    };

    function deactivate(){
        for (let i = 0; i < 9; i++){
            cells[i].classList.toggle('filled', true);
            cells.forEach((cell) => cell.removeEventListener("click", _play));
        };
    };

    return {deactivate};
})();