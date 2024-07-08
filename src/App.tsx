import { useState } from "react";
import "./App.css";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import Modal from "./components/Modal";
import { GameState, Player } from "./types";
import classNames from "classnames";
import { useLocalStorage } from "@uidotdev/usehooks";
import { deriveGame, deriveStats } from "./utils";

export default function App() {
  // const [state, setState] = useState<GameState>({
  //   currentGameMoves: [],
  //   history: {
  //     currentRoundGames: [],
  //     allGames: [],
  //   },
  // });
  const [state, setState] = useLocalStorage<GameState>("react-t3-key", {
    currentGameMoves: [],
    history: {
      currentRoundGames: [],
      allGames: [],
    },
  });

  const game = deriveGame(state);
  const stats = deriveStats(state);

  function resetGame(isNewRound: boolean) {
    setState((prev) => {
      const stateClone = structuredClone(prev);
      const { status, moves } = game;

      if (status.isComplete) {
        stateClone.history.currentRoundGames.push({
          moves,
          status,
        });
      }
      stateClone.currentGameMoves = [];

      if (isNewRound) {
        stateClone.history.allGames.push(
          ...stateClone.history.currentRoundGames
        );
        stateClone.history.currentRoundGames = [];
      }
      return stateClone;
    });
  }

  function handlePlayerMove(squareId: number, player: Player) {
    setState((prev) => {
      const stateClone = structuredClone(prev);
      stateClone.currentGameMoves.push({
        squareId,
        player,
      });
      return stateClone;
    });
  }

  return (
    <>
      <main>
        <div className="grid">
          <div
            key={game.currentPlayer.id}
            className={classNames("turn", game.currentPlayer.colorClass)}
          >
            <span className="material-symbols-outlined">
              {game.currentPlayer.iconString}
            </span>
            <p>Player {game.currentPlayer.id}, you're up!</p>
          </div>

          <Menu onAction={(action) => resetGame(action === "new-round")} />

          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((squareId) => {
            const existingMove = game.moves.find(
              (move) => move.squareId === squareId
            );

            return (
              <div
                key={squareId}
                className="square shadow"
                onClick={() => {
                  if (existingMove !== undefined) return;

                  handlePlayerMove(squareId, game.currentPlayer);
                }}
              >
                <span
                  className={classNames(
                    "material-symbols-outlined",
                    existingMove?.player.colorClass,
                    existingMove?.player.boardFontClass
                  )}
                >
                  {existingMove ? existingMove.player.iconString : ""}
                </span>
              </div>
            );
          })}

          <div
            className="score shadow"
            style={{ backgroundColor: "var(--yellow)" }}
          >
            <p>Player 1</p>
            <span>{stats.playerWithStats[0].wins} Wins</span>
          </div>
          <div className="score shadow">
            <p>Ties</p>
            <span>{stats.ties}</span>
          </div>
          <div
            className="score shadow"
            style={{ backgroundColor: "var(--turquoise)" }}
          >
            <p>Player 2</p>
            <span data-id="p2-wins">{stats.playerWithStats[1].wins} Wins</span>
          </div>
        </div>
      </main>

      <Footer />

      {game.status.isComplete && (
        <Modal
          message={
            game.status.winner
              ? `${game.status.winner.name} wins!`
              : "It's a Tie!"
          }
          onClick={() => {
            resetGame(false);
          }}
        />
      )}
    </>
  );
}
