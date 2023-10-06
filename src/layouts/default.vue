<template>
  <header>
    <div class="bar">
      <AuthStatus />
    </div>
    <nav>
      <span>Co-op</span>
      <NuxtLink to="/">Daily</NuxtLink>
      <NuxtLink to="/coopmugen">Mugen</NuxtLink>
    </nav>
  </header>
  <slot />
</template>

<style>
* {
  box-sizing: inherit;
}

html,
body,
#__nuxt {
  height: 100%;
}

html {
  box-sizing: border-box;
}

body {
  margin: 0;
}
</style>

<style scoped>
.bar {
  border-bottom: 1px solid black;
}

nav {
  display: flex;
  gap: 1ch;
}
</style>
