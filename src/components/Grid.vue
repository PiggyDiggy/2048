<template>
  <div>
    <div class="buttons">
      <div>
        <button class="restart-button" @click="controller.restart">
          Restart
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
    <div class="grid">
      <Tile
        v-for="{ id, index, value, isNew } in tiles"
        :key="id"
        :tile="{ index, value, isNew }"
      />
    </div>
  </div>
</template>

<script>
import { GameController } from "../utils/GameController";
import Tile from "./Tile.vue";

export default {
  components: {
    Tile,
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
    };
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
    document.addEventListener("keydown", (event) => {
      const { key } = event;
      if (!Object.keys(this.keys).includes(key)) return;
      this.controller.clear();
      this.keys[key]();

      if (!this.flatGrid.some((cell) => cell.moved)) return;
      this.controller.fill(false, 1);
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