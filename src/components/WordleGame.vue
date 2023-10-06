<script setup lang="ts">
const { data: state, error } = await useFetch("/api/game");
if (!state.value) {
  throw error.value;
}

const MAX_CHARS = 5;
const currentWord = ref(new Array(MAX_CHARS).fill("")) as Ref<string[]>;
let charIndex = 0;

let attemptPending = false;
async function handlePress(key: string) {
  if (!state.value) return;
  if (state.value.status === "GAME_OVER") return;
  if (attemptPending) return;

  switch (key) {
    case "enter":
      if (charIndex !== MAX_CHARS) return;
      const newState = await sendAttempt();
      if (!newState) {
        throw createError(new Error("Something went wrong"));
      }
      state.value = newState;
      currentWord.value = new Array(MAX_CHARS).fill("");
      charIndex = 0;
      break;
    case "backspace":
      if (charIndex === 0) return;
      charIndex--;
      currentWord.value[charIndex] = "";
      break;
    default:
      if (charIndex === MAX_CHARS) return;
      currentWord.value[charIndex] = key;
      charIndex++;
  }
}

function sendAttempt() {
  attemptPending = true;
  return $fetch("/api/attempt", {
    method: "POST",
    body: {
      word: currentWord.value.join(""),
      wordIndex: state.value?.attempts.length,
    },
    onResponse() {
      attemptPending = false;
    },
    onResponseError() {
      reloadNuxtApp();
    },
  });
}
</script>

<template>
  <main>
    <template v-if="state">
      <WordleBoard :attempts="state.attempts" :current-word="currentWord" />
      <WordleKeyboard :keys="state.keys" @press="handlePress" />
    </template>
  </main>
</template>

<style scoped>
main {
  display: grid;
  place-items: center;
  grid-template-rows: 1fr auto;
  gap: 1em;
  padding: 1em;
}
</style>
