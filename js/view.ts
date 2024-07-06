import type { Move, Player } from "./types";
import { DerivedStats, DerivedGame } from "./store";

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
    this.$.grid = this.#qs("[data-id=grid]");

    this.$$.squares = this.#qsAll("[data-id=square]");

    // UI-only Events
    this.$.menuBtn.addEventListener("click", (e) => {
      this.#toggleMenu();
    });
  }

  render(game: DerivedGame, stats: DerivedStats) {
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

  bindGameResetEvent(handler: EventListener) {
    this.$.resetBtn.addEventListener("click", handler);
    this.$.modalBtn.addEventListener("click", handler);
  }

  bindNewRoundEvent(handler: EventListener) {
    this.$.newRoundBtn.addEventListener("click", handler);
  }

  bindPlayerMoveEvent(handler: (element: Element) => void) {
    // this.$$.squares.forEach((square) => {
    //   square.addEventListener("click", () => handler(square));
    // });
    this.#delegate(this.$.grid, "[data-id=square]", "click", handler);
  }

  /**
   * DOM Helper Methods
   */

  #updateScoreboard(p1Wins: number, p2Wins: number, ties: number) {
    this.$.p1Wins.textContent = `${p1Wins} Wins`;
    this.$.p2Wins.textContent = `${p2Wins} Wins`;
    this.$.ties.textContent = `${ties}`;
  }

  #openModal(message: string) {
    this.$.modal.classList.remove("hidden");

    this.$.modalText.textContent = message;
  }

  #closeModal() {
    this.$.modal.classList.add("hidden");
  }

  #initializeMoves(moves: Move[]) {
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

    const icon = this.#qs(".material-symbols-outlined", this.$.menuBtn);
    icon.textContent = "keyboard_arrow_down";
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

    const icon = this.#qs(".material-symbols-outlined", this.$.menuBtn);

    icon.textContent =
      icon.textContent === "keyboard_arrow_down"
        ? "keyboard_arrow_up"
        : "keyboard_arrow_down";
  }

  #handlePlayerMove(square: Element, player: Player) {
    const icon = this.#createIcon(player);
    icon.classList.add(player.boardFontClass);
    square.replaceChildren(icon);
  }

  // player = 1 | 2
  #setTurnIndicator(player: Player) {
    const label = document.createElement("p");
    const icon = this.#createIcon(player);

    label.classList.add(player.colorClass);
    label.innerText = `${player.name}, you're up!`;

    this.$.turn.replaceChildren(icon, label);
  }

  #qs(selector: string, parent: Element | Document = document) {
    const el = parent.querySelector(selector);
    if (!el) throw new Error(`Element not found: ${selector}`);
    return el;
  }

  #qsAll(selector: string) {
    const el = document.querySelectorAll(selector);
    if (!el) throw new Error(`Elements not found: ${selector}`);
    return el;
  }

  #createIcon(player: Player) {
    const icon = document.createElement("span");
    icon.classList.add("material-symbols-outlined", player.colorClass);
    icon.innerText = player.iconString;
    return icon;
  }

  #delegate(
    element: Element,
    selector: string,
    eventKey: string,
    handler: (element: Element) => void
  ) {
    element.addEventListener(eventKey, (e) => {
      if (!(e.target instanceof Element)) {
        throw new Error(`Element not found: ${selector}`);
      }

      if (e.target.matches(selector)) {
        handler(e.target);
      }
    });
  }
}
