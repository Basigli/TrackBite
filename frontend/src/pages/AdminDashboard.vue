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
    <LoadingState :loading="loading" message="Loading dashboard..." />

    <!-- Error State -->
    <ErrorState 
      v-if="!loading && error" 
      :error="error" 
      title="Error Loading Dashboard"
      @retry="fetchData" 
    />

    <!-- Dashboard Content -->
    <div v-if="!loading && !error">
      <!-- Health Status Cards -->
      <HealthStatusCards 
        :liveness="health.liveness"
        :readiness="health.readiness"
      />

      <!-- System Stats -->
      <SystemStatsCard :stats="stats" />

      <!-- Database Stats -->
      <DatabaseStatsCard :dbStats="dbStats" />

      <!-- HTTP Metrics -->
      <HttpMetricsCard :metrics="metrics" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import api from '../api';
import HealthStatusCards from '../components/admin/stats/HealthStatusCards.vue';
import SystemStatsCard from '../components/admin/stats/SystemStatsCard.vue';
import DatabaseStatsCard from '../components/admin/stats/DatabaseStatsCard.vue';
import HttpMetricsCard from '../components/admin/stats/HttpMetricsCard.vue';
import LoadingState from '../components/admin/stats/LoadingState.vue';
import ErrorState from '../components/admin/stats/ErrorState.vue';

export default {
  name: 'AdminDashboard',
  components: {
    HealthStatusCards,
    SystemStatsCard,
    DatabaseStatsCard,
    HttpMetricsCard,
    LoadingState,
    ErrorState
  },
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
        loading.value = true;
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
      fetchData
    };
  }
};
</script>