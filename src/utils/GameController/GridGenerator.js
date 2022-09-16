const generateCell = () => ({ value: 0, changed: false, moved: false });

const GRID = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

export const generateEmptyGrid = () => {
  return GRID.map((row) => row.map(() => generateCell()));
}
