<script setup lang="ts">
const { signIn, signOut, data, status } = useAuth();

watchEffect(() => {
  if (data.value) {
    console.log(data.value);
  }
});
</script>

<template>
  <div class="auth-status">
    <template v-if="status === 'authenticated'">
      <button @click="signOut()">Sign Out</button>
      <img class="image" :src="data?.user?.avatar" width="128" height="128" />
      <span>{{ data?.user?.name }}</span>
    </template>
    <button v-else-if="status === 'unauthenticated'" @click="signIn('discord')">
      Sign In
    </button>
  </div>
</template>

<style scoped>
.auth-status {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.5em;
  min-height: 2em;
}

.image {
  border-radius: 9999px;
  height: 2em;
  width: auto;
}
</style>
