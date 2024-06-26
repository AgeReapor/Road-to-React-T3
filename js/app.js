import View from "./view.js";
import Store from "./store.js";

const players = [
  {
    id: 1,
    name: "Player 1",
    iconString: "close",
    colorClass: "yellow",
    boardFontClass: "board-x",
  },
  {
    id: 2,
    name: "Player 2",
    iconString: "circle",
    colorClass: "turquoise",
    boardFontClass: "board-o",
  },
];

function init() {
  const view = new View();
  const store = new Store("live-t3-storage-key", players);

  // Current tab state changes
  store.addEventListener("stateChanged", () => {
    view.render(store.game, store.stats);
  });

  // Different tab state changes
  window.addEventListener("storage", (e) => {
    console.log("State changed in another tab");
    if (e.key === store.storageKey) {
      view.render(store.game, store.stats);
    }
  });

  // Initial render
  view.render(store.game, store.stats);

  view.bindGameResetEvent((e) => {
    store.reset();
  });

  view.bindNewRoundEvent((e) => {
    store.newRound();
  });

  view.bindPlayerMoveEvent((square) => {
    console.log(square);

    // Check if move already exists
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );

    if (existingMove) return;

    // Store move and set next player
    store.playerMove(+square.id);
  });

  console.log(view.$);
}

window.addEventListener("load", init);
