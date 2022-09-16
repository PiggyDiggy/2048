<template>
  <div class="grid-tile" :style="pos" :class="{ new: tile.isNew }">
    <transition name="tile" appear>
      <div class="tile-inner">
        {{ tile.value }}
      </div>
    </transition>
  </div>
</template>

<script>
export default {
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
  font-size: 2.3rem;
  transition: transform 0.2s ease;
}

.tile-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  background-color: #e6ccb2;
}

.tile-enter-from {
  transform: scale(0);
}

.tile-enter-to {
  transform: scale(1);
}

.tile-enter-active {
  transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.2);
}

.grid-tile.new .tile-inner {
  transition-delay: 0.05s;
}
</style>