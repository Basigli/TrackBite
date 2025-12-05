<template>
  <div class="register-page min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="register-container bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-green-500 mb-2">CalorieTracker</h1>
        <h2 class="text-xl font-semibold text-gray-700">Create Account</h2>
        <p class="text-gray-500 text-sm mt-1">Sign up to start tracking your calories</p>
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Name Field -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            :class="{ 'border-red-500': errors.name }"
            placeholder="John Doe"
          />
          <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
        </div>

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
          <p class="text-gray-500 text-xs mt-1">Must be at least 8 characters</p>
        </div>

        <!-- Confirm Password Field -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            :class="{ 'border-red-500': errors.confirmPassword }"
            placeholder="••••••••"
          />
          <p v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1">{{ errors.confirmPassword }}</p>
        </div>

        <!-- Terms and Conditions -->
        <div class="flex items-start">
          <input
            id="terms"
            v-model="formData.acceptTerms"
            type="checkbox"
            required
            class="mt-1 mr-2"
          />
          <label for="terms" class="text-sm text-gray-600">
            I agree to the <a href="#" class="text-green-500 hover:underline">Terms and Conditions</a> and 
            <a href="#" class="text-green-500 hover:underline">Privacy Policy</a>
          </label>
        </div>
        <p v-if="errors.acceptTerms" class="text-red-500 text-xs">{{ errors.acceptTerms }}</p>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-green-500 text-white py-2 rounded-md font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <span v-if="!loading">Create Account</span>
          <span v-else>Creating Account...</span>
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

      <!-- Login Link -->
      <div class="mt-6 text-center">
        <p class="text-gray-600 text-sm">
          Already have an account? 
          <router-link to="/login" class="text-green-500 hover:underline font-semibold">
            Sign In
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

export default {
  name: 'RegisterPage',
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const showPassword = ref(false);
    const generalError = ref('');
    const successMessage = ref('');

    const formData = reactive({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    });

    const errors = reactive({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: ''
    });

    const validateForm = () => {
      let isValid = true;
      
      // Reset errors
      Object.keys(errors).forEach(key => errors[key] = '');

      // Name validation
      if (!formData.name.trim()) {
        errors.name = 'Name is required';
        isValid = false;
      } else if (formData.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters';
        isValid = false;
      }

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
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
        isValid = false;
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }

      // Terms validation
      if (!formData.acceptTerms) {
        errors.acceptTerms = 'You must accept the terms and conditions';
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
        const res = await api.post('/users', { nickname: formData.name, mail: formData.email, savedRecipesIds: [], passwordHash: formData.password });

        if (res.status !== 201) {
          throw new Error('Registration failed. Please try again.');
        }
        successMessage.value = 'Account created successfully! Redirecting...';
        
        // Redirect to login or dashboard after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);

      } catch (error) {
        generalError.value = error.message || 'Registration failed. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    return {
      formData,
      errors,
      loading,
      showPassword,
      generalError,
      successMessage,
      handleSubmit
    };
  }
};
</script>

<style scoped>
/* Add any additional custom styles here */
</style>