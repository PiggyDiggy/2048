import { generateEmptyGrid } from "./GridGenerator";

export class GameController {
  constructor() {
    this._grid = generateEmptyGrid();
    this.nextId = 0;
    this.tiles = [];
    this.won = false;
    this.fill();
  }

  get grid() {
    return this._grid;
  }

  set grid(newGrid) {
    this._grid = newGrid;
  }

  fill(count = 2) {
    for (let i = 0; i < count; i++) this.createRandomCell(count === 2);
  }

  createRandomCell(isEmpty) {
    const index = this.choice(this.availableCells).index;
    const cell = this.flatGrid[index];
    const value = Math.random() < 0.9 ? 2 : 4;
    cell.value = value;
    this.addTile(value, index, !isEmpty);
  }

  choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  get availableCells() {
    return this.flatGrid.filter((cell) => !cell.value);
  }

  get flatGrid() {
    return this._grid.flat();
  }

  addTile(value, index, isNew = false) {
    const tile = { value, index, delete: false, isNew, id: this.nextId++ };
    this.tiles.push(tile);
  }

  getCol(colId) {
    return this._grid.map((row) => row[colId]);
  }

  setCol(colId, col) {
    this._grid.forEach((row, id) => {
      row[colId] = col[id];
    });
  }

  getRow(rowId) {
    return [...this._grid[rowId]];
  }

  setRow(rowId, row) {
    this._grid[rowId] = row;
  }

  keyUp = () => {
    for (const colId in this._grid[0]) {
      this.moveUpAtCol(colId);
    }
  };

  keyDown = () => {
    for (const colId in this._grid[0]) {
      this.moveDownAtCol(colId);
    }
  };

  keyLeft = () => {
    for (const rowId in this._grid) {
      this.moveLeftAtRow(rowId);
    }
  };

  keyRight = () => {
    for (const rowId in this._grid) {
      this.moveRightAtRow(rowId);
    }
  };

  moveUpAtCol(colId) {
    const col = this.getCol(colId);
    this.setCol(colId, this.moveLine(col));
  }

  moveDownAtCol(colId) {
    const col = this.getCol(colId).reverse();
    this.setCol(colId, this.moveLine(col).reverse());
  }

  moveLeftAtRow(rowId) {
    const row = this.getRow(rowId);
    this.setRow(rowId, this.moveLine(row));
  }

  moveRightAtRow(rowId) {
    const row = this.getRow(rowId).reverse();
    this.setRow(rowId, this.moveLine(row).reverse());
  }

  moveLine(line) {
    for (let i = 1; i < line.length; i++) {
      let moveToId = -1;
      if (line[i].value === 0) continue;
      for (let j = i - 1; j >= 0; j--) {
        if (
          (line[j].value === 0 || line[j].value === line[i].value) &&
          !line[j].changed
        )
          moveToId = j;
        else break;
      }

      if (!~moveToId) continue;

      const cell = line[moveToId];
      const tile = this.tiles.find((tile) => tile.index === line[i].index);
      if (cell.value) {
        cell.changed = true;
        this.mergeTiles(cell, tile);
      }
      cell.value += line[i].value;
      cell.moved = true;
      tile.index = cell.index;
      line[i].value = 0;
    }
    return line;
  }

  mergeTiles(cellTo, tileFrom) {
    const tileTo = this.tiles.find((tile) => tile.index === cellTo.index);
    tileTo.delete = true;
    tileFrom.delete = true;
    this.addTile(cellTo.value * 2, cellTo.index, true);
  }

  clear() {
    for (const cell of this.flatGrid) {
      cell.changed = false;
      cell.moved = false;
    }
    this.tiles = this.tiles.filter((tile) => !tile.delete);
    this.tiles.forEach((tile) => (tile.isNew = false));
  }

  restart() {
    this.nextId = 0;
    this.tiles = [];
    this._grid = generateEmptyGrid();
    setTimeout(() => {
      this.fill();
    }, 0);
  }

  back(state) {
    this._grid = state.grid;
    this.tiles = state.tiles;
  }

  restoreTiles(state) {
    this.tiles = state.tiles;
  }

  hasLost() {
    if (this.availableCells.length) return false;
    for (let i = 0; i < this._grid.length; i++) {
      for (let j = 0; j < this._grid.length; j++) {
        const curValue = this._grid[i][j].value;
        if (
          curValue === this._grid[i + 1]?.[j]?.value ||
          curValue === this._grid[i]?.[j + 1]?.value
        )
          return false;
      }
    }
    return true;
  }

  hasWon() {
    for (const tile of this.tiles) {
      if (tile.value === 2048) {
        this.won = true;
        return true;
      }
    }
    return false;
  }
}
