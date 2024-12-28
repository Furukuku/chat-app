<script setup lang="ts">
import useAuth from '@/hooks/useAuth';
import router from '@/router';
import { onBeforeMount, ref } from 'vue';

interface IUser {
  _id: string;
  name: string;
  email: string;
}

const user = ref<IUser | null>(null);

const handleLogoutClick = () => {
  localStorage.removeItem('token');
  return router.push('/login');
};

onBeforeMount(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return router.push('/login');
  }

  user.value = await useAuth(token, 'http://localhost:3001/');
});
</script>

<template>
  <div class="my-20">
    <h1 class="text-center text-xl font-bold">Hello! {{ user?.name }}</h1>
    <div class="flex justify-center mt-4">
      <button 
        class="btn btn-outline btn-sm"
        :onclick="handleLogoutClick"
      >
        Logout
      </button>
    </div>
  </div>
</template>