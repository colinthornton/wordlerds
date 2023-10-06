<script setup lang="ts">
import type { CharResult } from "~/types/CharResult";

const props = defineProps<{
  attempts: {
    word: string;
    result: CharResult[];
    user: {
      name: string;
      avatar: string;
    };
  }[];
  currentWord: string[];
}>();

const emptyRows = computed(() => 6 - props.attempts.length - 1);
</script>

<template>
  <div class="board">
    <div v-for="row in attempts" class="word">
      <img
        class="avatar"
        :title="row.user.name"
        :src="row.user.avatar"
        :alt="row.user.name"
        width="128"
        height="128"
      />
      <div
        v-for="(char, i) in row.word.split('')"
        class="char"
        :class="`result-${row.result[i]}`"
      >
        {{ char }}
      </div>
    </div>
    <div class="word">
      <div v-for="char in currentWord" class="char">{{ char }}</div>
    </div>
    <div v-for="i in emptyRows" class="word">
      <div v-for="i in 5" class="char" />
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
  position: relative;
  display: grid;
  gap: 5px;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
}

.avatar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -3rem;
  width: 2rem;
  height: auto;
  border-radius: 9999px;
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
