<template>
  <div>
    <div class="buttons">
      <div>
        <div class="max-score">Max Score: {{ maxScore }}</div>
        <div class="score">Score: {{ score }}</div>
      </div>
      <div>
        <button class="history-button" @click="cancelMove">Back</button>
        <button class="restart-button" @click="restart">Restart</button>
      </div>
    </div>
    <div class="grid">
      <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="grid__row">
        <div
          class="grid__cell-wrap"
          v-for="(cell, colIndex) in row"
          :key="colIndex"
        >
          <span class="grid__cell">
            {{ cell.value === 0 ? "" : cell.value }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      grid: Array(),
      counter: 0,
      score: 0,
      maxScore: 0,
      keys: {
        ArrowUp: this.keyUp,
        ArrowDown: this.keyDown,
        ArrowLeft: this.keyLeft,
        ArrowRight: this.keyRight,
      },
    };
  },
  methods: {
    createNewCell() {
      const { rows, columns } = this.getAvailableCells();
      const row = rows[Math.floor(Math.random() * rows.length)];
      const column =
        columns[row][Math.floor(Math.random() * columns[row].length)];
      const value = Math.random() < 0.75 ? 2 : 4;
      this.grid[row][column] = this.createCell(value);
    },
    getAvailableCells() {
      return this.grid.reduce(
        (acc, arr, index) => {
          const indices = arr.reduce((indices, cell, index) => {
            if (!cell.value) indices.push(index);
            return indices;
          }, []);
          if (indices.length) acc.rows.push(index);
          acc.columns.push(indices);
          return acc;
        },
        { rows: [], columns: [] }
      );
    },
    keyUp() {
      for (const colId in this.grid[0]) {
        this.moveUpAtCol(colId);
      }
    },
    keyDown() {
      for (const colId in this.grid[0]) {
        this.moveDownAtCol(colId);
      }
    },
    keyLeft() {
      for (const rowId in this.grid) {
        this.moveLeftAtRow(rowId);
      }
    },
    keyRight() {
      for (const rowId in this.grid) {
        this.moveRightAtRow(rowId);
      }
    },
    createCell(value = 0) {
      return { value, moved: false, changed: false };
    },
    getCol(colId) {
      return this.grid.map((row) => row[colId]);
    },
    setCol(colId, col) {
      this.grid.forEach((row, id) => {
        row[colId] = col[id];
      });
    },
    getRow(rowId) {
      return [...this.grid[rowId]];
    },
    setRow(rowId, row) {
      this.grid[rowId] = row;
    },
    moveUpAtCol(colId) {
      const col = this.getCol(colId);
      this.setCol(colId, this.moveLine(col));
    },
    moveDownAtCol(colId) {
      const col = this.getCol(colId).reverse();
      this.setCol(colId, this.moveLine(col).reverse());
    },
    moveLeftAtRow(rowId) {
      const row = this.getRow(rowId);
      this.setRow(rowId, this.moveLine(row));
    },
    moveRightAtRow(rowId) {
      const row = this.getRow(rowId).reverse();
      this.setRow(rowId, this.moveLine(row).reverse());
    },
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
        if (cell.value) {
          cell.changed = true;
        }
        cell.value += line[i].value;
        cell.moved = true;
        line[i].value = 0;
      }
      return line;
    },
    clear() {
      for (const row of this.grid) {
        for (const cell of row) {
          cell.changed = false;
          cell.moved = false;
        }
      }
    },
    hasMoved() {
      return this.grid.flat().some((el) => el.moved || el.changed);
    },
    updateHistory() {
      const history = this.getHistory();
      history.push(this.grid);
      return localStorage.setItem("gridHistory", JSON.stringify(history));
    },
    getHistory() {
      return JSON.parse(localStorage.getItem("gridHistory"));
    },
    updateCurrentState() {
      this.counter++;
      for (const row of this.grid) {
        for (const cell of row) {
          if (cell.changed) {
            this.score += cell.value;
          }
        }
      }
      this.clear();
      this.saveCurrentState();
    },
    saveCurrentState() {
      const { score, counter, grid } = this;
      const state = JSON.stringify({ score, counter, grid });
      localStorage.setItem("currentState", state);
    },
    updateMaxScore() {
      const score = localStorage.getItem("maxScore");
      if (this.score > score) {
        this.maxScore = this.score;
        localStorage.setItem("maxScore", this.score);
      }
    },
    getLastState() {
      const history = this.getHistory();
      const grid = history.pop();
      localStorage.setItem("gridHistory", JSON.stringify(history));
      return grid;
    },
    cancelMove() {
      if (this.counter === 0) return;
      this.counter--;
      this.grid = this.getLastState();
      this.saveCurrentState();
    },
    restart() {
      this.setEmptyGrid();
      localStorage.setItem("gridHistory", "[]");
      localStorage.setItem("currentState", "null");
      this.counter = 0;
      this.score = 0;
    },
    setEmptyGrid() {
      this.grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ].map((row) => row.map(this.createCell));
      for (let i = 0; i < 2; i++) this.createNewCell();
    },
    loadFromStorage() {
      const state = JSON.parse(localStorage.getItem("currentState"));
      const maxScore = localStorage.getItem("maxScore");
      this.maxScore = maxScore ? maxScore : 0;
      if (!state) return this.setEmptyGrid();
      const { counter, grid, score } = state;
      this.counter = counter;
      this.grid = grid;
      this.score = score;
    },
  },
  created() {
    this.loadFromStorage();

    document.addEventListener("keydown", (event) => {
      const { key } = event;
      if (Object.keys(this.keys).includes(key)) {
        this.updateHistory();
        this.keys[key]();
        if (this.hasMoved()) {
          this.updateMaxScore();
          this.createNewCell();
          this.updateCurrentState();
        } else this.getLastState(); // pop duplicate from history
      }
    });
  },
};
</script>

<style>
.grid {
  background-color: #7f5539;
  border: 2px solid #7f5539;
  border-radius: 5px;
}

.grid__row {
  display: flex;
}

.grid__cell-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ddb892;
  height: 64px;
  width: 64px;
  border: 2px solid #7f5539;
  border-radius: 5px;
  font-size: 1.5rem;
}

.grid__cell {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  border-radius: 3px;
}

.cell-enter-from {
  transform: scale(0);
}

.cell-enter-to {
  transform: scale(1);
}

.cell-enter-active {
  transition: all 0.2s ease;
}

.buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 8px;
}
</style>