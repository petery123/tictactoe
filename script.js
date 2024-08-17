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
        }
        return diagonals;
    }

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
        }
        return true;
    }

    return {getBoard, play, checkEnd, getWinner};
})();

function createPlayer (name, symbol){
    return {name, symbol};
};

const playGame = (function() {
    const player1 = createPlayer("filler1", "X");
    const player2 = createPlayer("filler2", "O");

    let play = 1;

    function _playTurn(){
        const playerTurn = (play % 2 == 1)? player1 : player2;
        do{
            const position = prompt(`${playerTurn.name} enter coordinates in form "row,col"`);
            var [row, col] = position.split(",").map(val => Number(val));
            console.dir(gameBoard.getBoard());
        }while (!(gameBoard.play(playerTurn.symbol, row, col)));
        play ++;
    };

    function startGame(){
        do{
            _playTurn();
        }while(!(gameBoard.checkEnd()));
    }

    function getWinner(){
        if (gameBoard.getWinner() === "tie"){
            return false;
        };
        if (gameBoard.getWinner() === "X"){
            return player1;
        };
        return player2;
    }

    return {startGame, getWinner};
})();