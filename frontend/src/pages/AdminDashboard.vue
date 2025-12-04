<template>
  <div class="admin-dashboard-page p-4 md:p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-4 md:mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Admin Dashboard</h1>
      <p class="text-sm md:text-base text-gray-600">
        Last updated: {{ lastUpdate }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-green-500"></div>
      <p class="mt-4 text-sm md:text-base text-gray-600">Loading dashboard...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-3 py-2 md:px-4 md:py-3 rounded text-sm md:text-base mb-4 md:mb-6">
      <h2 class="text-lg font-bold mb-2">Error Loading Dashboard</h2>
      <p class="mb-3">{{ error }}</p>
      <button 
        @click="fetchData"
        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm md:text-base transition"
      >
        Retry
      </button>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Health Status Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
        <div class="bg-white rounded-lg shadow p-4 md:p-6">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
              <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span class="text-base md:text-lg">Liveness</span>
            </h2>
            <span :class="[
              'px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold',
              health.liveness?.status === 'ok' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            ]">
              {{ health.liveness?.status?.toUpperCase() || 'N/A' }}
            </span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-4 md:p-6">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
              <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              <span class="text-base md:text-lg">Readiness</span>
            </h2>
            <span :class="[
              'px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold',
              health.readiness?.status === 'ok' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            ]">
              {{ health.readiness?.status?.toUpperCase() || 'N/A' }}
            </span>
          </div>
        </div>
      </div>

      <!-- System Stats -->
      <div class="bg-white rounded-lg shadow p-4 md:p-6 mb-4 md:mb-6">
        <h2 class="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
          System Statistics
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div class="bg-gray-50 rounded-lg p-3 md:p-4">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-4 h-4 md:w-5 md:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="text-xs md:text-sm text-gray-600 font-medium">Uptime</h3>
            </div>
            <p class="text-lg md:text-2xl font-bold text-gray-800">
              {{ formatUptime(stats?.uptime || 0) }}
            </p>
          </div>

          <div class="bg-gray-50 rounded-lg p-3 md:p-4">
            <h3 class="text-xs md:text-sm text-gray-600 font-medium mb-2">Memory (RSS)</h3>
            <p class="text-lg md:text-2xl font-bold text-gray-800">
              {{ formatBytes(stats?.memoryUsage?.rss || 0) }}
            </p>
          </div>

          <div class="bg-gray-50 rounded-lg p-3 md:p-4">
            <h3 class="text-xs md:text-sm text-gray-600 font-medium mb-2">Heap Used</h3>
            <p class="text-lg md:text-2xl font-bold text-gray-800">
              {{ formatBytes(stats?.memoryUsage?.heapUsed || 0) }}
            </p>
          </div>

          <div class="bg-gray-50 rounded-lg p-3 md:p-4">
            <h3 class="text-xs md:text-sm text-gray-600 font-medium mb-2">Platform</h3>
            <p class="text-base md:text-xl font-bold text-gray-800">
              {{ stats?.platform }} ({{ stats?.arch }})
            </p>
            <p class="text-xs text-gray-500 mt-1">{{ stats?.nodeVersion }}</p>
          </div>
        </div>
      </div>

      <!-- Database Stats -->
      <div class="bg-white rounded-lg shadow p-4 md:p-6 mb-4 md:mb-6">
        <h2 class="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
          Database Statistics
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <div class="bg-blue-50 rounded-lg p-4 md:p-6 border border-blue-200">
            <div class="flex items-center gap-3 mb-2">
              <svg class="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 class="text-base md:text-lg text-gray-700 font-medium">Users</h3>
            </div>
            <p class="text-3xl md:text-4xl font-bold text-gray-800">{{ dbStats?.users || 0 }}</p>
          </div>

          <div class="bg-green-50 rounded-lg p-4 md:p-6 border border-green-200">
            <div class="flex items-center gap-3 mb-2">
              <svg class="w-6 h-6 md:w-8 md:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 class="text-base md:text-lg text-gray-700 font-medium">Diets</h3>
            </div>
            <p class="text-3xl md:text-4xl font-bold text-gray-800">{{ dbStats?.diets || 0 }}</p>
          </div>

          <div class="bg-purple-50 rounded-lg p-4 md:p-6 border border-purple-200">
            <div class="flex items-center gap-3 mb-2">
              <svg class="w-6 h-6 md:w-8 md:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 class="text-base md:text-lg text-gray-700 font-medium">Recipes</h3>
            </div>
            <p class="text-3xl md:text-4xl font-bold text-gray-800">{{ dbStats?.recipes || 0 }}</p>
          </div>
        </div>
      </div>

      <!-- HTTP Metrics -->
      <div v-if="metrics" class="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 class="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          HTTP Metrics
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div class="bg-gray-50 rounded-lg p-3 md:p-4">
            <h3 class="text-xs md:text-sm text-gray-600 font-medium mb-2">Total Requests</h3>
            <p class="text-2xl md:text-3xl font-bold text-gray-800">
              {{ metrics.httpRequestsTotal }}
            </p>
          </div>

          <div class="bg-gray-50 rounded-lg p-3 md:p-4">
            <h3 class="text-xs md:text-sm text-gray-600 font-medium mb-3">Requests by Status</h3>
            <div class="space-y-2">
              <div 
                v-for="(count, status) in metrics.requestsByStatus" 
                :key="status"
                class="flex justify-between items-center"
              >
                <span :class="[
                  'px-2 py-1 rounded text-xs md:text-sm font-semibold',
                  status.startsWith('2') ? 'bg-green-100 text-green-800' :
                  status.startsWith('4') ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                ]">
                  {{ status }}
                </span>
                <span class="text-gray-800 font-semibold text-sm md:text-base">{{ count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import api from '../api';

export default {
  name: 'AdminDashboard',
  setup() {    
    const stats = ref(null);
    const dbStats = ref(null);
    const health = ref({ liveness: null, readiness: null });
    const metrics = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const lastUpdateTime = ref(new Date());
    const refreshInterval = ref(null);

    const lastUpdate = computed(() => {
      return lastUpdateTime.value.toLocaleTimeString();
    });

    const parsePrometheusMetrics = (text) => {
      const lines = text.split('\n');
      const parsed = {
        httpRequestsTotal: 0,
        avgResponseTime: 0,
        requestsByStatus: {}
      };

      lines.forEach(line => {
        if (line.startsWith('http_requests_total')) {
          const match = line.match(/(\d+)$/);
          if (match) parsed.httpRequestsTotal += parseInt(match[1]);
          
          const statusMatch = line.match(/status_code="(\d+)"/);
          if (statusMatch) {
            const status = statusMatch[1];
            const count = parseInt(line.match(/(\d+)$/)[1]);
            parsed.requestsByStatus[status] = (parsed.requestsByStatus[status] || 0) + count;
          }
        }
      });

      return parsed;
    };

    const fetchData = async () => {
      try {
        const [statsRes, dbStatsRes, livenessRes, readinessRes, metricsRes] = await Promise.all([
          api.get(`/stats`),
          api.get(`/stats/db`),
          api.get(`/health/liveness`),
          api.get(`/health/readiness`),
          api.get(`/metrics`)
        ]);

        stats.value = statsRes.data;
        dbStats.value = dbStatsRes.data;
        health.value = { 
          liveness: livenessRes.data, 
          readiness: readinessRes.data 
        };
        metrics.value = parsePrometheusMetrics(metricsRes.data);
        lastUpdateTime.value = new Date();
        loading.value = false;
        error.value = null;
      } catch (err) {
        error.value = err.message || 'Failed to fetch dashboard data';
        loading.value = false;
      }
    };

    const formatUptime = (seconds) => {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${days}d ${hours}h ${minutes}m`;
    };

    const formatBytes = (bytes) => {
      return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    };

    onMounted(() => {
      fetchData();
      refreshInterval.value = setInterval(fetchData, 10000); // Refresh every 10 seconds
    });

    onUnmounted(() => {
      if (refreshInterval.value) {
        clearInterval(refreshInterval.value);
      }
    });

    return {
      stats,
      dbStats,
      health,
      metrics,
      loading,
      error,
      lastUpdate,
      fetchData,
      formatUptime,
      formatBytes
    };
  }
};
</script>

<style scoped>
</style>