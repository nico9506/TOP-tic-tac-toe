const Tile = (x, y) => {
    /**
     * Generate tile objects with X and Y coordinates
     */

    const getCoordinateX = () => x;
    const getCoordinateY = () => y;

    let tileValue = ""; //Keep the player icon 'X' or 'O' who took the tile

    let takenBy = ""; //Save the player who took this tile

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
    let playerType = "";
    let winner = false;

    const getNickname = () => nickname;
    const getScore = () => score;
    const getState = () => isActivePlayer;
    const getMark = () => mark;
    const getPlayerType = () => playerType;
    const isWinner = () => winner;

    const setNickname = (newName) => (nickname = newName);
    const addScorePoint = () => {
        score++;
        Game.displayPlayersInfo();
    };
    const setState = (state) => (isActivePlayer = state);
    const setPlayerMark = (newMark) => (mark = newMark);
    const restartScore = () => (score = 0);
    const setPlayerType = (newType) => (playerType = newType);
    const setWinnerStatus = () => (winner = true);
    const restartWinnerStatus = () => (winner = false);

    return {
        getNickname,
        getScore,
        addScorePoint,
        getState,
        setState,
        getMark,
        isWinner,
        setPlayerMark,
        restartScore,
        setNickname,
        getPlayerType,
        setPlayerType,
        setWinnerStatus,
        restartWinnerStatus,
    };
};

