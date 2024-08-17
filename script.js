const gameBoard = (function() {
    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    const getBoard = () => board;

    const play = (symbol, row, col) => {
        if (board[row][col]!= ""){
            return false;
        };
        board[row][col] = symbol;
        return true;
    };

    return {getBoard, play};
})();

function createPlayer (name, symbol){
    return {name, symbol};
};

function playGame(){
    const player1 = createPlayer("filler1", "X");
    const player2 = createPlayer("filler2", "O");

    let play = 1;

    playTurn();

    function playTurn(){
        const playerTurn = (play % 2 == 1)? player1 : player2;
        do{
            const position = prompt(`${playerTurn.name} enter coordinates in form "row,col"`);
            var [row, col] = position.split(",").map(val => Number(val));
            console.log(gameBoard.getBoard());
        }while (!(gameBoard.play(playerTurn.symbol, row, col)));
        play ++;
    }
};