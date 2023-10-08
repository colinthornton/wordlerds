<script setup lang="ts">
const { session } = useAuth();

const pageTitle = computed(() => {
  const path = useRoute().path;
  return (
    {
      "/": "Co-op Daily",
      "/coopmugen": "Co-op Mugen",
    }[path] ?? ""
  );
});

const menuOpen = useState(() => false);
const menuLinks = [
  {
    label: "Co-op",
    links: [
      { label: "Daily", to: "/" },
      { label: "Mugen", to: "/coopmugen" },
    ],
  },
];

// close menu when nav link is clicked
watch(
  () => useRoute().fullPath,
  () => {
    menuOpen.value = false;
  }
);
</script>

<template>
  <div
    class="min-h-[100svh] overscroll-contain grid grid-cols-1 grid-rows-[auto,1fr]"
  >
    <header class="h-10 border-b border-b-gray-700">
      <UContainer class="flex justify-between items-center h-full px-4 py-2">
        <UAvatar :src="session?.user?.avatar" />
        <h1 class="uppercase font-bold">{{ pageTitle }}</h1>
        <UButton
          icon="i-heroicons-bars-3"
          color="white"
          variant="ghost"
          @click="menuOpen = true"
        />
        <USlideover v-model="menuOpen" :ui="{ base: 'p-4 gap-4' }">
          <div class="flex justify-between">
            <AuthStatus />
            <UButton
              icon="i-heroicons-x-mark"
              color="white"
              variant="ghost"
              @click="menuOpen = false"
            />
          </div>
          <UVerticalNavigation :links="menuLinks">
            <template #default="{ link }">
              <div class="relative text-left w-full">
                <div class="mb-2">{{ link.label }}</div>
                <UVerticalNavigation
                  v-if="link.links"
                  :links="link.links"
                  :ui="{ active: 'dark:text-primary' }"
                />
              </div>
            </template>
          </UVerticalNavigation>
        </USlideover>
      </UContainer>
    </header>
    <slot />
    <UNotifications />
  </div>
</template>
