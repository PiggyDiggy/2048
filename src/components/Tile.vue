<template>
  <div class="grid-tile" :style="pos">
    <transition name="tile" appear>
      <div class="tile-inner" :class="className" :style="color">
        {{ tile.value }}
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      colors: {
        2: "#eee",
        4: "#fff3dd",
        8: "#feddb1",
        16: "#fed39c",
        32: "#fdd08c",
        64: "#ffc87d",
        128: "#fec16e",
        256: "#ffb972",
        512: "#fba877",
        1024: "#ff9182",
        2048: "#ff7070",
      },
    };
  },
  props: {
    tile: Object,
  },
  computed: {
    pos() {
      return `
        transform: translate(${(this.tile.index % 4) * 100}%, ${
        Math.floor(this.tile.index / 4) * 100
      }%)`;
    },
    className() {
      return {
        new: this.tile.isNew,
        merged: this.tile.delete,
      };
    },
    color() {
      const color = this.colors[this.tile.value] || "#8758ff";
      return this.tile.value < 2048
        ? `background-color: ${color}`
        : `background-color: ${color}; color: white`;
    },
  },
};
</script>

<style>
.grid-tile {
  position: absolute;
  width: 110px;
  height: 110px;
  top: -5px;
  left: -5px;
  padding: 5px;
  font-size: 36px;
  transition: transform 0.2s ease;
}

.tile-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  font-weight: bold;
  color: var(--layout-border);
  will-change: transform;
}

.tile-enter-from.new {
  transform: scale(0);
}

.tile-enter-to.new {
  transform: scale(1);
}

.tile-enter-active.new {
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.2);
}

.backwards .tile-enter-active {
  transition: transform 0s;
}

.backwards .tile-enter-active.merged {
  transition: none 0.2s;
  opacity: 0;
}

.tile-inner.new {
  transition-delay: 0.09s;
}

@media screen and (max-width: 500px) {
  .grid-tile {
    height: 90px;
    width: 90px;
    padding: 4px;
    font-size: 28px;
  }
}

@media screen and (max-width: 400px) {
  .grid-tile {
    height: 75px;
    width: 75px;
    padding: 3px;
    font-size: 24px;
  }
}
</style>
