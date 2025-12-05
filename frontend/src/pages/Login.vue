<template>
  <div class="login-page min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="login-container bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-green-500 mb-2">CalorieTracker</h1>
        <h2 class="text-xl font-semibold text-gray-700">Welcome Back</h2>
        <p class="text-gray-500 text-sm mt-1">Sign in to your account</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Username Field -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            :class="{ 'border-red-500': errors.username }"
            placeholder="Enter your username"
            autocomplete="username"
          />
          <p v-if="errors.username" class="text-red-500 text-xs mt-1">{{ errors.username }}</p>
        </div>

        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              :class="{ 'border-red-500': errors.password }"
              placeholder="••••••••"
              autocomplete="current-password"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
          <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember"
              v-model="formData.rememberMe"
              type="checkbox"
              class="mr-2"
            />
            <label for="remember" class="text-sm text-gray-600">
              Remember me
            </label>
          </div>
          <!-- <router-link to="/forgot-password" class="text-sm text-green-500 hover:underline">
            Forgot password?
          </router-link> -->
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-green-500 text-white py-2 rounded-md font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <span v-if="!loading">Sign In</span>
          <span v-else>Signing In...</span>
        </button>

        <!-- Error Message -->
        <div v-if="generalError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ generalError }}
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {{ successMessage }}
        </div>
      </form>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <!-- Social Login Buttons (Optional) -->
      <div class="space-y-2">
        <button
          type="button"
          @click="loginWithGoogle"
          class="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          <span>🔍</span>
          <span class="text-gray-700">Continue with Google</span>
        </button>
        <button
          type="button"
          @click="loginWithFacebook"
          class="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          <span>📘</span>
          <span class="text-gray-700">Continue with Facebook</span>
        </button>
      </div>

      <!-- Register Link -->
      <div class="mt-6 text-center">
        <p class="text-gray-600 text-sm">
          Don't have an account? 
          <router-link to="/register" class="text-green-500 hover:underline font-semibold">
            Sign Up
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/userStore';

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const showPassword = ref(false);
    const generalError = ref('');
    const successMessage = ref('');

    const formData = reactive({
      username: '',
      password: '',
      rememberMe: false
    });

    const errors = reactive({
      username: '',
      password: ''
    });

    const validateForm = () => {
      let isValid = true;
      
      // Reset errors
      Object.keys(errors).forEach(key => errors[key] = '');

      // Username validation
      if (!formData.username.trim()) {
        errors.username = 'Username is required';
        isValid = false;
      }

      // Password validation
      if (!formData.password) {
        errors.password = 'Password is required';
        isValid = false;
      }

      return isValid;
    };

    const handleSubmit = async () => {
      generalError.value = '';
      successMessage.value = '';

      if (!validateForm()) {
        return;
      }

      loading.value = true;

      try {
        const userStore = useUserStore();
        await userStore.login(formData.username, formData.password);
        const decoded = userStore.decodeToken();
        console.log('Decoded token:', decoded);
        await userStore.fetchUser(decoded.id);
        
        successMessage.value = 'Login successful! Redirecting...';
        
        // Redirect based on user role after 1 second
        setTimeout(() => {
          if (userStore.user?.isAdmin) {
            router.push('/admin');
          } else {
            router.push('/');
          }
        }, 1000);

      } catch (error) {
        console.error('Login error:', error);
        
        // Handle different error scenarios
        if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          const data = error.response.data;
          
          if (status === 401) {
            generalError.value = 'Invalid username or password';
          } else if (status === 400) {
            generalError.value = data.message || 'Invalid request. Please check your input.';
          } else if (status === 500) {
            generalError.value = 'Server error. Please try again later.';
          } else {
            generalError.value = data.message || 'Login failed. Please try again.';
          }
        } else if (error.request) {
          // Request was made but no response received
          generalError.value = 'Cannot connect to server. Please check your internet connection.';
        } else {
          // Something else happened
          generalError.value = error.message || 'An unexpected error occurred.';
        }
      } finally {
        loading.value = false;
      }
    };

    const loginWithGoogle = () => {
      console.log('Login with Google');
      generalError.value = 'Google login not implemented yet';
    };

    const loginWithFacebook = () => {
      console.log('Login with Facebook');
      generalError.value = 'Facebook login not implemented yet';
    };

    return {
      formData,
      errors,
      loading,
      showPassword,
      generalError,
      successMessage,
      handleSubmit,
      loginWithGoogle,
      loginWithFacebook
    };
  }
};
</script>

<style scoped>
</style>