<script setup lang="ts">
defineProps<{
  withClose: boolean;
}>();

defineEmits<{
  (e: "close"): void;
}>();

const menuLinks = [
  {
    label: "Squad",
    links: [
      { label: "Daily", to: "/" },
      { label: "Mugen", to: "/squadmugen" },
      { label: "Stats", to: "/stats" },
    ],
  },
];
</script>

<template>
  <div class="p-4 flex flex-col gap-4">
    <div class="flex justify-between">
      <p>Wordlerds</p>
      <UButton
        v-if="withClose"
        icon="i-heroicons-x-mark"
        color="white"
        variant="ghost"
        @click="$emit('close')"
      />
    </div>
    <UVerticalNavigation :links="menuLinks">
      <template #default="{ link }">
        <div class="relative text-left w-full">
          <div class="mb-2">
            {{ link.label }}
          </div>
          <UVerticalNavigation
            v-if="link.links"
            :links="link.links"
            :ui="{ active: 'dark:text-primary' }"
          />
        </div>
      </template>
    </UVerticalNavigation>
  </div>
</template>
