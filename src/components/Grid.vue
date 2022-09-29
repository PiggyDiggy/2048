<template>
  <div class="game-wrapper" :class="{ blur: hasWon || gameOver }">
    <div class="control-panel">
      <div class="scores">
        <div>Score: {{ getScore() }}</div>
      </div>
      <div class="control-buttons">
        <button class="control-button back-button" @click="back">
          <img src="../assets/arrow-back.svg" alt="Back" title="Back" />
          <div class="history-length">{{ history.length }}</div>
        </button>
        <button class="control-button" @click="restart">
          <img src="../assets/refresh.svg" alt="Restart" title="Restart" />
        </button>
      </div>
    </div>
    <div class="grid-layout">
      <div
        v-for="(row, rowIndex) in grid"
        :key="rowIndex"
        class="grid-layout__row"
      >
        <div
          v-for="(cell, index) in row"
          :key="index"
          class="grid-layout__cell"
        ></div>
      </div>
    </div>
    <div class="grid" :class="{ backwards }">
      <Tile v-for="tile in tiles" :key="tile.id" :tile="tile" />
    </div>
    <Modal
      :show="gameOver"
      @restart="restart"
      text="Game Over"
      alternative="Back"
      @alternative="back"
    />
    <Modal
      :show="hasWon"
      @restart="restart"
      text="You Won"
      alternative="Continue"
      @alternative="hasWon = false"
    />
  </div>
</template>

<script>
import { GameController } from "../utils/GameController";
import Tile from "./Tile.vue";
import Modal from "./Modal.vue";

export default {
  components: {
    Tile,
    Modal,
  },
  data() {
    const controller = new GameController();

    return {
      keys: {
        ArrowUp: controller.keyUp,
        ArrowDown: controller.keyDown,
        ArrowLeft: controller.keyLeft,
        ArrowRight: controller.keyRight,
      },
      controller,
      gameOver: false,
      hasWon: false,
      backwards: false,
      history: [],
    };
  },
  methods: {
    restart() {
      this.gameOver = false;
      this.hasWon = false;
      this.backwards = false;
      this.controller.restart();
      this.history = [];
    },
    back() {
      const state = this.history.pop();
      if (state === undefined) return;
      this.backwards = true;
      this.gameOver = false;
      this.controller.back(state);
    },
    copyState() {
      return {
        grid: JSON.parse(JSON.stringify(this.grid)),
        tiles: JSON.parse(JSON.stringify(this.tiles)),
        score: this.getScore(),
      };
    },
    updateHistory(state) {
      if (this.history.length === 5) this.history.shift();
      this.history.push(state);
    },
    getScore() {
      return this.controller.score;
    },
  },
  computed: {
    grid() {
      return this.controller.grid;
    },
    flatGrid() {
      return this.grid.flat();
    },
    tiles() {
      return this.controller.tiles;
    },
  },
  created() {
    document.addEventListener("keydown", ({ key }) => {
      if (!Object.keys(this.keys).includes(key)) return;
      const lastState = this.copyState();
      this.backwards = false;
      this.controller.clear();
      this.keys[key]();

      if (!this.flatGrid.some((cell) => cell.moved)) {
        return this.controller.restoreTiles(lastState);
      }

      this.controller.fill(1);
      this.updateHistory(lastState);

      if (this.controller.hasLost()) {
        this.gameOver = true;
      }

      if (!this.controller.won && this.controller.hasWon()) {
        this.hasWon = true;
      }
    });
    document.addEventListener("keydown", (event) => {
      if (
        event.ctrlKey &&
        (event.key.toLowerCase() === "z" || event.key.toLowerCase() === "я")
      )
        this.back();
    });
  },
};
</script>

<style>
.game-wrapper {
  position: relative;
  transition: filter 0.2s ease-out;
}

.game-wrapper.blur {
  filter: blur(3px);
}

.control-panel {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 16px;
  padding: 0 8px;
  font-size: 20px;
}

.control-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.control-button {
  border: none;
  border-radius: 12px;
  padding: 6px;
  background-color: var(--layout-cell);
  cursor: pointer;
  font: inherit;
  transition: background-color 0.2s ease-out;
}

.control-button:hover,
.control-button:focus {
  outline: none;
  background-color: #565a61;
}

.control-button img {
  display: block;
}

.back-button {
  position: relative;
}

.history-length {
  position: absolute;
  top: 0;
  right: 0;
  width: 26px;
  height: 26px;
  border: 2px solid white;
  line-height: 1;
  border-radius: 100%;
  background-color: var(--layout-cell);
  color: white;
  transform: translate(25%, -25%);
}

.grid {
  position: relative;
  height: 450px;
  width: 450px;
  border-radius: 8px;
  border: 10px solid transparent;
}

.grid-layout {
  z-index: -1;
  position: absolute;
  bottom: 0;
  right: 0;
  border: 5px solid var(--layout-border);
  background-color: var(--layout-border);
  border-radius: 12px;
}

.grid-layout__row {
  display: flex;
}

.grid-layout__cell {
  height: 110px;
  width: 110px;
  background-color: var(--layout-cell);
  border: 5px solid var(--layout-border);
  border-radius: 12px;
}
</style>
