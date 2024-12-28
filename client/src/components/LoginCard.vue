<script setup lang="ts">
import useForm from '@/hooks/useForm';
import router from '@/router';

interface LoginData {
  email: string;
  password: string;
}

const { data, post, loading, errors, reset } = useForm<LoginData>({
  email: '',
  password: ''
});

const handleSubmit = () => {
  post('http://localhost:3001/login', { onSuccess: () => {
    reset();
  } })
      .then(data => {
        if (data?.token) {
          router.push('/');
          localStorage.setItem('token', data.token);
        }
      })
      .catch(err => console.error(err));
};
</script>

<template>
  <div 
    class="py-20 overflow-auto"
    @submit.prevent="handleSubmit"
  >
    <form class="bg-zinc-900 w-[400px] mx-auto rounded-lg p-8">
      <h1 class="text-center text-xl font-bold mb-6">Login</h1>
      <div class="mb-4">
        <label for="email">Email</label>
        <input 
          type="text" 
          id="email"
          :class="['input', 'input-bordered', errors?.email || errors?.incorrect ? 'input-error' : '', 'w-full']" 
          v-model="data.email"
          :disabled="loading"
        />
        <p v-if="errors?.email" class="text-xs text-red-400 px-1 py-1">{{ errors.email }}</p>
      </div>
      <div class="mb-8">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password"
          :class="['input', 'input-bordered', errors?.password || errors?.incorrect ? 'input-error' : '', 'w-full']" 
          v-model="data.password"
          :disabled="loading"
        />
        <p v-if="errors?.password" class="text-xs text-red-400 px-1 py-1">{{ errors.password }}</p>
        <p v-if="errors?.incorrect" class="text-xs text-red-400 px-1 py-1">{{ errors.incorrect }}</p>
      </div>
      <button
        type="submit"
        class="btn btn-block btn-accent"
        :disabled="loading"
      >
        Login
      </button>
      <p class="text-center text-sm mt-4">
        Dont have an account?
        <RouterLink 
          to="/register"
          class="link link-info"
        >
          Register
        </RouterLink>
      </p>
    </form>
  </div>
</template>