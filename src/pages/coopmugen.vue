<script setup lang="ts">
const { data } = useFetch("/api/coopmugen");

const { session } = useAuth();
const canPlay = computed(
  () =>
    data.value?.state.status === "PLAYING" &&
    data.value?.state.attempts.every(
      (attempt) => attempt.user.id !== session.value?.user?.id
    ) &&
    !attemptPending
);

let attemptPending = false;
async function sendAttempt(word: string) {
  if (!data.value) return;

  attemptPending = true;
  const newState = await $fetch("/api/coopmugen/attempt", {
    method: "POST",
    body: {
      word,
      wordIndex: data.value.state.attempts.length,
    },
    onResponse() {
      attemptPending = false;
    },
    onResponseError() {
      refreshNuxtData();
    },
  });
  data.value.state = newState;
}
</script>

<template>
  <WordleGame
    v-if="data"
    :state="data.state"
    :can-play="canPlay"
    @attempt="sendAttempt"
  />
</template>
