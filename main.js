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

const Player = (nickname = "Unknown Player") => {
    /**
     * Generate player objects
     */
    let score = 0;
    let isActivePlayer = false;
    let mark = "";

    const getNickname = () => nickname;
    const getScore = () => score;
    const getState = () => isActivePlayer;
    const getMark = () => mark;

    const addScorePoint = () => score++;
    const setState = (state) => (isActivePlayer = state);
    const setPlayerMark = (newMark) => (mark = newMark);

    return {
        getNickname,
        getScore,
        addScorePoint,
        getState,
        setState,
        getMark,
        setPlayerMark,
    };
};

const Players = (() => {
    /**
     * Creates only two players from the popup form "Start New Game"
     */
    const player1 = Player("Player 1");
    player1.setPlayerMark("O");
    player1.setState(true);

    const player2 = Player("Player 2");
    player2.setPlayerMark("X");

    const getPlayer1 = () => player1;
    const getPlayer2 = () => player2;

    return { getPlayer1, getPlayer2 };
})();

const GameBoard = (() => {
    /**
     * Generates the game board, which is formed by an array of tiles,
     * to be placed in the interface within a div#board HTML element
     */

    const tilesByColumn = 3;
    const tilesByRow = 3;
    let tilesArray = [];
    let pivotArray = [];
    let boardElement = document.getElementById("board");
    const gameContainerElement = document.getElementById("game-container");

    const deleteBoard = () => {
        if (boardElement) boardElement.remove();
        boardElement = document.createElement("div");
        boardElement.setAttribute("id", "board");
        gameContainerElement.appendChild(boardElement);
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
     * Allows to add marks to the tiles validating each action according to
     * the game's rules
     */

    function getTile(x, y) {
        /**
         * Looks for a specific tile of X and Y coordinates.
         */
        const tilesArray = GameBoard.getTilesArray();

        for (let i = 0; i < tilesArray.length; i++) {
            if (tilesArray[i].getCoordinateX() == x &&
                tilesArray[i].getCoordinateY() == y)
                return tilesArray[i];
        }

        return 0;
    }

    const getActivePlayer = () => {
        if (Players.getPlayer1().getState()) {
            Players.getPlayer1().setState(false);
            Players.getPlayer2().setState(true);
            return Players.getPlayer1();
        }

        if (Players.getPlayer2().getState()) {
            Players.getPlayer1().setState(true);
            Players.getPlayer2().setState(false);
            return Players.getPlayer2();
        }

        console.log("Both players state is false");
        return 0;
    };

    const activateTiles = () => {
        /**
         * Only add the eventListener to the tiles with no mark
         */
        const tileElements = [...document.querySelectorAll("div.tile")];

        tileElements.forEach((element) => {
            element.addEventListener("click", () => {
                let tile = getTile(
                    Number(element.getAttribute("corX")),
                    Number(element.getAttribute("corY"))
                );
                if (tile.getTileValue() === "") {
                    tile.setTileValue(getActivePlayer().getMark());
                    GameBoard.refreshBoard();
                    activateTiles();
                }
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