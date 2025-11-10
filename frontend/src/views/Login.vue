<template>
  <div class="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow">
    <h2 class="text-2xl font-bold text-center mb-6">{{ isRegister ? 'Registracija' : 'Prijava' }}</h2>
    <form @submit.prevent="submit" class="space-y-4">
      <input v-model="form.email" type="email" placeholder="Email" required class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <input v-model="form.password" type="password" placeholder="Lozinka" required class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <input v-if="isRegister" v-model="form.name" placeholder="Ime i prezime" required class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <button type="submit" :disabled="loading" class="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition">
        {{ loading ? 'Učitavanje...' : (isRegister ? 'Registruj se' : 'Prijavi se') }}
      </button>
    </form>
    <p class="text-center mt-4 text-sm">
      <button @click="isRegister = !isRegister" class="text-blue-600 hover:underline">
        {{ isRegister ? 'Već imaš nalog? Prijavi se' : 'Nemaš nalog? Registruj se' }}
      </button>
    </p>
    <div class="mt-4 p-3 bg-yellow-50 text-sm rounded border border-yellow-200">
      <strong>Demo pristup:</strong><br>
      Email: <strong>demo@demo.com</strong><br>
      Lozinka: <strong>demo123</strong>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth.js';

const router = useRouter();
const auth = useAuth();
const isRegister = ref(false);
const loading = ref(false);
const form = reactive({ email: 'demo@demo.com', password: 'demo123', name: '' });

const submit = async () => {
  loading.value = true;
  try {
    if (isRegister.value) {
      await auth.register({ ...form });
    } else {
      await auth.login({ email: form.email, password: form.password });
    }
    router.push('/dashboard');
  } catch (err) {
    alert(err.response?.data?.error || 'Greška pri prijavi');
  } finally {
    loading.value = false;
  }
};
</script>
