<template>
  <div
    class="min-h-[100svh] overscroll-contain grid grid-cols-1 grid-rows-[auto,1fr]"
  >
    <header class="h-10 border-b border-b-gray-700">
      <UContainer class="flex justify-between items-center h-full px-4 py-2">
        <AuthStatus />
        <nav class="flex gap-2">
          <NuxtLink active-class="text-primary" to="/">Daily</NuxtLink>
          <NuxtLink active-class="text-primary" to="/coopmugen">Mugen</NuxtLink>
        </nav>
      </UContainer>
    </header>
    <slot />
    <UNotifications />
  </div>
</template>
