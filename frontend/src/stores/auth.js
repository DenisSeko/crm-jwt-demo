import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/api.js';

export const useAuth = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(null);

  const set = (t, u) => {
    token.value = t;
    user.value = u;
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const clear = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const login = async (data) => {
    const res = await api.post('/auth/login', data);
    set(res.data.token, res.data.user);
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    set(res.data.token, res.data.user);
  };

  const load = () => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (t && u) {
      token.value = t;
      user.value = JSON.parse(u);
    }
  };

  const logout = () => {
    clear();
    window.location.href = '/login';
  };

  return { user, token, login, register, logout, load };
});
