<!-- pages/dashboard.vue -->
<template>
  <div class="space-y-6">
    <!-- Page Header & Actions Bar -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-xl font-bold text-slate-900">MIS Queueing Dashboard</h1>
        <p class="text-xs text-slate-500 font-medium">
          Real-time overview of completed services across categories
        </p>
      </div>

      <!-- Quick Refresh Button -->
      <button
        @click="handleRefresh"
        :disabled="pending"
        class="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#003300] disabled:opacity-50 shrink-0"
        aria-label="Refresh Dashboard Data"
      >
        <svg
          :class="['w-4 h-4 text-slate-500', pending ? 'animate-spin' : '']"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span>{{ pending ? "Updating..." : "Refresh" }}</span>
      </button>
    </div>

    <!-- Loading Skeleton State -->
    <div v-if="pending && !stats" class="space-y-6">
      <div class="h-28 bg-slate-200/80 rounded-2xl animate-pulse"></div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
      >
        <div
          v-for="i in 5"
          :key="i"
          class="h-40 bg-slate-200/80 rounded-2xl animate-pulse"
        ></div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-50 border-l-4 border-red-500 p-5 rounded-2xl shadow-sm text-red-800 flex items-start gap-4"
      role="alert"
    >
      <div class="p-2 bg-red-100 rounded-lg text-red-600 shrink-0">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <div class="flex-1">
        <h3 class="font-bold text-base">Database Query Failed</h3>
        <p class="text-sm text-red-700 mt-0.5">
          {{ error.statusMessage || error.message }}
        </p>
        <button
          @click="handleRefresh"
          class="mt-3 text-xs font-bold text-red-800 underline hover:text-red-900"
        >
          Try reloading data
        </button>
      </div>
    </div>

    <!-- Dashboard Main Content -->
    <template v-else-if="stats">
      <!-- Summary & Filter Row -->
      <section
        class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
      >
        <div class="absolute top-0 left-0 bottom-0 w-2 bg-[#003300]"></div>

        <div class="space-y-1">
          <div
            class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60"
          >
            <span
              class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
            ></span>
            Live Queue Summary
          </div>
          <h2 class="text-xl font-bold text-slate-900">
            Total Completed Services
          </h2>
          <p class="text-xs text-slate-500">
            Cumulative completed tickets across all active categories
          </p>
        </div>

        <div
          class="flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <!-- Search / Filter Input -->
          <div class="relative w-full sm:w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Filter category..."
              class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003300] transition-all"
            />
            <svg
              class="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <!-- Total Metric Badge -->
          <div
            class="flex items-baseline gap-2 bg-slate-50 px-5 py-3 rounded-xl border border-slate-200/60 shrink-0"
          >
            <span class="text-4xl font-black text-[#003300] tracking-tight">
              {{ totalDone }}
            </span>
            <span
              class="text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              Total Done
            </span>
          </div>
        </div>
      </section>

      <!-- Category Grid -->
      <section
        v-if="filteredCategories.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
      >
        <div
          v-for="cat in filteredCategories"
          :key="cat.servicetype"
          class="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 relative group overflow-hidden"
        >
          <!-- Top Category Color Accent -->
          <div
            :class="[
              'absolute top-0 left-0 right-0 h-1.5',
              getCategoryMeta(cat.servicetype).barBg,
            ]"
          ></div>

          <div class="space-y-4">
            <!-- Icon & Percentage Tag -->
            <div class="flex items-center justify-between gap-2">
              <span
                :class="[
                  'p-2 rounded-xl text-xs font-bold',
                  getCategoryMeta(cat.servicetype).badgeBg,
                  getCategoryMeta(cat.servicetype).badgeText,
                ]"
              >
                <component
                  :is="getCategoryMeta(cat.servicetype).icon"
                  class="w-5 h-5"
                />
              </span>
              <span
                class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md"
              >
                {{ calculatePercentage(cat.done) }}% of total
              </span>
            </div>

            <!-- Category Info -->
            <div>
              <p
                class="text-xs font-bold uppercase tracking-wider text-slate-600 line-clamp-1"
                :title="cat.servicetype"
              >
                {{ cat.servicetype }}
              </p>

              <div class="mt-2 flex items-baseline justify-between">
                <span class="text-3xl font-black text-slate-900">
                  {{ cat.done }}
                </span>
                <span
                  class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60"
                >
                  Completed
                </span>
              </div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mt-4 pt-3 border-t border-slate-100">
            <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                :class="[
                  'h-full rounded-full transition-all duration-500',
                  getCategoryMeta(cat.servicetype).barBg,
                ]"
                :style="{ width: `${calculatePercentage(cat.done)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Empty State -->
      <div
        v-else
        class="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm space-y-3"
      >
        <div
          class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <p class="text-slate-600 font-semibold text-sm">
          No matching service categories found
        </p>
        <p class="text-xs text-slate-400">
          Try clearing your search query to see all metrics.
        </p>
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="text-xs font-bold text-[#003300] hover:underline pt-2"
        >
          Clear Search
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from "vue";

interface CategoryStat {
  servicetype: string;
  done: number;
}

interface StatsResponse {
  categories: CategoryStat[];
}

const searchQuery = ref("");

const {
  data: stats,
  pending,
  error,
  refresh,
} = await useFetch<StatsResponse>("/api/dashboard/stats");

const handleRefresh = async () => {
  await refresh();
};

const totalDone = computed(() => {
  if (!stats.value?.categories) return 0;
  return stats.value.categories.reduce((acc, cat) => acc + (cat.done || 0), 0);
});

const filteredCategories = computed(() => {
  if (!stats.value?.categories) return [];
  if (!searchQuery.value.trim()) return stats.value.categories;
  return stats.value.categories.filter((cat) =>
    cat.servicetype.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const calculatePercentage = (count: number) => {
  if (!totalDone.value || totalDone.value === 0) return 0;
  return Math.round((count / totalDone.value) * 100);
};

// Category SVG Icons
const IconCard = () =>
  h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
    h("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6",
    }),
  ]);

const IconRefresh = () =>
  h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
    h("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    }),
  ]);

const IconUserAlert = () =>
  h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
    h("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    }),
  ]);

const IconDocument = () =>
  h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
    h("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    }),
  ]);

const IconHelp = () =>
  h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
    h("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    }),
  ]);

const getCategoryMeta = (type: string) => {
  switch (type) {
    case "ID Processing":
      return {
        icon: IconCard,
        barBg: "bg-blue-600",
        badgeBg: "bg-blue-50",
        badgeText: "text-blue-600",
      };
    case "Re-ID":
      return {
        icon: IconRefresh,
        barBg: "bg-amber-500",
        badgeBg: "bg-amber-50",
        badgeText: "text-amber-600",
      };
    case "Account Problem":
      return {
        icon: IconUserAlert,
        barBg: "bg-rose-500",
        badgeBg: "bg-rose-50",
        badgeText: "text-rose-600",
      };
    case "Clearance Signing":
      return {
        icon: IconDocument,
        barBg: "bg-emerald-600",
        badgeBg: "bg-emerald-50",
        badgeText: "text-emerald-600",
      };
    case "Inquiry":
      return {
        icon: IconHelp,
        barBg: "bg-purple-600",
        badgeBg: "bg-purple-50",
        badgeText: "text-purple-600",
      };
    default:
      return {
        icon: IconDocument,
        barBg: "bg-[#003300]",
        badgeBg: "bg-slate-100",
        badgeText: "text-slate-700",
      };
  }
};
</script>
