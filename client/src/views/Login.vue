<script setup lang="ts">
import LoginCard from "@/components/LoginCard.vue";
import useGuest from "@/hooks/useGuest";
import { onBeforeMount } from "vue";

onBeforeMount(async () => {
  const token = localStorage.getItem('token');
  if (token) {
    await useGuest(token, 'http://localhost:3001/login');
  }
});
</script>

<template>
  <LoginCard />
</template>