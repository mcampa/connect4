const checkChip = (table, col, row, direction) => {
  const [lat, long] = direction;
  const value = table[col][row];

  for (let i = 1; i <= 3; i++) {
    const column = table[col + i * lat];
    if (!column) {
      return false;
    }
    if (column[row + i * long] !== value) {
      return false;
    }
  }

  return true;
};

const getWinners = (column, row, direction) => {
  const [lat, long] = direction;
  const winners = [`${column}-${row}`];
  for (let i = 1; i <= 3; i++) {
    const winnerColumn = column + i * lat;
    const winnerRow = row + i * long;

    winners.push(`${winnerColumn}-${winnerRow}`);
  }

  return winners;
};

export const checkWinner = plays => {
  const data = [...Array(7)].map(() => []);

  plays.forEach((column, index) => {
    data[column].push(index % 2);
  });

  const possibleDirections = [
    [1, 0], // east
    [1, 1], // northeast
    [0, 1], // north
    [-1, 1], // northwest
    [-1, 0], // west
  ];

  for (let column = 0; column < data.length; column++) {
    for (let row = 0; row < data[column].length; row++) {
      for (let direction of possibleDirections) {
        if (checkChip(data, column, row, direction)) {
          const winners = getWinners(column, row, direction);
          return { winners, column, row, direction };
        }
      }
    }
  }

  return false;
};
