import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/stores/auth.js';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Dashboard from '@/views/Dashboard.vue';
import Notes from '@/views/Notes.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/notes', component: Notes }
  ]
});

router.beforeEach((to, _from, next) => {
  const auth = useAuth();
  if (to.meta.requiresAuth && !auth.token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
