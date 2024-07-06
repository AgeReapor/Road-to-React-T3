export default class View {
  $: Record<string, Element> = {};
  $$: Record<string, NodeListOf<Element>> = {};

  constructor() {
    this.$.menu = this.#qs("[data-id=menu]");
    this.$.menuBtn = this.#qs("[data-id=menu-btn]");
    this.$.menuItems = this.#qs("[data-id=menu-items]");
    this.$.resetBtn = this.#qs("[data-id=reset-btn]");
    this.$.newRoundBtn = this.#qs("[data-id=new-round-btn]");
    this.$.modal = this.#qs("[data-id=modal]");
    this.$.modalText = this.#qs("[data-id=modal-text]");
    this.$.modalBtn = this.#qs("[data-id=modal-btn]");
    this.$.turn = this.#qs("[data-id=turn]");
    this.$.p1Wins = this.#qs("[data-id=p1-wins]");
    this.$.p2Wins = this.#qs("[data-id=p2-wins]");
    this.$.ties = this.#qs("[data-id=ties]");

    this.$$.squares = this.#qsAll("[data-id=square]");

    // UI-only Events
    this.$.menuBtn.addEventListener("click", (e) => {
      this.#toggleMenu();
    });
  }

  render(game, stats) {
    const { playerWithStats, ties } = stats;
    const {
      moves,
      currentPlayer,
      status: { isComplete, winner },
    } = game;

    this.#closeAll();
    this.#clearMoves();
    this.#updateScoreboard(
      playerWithStats[0].wins,
      playerWithStats[1].wins,
      ties
    );
    this.#initializeMoves(moves);

    if (isComplete) {
      this.#openModal(winner ? `${winner.name} Wins!` : "It's a Tie!");
      return;
    }
    this.#setTurnIndicator(currentPlayer);
  }

  /**
   * Register Event Listeners
   */

  bindGameResetEvent(handler) {
    this.$.resetBtn.addEventListener("click", handler);
    this.$.modalBtn.addEventListener("click", handler);
  }

  bindNewRoundEvent(handler) {
    this.$.newRoundBtn.addEventListener("click", handler);
  }

  bindPlayerMoveEvent(handler) {
    this.$$.squares.forEach((square) => {
      square.addEventListener("click", () => handler(square));
    });
  }

  /**
   * DOM Helper Methods
   */

  #updateScoreboard(p1Wins, p2Wins, ties) {
    this.$.p1Wins.innerText = `${p1Wins} Wins`;
    this.$.p2Wins.innerText = `${p2Wins} Wins`;
    this.$.ties.innerText = ties;
  }

  #openModal(message) {
    this.$.modal.classList.remove("hidden");

    this.$.modalText.innerText = message;
  }

  #closeModal() {
    this.$.modal.classList.add("hidden");
  }

  #initializeMoves(moves) {
    this.$$.squares.forEach((square) => {
      const existingMove = moves.find((move) => move.squareId === +square.id);

      if (existingMove) {
        this.#handlePlayerMove(square, existingMove.player);
      }
    });
  }

  #closeMenu() {
    this.$.menuItems.classList.add("hidden");
    this.$.menuBtn.classList.remove("border");

    const icon = this.$.menuBtn.querySelector(".material-symbols-outlined");
    icon.innerText = "keyboard_arrow_down";
  }

  #closeAll() {
    this.#closeModal();
    this.#closeMenu();
  }

  #clearMoves() {
    this.$$.squares.forEach((square) => {
      square.replaceChildren();
    });
  }

  #toggleMenu() {
    this.$.menuItems.classList.toggle("hidden");
    this.$.menuBtn.classList.toggle("border");

    const icon = this.$.menuBtn.querySelector(".material-symbols-outlined");

    icon.innerText =
      icon.innerText === "keyboard_arrow_down"
        ? "keyboard_arrow_up"
        : "keyboard_arrow_down";
  }

  #handlePlayerMove(square, player) {
    const icon = this.#createIcon(player);
    icon.classList.add(player.boardFontClass);
    square.replaceChildren(icon);
  }

  // player = 1 | 2
  #setTurnIndicator(player) {
    const label = document.createElement("p");
    const icon = this.#createIcon(player);

    label.classList.add(player.colorClass);
    label.innerText = `${player.name}, you're up!`;

    this.$.turn.replaceChildren(icon, label);
  }

  #qs(selector: string, parent = document) {
    const el = parent.querySelector(selector);
    if (!el) throw new Error(`Element not found: ${selector}`);
    return el;
  }

  #qsAll(selector: string) {
    const el = document.querySelectorAll(selector);
    if (!el) throw new Error(`Elements not found: ${selector}`);
    return el;
  }

  #createIcon(player) {
    const icon = document.createElement("span");
    icon.classList.add("material-symbols-outlined", player.colorClass);
    icon.innerText = player.iconString;
    return icon;
  }
}
