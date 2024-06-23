import View from "./view.js";

function init() {
  const view = new View();

  view.bindGameResetEvent((e) => {
    console.log("Reset Event");
    console.log(e);
  });

  view.bindNewRoundEvent((e) => {
    console.log("New Round Event");
    console.log(e);
  });

  view.bindPlayerMoveEvent((e) => {
    view.setTurnIndicator(2);
    view.handlePlayerMove(e.target, 1);
  });

  console.log(view.$);
}

window.addEventListener("load", init);

// For Reference
const App = {
  // All of selected HTML Elements
  $: {
    menu: document.querySelector("[data-id='menu']"),
    menuItems: document.querySelector("[data-id='menu-items']"),
    resetBtn: document.querySelector("[data-id=reset-btn]"),
    newRoundBtn: document.querySelector("[data-id=new-round-btn]"),
    squares: document.querySelectorAll("[data-id=square]"),
    modal: document.querySelector("[data-id=modal]"),
    modalText: document.querySelector("[data-id=modal-text]"),
    modalBtn: document.querySelector("[data-id=modal-btn]"),
    turn: document.querySelector("[data-id=turn]"),
  },

  state: {
    moves: [],
  },

  getGameStatus(moves) {
    const p1Moves = moves
      .filter((move) => move.playerId === 1)
      .map((move) => +move.squareId);
    const p2Moves = moves
      .filter((move) => move.playerId === 2)
      .map((move) => +move.squareId);

    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];

    let winner = null;
    winningPatterns.forEach((pattern) => {
      const p1Wins = pattern.every((value) => p1Moves.includes(value));
      const p2Wins = pattern.every((value) => p2Moves.includes(value));

      if (p1Wins) winner = 1;
      if (p2Wins) winner = 2;
    });

    return {
      status: moves.length === 9 || winner != null ? "complete" : "in-progress", // in-progress | complete
      winner, // 1 | 2 | null
    };
  },

  init() {
    App.registerEventListeners();
  },

  registerEventListeners() {
    // add event listeners

    // DONE
    App.$.menu.addEventListener("click", (e) => {
      App.$.menuItems.classList.toggle("hidden");
    });

    // TODO
    App.$.resetBtn.addEventListener("click", () => {
      console.log("Game Reset");
    });

    // TODO
    App.$.newRoundBtn.addEventListener("click", () => {
      console.log("New Round");
    });

    // TODO
    App.$.modalBtn.addEventListener("click", (e) => {
      App.state.moves = [];
      App.$.squares.forEach((square) => {
        square.replaceChildren();
      });
      App.$.modal.classList.add("hidden");
      App.$.turn.textContent = "Player 1, you're up!";
    });

    // DONE
    App.$.squares.forEach((square) => {
      square.addEventListener("click", () => {
        console.log(`Square ${square.id} Clicked`);
        // console.log(`Current player: ${App.state.currentPlayer}`);

        // If the square is already filled, don't do anything
        const hasMove = (squareId) => {
          const existingMove = App.state.moves.find(
            (move) => move.squareId === squareId
          );
          return existingMove !== undefined;
        };

        if (hasMove(+square.id)) {
          return;
        }

        // Determine current player and update the square
        // const lastMove = App.state.moves.at(-1);
        // const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);
        // const currentPlayer =
        //   App.state.moves.length === 0
        //     ? 1
        //     : getOppositePlayer(lastMove.playerId);
        const currentPlayer = App.state.moves.length % 2 ? 2 : 1;
        const nextPlayer = currentPlayer === 1 ? 2 : 1;

        const span = document.createElement("span");

        span.classList.add("material-symbols-outlined");

        const turnIcon = document.createElement("span");
        turnIcon.classList.add("material-symbols-outlined");
        const turnLabel = document.createElement("p");
        turnLabel.textContent = `Player ${nextPlayer}, you're up!`;

        if (currentPlayer === 1) {
          span.classList.add("yellow");
          span.textContent = "close";

          turnIcon.textContent = "circle";
          App.$.turn.classList.remove("yellow");

          App.$.turn.classList.add("turquoise");

          // font size
          span.style.fontSize = "4rem";
        } else {
          span.classList.add("turquoise");
          span.textContent = "circle";
          span.style.fontSize = "3.5rem";

          turnIcon.textContent = "close";

          App.$.turn.classList.remove("turquoise");

          App.$.turn.classList.add("yellow");
        }

        App.$.turn.replaceChildren(turnIcon, turnLabel);

        //     <span class="material-symbols-outlined yellow" style="font-size: 3rem">close</span>

        //     <span class="material-symbols-outlined turquoise" style="font-size: 2.5rem">circle</span>

        App.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer,
        });

        square.replaceChildren(span);

        console.log(App.state.moves);

        // Check if there is a winner or tie
        const game = App.getGameStatus(App.state.moves);

        if (game.status === "complete") {
          App.$.modal.classList.remove("hidden");
          let message = "";
          if (game.winner) {
            message = `Player ${game.winner} wins!`;
          } else {
            message = "Tie game!";
          }
          App.$.modalText.textContent = message;
        }
      });
    });
  },
};
