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
        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            :class="{ 'border-red-500': errors.email }"
            placeholder="john@example.com"
            autocomplete="email"
          />
          <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
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
          <router-link to="/forgot-password" class="text-sm text-green-500 hover:underline">
            Forgot password?
          </router-link>
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

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const showPassword = ref(false);
    const generalError = ref('');
    const successMessage = ref('');

    const formData = reactive({
      email: '',
      password: '',
      rememberMe: false
    });

    const errors = reactive({
      email: '',
      password: ''
    });

    const validateForm = () => {
      let isValid = true;
      
      // Reset errors
      Object.keys(errors).forEach(key => errors[key] = '');

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
        isValid = false;
      } else if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
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
        // Replace this with your actual API call
        const response = await loginUser({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe
        });

        // Store token/user data
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }

        successMessage.value = 'Login successful! Redirecting...';
        
        // Redirect to dashboard after 1 second
        setTimeout(() => {
          router.push('/');
        }, 1000);

      } catch (error) {
        generalError.value = error.message || 'Login failed. Please check your credentials.';
      } finally {
        loading.value = false;
      }
    };

    const loginUser = async (credentials) => {
      // Simulate API call
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate login validation
          if (credentials.email === 'test@test.com' && credentials.password === 'password123') {
            resolve({ 
              success: true, 
              token: 'fake-jwt-token',
              user: { email: credentials.email, name: 'Test User' }
            });
          } else {
            reject(new Error('Invalid email or password'));
          }
        }, 1500);
      });

      // Real implementation would look like:
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials)
      // });
      // if (!response.ok) throw new Error('Login failed');
      // return await response.json();
    };

    const loginWithGoogle = () => {
      console.log('Login with Google');
      // Implement Google OAuth login
      generalError.value = 'Google login not implemented yet';
    };

    const loginWithFacebook = () => {
      console.log('Login with Facebook');
      // Implement Facebook OAuth login
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
/* Add any additional custom styles here */
</style>