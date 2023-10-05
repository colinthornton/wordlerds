<script setup lang="ts">
import type { CharResult } from "~/types/CharResult";

const props = defineProps<{
  keys: Record<string, CharResult>;
}>();

defineEmits<{
  (e: "press", key: string): void;
}>();

const keyboard = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["enter", "z", "x", "c", "v", "b", "n", "m", "backspace"],
];

function getKeyClass(key: string) {
  if (!(key in props.keys)) return;
  return `key-${props.keys[key]}`;
}
</script>

<template>
  <div class="keyboard">
    <div v-for="row of keyboard" class="row">
      <button
        v-for="key of row"
        class="key"
        :class="getKeyClass(key)"
        @click="$emit('press', key)"
      >
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
  width: 100%;
  max-width: 500px;
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

.key-0 {
  background: lightgray;
}

.key-1 {
  background: yellow;
}

.key-2 {
  background: yellowgreen;
}
</style>
