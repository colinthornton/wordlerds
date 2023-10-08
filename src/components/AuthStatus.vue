<script setup lang="ts">
const { signIn, signOut, status } = useAuth();
</script>

<template>
  <UButton
    v-if="status === 'authenticated'"
    @click="signOut()"
    label="Log Out"
    size="xs"
    variant="outline"
    color="yellow"
  />
  <UButton
    v-else
    :label="status === 'unauthenticated' ? 'Sign In' : ''"
    size="xs"
    :loading="status === 'loading'"
    class="transition-all"
    @click="signIn('discord')"
  />
</template>
