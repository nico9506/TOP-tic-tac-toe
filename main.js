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
        newDiv.innerHTML = `<h1>${tileValue}</h1>`;

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
    let tilesArray = [];
    let pivotArray = [];
    let boardElement;
    // let boardElement = document.getElementById("board");
    // const bodyElement = document.getElementsByTagName("body");

    const deleteBoard = () => {
        if (boardElement) boardElement.remove();
        boardElement = document.createElement("div");
        boardElement.setAttribute("id", "board");
        document.body.appendChild(boardElement);
        tilesArray.length = 0; //Clear the existing array
    };

    const generateEmptyBoard = () => {
        for (let i = 0; i < tilesByColumn; i++) {
            for (let j = 0; j < tilesByRow; j++) {
                const newTile = Tile(i, j);
                tilesArray.push(newTile);
                boardElement.appendChild(newTile.createTileElement());
            }
        }
    };

    const restartBoard = () => {
        deleteBoard();
        generateEmptyBoard();
    };

    const refreshBoard = () => {
        pivotArray = [...tilesArray];
        deleteBoard();
        tilesArray = [...pivotArray];
        pivotArray.length = 0;
        for (let i = 0; i < tilesArray.length; i++) {
            boardElement.appendChild(tilesArray[i].createTileElement());
        }
    };

    const getTilesArray = () => tilesArray;

    return { getTilesArray, restartBoard, refreshBoard };
})();
