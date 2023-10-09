<script setup lang="ts">
const { data: userStats, pending } = useFetch("/api/stats");

const tableCols = [
  {
    key: "user",
    label: "",
  },
  {
    key: "guesses",
    label: "Guesses",
    sortable: true,
  },
  {
    key: "green",
    label: "🟩%",
    sortable: true,
  },
  {
    key: "yellow",
    label: "🟨%",
    sortable: true,
  },
  {
    key: "black",
    label: "⬛%",
    sortable: true,
  },
];

const tableRows = computed(() => {
  if (!userStats.value) return [];
  return userStats.value.map((row) => ({
    user: row.user,
    guesses: row.stats.guesses,
    green: row.stats.green,
    yellow: row.stats.yellow,
    black: row.stats.black,
  }));
});
</script>

<template>
  <UContainer class="pt-4">
    <UTable
      :loading="pending"
      :columns="tableCols"
      :rows="tableRows"
      :sort="{ column: 'green', direction: 'desc' }"
      :ui="{ th: { base: 'text-right' }, td: { base: 'text-right' } }"
    >
      <template #user-data="{ row }">
        <UAvatar :src="row.user.avatar" :alt="row.user.name" />
      </template>
      <template #green-data="{ row }">
        <span class="text-primary-500">{{ row.green }}</span>
      </template>
      <template #yellow-data="{ row }">
        <span class="text-yellow-400">{{ row.yellow }}</span>
      </template>
    </UTable>
  </UContainer>
</template>
