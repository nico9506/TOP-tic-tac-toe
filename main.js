const Tile = (x, y) => {
    /**
     * Generate tile objects with X and Y coordinates
     */

    const getCoordinateX = () => x;
    const getCoordinateY = () => y;

    let tileValue = ""; //Keep the player icon 'X' or 'O' who took the tile

    const getTileValue = () => tileValue;
    const setTileValue = (value) => (tileValue = value);

    const createTileElement = () => {
        let newDiv = document.createElement("div");
        newDiv.setAttribute("id", "tile" + x + y);
        newDiv.setAttribute("class", "tile");
        newDiv.setAttribute("corX", x);
        newDiv.setAttribute("corY", y);

        return newDiv;
    };

    return {
        getCoordinateX,
        getCoordinateY,
        getTileValue,
        setTileValue,
        createTileElement,
    };
};

const Player = (nickname, mark) => {
    /**
     * Generate player objects
     */
    let score = 0;

    const getNickname = () => nickname;
    const getMark = () => mark;
    const getScore = () => score;

    const addScorePoint = () => score++;

    return { getNickname, getMark, getScore, addScorePoint };
};

const GameBoardGenerator = (() => {
    /**
     * Generates the game board, which is formed by an array of tiles,
     * to be placed in the interface within the div#board HTML element
     */

    const tilesByColumn = 3;
    const tilesByRow = 3;
    const tilesArray = [];
    const boardElement = document.getElementById("board");

    const generateBoard = () => {
        for (let i = 0; i < tilesByColumn; i++) {
            for (let j = 0; j < tilesByRow; j++) {
                const newTile = Tile(i, j);
                tilesArray.push(newTile);
                boardElement.appendChild(newTile.createTileElement());
            }
        }
    };

    const getTilesArray = () => tilesArray;

    return { generateBoard, getTilesArray };
})();
