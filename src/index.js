import React from "react";
import ReactDOM from "react-dom";
import checkWinner from "./checkWinner";

import "./styles.css";

const CHIP_SIZE = 90;
const PLAYER1_COLOR = "red";
const PLAYER2_COLOR = "yellow";

const initialPlays = [];

class Chip extends React.Component {
  render() {
    const { color, row, column, placeholder, isWinner } = this.props;
    const style = {
      left: `${column * CHIP_SIZE + 4}px`,
      top: `${(5 - row) * CHIP_SIZE + 4}px`,
      backgroundColor: color
    };
    return (
      <div
        className={`Chip ${placeholder ? "placeholder" : ""} ${
          isWinner ? "isWinner" : ""
        }`}
        style={style}
      />
    );
  }
}

class Placeholder extends React.Component {
  render() {
    const { column, plays } = this.props;
    const row = plays.reduce((row, c) => {
      return c === column ? ++row : row;
    }, 0);
    const color = plays.length % 2 === 0 ? PLAYER1_COLOR : PLAYER2_COLOR;

    return (
      <div className="Placeholder">
        <Chip key="0" color={color} row={6} column={column} />
        <Chip key="1" color={color} row={row} column={column} placeholder />
      </div>
    );
  }
}

class Connect4 extends React.Component {
  state = {
    plays: initialPlays,
    selectedColumn: 3,
    winner: checkWinner(initialPlays)
  };

  componentDidMount() {
    window.addEventListener("keydown", this.onKeyPress, true);
  }

  render() {
    const { selectedColumn, plays, winner } = this.state;
    return (
      <div class="Connect4">
        <div className="frame">
          {this.renderChips()}
          {!winner && <Placeholder column={selectedColumn} plays={plays} />}
          {[...Array(7).keys()].map(n => this.renderColumn(n))}
        </div>
        <button onClick={this.handleReset}>RESET</button>
      </div>
    );
  }

  renderColumn = n => {
    return (
      <div
        key={n}
        className="column"
        onMouseEnter={this.onColumnHover(n)}
        onClick={this.onColumnClick(n)}
      >
        {[...Array(6).keys()].map(n => <div key={n} className="hole" />)}
      </div>
    );
  };

  renderChips = () => {
    const { plays } = this.state;
    const rowPositions = [...Array(7)].map(() => 0);

    return plays.map((column, index) => {
      const row = rowPositions[column]++;
      return (
        <Chip
          color={index % 2 === 0 ? PLAYER1_COLOR : PLAYER2_COLOR}
          row={row}
          column={column}
          isWinner={this.isWinner(column, row)}
        />
      );
    });
  };

  handleReset = e => {
    e.preventDefault();
    this.setState({ plays: [], winner: false });
  };

  onColumnHover = column => () => {
    this.setState({ selectedColumn: column });
  };

  onColumnClick = column => () => {
    if (this.state.winner) {
      return;
    }

    const chipsInColumn = this.state.plays.filter(c => c === column).length;
    if (chipsInColumn > 5) {
      return;
    }

    const plays = [...this.state.plays, column];

    this.setState({ plays, winner: checkWinner(plays) });
  };

  onKeyPress = e => {
    const { selectedColumn } = this.state;
    switch (e.key) {
      case "a":
        return this.setState({
          selectedColumn: Math.max(selectedColumn - 1, 0)
        });
      case "d":
        return this.setState({
          selectedColumn: Math.min(selectedColumn + 1, 6)
        });
      case "Enter":
        return this.onColumnClick(selectedColumn);
      default:
    }
  };

  isWinner = (column, row) => {
    const { winner } = this.state;

    return winner && winner.winners.includes(`${column}-${row}`);
  };
}
const rootElement = document.getElementById("root");
ReactDOM.render(<Connect4 />, rootElement);
