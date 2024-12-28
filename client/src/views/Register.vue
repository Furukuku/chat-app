<script setup lang="ts">
import RegisterCard from '@/components/RegisterCard.vue';
import useGuest from '@/hooks/useGuest';
import { onBeforeMount } from 'vue';

onBeforeMount(async () => {
  const token = localStorage.getItem('token');
  if (token) {
    await useGuest(token, 'http://localhost:3001/register');
  }
});
</script>

<template>
  <RegisterCard />
</template>