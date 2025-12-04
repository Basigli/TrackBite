<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p class="text-gray-400">
          Last updated: {{ lastUpdate }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-white text-xl">Loading dashboard...</div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center py-20">
        <div class="bg-red-500/20 border border-red-500 rounded-lg p-6 text-white max-w-md">
          <h2 class="text-xl font-bold mb-2">Error Loading Dashboard</h2>
          <p>{{ error }}</p>
          <button 
            @click="fetchData"
            class="mt-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
          >
            Retry
          </button>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div v-else>
        <!-- Health Status -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-white flex items-center gap-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Liveness
              </h2>
              <span :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                health.liveness?.status === 'ok' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              ]">
                {{ health.liveness?.status?.toUpperCase() || 'N/A' }}
              </span>
            </div>
          </div>

          <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-white flex items-center gap-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                Readiness
              </h2>
              <span :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                health.readiness?.status === 'ok' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              ]">
                {{ health.readiness?.status?.toUpperCase() || 'N/A' }}
              </span>
            </div>
          </div>
        </div>

        <!-- System Stats -->
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
          <h2 class="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
            System Statistics
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-gray-700/50 rounded p-4">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="text-sm text-gray-400">Uptime</h3>
              </div>
              <p class="text-2xl font-bold text-white">
                {{ formatUptime(stats?.uptime || 0) }}
              </p>
            </div>

            <div class="bg-gray-700/50 rounded p-4">
              <h3 class="text-sm text-gray-400 mb-2">Memory (RSS)</h3>
              <p class="text-2xl font-bold text-white">
                {{ formatBytes(stats?.memoryUsage?.rss || 0) }}
              </p>
            </div>

            <div class="bg-gray-700/50 rounded p-4">
              <h3 class="text-sm text-gray-400 mb-2">Heap Used</h3>
              <p class="text-2xl font-bold text-white">
                {{ formatBytes(stats?.memoryUsage?.heapUsed || 0) }}
              </p>
            </div>

            <div class="bg-gray-700/50 rounded p-4">
              <h3 class="text-sm text-gray-400 mb-2">Platform</h3>
              <p class="text-xl font-bold text-white">
                {{ stats?.platform }} ({{ stats?.arch }})
              </p>
              <p class="text-xs text-gray-400 mt-1">{{ stats?.nodeVersion }}</p>
            </div>
          </div>
        </div>

        <!-- Database Stats -->
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
          <h2 class="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            Database Statistics
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg p-6 border border-blue-500/30">
              <div class="flex items-center gap-3 mb-2">
                <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 class="text-lg text-gray-300">Users</h3>
              </div>
              <p class="text-4xl font-bold text-white">{{ dbStats?.users || 0 }}</p>
            </div>

            <div class="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg p-6 border border-green-500/30">
              <div class="flex items-center gap-3 mb-2">
                <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 class="text-lg text-gray-300">Diets</h3>
              </div>
              <p class="text-4xl font-bold text-white">{{ dbStats?.diets || 0 }}</p>
            </div>

            <div class="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30">
              <div class="flex items-center gap-3 mb-2">
                <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 class="text-lg text-gray-300">Recipes</h3>
              </div>
              <p class="text-4xl font-bold text-white">{{ dbStats?.recipes || 0 }}</p>
            </div>
          </div>
        </div>

        <!-- HTTP Metrics -->
        <div v-if="metrics" class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 class="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            HTTP Metrics
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-700/50 rounded p-4">
              <h3 class="text-sm text-gray-400 mb-2">Total Requests</h3>
              <p class="text-3xl font-bold text-white">
                {{ metrics.httpRequestsTotal }}
              </p>
            </div>

            <div class="bg-gray-700/50 rounded p-4">
              <h3 class="text-sm text-gray-400 mb-2">Requests by Status</h3>
              <div class="space-y-2">
                <div 
                  v-for="(count, status) in metrics.requestsByStatus" 
                  :key="status"
                  class="flex justify-between items-center"
                >
                  <span :class="[
                    'px-2 py-1 rounded text-sm',
                    status.startsWith('2') ? 'bg-green-500/20 text-green-400' :
                    status.startsWith('4') ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  ]">
                    {{ status }}
                  </span>
                  <span class="text-white font-semibold">{{ count }}</span>
                </div>
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