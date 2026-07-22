<!-- pages/reports.vue -->
<template>
  <div
    class="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto font-sans text-slate-800"
  >
    <!-- Header & Filter Controls -->
    <div
      class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm"
    >
      <div>
        <div class="flex items-center gap-2">
          <div
            class="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"
          ></div>
          <h1
            class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900"
          >
            Completed Tickets Report
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor service performance metrics and export application logs.
        </p>
      </div>

      <!-- Graph Filters -->
      <div class="flex flex-wrap items-center gap-3">
        <!-- Preset Filter Toggle Buttons -->
        <div
          class="inline-flex bg-slate-100/80 p-1 rounded-xl border border-slate-200/50"
        >
          <button
            v-for="period in filterPeriods"
            :key="period"
            @click="setPresetFilter(period)"
            :class="[
              'px-3.5 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer',
              filterType === period
                ? 'bg-white text-emerald-800 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50',
            ]"
          >
            {{ period }}
          </button>
        </div>

        <!-- Custom Date Range Picker -->
        <div
          class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-600 transition-all"
        >
          <svg
            class="w-3.5 h-3.5 text-slate-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <input
            type="date"
            v-model="customStartDate"
            @change="filterType = 'custom'"
            class="bg-transparent border-none text-slate-700 text-xs focus:outline-none cursor-pointer"
          />
          <span class="text-slate-400 font-medium">to</span>
          <input
            type="date"
            v-model="customEndDate"
            @change="filterType = 'custom'"
            class="bg-transparent border-none text-slate-700 text-xs focus:outline-none cursor-pointer"
          />
        </div>

        <!-- Apply Filter Button -->
        <button
          @click="fetchReportData"
          :disabled="loading"
          class="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white px-4 py-2 text-xs rounded-xl font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-sm hover:shadow"
        >
          <svg
            v-if="loading"
            class="animate-spin h-3.5 w-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Apply Filter</span>
        </button>
      </div>
    </div>

    <!-- Data Export Utility Section -->
    <div
      class="bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
      >
        <div>
          <div class="flex items-center gap-2">
            <div class="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 class="text-base font-bold text-slate-900">
              Export ID Applications Data
            </h2>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            Extract completed records from the
            <code
              class="bg-slate-200/60 text-slate-800 px-1.5 py-0.5 rounded text-[11px] font-mono"
              >id_applications</code
            >
            repository into CSV.
          </p>
        </div>

        <!-- Quick Export Date Shortcuts -->
        <div class="flex items-center gap-2 text-xs">
          <span class="text-slate-400 font-medium">Quick presets:</span>
          <button
            @click="setExportPreset('7days')"
            class="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 text-[11px] font-medium transition-colors cursor-pointer"
          >
            Last 7 Days
          </button>
          <button
            @click="setExportPreset('30days')"
            class="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 text-[11px] font-medium transition-colors cursor-pointer"
          >
            This Month
          </button>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3 pt-1">
        <div
          class="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs shadow-sm"
        >
          <span class="text-slate-400 font-medium">From:</span>
          <input
            type="date"
            v-model="exportStartDate"
            class="bg-transparent border-none text-slate-700 text-xs focus:outline-none cursor-pointer"
          />
          <span class="text-slate-400 font-medium ml-2">To:</span>
          <input
            type="date"
            v-model="exportEndDate"
            class="bg-transparent border-none text-slate-700 text-xs focus:outline-none cursor-pointer"
          />
        </div>

        <button
          @click="handleExport"
          :disabled="exporting || !exportStartDate || !exportEndDate"
          class="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white px-5 py-2.5 text-xs rounded-xl font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-sm hover:shadow"
        >
          <svg
            v-if="exporting"
            class="animate-spin h-3.5 w-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <svg
            v-else
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span>{{
            exporting ? "Preparing CSV..." : "Download Excel Export"
          }}</span>
        </button>
      </div>

      <!-- Export Error Notice -->
      <div
        v-if="exportError"
        class="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700"
      >
        <svg
          class="w-4 h-4 shrink-0 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{{ exportError }}</span>
      </div>
    </div>

    <!-- KPI Analytics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <!-- Card 1: Total Completed -->
      <div
        class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-all"
      >
        <div class="flex items-center justify-between">
          <p
            class="text-[11px] font-bold uppercase tracking-wider text-slate-400"
          >
            Total Completed Tickets
          </p>
          <div class="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-slate-900">{{
            totalDoneTickets
          }}</span>
          <span class="text-xs text-slate-500 font-medium">tickets</span>
        </div>
      </div>

      <!-- Card 2: Top Service -->
      <div
        class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-all"
      >
        <div class="flex items-center justify-between">
          <p
            class="text-[11px] font-bold uppercase tracking-wider text-slate-400"
          >
            Most Requested Service
          </p>
          <div class="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
        </div>
        <div class="mt-3">
          <p
            class="text-lg font-bold text-slate-900 truncate"
            :title="topService"
          >
            {{ topService }}
          </p>
        </div>
      </div>

      <!-- Card 3: Active Range -->
      <div
        class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-all"
      >
        <div class="flex items-center justify-between">
          <p
            class="text-[11px] font-bold uppercase tracking-wider text-slate-400"
          >
            Active Filter Window
          </p>
          <div class="p-2 bg-slate-100 text-slate-600 rounded-xl">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.447.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
              />
            </svg>
          </div>
        </div>
        <div class="mt-3">
          <span
            class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 capitalize"
          >
            {{ activeFilterLabel }}
          </span>
        </div>
      </div>
    </div>

    <!-- Enhanced Interactive Bar Graph Section -->
    <div
      class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6"
    >
      <!-- Section Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2"
      >
        <div>
          <h2
            class="text-base font-bold text-slate-900 flex items-center gap-2"
          >
            Completed Tickets by Category
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">
            Distribution of fulfilled requests across service categories
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-slate-400"
            >Volume breakdown</span
          >
          <span
            class="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60"
          >
            {{ categoryData.length }} Categories
          </span>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="py-20 flex flex-col items-center justify-center text-slate-400"
      >
        <div
          class="animate-spin rounded-full h-8 w-8 border-3 border-slate-100 border-t-emerald-700 mb-3"
        ></div>
        <p class="text-xs font-medium">Fetching category metrics...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="categoryData.length === 0"
        class="py-20 text-center text-slate-400"
      >
        <div
          class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3"
        >
          <svg
            class="w-6 h-6 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p class="text-sm font-semibold text-slate-700">
          No ticket records found
        </p>
        <p class="text-xs text-slate-400 mt-1">
          Adjust your date filter parameters above.
        </p>
      </div>

      <!-- Modern Chart Area -->
      <div v-else class="relative pt-6 pb-2">
        <!-- Y-Axis Gridlines Background -->
        <div
          class="absolute inset-0 top-6 bottom-8 flex flex-col justify-between pointer-events-none z-0"
        >
          <div
            v-for="i in 4"
            :key="i"
            class="border-b border-dashed border-slate-100 flex items-center justify-between w-full"
          >
            <span
              class="text-[10px] font-medium text-slate-400 -translate-y-2 bg-white pr-2"
            >
              {{ Math.round(maxVal * ((4 - i) / 3)) }}
            </span>
          </div>
        </div>

        <!-- Bars Container -->
        <div
          class="relative z-10 pl-8 h-64 flex items-end justify-around gap-2 sm:gap-4 border-b border-slate-200"
        >
          <div
            v-for="item in categoryData"
            :key="item.servicetype"
            class="group relative flex-1 h-full flex flex-col justify-end items-center max-w-[64px]"
          >
            <!-- Floating Hover Tooltip -->
            <div
              class="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-30 transform group-hover:-translate-y-1"
            >
              <div
                class="bg-slate-900 text-white text-[11px] py-1 px-2.5 rounded-lg shadow-xl font-medium whitespace-nowrap flex items-center gap-1.5"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{{ item.servicetype }}:</span>
                <span class="font-bold text-emerald-300">{{ item.count }}</span>
              </div>
              <div class="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1"></div>
            </div>

            <!-- Value Indicator above bar -->
            <span
              class="text-[11px] font-bold text-slate-600 mb-1.5 group-hover:text-emerald-700 transition-colors"
            >
              {{ item.count }}
            </span>

            <!-- Bar Pillar -->
            <div
              class="w-full h-full bg-slate-100/60 rounded-t-lg p-0.5 flex items-end transition-colors group-hover:bg-slate-100"
            >
              <div
                class="w-full rounded-t-md bg-gradient-to-t from-emerald-900 via-emerald-700 to-emerald-500 transition-all duration-500 ease-out group-hover:from-emerald-800 group-hover:to-emerald-400 group-hover:shadow-lg group-hover:shadow-emerald-900/10"
                :style="{ height: `${calculateBarPercentage(item.count)}%` }"
              ></div>
            </div>

            <!-- X-Axis Label -->
            <div class="absolute -bottom-7 w-full text-center">
              <p
                class="text-[11px] font-medium text-slate-500 truncate group-hover:text-slate-900 group-hover:font-semibold transition-colors"
                :title="item.servicetype"
              >
                {{ truncateLabel(item.servicetype) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// State
const filterPeriods = ["daily", "weekly", "monthly"];
const filterType = ref("monthly");
const customStartDate = ref("");
const customEndDate = ref("");
const loading = ref(false);
const categoryData = ref([]);

const exportStartDate = ref("");
const exportEndDate = ref("");
const exporting = ref(false);
const exportError = ref("");

// Computed Metrics
const totalDoneTickets = computed(() =>
  categoryData.value.reduce((acc, curr) => acc + (curr.count || 0), 0),
);

const topService = computed(() => {
  if (!categoryData.value.length) return "None";
  const sorted = [...categoryData.value].sort((a, b) => b.count - a.count);
  return sorted[0]?.count > 0
    ? `${sorted[0].servicetype} (${sorted[0].count})`
    : "None";
});

const maxVal = computed(() => {
  const counts = categoryData.value.map((c) => c.count);
  return counts.length > 0 ? Math.max(...counts, 1) : 1;
});

const activeFilterLabel = computed(() => {
  if (filterType.value === "custom") {
    return `${customStartDate.value || "Start"} → ${customEndDate.value || "End"}`;
  }
  return filterType.value;
});

// Utility Helpers
const calculateBarPercentage = (count) => {
  if (!maxVal.value || count === 0) return 4;
  return Math.max(Math.round((count / maxVal.value) * 100), 4);
};

const truncateLabel = (str) => {
  if (!str) return "";
  return str.length > 12 ? `${str.slice(0, 10)}...` : str;
};

// Handlers
const setPresetFilter = (type) => {
  filterType.value = type;
  fetchReportData();
};

const setExportPreset = (preset) => {
  const today = new Date();
  const endDateStr = today.toISOString().split("T")[0];
  const startDate = new Date();

  if (preset === "7days") {
    startDate.setDate(today.getDate() - 7);
  } else if (preset === "30days") {
    startDate.setDate(today.getDate() - 30);
  }

  exportStartDate.value = startDate.toISOString().split("T")[0];
  exportEndDate.value = endDateStr;
};

const fetchReportData = async () => {
  loading.value = true;
  try {
    const query = { filterType: filterType.value };
    if (filterType.value === "custom") {
      if (customStartDate.value) query.startDate = customStartDate.value;
      if (customEndDate.value) query.endDate = customEndDate.value;
    }

    const data = await $fetch("/api/reports", { query });
    categoryData.value = data?.categories || [];
  } catch (err) {
    console.error("Error fetching report data:", err);
  } finally {
    loading.value = false;
  }
};

const handleExport = async () => {
  if (!exportStartDate.value || !exportEndDate.value) {
    exportError.value = "Please select both a start and end date.";
    return;
  }

  exportError.value = "";
  exporting.value = true;

  let downloadUrl = null;
  let link = null;

  try {
    const response = await fetch(
      `/api/export-applications?startDate=${exportStartDate.value}&endDate=${exportEndDate.value}`,
    );

    if (!response.ok) {
      const errorJson = await response.json().catch(() => null);
      throw new Error(
        errorJson?.statusMessage ||
          `Server responded with status ${response.status}`,
      );
    }

    const blob = await response.blob();
    downloadUrl = window.URL.createObjectURL(blob);

    link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `ID_Applications_${exportStartDate.value}_to_${exportEndDate.value}.csv`;
    document.body.appendChild(link);
    link.click();
  } catch (err) {
    console.error("Export failed:", err);
    exportError.value = `Export Error: ${err.message}`;
  } finally {
    if (link && document.body.contains(link)) {
      document.body.removeChild(link);
    }
    if (downloadUrl) {
      window.URL.revokeObjectURL(downloadUrl);
    }
    exporting.value = false;
  }
};

onMounted(() => {
  fetchReportData();
});
</script>
