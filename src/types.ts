export type Player = {
  id: number;
  name: string;
  iconString: string;
  colorClass: string;
  boardFontClass: string;
};

export type Move = {
  squareId: number;
  player: Player;
};

export type Game = {
  moves: Move[];
  status: GameStatus;
};

export type GameStatus = {
  isComplete: boolean;
  winner: Player | null;
};

export type GameState = {
  currentGameMoves: Move[];
  history: {
    currentRoundGames: Game[];
    allGames: Game[];
  };
};
