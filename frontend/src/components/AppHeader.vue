<template>
  <nav class="bg-white shadow-sm p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
        <span class="font-bold text-xl text-blue-600">CRM Demo</span>
      </div>
      <div v-if="auth.user" class="flex items-center space-x-6">
        <router-link to="/dashboard" class="text-gray-700 hover:text-blue-600 transition" :class="{ 'text-blue-600 font-semibold': $route.path === '/dashboard' }">
          Klijenti
        </router-link>
        <router-link to="/notes" class="text-gray-700 hover:text-blue-600 transition" :class="{ 'text-blue-600 font-semibold': $route.path === '/notes' }">
          Bilješke
        </router-link>
        <span class="text-gray-700">Zdravo, {{ auth.user.name }}</span>
        <button @click="auth.logout()" class="text-red-600 hover:text-red-800 transition">
          Odjavi se
        </button>
      </div>
      <div v-else class="flex items-center space-x-4">
        <router-link to="/login" class="text-gray-700 hover:text-blue-600 transition">
          Prijavi se
        </router-link>
        <router-link to="/notes" class="text-gray-700 hover:text-blue-600 transition">
          Bilješke
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuth } from '@/stores/auth.js';
const auth = useAuth();
</script>
