<script setup lang="ts">
const { signIn, signOut, status } = useAuth();
</script>

<template>
  <UButton
    v-if="status === 'authenticated'"
    label="Log Out"
    size="xs"
    variant="outline"
    color="yellow"
    @click="signOut()"
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
