<script setup lang="ts">
const { data: state, error } = await useFetch("/api/game");
if (!state.value) {
  throw error.value;
}

const MAX_CHARS = 5;

if (state.value.status === "PLAYING") {
  state.value.attempts.push({
    word: "     ",
    result: [],
    user: {
      username: "",
      avatar: "",
    },
  });
}
const attemptIndex = state.value.attempts.length;
let charIndex = 0;
const currentAttempt = computed(() => {
  if (!state.value) throw new Error();
  console.log(state.value.attempts);
  return state.value.attempts[attemptIndex];
});

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
      break;
    case "backspace":
      if (charIndex === 0) return;
      charIndex--;
      currentAttempt.value.word = currentAttempt.value.word.slice(0, charIndex);
      break;
    default:
      if (charIndex === MAX_CHARS) return;
      currentAttempt.value.word = currentAttempt.value.word + key;
      charIndex++;
  }
}

function sendAttempt() {
  attemptPending = true;
  return $fetch("/api/attempt", {
    method: "POST",
    body: {
      word: currentAttempt.value.word,
      attemptIndex,
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
    <WordleBoard :attempts="state?.attempts ?? []" />
    <WordleKeyboard :keys="state?.keys ?? {}" @press="handlePress" />
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
