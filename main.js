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
        score++;
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
         * Add EventListeners to tiles according three different cases
         */

        const tileElements = [...document.querySelectorAll("div.tile")];

        switch (gameState) {
            case 0: //Victory
                Game.newRound(); //+1 to the round counter
                if (Game.getRound() >= 3) {
                    Game.showGameOverHeader();
                    break; // Game over
                }

                const winner = Players.getPlayer1().getState()
                    ? Players.getPlayer1().getNickname()
                    : Players.getPlayer2().getNickname();

                tileElements.forEach((element) => {
                    document.getElementById("game-header").textContent =
                        winner + " wins!";
                    element.addEventListener("click", Game.continueNextGame);
                });
                break;

            case 1: //Tie
                Game.newRound(); //+1 to the round counter
                if (Game.getRound() >= 3) {
                    Game.showGameOverHeader();
                    break; // Game over
                }

                tileElements.forEach((element) => {
                    document.getElementById("game-header").textContent =
                        "It's a tie!";
                    element.addEventListener("click", Game.continueNextGame);
                });
                break;

            case 2: //Continue
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
                break;

            default:
                break;
        }
    };

    const validateWinningCondition = () => {
        const tilesArray = GameBoard.getTilesArray();
        /**
         Check results returning:
         0 to report a victory
         1 to report tie scenario
         2 to let continue the game
 
         The getActivePlayer() function is called to change the ActivePlayer
         class (CSS) and highligh needed PlayerInfo. 
         Also it returns the loser player

         The first 8 conditions check victory scenarios, followed by tie case
         and return 2 to allow the game keep going
         * 
         */
        let loser, winner;

        // Check horizontal winning scenarios
        if (
            tilesArray[0].getTileValue() == tilesArray[1].getTileValue() &&
            tilesArray[0].getTileValue() == tilesArray[2].getTileValue() &&
            tilesArray[0].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[0].getTakenBy().addScorePoint();
            return 0;
        }

        if (
            tilesArray[3].getTileValue() == tilesArray[4].getTileValue() &&
            tilesArray[3].getTileValue() == tilesArray[5].getTileValue() &&
            tilesArray[3].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[3].getTakenBy().addScorePoint();
            return 0;
        }

        if (
            tilesArray[6].getTileValue() == tilesArray[7].getTileValue() &&
            tilesArray[6].getTileValue() == tilesArray[8].getTileValue() &&
            tilesArray[6].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[6].getTakenBy().addScorePoint();
            return 0;
        }

        //Check vertical winning scenarios
        if (
            tilesArray[0].getTileValue() == tilesArray[3].getTileValue() &&
            tilesArray[0].getTileValue() == tilesArray[6].getTileValue() &&
            tilesArray[0].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[0].getTakenBy().addScorePoint();
            return 0;
        }

        if (
            tilesArray[1].getTileValue() == tilesArray[4].getTileValue() &&
            tilesArray[1].getTileValue() == tilesArray[7].getTileValue() &&
            tilesArray[1].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[1].getTakenBy().addScorePoint();
            return 0;
        }

        if (
            tilesArray[2].getTileValue() == tilesArray[5].getTileValue() &&
            tilesArray[2].getTileValue() == tilesArray[8].getTileValue() &&
            tilesArray[2].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[2].getTakenBy().addScorePoint();
            return 0;
        }

        //Check diagonal winning scenarios
        if (
            tilesArray[0].getTileValue() == tilesArray[4].getTileValue() &&
            tilesArray[0].getTileValue() == tilesArray[8].getTileValue() &&
            tilesArray[0].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[0].getTakenBy().addScorePoint();
            return 0;
        }

        if (
            tilesArray[2].getTileValue() == tilesArray[4].getTileValue() &&
            tilesArray[2].getTileValue() == tilesArray[6].getTileValue() &&
            tilesArray[2].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[2].getTakenBy().addScorePoint();
            return 0;
        }

        // To check whether game has finished in tie, all cells are checked to
        // know if they are holding values.
        for (let i = 0; i < tilesArray.length; i++) {
            if (tilesArray[i].getTileValue() == "") return 2; //Game continue
        }

        return 1; //Tie scenario
    };

    return { activateTiles, restartPlayersScore, restartPlayersState };
})();

const Game = (() => {
    /**
     * Control the game flow
     */
    let round = 0;

    const gameHeader = document.getElementById("game-header");

    const newRound = () => round++;
    const getRound = () => round;
    const restartRounds = () => (round = 0);

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
        restartRounds();
        GameBoard.restartBoard();
        PlayerActions.activateTiles(2);
        PlayerActions.restartPlayersScore();
        PlayerActions.restartPlayersState();
        displayPlayersInfo();
        gameHeader.textContent = "Tic-Tac-Toe";
    };

    const restartGame = () => {
        // Restart game with same player's config
        restartRounds();
        GameBoard.restartBoard();
        PlayerActions.activateTiles(2);
        PlayerActions.restartPlayersScore();
        PlayerActions.restartPlayersState();
        displayPlayersInfo();
        gameHeader.textContent = "Tic-Tac-Toe";
    };

    const continueNextGame = () => {
        // Clean the GameBoard to start a new round
        GameBoard.restartBoard();
        PlayerActions.restartPlayersState();
        PlayerActions.activateTiles(2);
        displayPlayersInfo();
        gameHeader.textContent = "Tic-Tac-Toe";
    };

    const showGameOverHeader = () => {
        const gOMsg = "Game Over: ";
        if (Players.getPlayer1().getScore() === Players.getPlayer2().getScore())
            gameHeader.textContent = gOMsg + "It's a tie!";
        if (Players.getPlayer1().getScore() > Players.getPlayer2().getScore())
            gameHeader.textContent =
                gOMsg + Players.getPlayer1().getNickname() + " wins!";
        if (Players.getPlayer1().getScore() < Players.getPlayer2().getScore())
            gameHeader.textContent =
                gOMsg + Players.getPlayer2().getNickname() + " wins!";
    };

    const showMenu = () => {        

        
    };

    const activateMenu = () => {
        // Get the modal
        const modal = document.getElementById("new-game-menu");

        // Get the button that opens the modal
        const newGameBtn = document.getElementById("newgame-btn");
        // When the user clicks the button, open the modal
        newGameBtn.addEventListener("click", () => {modal.style.display = "block";});

        // Get the <span> element that closes the modal
        const span = document.getElementsByClassName("close")[0];
        // When the user clicks on <span> (x), close the modal
        span.addEventListener("click", () => {modal.style.display = "none"});

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };

        // Restart game keeping the preview game settings, restartGame()
        const restartGameBtn = document.getElementById("restart-btn");
        restartGameBtn.addEventListener("click", restartGame);
    };

    return {
        activateMenu,
        displayPlayersInfo,
        continueNextGame,
        newRound,
        getRound,
        showGameOverHeader,
    };
})();

/**********************************************************************/
Game.activateMenu();
