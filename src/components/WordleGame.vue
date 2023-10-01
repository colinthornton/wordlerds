<script setup lang="ts">
const { data: state, error } = await useFetch("/api/game");
if (error.value) {
  throw createError(error.value);
}

const MAX_WORDS = 6;
const MAX_CHARS = 5;

const words = useState("WordleGame-words", (): string[][] =>
  Array.from(
    { length: MAX_WORDS },
    (_, i) =>
      state.value?.attempts[i] ??
      Array.from(
        { length: MAX_CHARS },
        (_, j) => state.value?.attempts[i]?.[j] ?? ""
      )
  )
);
let wordIndex = state.value?.attempts.length ?? 0;
let charIndex = 0;

let resultPending = false;
const results = useState(
  "WordleGame-results",
  (): CharResult[][] => state.value?.results ?? []
);

const keys = useState("WordleGame-keys", () => state.value?.keys ?? {});

async function handlePress(key: string) {
  if (wordIndex === MAX_WORDS) return;
  if (resultPending) return;

  switch (key) {
    case "enter":
      if (charIndex !== MAX_CHARS) return;
      const state = await sendAttempt();
      if (!state) {
        throw createError(new Error("Something went wrong"));
      }
      results.value = state.results;
      keys.value = state.keys;
      wordIndex++;
      charIndex = 0;
      if (state.status === "GAME_OVER") {
        setTimeout(reloadNuxtApp, 1000);
      }
      break;
    case "backspace":
      if (charIndex === 0) return;
      charIndex--;
      words.value[wordIndex][charIndex] = "";
      break;
    default:
      if (charIndex === MAX_CHARS) return;
      words.value[wordIndex][charIndex] = key;
      charIndex++;
  }
}

function sendAttempt() {
  resultPending = true;
  return $fetch("/api/attempt", {
    method: "POST",
    body: {
      word: words.value[wordIndex],
      wordIndex,
    },
    onResponse() {
      resultPending = false;
    },
    onResponseError() {
      reloadNuxtApp();
    },
  });
}
</script>

<template>
  <main>
    <WordleBoard :words="words" :results="results" />
    <WordleKeyboard :key-mods="keys" @press="handlePress" />
  </main>
</template>

<style scoped>
main {
  display: grid;
  place-items: center;
  grid-template-rows: 1fr auto;
  min-height: 100dvh;
}
</style>
