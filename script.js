const gameBoard = (function() {
    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    const getBoard = () => board;

    const play = (symbol, row, col) => {
        if (row > 2 || col > 2){
            return false;
        }
        if (board[row][col]!= ""){
            return false;
        };
        board[row][col] = symbol;
        return true;
    };

    return {getBoard, play};
})();

function createPlayer (name, symbol){
    const name = name;
    const symbol = symbol;

    return {name, symbol};
};

function playGame(){
    const player1 = createPlayer("filler1", "X");
    const player2 = createPlayer("filler2", "O");


};