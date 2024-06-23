export default class View {
  $ = {};
  $$ = {};

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

    this.$$.squares = this.#qsAll("[data-id=square]");

    // UI-only Events
    this.$.menuBtn.addEventListener("click", (e) => {
      this.#toggleMenu();
    });
  }

  /**
   * Register Event Listeners
   */

  bindGameResetEvent(handler) {
    this.$.resetBtn.addEventListener("click", handler);
  }

  bindNewRoundEvent(handler) {
    this.$.newRoundBtn.addEventListener("click", handler);
  }

  bindPlayerMoveEvent(handler) {
    this.$$.squares.forEach((square) => {
      square.addEventListener("click", handler);
    });
  }

  /**
   * DOM Helper Methods
   */

  #toggleMenu() {
    this.$.menuItems.classList.toggle("hidden");
    this.$.menuBtn.classList.toggle("border");

    const icon = this.$.menuBtn.querySelector(".material-symbols-outlined");

    icon.innerText =
      icon.innerText === "keyboard_arrow_down"
        ? "keyboard_arrow_up"
        : "keyboard_arrow_down";
  }

  // player = 1 | 2
  setTurnIndicator(player) {
    const icon = document.createElement("span");
    icon.classList.add("material-symbols-outlined");
    const label = document.createElement("p");

    this.$.turn.classList.add(player === 1 ? "yellow" : "turquoise");
    this.$.turn.classList.remove(player === 1 ? "turquoise" : "yellow");

    icon.innerText = player === 1 ? "close" : "circle";
    label.innerText = `Player ${player}, you're up!`;

    this.$.turn.replaceChildren(icon, label);
  }

  #qs(selector, parent = document) {
    const el = parent.querySelector(selector);
    if (!el) throw new Error(`Element not found: ${selector}`);
    return el;
  }

  #qsAll(selector) {
    const el = document.querySelectorAll(selector);
    if (!el) throw new Error(`Elements not found: ${selector}`);
    return el;
  }
}
