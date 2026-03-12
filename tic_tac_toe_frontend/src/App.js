import React, { useMemo, useState } from "react";
import "./App.css";

/**
 * Return the winner ("X" | "O") if present, otherwise null.
 * Also returns the winning line indices for highlighting.
 */
function calculateWinner(squares) {
  const lines = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

function isDraw(squares) {
  return squares.every(Boolean);
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Game state:
   * - squares: board cells (9)
   * - xIsNext: current player toggle
   * - history: minimal local move list (for retro "log" feel)
   */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([]);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const draw = useMemo(() => !winner && isDraw(squares), [winner, squares]);

  const currentPlayer = xIsNext ? "X" : "O";
  const gameOver = Boolean(winner) || draw;

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (draw) return "Draw: No moves left";
    return `Turn: ${currentPlayer}`;
  }, [winner, draw, currentPlayer]);

  function handleSquareClick(index) {
    if (gameOver) return;
    if (squares[index]) return;

    const nextSquares = squares.slice();
    nextSquares[index] = currentPlayer;

    setSquares(nextSquares);
    setXIsNext(!xIsNext);

    setHistory((prev) => [
      ...prev,
      {
        moveNumber: prev.length + 1,
        player: currentPlayer,
        position: index,
      },
    ]);
  }

  // PUBLIC_INTERFACE
  function restartRound() {
    /** Restart the current round (same "session", clears board and history). */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setHistory([]);
  }

  // PUBLIC_INTERFACE
  function newGame() {
    /**
     * Start a "new game" (currently same as restart, but left as separate
     * affordance in UI per requirements and future extensibility).
     */
    restartRound();
  }

  return (
    <div className="App">
      <main className="ttt-shell">
        <header className="ttt-header">
          <div className="ttt-badge" aria-hidden="true">
            8-BIT
          </div>
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <p className="ttt-subtitle">Local 2-player • Retro Arcade Edition</p>
        </header>

        <section className="ttt-status" aria-live="polite">
          <span className={`ttt-statusText ${winner ? "is-winner" : ""}`}>
            {statusText}
          </span>

          {!gameOver ? (
            <span className="ttt-hint" aria-hidden="true">
              Click a tile to place {currentPlayer}
            </span>
          ) : (
            <span className="ttt-hint" aria-hidden="true">
              Press Restart or New Game to play again
            </span>
          )}
        </section>

        <section className="ttt-boardWrap" aria-label="Tic Tac Toe board">
          <div className="ttt-board" role="grid" aria-label="3 by 3 grid">
            {squares.map((value, i) => {
              const isWinning = line.includes(i);
              return (
                <button
                  key={i}
                  type="button"
                  className={[
                    "ttt-square",
                    value ? "is-filled" : "",
                    isWinning ? "is-winning" : "",
                    gameOver ? "is-locked" : "",
                  ].join(" ")}
                  onClick={() => handleSquareClick(i)}
                  role="gridcell"
                  aria-label={`Square ${i + 1}${value ? `, ${value}` : ""}${
                    isWinning ? ", winning square" : ""
                  }`}
                >
                  <span className="ttt-squareInner" aria-hidden="true">
                    {value ?? ""}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="ttt-controls" aria-label="Game controls">
            <button
              type="button"
              className="ttt-btn ttt-btnPrimary"
              onClick={restartRound}
            >
              Restart
            </button>
            <button type="button" className="ttt-btn" onClick={newGame}>
              New Game
            </button>
          </div>
        </section>

        <section className="ttt-panel" aria-label="Game details">
          <div className="ttt-panelRow">
            <div className="ttt-pill" aria-label="Player X">
              <span className="ttt-pillLabel">X</span>
              <span className={`ttt-pillValue ${xIsNext && !gameOver ? "is-active" : ""}`}>
                {xIsNext && !gameOver ? "Playing" : winner === "X" ? "Won" : "Waiting"}
              </span>
            </div>
            <div className="ttt-pill" aria-label="Player O">
              <span className="ttt-pillLabel">O</span>
              <span className={`ttt-pillValue ${!xIsNext && !gameOver ? "is-active" : ""}`}>
                {!xIsNext && !gameOver ? "Playing" : winner === "O" ? "Won" : "Waiting"}
              </span>
            </div>
          </div>

          <div className="ttt-moves" aria-label="Move history">
            <h2 className="ttt-panelTitle">Move Log</h2>
            {history.length === 0 ? (
              <p className="ttt-panelEmpty">No moves yet. Insert coin to begin.</p>
            ) : (
              <ol className="ttt-moveList">
                {history
                  .slice()
                  .reverse()
                  .map((m) => (
                    <li key={m.moveNumber} className="ttt-moveItem">
                      <span className="ttt-moveNum">#{m.moveNumber}</span>
                      <span className="ttt-moveText">
                        {m.player} → tile {m.position + 1}
                      </span>
                    </li>
                  ))}
              </ol>
            )}
          </div>
        </section>

        <footer className="ttt-footer">
          <span className="ttt-footerText">
            Tip: First to align 3 wins. No backend required.
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;
