<script setup lang="ts">
import {
  type CharResult,
  RESULT_CORRECT,
  RESULT_INCORRECT_PLACE,
  RESULT_NOT_FOUND,
} from "~/types/CharResult";

const props = defineProps<{
  keys: Record<string, CharResult>;
  attemptPending: boolean;
}>();

const emit = defineEmits<{
  (e: "press", key: string): void;
}>();

function emitKeydown(e: KeyboardEvent) {
  if (e.key && keyboard.flat().includes(e.key)) {
    emit("press", e.key);
  }
}
onMounted(() => {
  window.addEventListener("keydown", emitKeydown, { passive: true });
});
onUnmounted(() => {
  window.removeEventListener("keydown", emitKeydown);
});

const keyboard = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["", "a", "s", "d", "f", "g", "h", "j", "k", "l", ""],
  ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"],
];

function getKeyColor(key: string) {
  return (
    {
      [RESULT_NOT_FOUND]: "gray",
      [RESULT_INCORRECT_PLACE]: "yellow",
      [RESULT_CORRECT]: "primary",
    }[props.keys[key]] ?? "black"
  );
}

function getKeyIcon(key: string) {
  switch (key) {
    case "Backspace":
      return "i-heroicons-backspace";
    case "Enter":
      return "i-heroicons-paper-airplane";
    default:
      return "";
  }
}

function getKeyLabel(key: string) {
  switch (key) {
    case "Backspace":
    case "Enter":
      return undefined;
    default:
      return key;
  }
}

function getKeyClass(key: string) {
  switch (key) {
    case "Backspace":
    case "Enter":
      return "flex-[1.5] max-w-none";
    default:
      return "";
  }
}
</script>

<template>
  <div class="flex flex-col gap-2 max-w-full w-[484px] mx-auto">
    <div v-for="row of keyboard" class="flex gap-2 justify-center">
      <template v-for="key of row">
        <UButton
          v-if="key"
          :color="getKeyColor(key)"
          variant="solid"
          :icon="getKeyIcon(key)"
          :label="getKeyLabel(key)"
          :loading="key === 'Enter' && attemptPending"
          class="flex-1 uppercase font-bold justify-center h-14"
          :class="getKeyClass(key)"
          @click="$emit('press', key)"
        />
        <div v-else class="flex-[0.5]"></div>
      </template>
    </div>
  </div>
</template>
