function checkChip(grid, col, row, direction) {
  const [lat, long] = direction;
  const value = grid[col][row];

  for (let i = 1; i <= 3; i++) {
    const column = grid[col + i * lat];
    if (!column) {
      return false;
    }
    if (column[row + i * long] !== value) {
      return false;
    }
  }

  return true;
}

function getWinners(column, row, direction) {
  const [lat, long] = direction;
  const winners = [`${column}-${row}`];
  for (let i = 1; i <= 3; i++) {
    const winnerColumn = column + i * lat;
    const winnerRow = row + i * long;

    winners.push(`${winnerColumn}-${winnerRow}`);
  }

  return winners;
}

function checkWinner(plays) {
  const grid = [...Array(7)].map(() => []);

  plays.forEach((column, index) => {
    grid[column].push(index % 2);
  });

  const possibleDirections = [
    [1, 0], // east
    [1, 1], // northeast
    [0, 1], // north
    [-1, 1], // northwest
    [-1, 0] // west
  ];

  for (let column = 0; column < grid.length; column++) {
    for (let row = 0; row < grid[column].length; row++) {
      for (let direction of possibleDirections) {
        if (checkChip(grid, column, row, direction)) {
          const winners = getWinners(column, row, direction);
          return { winners, column, row, direction };
        }
      }
    }
  }

  return false;
}

export default checkWinner;
