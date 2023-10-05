<script setup lang="ts">
import type { CharResult } from "~/types/CharResult";

const props = defineProps<{
  attempts: {
    word: string;
    result: CharResult[];
  }[];
}>();

const board = computed(() => {
  return Array.from({ length: 6 }).map(
    (_, i) => props.attempts[i] ?? { word: "     ", result: [] }
  );
});
console.log(JSON.stringify(board.value.length));
</script>

<template>
  <div class="board">
    <div v-for="row in board" class="word">
      <div
        v-for="(char, i) in row.word.split('')"
        class="char"
        :class="`result-${row.result[i]}`"
      >
        {{ char }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.board {
  width: 100%;
  max-width: 350px;
  height: 420px;
  display: grid;
  gap: 5px;
  grid-auto-rows: 1fr;
}

.word {
  display: grid;
  gap: 5px;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
}

.char {
  font-size: 2rem;
  font-family: system-ui, sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  display: grid;
  place-items: center;
  border: 2px solid black;
}

.result-0 {
  background: lightgray;
}

.result-1 {
  background: yellow;
}

.result-2 {
  background: yellowgreen;
}
</style>
