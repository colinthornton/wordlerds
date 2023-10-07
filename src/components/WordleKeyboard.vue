<script setup lang="ts">
import {
  type CharResult,
  RESULT_CORRECT,
  RESULT_INCORRECT_PLACE,
  RESULT_NOT_FOUND,
} from "~/types/CharResult";

const props = defineProps<{
  keys: Record<string, CharResult>;
}>();

defineEmits<{
  (e: "press", key: string): void;
}>();

const keyboard = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["", "a", "s", "d", "f", "g", "h", "j", "k", "l", ""],
  ["enter", "z", "x", "c", "v", "b", "n", "m", "backspace"],
];

function getKeyColor(key: string) {
  return (
    {
      [RESULT_NOT_FOUND]: "gray",
      [RESULT_INCORRECT_PLACE]: "yellow",
      [RESULT_CORRECT]: "lime",
    }[props.keys[key]] ?? "black"
  );
}

function getKeyIcon(key: string) {
  switch (key) {
    case "backspace":
      return "i-heroicons-backspace";
    case "enter":
      return "i-heroicons-paper-airplane";
    default:
      return "";
  }
}

function getKeyLabel(key: string) {
  switch (key) {
    case "backspace":
    case "enter":
      return undefined;
    default:
      return key;
  }
}

function getKeyClass(key: string) {
  switch (key) {
    case "backspace":
    case "enter":
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
          class="flex-1 uppercase font-bold justify-center h-14"
          :class="getKeyClass(key)"
          @click="$emit('press', key)"
        />
        <div v-else class="flex-[0.5]"></div>
      </template>
    </div>
  </div>
</template>
