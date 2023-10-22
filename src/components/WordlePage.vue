<script setup lang="ts">
import { dictionary } from "@/assets/dictionary";
import { WordleGameDesyncError, WordleInvalidWordError } from "~/types/errors";

const props = defineProps<{
  fetchUrl: "/api/coopdaily" | "/api/coopmugen";
  sendUrl: "/api/coopdaily/attempt" | "/api/coopmugen/attempt";
}>();

const { data, refresh: refreshGame } = useFetch(props.fetchUrl);
const refresh = () => refreshNuxtData;
onMounted(() => {
  window.addEventListener("focus", refresh);
});
onUnmounted(() => {
  window.removeEventListener("focus", refresh);
});

const { session, status } = useAuth();

watch(status, () => {
  if (status.value !== "authenticated") {
    refreshNuxtData();
  }
});

const gameOver = computed(() => data.value?.state.status === "GAME_OVER");
const hasPlayed = computed(() => {
  const state = data.value?.state;
  const user = session.value?.user;
  if (!(state && user)) return false;
  return state.attempts.some((attempt) => attempt.user.id === user.id);
});
const canPlay = computed(
  () =>
    Boolean(session.value?.user) &&
    !gameOver.value &&
    !hasPlayed.value &&
    !attemptPending.value
);

const attemptPending = ref(false);
async function sendAttempt(word: string) {
  if (!data.value || attemptPending.value) return;

  if (!dictionary.includes(word)) {
    useToast().remove("notinwordlist");
    useToast().add({
      id: "notinwordlist",
      title: "Not in word list",
      color: "yellow",
      timeout: 2000,
    });
    return;
  }

  attemptPending.value = true;
  try {
    const newState = await $fetch(props.sendUrl, {
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
        useToast().remove("tooslow");
        useToast().add({
          id: "tooslow",
          title: "You're too slow",
          color: "yellow",
          timeout: 2000,
        });
        refreshGame();
        break;
      case WordleInvalidWordError.ecode:
        useToast().remove("notinwordlist");
        useToast().add({
          id: "notinwordlist",
          title: "Not in word list",
          color: "yellow",
          timeout: 2000,
        });
        break;
      default:
        refreshNuxtData();
    }
  }
}

function toastError() {
  if (status.value !== "authenticated") {
    useToast().remove("signin");
    useToast().add({
      id: "signin",
      title: "Sign in to play",
      color: "yellow",
      timeout: 2000,
    });
    return;
  }
  if (hasPlayed.value) {
    useToast().remove("alreadyplayed");
    useToast().add({
      id: "alreadyplayed",
      title: "You've already played",
      color: "yellow",
      timeout: 2000,
    });
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
