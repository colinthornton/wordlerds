<script setup lang="ts">
import { dictionary } from "@/assets/dictionary";
import { WordleGameDesyncError, WordleInvalidWordError } from "~/types/errors";

const props = defineProps<{
  fetchUrl: "/api/coopdaily" | "/api/coopmugen";
  sendUrl: "/api/coopdaily/attempt" | "/api/coopmugen/attempt";
}>();

const { data } = useFetch(props.fetchUrl);
const refresh = () => refreshNuxtData;
onMounted(() => {
  window.addEventListener("focus", refresh);
});
onUnmounted(() => {
  window.removeEventListener("focus", refresh);
});

const { session, status } = useAuth();

const gameOver = computed(() => data.value?.state.status === "GAME_OVER");
const hasPlayed = computed(() => {
  const state = data.value?.state;
  const user = session.value?.user;
  if (!(state && user)) return false;
  return state.attempts.some((attempt) => attempt.user.id === user.id);
});
const canPlay = computed(
  () => !gameOver.value && !hasPlayed.value && !attemptPending.value
);

let attemptPending = ref(false);
async function sendAttempt(word: string) {
  if (!data.value || attemptPending.value) return;

  if (!dictionary.includes(word)) {
    useToast().add({ title: "Not in word list", color: "yellow" });
    return;
  }

  attemptPending.value = true;
  try {
    const newState = await $fetch("/api/coopmugen/attempt", {
      method: "POST",
      body: {
        word,
        wordIndex: data.value.state.attempts.length,
      },
      onResponse() {
        attemptPending.value = false;
      },
    });
    data.value.state = newState;
  } catch (error: any) {
    switch (error?.data?.ecode) {
      case WordleGameDesyncError.ecode:
        useToast().add({ title: "You're too slow", color: "yellow" });
        refreshNuxtData();
        break;
      case WordleInvalidWordError.ecode:
        useToast().add({ title: "Not in word list", color: "yellow" });
        break;
      default:
        refreshNuxtData();
    }
  }
}

function toastError() {
  if (status.value !== "authenticated") {
    useToast().add({ title: "Sign in to play", color: "yellow" });
    return;
  }
  if (hasPlayed.value) {
    useToast().add({ title: "You've already played", color: "yellow" });
    return;
  }
}
</script>

<template>
  <WordleGame
    v-if="data"
    :state="data.state"
    :can-play="canPlay"
    :attempt-pending="attemptPending"
    @attempt="sendAttempt"
    @blockpress="toastError"
  />
</template>
