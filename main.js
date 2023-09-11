const Tile = (x, y) => {
    /**
     * Generate tile objects with X and Y coordinates
     */

    const getCoordinateX = () => x;
    const getCoordinateY = () => y;

    let tileValue = ""; //Keep the player icon 'X' or 'O' who took the tile

    let takenBy; //Save the player who took this tile

    const getTileValue = () => tileValue;
    const setTileValue = (value) => (tileValue = value);
    const getTakenBy = () => takenBy;
    const setTakenBy = (player) => (takenBy = player);

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
        getTakenBy,
        setTakenBy,
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

    const setNickname = (newName) => (nickname = newName);
    const addScorePoint = () => score++;
    const setState = (state) => (isActivePlayer = state);
    const setPlayerMark = (newMark) => (mark = newMark);
    const restartScore = () => (score = 0);

    return {
        getNickname,
        getScore,
        addScorePoint,
        getState,
        setState,
        getMark,
        setPlayerMark,
        restartScore,
        setNickname,
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
    const restartPlayersState = () => {
        Players.getPlayer1().setState(true);
        Players.getPlayer2().setState(false);
    };

    const restartPlayersScore = () => {
        Players.getPlayer1().restartScore();
        Players.getPlayer2().restartScore();
    };

    function getTile(x, y) {
        /**
         * Looks for a specific tile of X and Y coordinates.
         */
        const tilesArray = GameBoard.getTilesArray();

        for (let i = 0; i < tilesArray.length; i++) {
            if (
                tilesArray[i].getCoordinateX() == x &&
                tilesArray[i].getCoordinateY() == y
            )
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
                    const activePlayer = getActivePlayer();
                    tile.setTileValue(activePlayer.getMark());
                    tile.setTakenBy(activePlayer);
                    GameBoard.refreshBoard();
                    validateWinningCondition();
                    activateTiles();
                }
            });
        });
    };

    const validateWinningCondition = () => {
        const tilesArray = GameBoard.getTilesArray();

        //Check horizontal winning scenarios
        if (
            tilesArray[0].getTileValue() == tilesArray[1].getTileValue() &&
            tilesArray[0].getTileValue() == tilesArray[2].getTileValue() &&
            tilesArray[0].getTileValue() !== ""
        ) {
            console.log(tilesArray[0].getTakenBy().getNickname());
            return;
        }

        if (
            tilesArray[3].getTileValue() == tilesArray[4].getTileValue() &&
            tilesArray[3].getTileValue() == tilesArray[5].getTileValue() &&
            tilesArray[3].getTileValue() !== ""
        ) {
            console.log(tilesArray[3].getTakenBy().getNickname());
            return;
        }

        if (
            tilesArray[6].getTileValue() == tilesArray[7].getTileValue() &&
            tilesArray[6].getTileValue() == tilesArray[8].getTileValue() &&
            tilesArray[6].getTileValue() !== ""
        ) {
            console.log(tilesArray[6].getTakenBy().getNickname());
            return;
        }

        //Check vertical winning scenarios
        if (
            tilesArray[0].getTileValue() == tilesArray[3].getTileValue() &&
            tilesArray[0].getTileValue() == tilesArray[6].getTileValue() &&
            tilesArray[0].getTileValue() !== ""
        ) {
            console.log(tilesArray[0].getTakenBy().getNickname());
            return;
        }

        if (
            tilesArray[1].getTileValue() == tilesArray[4].getTileValue() &&
            tilesArray[1].getTileValue() == tilesArray[7].getTileValue() &&
            tilesArray[1].getTileValue() !== ""
        ) {
            console.log(tilesArray[1].getTakenBy().getNickname());
            return;
        }

        if (
            tilesArray[2].getTileValue() == tilesArray[5].getTileValue() &&
            tilesArray[2].getTileValue() == tilesArray[8].getTileValue() &&
            tilesArray[2].getTileValue() !== ""
        ) {
            console.log(tilesArray[2].getTakenBy().getNickname());
            return;
        }

        //Check diagonal winning scenarios
        if (
            tilesArray[0].getTileValue() == tilesArray[4].getTileValue() &&
            tilesArray[0].getTileValue() == tilesArray[8].getTileValue() &&
            tilesArray[0].getTileValue() !== ""
        ) {
            console.log(tilesArray[0].getTakenBy().getNickname());
            return;
        }

        if (
            tilesArray[2].getTileValue() == tilesArray[4].getTileValue() &&
            tilesArray[2].getTileValue() == tilesArray[6].getTileValue() &&
            tilesArray[2].getTileValue() !== ""
        ) {
            console.log(tilesArray[2].getTakenBy().getNickname());
            return;
        }
    };

    return { activateTiles, restartPlayersScore, restartPlayersState };
})();

const Game = (() => {
    /**
     * Control the game flow
     */

    const displayPlayersInfo = () => {
        const nicknameP1 = document.getElementById("nickname-p1");
        const scoreP1 = document.getElementById("score-p1");
        nicknameP1.textContent =
            Players.getPlayer1().getMark() +
            ": " +
            Players.getPlayer1().getNickname();
        scoreP1.textContent = "Score: " + Players.getPlayer1().getScore();

        const nicknameP2 = document.getElementById("nickname-p2");
        const scoreP2 = document.getElementById("score-p2");
        nicknameP2.textContent =
            Players.getPlayer2().getMark() +
            ": " +
            Players.getPlayer2().getNickname();
        scoreP2.textContent = "Score: " + Players.getPlayer2().getScore();
    };

    const newGame = () => {
        // Set up new players
        displayPlayersInfo();
        GameBoard.restartBoard();
        PlayerActions.activateTiles();
        PlayerActions.restartPlayersScore();
        PlayerActions.restartPlayersState();
    };

    const restartGame = () => {
        // Restart game with same player's config
        displayPlayersInfo();
        GameBoard.restartBoard();
        PlayerActions.activateTiles();
        PlayerActions.restartPlayersScore();
        PlayerActions.restartPlayersState();
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
