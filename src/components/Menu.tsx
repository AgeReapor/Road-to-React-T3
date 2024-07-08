import { useState } from "react";
import "./Menu.css";

type Props = {
  onAction(action: "reset" | "new-round"): void;
};

export default function Menu({ onAction }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="menu">
      <button
        className="menu-btn turquoise shadow"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        Actions
        <span className="material-symbols-outlined">
          {menuOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"}
        </span>
      </button>
      {menuOpen && (
        <div className="items border shadow">
          <button
            onClick={() => {
              onAction("reset");
              setMenuOpen(false);
            }}
          >
            Reset
          </button>
          <button
            onClick={() => {
              onAction("new-round");
              setMenuOpen(false);
            }}
          >
            New Round
          </button>
        </div>
      )}
    </div>
  );
}
