<script setup lang="ts">
import {
  RESULT_NOT_FOUND,
  type CharResult,
  RESULT_INCORRECT_PLACE,
  RESULT_CORRECT,
} from "~/types/CharResult";

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

function getCharClass(row: number, col: number) {
  if (row > props.attempts.length) return "";
  const result = props.attempts[row - 1].result[col - 1];
  switch (result) {
    case RESULT_NOT_FOUND:
      return "bg-gray-800";
    case RESULT_INCORRECT_PLACE:
      return "bg-yellow-400 text-gray-900";
    case RESULT_CORRECT:
      return "bg-primary-500 text-gray-900";
    default:
      return "";
  }
}

function getChar(row: number, col: number) {
  if (row <= props.attempts.length) {
    return props.attempts[row - 1].word[col - 1];
  }
  if (row === props.attempts.length + 1) {
    return props.currentWord[col - 1];
  }
  return "";
}

function getAttemptUser(row: number) {
  return props.attempts[row - 1]?.user;
}
</script>

<template>
  <div
    class="grid grid-rows-6 gap-1.5 mx-auto max-w-full w-[350px] h-[420px] p-2.5"
  >
    <div
      v-for="row in 6"
      :key="row"
      class="grid grid-cols-5 gap-1.5 relative"
    >
      <UAvatar
        v-if="getAttemptUser(row)"
        :src="getAttemptUser(row).avatar"
        class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 -z-10"
      />
      <div
        v-for="col in 5"
        :key="col"
        class="grid place-items-center border-2 border-gray-700 text-3xl font-bold uppercase"
        :class="getCharClass(row, col)"
      >
        {{ getChar(row, col) }}
      </div>
      <UAvatar
        v-if="getAttemptUser(row)"
        :src="getAttemptUser(row).avatar"
        class="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 -z-10"
      />
    </div>
  </div>
</template>
