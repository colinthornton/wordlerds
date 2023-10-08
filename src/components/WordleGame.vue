<script setup lang="ts">
import { type WordleGameState } from "~/server/models/WordleGame";

const props = defineProps<{
  state: WordleGameState;
  canPlay: boolean;
}>();

const emit = defineEmits<{
  (e: "attempt", word: string): void;
  (e: "blockpress"): void;
}>();

const MAX_CHARS = 5;
const currentWord = ref(new Array(MAX_CHARS).fill("")) as Ref<string[]>;
let charIndex = 0;

watch(
  () => props.state,
  () => {
    currentWord.value = new Array(MAX_CHARS).fill("");
    charIndex = 0;
  }
);

async function handlePress(key: string) {
  if (!props.canPlay) {
    emit("blockpress");
    return;
  }

  switch (key) {
    case "Enter":
      if (charIndex !== MAX_CHARS) return;
      emit("attempt", currentWord.value.join(""));
      break;
    case "Backspace":
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
</script>

<template>
  <UContainer
    as="main"
    class="grid grid-cols-1 grid-rows-[1fr,auto] pb-4 items-center"
  >
    <template v-if="state">
      <WordleBoard :attempts="state.attempts" :current-word="currentWord" />
      <WordleKeyboard :keys="state.keys" @press="handlePress" />
    </template>
  </UContainer>
</template>