const Players = (() => {
    /**
     * Creates only two players from the popup form "Start New Game"
     */
    const player1 = Player("Player 1");
    player1.setPlayerMark("O");
    player1.setPlayerType("human");
    player1.setState(true);

    const player2 = Player("Player 2");
    player2.setPlayerMark("X");
    player2.setPlayerType("ai");
    player2.setState(false);

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

    //to simulate and validate possible scenarios
    const board = ["", "", "", "", "", "", "", "", ""];

    const copyBoardForMinimax = () => {
        const tiles = [...document.querySelectorAll("div.tile")];
        for (let i = 0; i < tiles.length; i++) {
            let tile = PlayerActions.getTile(
                Number(tiles[i].getAttribute("corX")),
                Number(tiles[i].getAttribute("corY"))
            );
            board[i] = tile.getTileValue();
        }
    };

    const updateBoardForMinimax = (index, mark) => {
        board[index] = mark;
    };

    const getBoardForMinimax = () => board;

    return {
        getTilesArray,
        restartBoard,
        refreshBoard,
        updateBoardForMinimax,
        copyBoardForMinimax,
        getBoardForMinimax,
    };
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

    const restartWinner = () => {
        Players.getPlayer1().restartWinnerStatus();
        Players.getPlayer2().restartWinnerStatus();
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
            p1Info.classList.add(activeClass);
            p2Info.classList.remove(activeClass);
            return Players.getPlayer1();
        }

        if (Players.getPlayer2().getState()) {
            Players.getPlayer1().setState(true);
            Players.getPlayer2().setState(false);
            p1Info.classList.remove(activeClass);
            p2Info.classList.add(activeClass);
            return Players.getPlayer2();
        }

        console.log("Both players state is false");
        return 0;
    };

    const removeActiveClass = () => {
        /**
         * Remove the Active-player class from the html tags
         */

        const p1Info = document.getElementById("p1-info");
        const p2Info = document.getElementById("p2-info");
        const activeClass = "active-player";

        p1Info.classList.remove(activeClass);
        p2Info.classList.remove(activeClass);
    };

    const activateTiles = (gameState) => {
        /**
         * Add EventListeners to tiles according three different cases
         */

        const tileElements = [...document.querySelectorAll("div.tile")];

        switch (gameState) {
            case 0: //Victory
                removeActiveClass();

                Game.newRound(); //+1 to the round counter
                if (Game.getRound() >= 3) {
                    Game.showGameOverHeader();
                    break; // Game over
                }

                const winner = Players.getPlayer1().getState()
                    ? Players.getPlayer1().getNickname()
                    : Players.getPlayer2().getNickname();

                document.getElementById("game-header").textContent =
                    winner + " wins! (round " + Game.getRound() + ")";

                tileElements.forEach((element) => {
                    element.addEventListener("click", Game.continueNextGame);
                });
                break;

            case 1: //Tie
                removeActiveClass();

                Game.newRound(); //+1 to the round counter
                if (Game.getRound() >= 3) {
                    Game.showGameOverHeader();
                    break; // Game over
                }

                document.getElementById("game-header").textContent =
                    "It's a tie! (round " + Game.getRound() + ")";

                tileElements.forEach((element) => {
                    element.addEventListener("click", Game.continueNextGame);
                });
                break;

            case 2: //Continue
                const activePlayer = getActivePlayer();

                if (activePlayer.getPlayerType() == "ai") {
                    /**
                     * Easy-level AI: Random legal movements
                     */
                    executeRandomMovement(activePlayer);
                    break;
                } else if (activePlayer.getPlayerType() == "aix") {
                    /**
                     * Unbeatable AI: Executes movements using the minimax algorithm
                     */
                    findBestMovement(activePlayer);
                    break;
                } else {
                    /**
                     * Allows tiles to be clicked by a human player
                     */
                    tileElements.forEach((element) => {
                        element.addEventListener("click", () => {
                            let tile = getTile(
                                Number(element.getAttribute("corX")),
                                Number(element.getAttribute("corY"))
                            );
                            if (tile.getTileValue() === "") {
                                tile.setTileValue(activePlayer.getMark());
                                tile.setTakenBy(activePlayer);
                                GameBoard.refreshBoard();
                                activateTiles(validateWinningCondition());
                            }
                        });
                    });
                    break;
                }

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
            winner = tilesArray[0].getTakenBy();
            winner.addScorePoint();
            winner.setWinnerStatus(true);
            return 0;
        }

        if (
            tilesArray[3].getTileValue() == tilesArray[4].getTileValue() &&
            tilesArray[3].getTileValue() == tilesArray[5].getTileValue() &&
            tilesArray[3].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[3].getTakenBy();
            winner.addScorePoint();
            winner.setWinnerStatus(true);
            return 0;
        }

        if (
            tilesArray[6].getTileValue() == tilesArray[7].getTileValue() &&
            tilesArray[6].getTileValue() == tilesArray[8].getTileValue() &&
            tilesArray[6].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[6].getTakenBy();
            winner.addScorePoint();
            winner.setWinnerStatus(true);
            return 0;
        }

        //Check vertical winning scenarios
        if (
            tilesArray[0].getTileValue() == tilesArray[3].getTileValue() &&
            tilesArray[0].getTileValue() == tilesArray[6].getTileValue() &&
            tilesArray[0].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[0].getTakenBy();
            winner.addScorePoint();
            winner.setWinnerStatus(true);
            return 0;
        }

        if (
            tilesArray[1].getTileValue() == tilesArray[4].getTileValue() &&
            tilesArray[1].getTileValue() == tilesArray[7].getTileValue() &&
            tilesArray[1].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[1].getTakenBy();
            winner.addScorePoint();
            winner.setWinnerStatus(true);
            return 0;
        }

        if (
            tilesArray[2].getTileValue() == tilesArray[5].getTileValue() &&
            tilesArray[2].getTileValue() == tilesArray[8].getTileValue() &&
            tilesArray[2].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[2].getTakenBy();
            winner.addScorePoint();
            winner.setWinnerStatus(true);
            return 0;
        }

        //Check diagonal winning scenarios
        if (
            tilesArray[0].getTileValue() == tilesArray[4].getTileValue() &&
            tilesArray[0].getTileValue() == tilesArray[8].getTileValue() &&
            tilesArray[0].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[0].getTakenBy();
            winner.addScorePoint();
            winner.setWinnerStatus(true);
            return 0;
        }

        if (
            tilesArray[2].getTileValue() == tilesArray[4].getTileValue() &&
            tilesArray[2].getTileValue() == tilesArray[6].getTileValue() &&
            tilesArray[2].getTileValue() !== ""
        ) {
            loser = getActivePlayer();
            winner = tilesArray[2].getTakenBy();
            winner.addScorePoint();
            winner.setWinnerStatus(true);
            return 0;
        }

        // To check whether game has finished in tie, all cells are checked to
        // know if they are holding values.
        for (let i = 0; i < tilesArray.length; i++) {
            if (tilesArray[i].getTileValue() == "") return 2; //Game continue
        }

        return 1; //Tie scenario
    };

    const executeRandomMovement = (activePlayer) => {
        /**
         * Filters the available tiles to pick one and left it marked
         * as an AI movement
         */
        const tiles = [...document.querySelectorAll("div.tile")];
        const tilesAvailable = [];

        for (let i = 0; i < tiles.length; i++) {
            let tile = getTile(
                Number(tiles[i].getAttribute("corX")),
                Number(tiles[i].getAttribute("corY"))
            );
            if (tile.getTileValue() === "") {
                tilesAvailable.push(tile);
            }
        }

        const randomTile =
            tilesAvailable[Math.floor(Math.random() * tilesAvailable.length)];

        setTimeout(() => {
            randomTile.setTileValue(activePlayer.getMark());
            randomTile.setTakenBy(activePlayer);
            GameBoard.refreshBoard();
            activateTiles(validateWinningCondition());
        }, 1000);
    };

    const executeMinimax = (depth, isMaximizing) => {
        /**
         * Minimax algorithm to seek the optimum route
         */
        const AIPlayer = Players.getPlayer1().getState() ? "X" : "O";
        const opponent = Players.getPlayer2().getState() ? "X" : "O";

        const board = GameBoard.getBoardForMinimax();

        function checkWin(player) {
            // Check rows, columns, and diagonals for a win
            for (let i = 0; i < 9; i += 3) {
                if (
                    board[i] === player &&
                    board[i + 1] === player &&
                    board[i + 2] === player
                ) {
                    return true;
                }
            }
            for (let i = 0; i < 3; i++) {
                if (
                    board[i] === player &&
                    board[i + 3] === player &&
                    board[i + 6] === player
                ) {
                    return true;
                }
            }
            if (
                (board[0] === player &&
                    board[4] === player &&
                    board[8] === player) ||
                (board[2] === player &&
                    board[4] === player &&
                    board[6] === player)
            ) {
                return true;
            }
            return false;
        }

        function isBoardFull() {
            return board.every((cell) => cell !== "");
        }

        // Base case: if the game is over, return the score
        if (checkWin(AIPlayer)) {
            return 1;
        } else if (checkWin(opponent)) {
            return -1;
        } else if (isBoardFull()) {
            return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] == "") {
                    GameBoard.updateBoardForMinimax(i, AIPlayer);
                    const score = executeMinimax(depth + 1, false);
                    GameBoard.updateBoardForMinimax(i, "");
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] == "") {
                    GameBoard.updateBoardForMinimax(i, opponent);
                    const score = executeMinimax(depth + 1, true);
                    GameBoard.updateBoardForMinimax(i, "");
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    function findBestMovement(activePlayer) {
        /**
         * Function to find the best movement for the computer
         */
        let bestScore = -Infinity;
        let bestMove = -1;

        GameBoard.copyBoardForMinimax();
        const board = GameBoard.getBoardForMinimax();

        for (let i = 0; i < 9; i++) {
            if (board[i] == "") {
                board[i] = activePlayer.getMark();
                const score = executeMinimax(0, false);
                board[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        const tiles = [...document.querySelectorAll("div.tile")];
        const tilesAvailable = [];

        for (let i = 0; i < tiles.length; i++) {
            let tile = getTile(
                Number(tiles[i].getAttribute("corX")),
                Number(tiles[i].getAttribute("corY"))
            );
            tilesAvailable.push(tile);
        }

        setTimeout(() => {
            tilesAvailable[bestMove].setTileValue(activePlayer.getMark());
            tilesAvailable[bestMove].setTakenBy(activePlayer);
            GameBoard.refreshBoard();
            activateTiles(validateWinningCondition());
        }, 1000);
    }

    return {
        activateTiles,
        restartPlayersScore,
        restartPlayersState,
        restartWinner,
        getTile,
    };
})();

const Game = (() => {
    /**
     * Control the game flow
     */
    let round = 0;

    const gameHeader = document.getElementById("game-header");

    // Get the modal
    const modal = document.getElementById("new-game-menu");

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
        // Set up new players with the info got from the modal
        const p1Name = document.getElementById("p1-name");
        const p1Type = document.getElementById("p1-type");

        const p2Name = document.getElementById("p2-name");
        const p2Type = document.getElementById("p2-type");

        p1Name.value != ""
            ? Players.getPlayer1().setNickname(p1Name.value)
            : Players.getPlayer1().setNickname("Player 1");

        p1Type.value != ""
            ? Players.getPlayer1().setPlayerType(p1Type.value)
            : Players.getPlayer1().setPlayerType("human");

        p2Name.value != ""
            ? Players.getPlayer2().setNickname(p2Name.value)
            : Players.getPlayer2().setNickname("Player 2");

        p2Type.value != ""
            ? Players.getPlayer2().setPlayerType(p2Type.value)
            : Players.getPlayer2().setPlayerType("ai");

        p1Name.value = "";
        p2Name.value = "";

        modal.style.display = "none"; // Hide the modal after clicking START

        restartGame();
    };

    const restartGame = () => {
        // Restart game with same player's config
        restartRounds();
        GameBoard.restartBoard();
        PlayerActions.restartPlayersScore();
        PlayerActions.restartPlayersState();
        PlayerActions.restartWinner();
        PlayerActions.activateTiles(2);

        displayPlayersInfo();
        gameHeader.textContent = "Tic-Tac-Toe (round 1)";
    };

    const continueNextGame = () => {
        // Clean the GameBoard to start a new round
        GameBoard.restartBoard();
        PlayerActions.restartPlayersState();
        PlayerActions.restartWinner();
        PlayerActions.activateTiles(2);
        displayPlayersInfo();
        gameHeader.textContent =
            "Tic-Tac-Toe " + "(round " + (getRound() + 1) + ")";
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

    const activateMenu = () => {
        /**
         * Add EventListeners to the menu buttons
         */

        // Get the button that opens the modal
        const newGameBtn = document.getElementById("newgame-btn");
        // When the user clicks the button, open the modal
        newGameBtn.addEventListener("click", () => {
            modal.style.display = "block";
        });

        // Get the <span> element that closes the modal
        const span = document.getElementsByClassName("close")[0];
        // When the user clicks on <span> (x), close the modal
        span.addEventListener("click", () => {
            modal.style.display = "none";
        });

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };

        //Set up a new game with new players
        const startNewGame = document.getElementById("set-game");
        startNewGame.addEventListener("click", newGame);

        // Restart game keeping the previous game settings, restartGame()
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
