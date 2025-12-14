import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../pages/Dashboard.vue';
import DailyIntakes from '../pages/DailyIntakes.vue';
import AddFood from '../pages/ScanFood.vue';
import MyRecipes from '../pages/MyRecipes.vue';
import Diet from '../pages/Diet.vue';
import UserSettings from '../pages/UserSettings.vue';
import Register from '../pages/Register.vue';
import Login from '../pages/Login.vue';
import FindRecipe from '../pages/FindRecipe.vue';

import AdminDashboard from '../pages/AdminDashboard.vue';
import AdminRecipesPage from '../pages/AdminRecipesPage.vue';
import AdminUsersPage from '../pages/AdminUsersPage.vue';

import NotFound from '../pages/NotFound.vue';
import { useUserStore } from '../store/userStore';
import { notifyWarning } from '../utils/Notifications';

const routes = [
  { path: '/register', component: Register, meta: { requiresAuth: false } },
  { path: '/login', name: 'Login', component: Login, meta: { requiresAuth: false } },
  { path: '/', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/history', component: DailyIntakes, meta: { requiresAuth: true } },
  { path: '/scan-food', component: AddFood, meta: { requiresAuth: true } },
  { path: '/my-recipes', component: MyRecipes, meta: { requiresAuth: true } },
  { path: '/find-recipe', component: FindRecipe, meta: { requiresAuth: true } },
  { path: '/diet', component: Diet, meta: { requiresAuth: true } },
  { path: '/settings', component: UserSettings, meta: { requiresAuth: true } },
  { path: '/admin', component: AdminDashboard, meta: { requiresAuth: true } },
  { path: '/admin/users', component: AdminUsersPage, meta: { requiresAuth: true } },
  { path: '/admin/recipes', component: AdminRecipesPage, meta: { requiresAuth: true } },
  { path: "/:pathMatch(.*)*", component: NotFound, meta: { requiresAuth: false } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // No auth required, continue
  if (!to.meta.requiresAuth) {
    return next()
  }

  // No token, redirect to login
  if (!userStore.authToken.value) {
    return next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  }

  // Decode token and validate
  const decoded = userStore.decodeToken()
  userStore.isTokenExpired()

  if (!decoded?.exp) {
    notifyWarning("Session Expired")
    userStore.logout()
    return next({ name: 'Login' })
  }

  const now = Math.floor(Date.now() / 1000)

  // Token expired
  if (decoded.exp < now) {
    userStore.logout()
    return next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  }

  next()
})

export default router;