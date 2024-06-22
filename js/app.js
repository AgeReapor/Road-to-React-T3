// Namespace
const App = {
  // All of selected HTML Elements
  $: {
    menu: document.querySelector("[data-id='menu']"),
    menuItems: document.querySelector("[data-id='menu-items']"),
    resetBtn: document.querySelector("[data-id=reset-btn]"),
    newRoundBtn: document.querySelector("[data-id=new-round-btn]"),
    squares: document.querySelectorAll("[data-id=square]"),
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

    // DONE
    App.$.squares.forEach((square) => {
      square.addEventListener("click", () => {
        console.log(`Square ${square.id} Clicked`);
      });
    });
  },
};

// Initialize the app
window.addEventListener("load", App.init);
