import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../pages/Dashboard.vue';
import DailyIntakes from '../pages/DailyIntakes.vue';
import AddFood from '../pages/ScanFood.vue';
import Recipes from '../pages/Recipes.vue';
import Diet from '../pages/Diet.vue';
import UserSettings from '../pages/UserSettings.vue';
import Register from '../pages/Register.vue';
import Login from '../pages/Login.vue';
import AdminDashboard from '../pages/AdminDashboard.vue';
import AdminUserManagement from '../components/AdminUserManagement.vue';
import AdminRecipeManagement from '../components/AdminRecipeManagement.vue';
import NotFound from '../pages/NotFound.vue';

const routes = [
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/', component: Dashboard },
  { path: '/history', component: DailyIntakes },
  { path: '/scan-food', component: AddFood },
  { path: '/recipes', component: Recipes },
  { path: '/diet', component: Diet },
  { path: '/settings', component: UserSettings },
  { path: '/admin', component: AdminDashboard },
  { path: '/admin/users', component: AdminUserManagement },
  { path: '/admin/recipes', component: AdminRecipeManagement },
  { path: "/:pathMatch(.*)*", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;