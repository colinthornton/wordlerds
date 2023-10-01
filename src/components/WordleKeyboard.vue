<script setup lang="ts">
defineEmits<{
  (e: "press", key: string): void;
}>();

const keys = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["enter", "z", "x", "c", "v", "b", "n", "m", "backspace"],
];
</script>

<template>
  <div class="keyboard">
    <div v-for="row of keys" class="row">
      <button v-for="key of row" class="key" @click="$emit('press', key)">
        {{ key }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.keyboard {
  --gap: 6px;
  --key-width: 43px;

  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  padding: 0 8px;
  gap: var(--gap);
}

.row {
  display: flex;
  justify-content: center;
  gap: var(--gap);
  width: 100%;
}

.row:nth-of-type(2) {
  width: calc(100% - var(--key-width));
}

.key {
  flex-basis: var(--key-width);
  height: 58px;
  font-family: system-ui, sans-serif;
  font-weight: bold;
  text-transform: uppercase;
}
</style>
