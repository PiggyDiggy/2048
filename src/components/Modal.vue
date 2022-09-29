<template>
  <teleport to="body">
    <transition name="modal">
      <div class="modal" v-if="show">
        <div class="modal__text">{{ text }}</div>
        <div class="modal__buttons">
          <button class="modal__button modal__restart-button" @click="$emit('restart')">
            Restart
          </button>
          <button class="modal__button" @click="$emit('alternative')">
            {{ alternative }}
          </button>
        </div>
        <div class="backdrop"></div>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  props: {
    text: String,
    show: Boolean,
    alternative: String,
  },
  emits: ["restart", "alternative"],
};
</script>

<style>
.modal {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.modal__text {
  font-size: 96px;
  font-weight: bold;
  color: white;
  margin-bottom: 32px;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 20;
}

.modal__buttons {
  z-index: 20;
  display: flex;
  gap: 16px;
}

.modal__button {
  font-size: 20px;
  font-family: inherit;
  border: none;
  background-color: #eee;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s ease-out;
}

.modal__button:hover,
.modal__button:focus {
  outline: none;
  background-color: #ddd;
}

.modal__restart-button {
  color: #ff2d2d;
}

.backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease-out;
}
</style>
