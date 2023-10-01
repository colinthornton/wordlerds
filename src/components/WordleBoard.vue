<script setup lang="ts">
defineProps<{
  words: string[][];
  results: CharResult[][];
}>();
</script>

<template>
  <div class="board">
    <div v-for="(word, i) in words" class="word">
      <div
        v-for="(char, j) in word"
        class="char"
        :class="[results[i] ? `result-${results[i][j]}` : '']"
      >
        {{ char }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.board {
  width: 350px;
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
