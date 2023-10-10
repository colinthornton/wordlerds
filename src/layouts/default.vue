<script setup lang="ts">
const { session } = useAuth();

const pageTitle = computed(() => {
  const path = useRoute().path;
  return (
    {
      "/": "Squad Daily",
      "/squadmugen": "Squad Mugen",
      "/stats": "Stats",
    }[path] ?? ""
  );
});

const menuOpen = useState(() => false);

// close menu when nav link is clicked
watch(
  () => useRoute().fullPath,
  () => {
    menuOpen.value = false;
  },
);
</script>

<template>
  <div
    class="min-h-[100svh] overscroll-contain grid grid-cols-1 grid-rows-[auto,1fr]"
  >
    <header class="h-10 border-b border-b-gray-700">
      <UContainer class="flex justify-between items-center h-full px-4 py-2">
        <UPopover v-if="session?.user?.avatar">
          <UButton variant="link">
            <UAvatar :src="session?.user?.avatar" />
          </UButton>
          <template #panel>
            <AuthStatus />
          </template>
        </UPopover>
        <AuthStatus v-else />
        <h1 class="uppercase font-bold">
          {{ pageTitle }}
        </h1>
        <UButton
          icon="i-heroicons-bars-3"
          color="white"
          variant="ghost"
          class="lg:invisible"
          @click="menuOpen = true"
        />
        <USlideover v-model="menuOpen">
          <SideMenu
            with-close
            @close="menuOpen = false"
          />
        </USlideover>
      </UContainer>
    </header>
    <div
      class="mx-auto w-full max-w-5xl grid grid-rows-1 grid-cols-1 lg:grid-cols-10 justify-center"
    >
      <div class="lg:col-span-6 lg:col-start-3">
        <slot />
      </div>
      <SideMenu class="hidden lg:flex col-span-2" />
    </div>
    <UNotifications />
  </div>
</template>
