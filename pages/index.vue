<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})
import { GalleryVerticalEnd } from 'lucide-vue-next'
import LoginForm from '@/components/LoginForm.vue'
</script>

<template>
  <div class="bg-[#000000] flex min-h-svh flex-col items-center justify-center gap-6 md:p-10">
    <div class="flex w-full max-w-sm flex-col gap-6">
      <LoginForm />
    </div>
  </div>
</template>
