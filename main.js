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
    const addScorePoint = () => {
        score++
        Game.displayPlayersInfo();
    };
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
        const p1Info = document.getElementById("p1-info");
        const p2Info = document.getElementById("p2-info");
        const activeClass = "active-player";
        
        if (Players.getPlayer1().getState()) {
            Players.getPlayer1().setState(false);
            Players.getPlayer2().setState(true);
            p1Info.classList.remove(activeClass);
            p2Info.classList.add(activeClass);
            return Players.getPlayer1();
        }

        if (Players.getPlayer2().getState()) {
            Players.getPlayer1().setState(true);
            Players.getPlayer2().setState(false);
            p1Info.classList.add(activeClass);
            p2Info.classList.remove(activeClass);
            return Players.getPlayer2();
        }

        console.log("Both players state is false");
        return 0;
    };

    const activateTiles = (gameState) => {
        /**
         * Only add the eventListener to the tiles with no mark
         * while the gameState is true (active)
         */

        const tileElements = [...document.querySelectorAll("div.tile")];

        if (!gameState) {
            tileElements.forEach((element) => {
                element.addEventListener("click", Game.continueNextGame);
            });

            return;
        }

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
                    activateTiles(validateWinningCondition());
                }
            });
        });
    };

    const validateWinningCondition = () => {
        const tilesArray = GameBoard.getTilesArray();

        let loser, winner;

        //Check horizontal winning scenarios
        //Return true or false to continue or not the game 

        // The getActivePlayer() function is called to change the ActivePlayer 
        // class and highligh needed PlayerInfo. Also it returns the loser player
        if (
            tilesArray[0].getTileValue() == tilesArray[1].getTileValue() &&
            tilesArray[0].getTileValue() == tilesArray[2].getTileValue() &&
            tilesArray[0].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[0].getTakenBy().addScorePoint();
            return false;
        }

        if (
            tilesArray[3].getTileValue() == tilesArray[4].getTileValue() &&
            tilesArray[3].getTileValue() == tilesArray[5].getTileValue() &&
            tilesArray[3].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[3].getTakenBy().addScorePoint();
            return false;
        }

        if (
            tilesArray[6].getTileValue() == tilesArray[7].getTileValue() &&
            tilesArray[6].getTileValue() == tilesArray[8].getTileValue() &&
            tilesArray[6].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[6].getTakenBy().addScorePoint();
            return false;
        }

        //Check vertical winning scenarios
        if (
            tilesArray[0].getTileValue() == tilesArray[3].getTileValue() &&
            tilesArray[0].getTileValue() == tilesArray[6].getTileValue() &&
            tilesArray[0].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[0].getTakenBy().addScorePoint();
            return false;
        }

        if (
            tilesArray[1].getTileValue() == tilesArray[4].getTileValue() &&
            tilesArray[1].getTileValue() == tilesArray[7].getTileValue() &&
            tilesArray[1].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[1].getTakenBy().addScorePoint();
            return false;
        }

        if (
            tilesArray[2].getTileValue() == tilesArray[5].getTileValue() &&
            tilesArray[2].getTileValue() == tilesArray[8].getTileValue() &&
            tilesArray[2].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[2].getTakenBy().addScorePoint();
            return false;
        }

        //Check diagonal winning scenarios
        if (
            tilesArray[0].getTileValue() == tilesArray[4].getTileValue() &&
            tilesArray[0].getTileValue() == tilesArray[8].getTileValue() &&
            tilesArray[0].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[0].getTakenBy().addScorePoint();
            return false;
        }

        if (
            tilesArray[2].getTileValue() == tilesArray[4].getTileValue() &&
            tilesArray[2].getTileValue() == tilesArray[6].getTileValue() &&
            tilesArray[2].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[2].getTakenBy().addScorePoint();
            return false;
        }

        return true;
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
        GameBoard.restartBoard();
        PlayerActions.activateTiles(true);
        PlayerActions.restartPlayersScore();
        PlayerActions.restartPlayersState();
        displayPlayersInfo();
    };

    const restartGame = () => {
        // Restart game with same player's config
        GameBoard.restartBoard();
        PlayerActions.activateTiles(true);
        PlayerActions.restartPlayersScore();
        PlayerActions.restartPlayersState();
        displayPlayersInfo();
    };

    const continueNextGame = () => {
        // Clean the GameBoard to start a new round
        GameBoard.restartBoard();
        PlayerActions.restartPlayersState();
        PlayerActions.activateTiles(true);
        displayPlayersInfo();
    }

    const activateMenu = () => {
        const newGameBtn = document.getElementById("newgame-btn");
        newGameBtn.addEventListener("click", newGame);

        const restartGameBtn = document.getElementById("restart-btn");
        restartGameBtn.addEventListener("click", restartGame);
    };

    return { activateMenu, displayPlayersInfo, continueNextGame };
})();

/**********************************************************************/
Game.activateMenu();
