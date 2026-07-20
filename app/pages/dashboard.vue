<!-- pages/dashboard.vue -->
<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <!-- CSU Brand Header Bar -->
    <header
      class="bg-[#003300] text-white shadow-md border-b-4 border-[#FFCC00]"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <h1 class="text-2xl font-bold tracking-tight text-[#FFCC00]">
          CSU MIS Queueing System
        </h1>
        <p class="text-xs text-emerald-100 mt-1">Completed Tickets Overview</p>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center items-center py-20">
        <div
          class="animate-spin rounded-full h-12 w-12 border-4 border-[#003300] border-t-[#FFCC00]"
        ></div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700"
      >
        <p class="font-bold">Error loading dashboard data</p>
        <p class="text-sm">{{ error.statusMessage || error.message }}</p>
      </div>

      <!-- Category Done Cards -->
      <div
        v-else-if="stats"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
      >
        <div
          v-for="cat in stats.categories"
          :key="cat.servicetype"
          class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 border-t-4 border-t-[#003300] flex flex-col justify-between"
        >
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              {{ cat.servicetype }}
            </p>
            <div class="mt-3 flex items-baseline justify-between">
              <span class="text-4xl font-extrabold text-[#003300]">
                {{ cat.done }}
              </span>
              <span
                class="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full"
              >
                Done
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// 1. Define explicit types for the API response
interface CategoryStat {
  servicetype: string;
  done: number;
}

interface StatsResponse {
  categories: CategoryStat[];
}

// 2. Pass the interface generic into useFetch
const {
  data: stats,
  pending,
  error,
} = await useFetch<StatsResponse>("/api/dashboard/stats");
</script>
