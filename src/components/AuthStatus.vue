<script setup lang="ts">
const { signIn, signOut, status, session } = useAuth();
</script>

<template>
  <ClientOnly>
    <div class="auth-status">
      <template v-if="status === 'authenticated'">
        <button @click="signOut()">Sign Out</button>
        <img
          class="image"
          :src="session?.user?.avatar"
          width="128"
          height="128"
        />
        <span>{{ session?.user?.name }}</span>
      </template>
      <button
        v-else-if="status === 'unauthenticated'"
        @click="signIn('discord')"
      >
        Sign In
      </button>
    </div>
  </ClientOnly>
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
