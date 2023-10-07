<script setup lang="ts">
const { signIn, signOut, status, session } = useAuth();
</script>

<template>
  <div class="flex items-center gap-2">
    <template v-if="status === 'authenticated'">
      <UButton @click="signOut()" label="Sign Out" size="xs" />
      <UAvatar :src="session?.user?.avatar" :alt="session?.user?.name" />
    </template>
    <UButton
      v-else
      :label="status === 'unauthenticated' ? 'Sign In' : ''"
      size="xs"
      :loading="status === 'loading'"
      class="transition-all"
      @click="signIn('discord')"
    />
  </div>
</template>
