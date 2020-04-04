import React from "react";
import ReactDOM from "react-dom";
import "./index.css";




function Square(props) {
  return (
    <div className="square" onClick={props.onClick}>{props.value}</div>
  )
}

// TODO: Rewrite Board to use two loops to make the squares
class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />
    )
  }
  createSquare = () => {
    let row = [];
    let k = 3;
    let j = 0
    for (let i = 0; i < 3; i++) {
      let square = [];
      for (j; j < k; j++) {
        square.push(this.renderSquare(j));
      }
      k += 3;
      row.push(<div className="board-row">{square}</div>)
    }
    return row;
  }

  render() {
    return (
      <div>
        {/* <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div> */}
        {this.createSquare()}
      </div>
    )
  }
}

// need way to pass value of square after the winning click to game component's winner div
// lift up state for calculate winner to have access to squares array
// want to access current state of board for calculate winner so make copy of current state of squares to pass to calculateWinner
// displays Next Player: xIsNext ? "X" : "O" until calculateWinner rings true
// dynamic list creates buttons upon updates click events and allows you to update size of array if you select the button
// update index of state array upon selecting a button
//
// TODO display location for each move in format (col, row) in the move history list

class Game extends React.Component {
  // constructor needs to keep track of all possible squares arrays
  // concat first null array with click event moves
  // create history array to hold the moves
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          col: null,
          row: null
        },
      ],
      xIsNext: true,
      stepNumber: 0,
    }
  }
  // * col 1 is [0,3,6], col 2 is [1, 4,7], col 3 is [2,5,8]
  // * row 1 is [0,1,2], row 1 is [3,4,5], row 2 is [6,7,8]
  // * passing i up to handleClick event -> conditional statement to place in history list
  // gets passed i of clicked value,
  handleClick(i) {
    // change state of corresponding square to display an X
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let col;
    let row;
    switch (i) {
      case (0):
      case (3):
      case (6):
        col = 1;
        break;
      case (1):
      case (4):
      case (7):
        col = 2;
        break;
      case (2):
      case (5):
      case (8):
        col = 3;
        break;
    }
    // * row 1 is [0,1,2], row 1 is [3,4,5], row 2 is [6,7,8]
    switch (i) {
      case (0):
      case (1):
      case (2):
        row = 1;
        break;
      case (3):
      case (4):
      case (5):
        row = 2;
        break;
      case (6):
      case (7):
      case (8):
        row = 3;
        break;
    }
    console.log(col, row);
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat({
        squares: squares,
        col: col,
        row: row
      }),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }

  goToMove(e, move) {
    // const history = this.state.history.slice();
    // const shorten = history.slice(0, move);
    let allButtons = document.querySelectorAll('li > button');
    [...allButtons].forEach(button => {
      button.classList.remove('button-bold')
    })
    let button = e.target;
    e.target.classList.add('button-bold');
    console.log(button)
    this.setState({
      stepNumber: move,
      xIsNext: (move % 2) === 0
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    console.log(current);
    const squares = current.squares;
    const status = calculateWinner(squares) ?
      `Winner: ${this.state.xIsNext ? "O" : "X"}` :
      `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    let spot;

    // TODO: bold currently selected items in the move list
    const moves = history.map((step, move) => {
      spot = move ? `move #${move}` : "game start";
      let row = this.state.history[move].row;
      let col = this.state.history[move].col;
      let displayRow = row ? `row: ${row}` : null;
      let displayCol = col ? `col: ${col}` : null;

      return (
        <li key={move} style={{ display: "flex" }}>
          <button onClick={(e) => this.goToMove(e, move)}>Go to {spot}</button>
          <div className="hide-row">{displayCol}&nbsp;</div>
          <div className="hide-col">{displayRow}</div>
        </li>
      )
    })

    return (
      <div className="game">
        <Board
          squares={squares}
          onClick={(i) => this.handleClick(i)}
        />
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
