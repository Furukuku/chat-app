<script setup lang="ts">
import useForm from '@/hooks/useForm';
import router from '@/router';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const { data, loading, errors, post, reset } = useForm<RegisterData>({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
 });

const handelSubmit = () => {
  post('http://localhost:3001/register', { onSuccess: () => {
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
  <div class="py-20 overflow-auto">
    <form 
      class="bg-zinc-900 w-[400px] mx-auto rounded-lg p-8"
      @submit.prevent="handelSubmit"
    >
      <h1 class="text-center text-xl font-bold mb-6">Register</h1>
      <div class="mb-4">
        <label for="name">Name</label>
        <input 
          type="text" 
          id="name"
          :class="['input', 'input-bordered', errors?.name ? 'input-error' : '', 'w-full']" 
          v-model="data.name"
          :disabled="loading"
        />
        <p v-if="errors?.name" class="text-xs text-red-400 px-1 py-1">{{ errors.name }}</p>
      </div>
      <div class="mb-4">
        <label for="email">Email</label>
        <input 
          type="text" 
          id="email"
          :class="['input', 'input-bordered', errors?.email ? 'input-error' : '', 'w-full']" 
          v-model="data.email"
          :disabled="loading"
        />
        <p v-if="errors?.email" class="text-xs text-red-400 px-1 py-1">{{ errors.email }}</p>
      </div>
      <div class="mb-4">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password"
          :class="['input', 'input-bordered', errors?.password ? 'input-error' : '', 'w-full']" 
          v-model="data.password"
          :disabled="loading"
        />
        <p v-if="errors?.password" class="text-xs text-red-400 px-1 py-1">{{ errors.password }}</p>
      </div>
      <div class="mb-8">
        <label for="confirm-password">Confirm Password</label>
        <input 
          type="password" 
          id="confirm-password"
          :class="['input', 'input-bordered', errors?.confirmPassword ? 'input-error' : '', 'w-full']" 
          v-model="data.confirmPassword"
          :disabled="loading"
        />
        <p v-if="errors?.confirmPassword" class="text-xs text-red-400 px-1 py-1">{{ errors.confirmPassword }}</p>
      </div>
      <button
        type="submit"
        class="btn btn-block btn-accent"
        :disabled="loading"
      >
        Register
      </button>
      <p class="text-center text-sm mt-4">
        Already have an account?
        <RouterLink 
        to="/login"
          class="link link-info"
        >
          Login
        </RouterLink>
      </p>
    </form>
  </div>
</template>