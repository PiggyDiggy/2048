<template>
  <div>
    <div class="buttons">
      <div>
        <button class="restart-button" @click="restart">Restart</button>
        <button class="back-button" @click="back">Back</button>
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
      };
    },
    updateHistory(state) {
      if (this.history.length === 5) this.history.shift();
      this.history.push(state);
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
main > div {
  position: relative;
}

.buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 8px;
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
  background-color: var(--cell-layout);
  border: 5px solid var(--layout-border);
  border-radius: 12px;
}
</style>
