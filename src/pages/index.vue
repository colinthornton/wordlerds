<template>
  <header>
    <AuthStatus />
  </header>
  <WordleGame />
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

#__nuxt {
  display: grid;
  grid-template-rows: auto 1fr;
}
</style>

<style scoped>
header {
  border-bottom: 1px solid black;
}
</style>
