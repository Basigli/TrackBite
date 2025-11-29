import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../pages/Dashboard.vue';
import DailyIntakes from '../pages/DailyIntakes.vue';
import AddFood from '../pages/AddFood.vue';
import Recipes from '../pages/Recipes.vue';
import Diet from '../pages/Diet.vue';
import UserSettings from '../pages/UserSettings.vue';
import Register from '../pages/Register.vue';
import Login from '../pages/Login.vue';

const routes = [
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/', component: Dashboard },
  { path: '/history', component: DailyIntakes },
  { path: '/add-food', component: AddFood },
  { path: '/recipes', component: Recipes },
  { path: '/diet', component: Diet },
  { path: '/settings', component: UserSettings },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;


// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [],
// })