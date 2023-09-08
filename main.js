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
        newDiv.innerHTML = `<span class="tile-value">${tileValue}</span>`;

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

const Player = (nickname) => {
    /**
     * Generate player objects
     */
    let score = 0;

    const getNickname = () => nickname;
    const getScore = () => score;

    const addScorePoint = () => score++;

    return { getNickname, getScore, addScorePoint };
};

const GameBoard = (() => {
    /**
     * Generates the game board, which is formed by an array of tiles,
     * to be placed in the interface within a div#board HTML element
     */

    const tilesByColumn = 3;
    const tilesByRow = 3;
    let tilesArray = [];
    let pivotArray = [];
    let boardElement;

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

const PlayerActions = (() => {
    /**
     *
     */

    const getTile = (x, y) => {
        const tilesArray = GameBoard.getTilesArray();

        for (let i = 0; i < tilesArray.length; i++) {
            if (
                tilesArray[i].getCoordinateX() == x &&
                tilesArray[i].getCoordinateY() == y
            )
                return tilesArray[i];
        }

        return 0;
    };

    const activateTiles = () => {
        const tileElements = [...document.querySelectorAll("div.tile")];

        tileElements.forEach((element) => {
            element.addEventListener("click", () => {
                getTile(
                    Number(element.getAttribute("corX")),
                    Number(element.getAttribute("corY"))
                ).setTileValue("X");
                GameBoard.refreshBoard();
                activateTiles();
            });
        });
    };

    return { activateTiles };
})();

const Game = (() => {
    /**
     * Control the game flow
     */
    const newGame = () => {
        // Set up new players

        GameBoard.restartBoard();
        PlayerActions.activateTiles();
        
    };

    const restartGame = () => {
        // Restart game with same player's config

        GameBoard.restartBoard();
        PlayerActions.activateTiles();
        
    };

    const activateMenu = () => {
        const newGameBtn = document.getElementById("newgame-btn");
        newGameBtn.addEventListener("click", newGame);

        const restartGameBtn = document.getElementById("restart-btn");
        restartGameBtn.addEventListener("click", restartGame);
    };

    return { activateMenu };
})();



/**********************************************************************/
Game.activateMenu();