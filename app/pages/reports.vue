<!-- pages/reports.vue -->
<template>
  <div
    class="mx-auto flex max-w-7xl flex-col space-y-8 p-4 font-sans text-slate-800 sm:p-6 lg:p-8"
  >
    <!-- Data Export Utility Section -->
    <div
      class="order-1 space-y-5 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm"
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
            >
              id_applications
            </code>
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

    <!-- Ticket Summary Overview Cards -->
    <div
      class="order-3 my-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <!-- Total Tickets -->
      <div
        class="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md"
      >
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            Total Tickets
          </p>
          <h3 class="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
            {{ summary.total_tickets }}
          </h3>
          <p class="mt-1 text-[11px] text-slate-400">All registered tickets</p>
        </div>
        <div class="rounded-xl bg-slate-100 p-3 text-slate-700">
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z"
            />
          </svg>
        </div>
      </div>

      <!-- Completed Tickets (Done) -->
      <div
        class="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-sm transition-all hover:shadow-md"
      >
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-wider text-emerald-800"
          >
            Completed Tickets
          </p>
          <h3 class="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-900">
            {{ summary.completed_tickets }}
          </h3>
          <p class="mt-1 text-[11px] text-emerald-600/80">Done status</p>
        </div>
        <div class="rounded-xl bg-emerald-100 p-3 text-emerald-700">
          <svg
            class="h-6 w-6"
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

      <!-- Skipped Tickets (Rejected) -->
      <div
        class="flex items-center justify-between rounded-2xl border border-rose-100 bg-rose-50/40 p-5 shadow-sm transition-all hover:shadow-md"
      >
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-wider text-rose-800"
          >
            Skipped Tickets
          </p>
          <h3 class="mt-2 text-2xl sm:text-3xl font-extrabold text-rose-900">
            {{ summary.skipped_tickets }}
          </h3>
          <p class="mt-1 text-[11px] text-rose-600/80">
            Not present when called
          </p>
        </div>
        <div class="rounded-xl bg-rose-100 p-3 text-rose-700">
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      <!-- Still in Queue (Waiting) -->
      <div
        class="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50/40 p-5 shadow-sm transition-all hover:shadow-md"
      >
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-wider text-amber-800"
          >
            Still in Queue
          </p>
          <h3 class="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-900">
            {{ summary.queued_tickets }}
          </h3>
          <p class="mt-1 text-[11px] text-amber-600/80">Waiting status</p>
        </div>
        <div class="rounded-xl bg-amber-100 p-3 text-amber-700">
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Header & Filter Controls -->
    <div
      class="order-2 flex flex-col gap-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm xl:flex-row xl:items-center xl:justify-between"
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

      <!-- Graph Filters & Date Scroller -->
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

        <!-- Period Navigator (Scroll Day/Week/Month) -->
        <div
          v-if="filterType !== 'custom'"
          class="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1 text-xs shadow-sm"
        >
          <button
            @click="navigatePeriod(-1)"
            title="Previous Period"
            class="p-1.5 hover:bg-slate-200/70 rounded-lg text-slate-600 transition-colors cursor-pointer"
          >
            <svg
              class="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <span
            class="px-2 font-medium text-slate-700 min-w-[140px] text-center select-none"
          >
            {{ activePeriodLabel }}
          </span>

          <button
            @click="navigatePeriod(1)"
            title="Next Period"
            class="p-1.5 hover:bg-slate-200/70 rounded-lg text-slate-600 transition-colors cursor-pointer"
          >
            <svg
              class="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <button
            @click="resetToCurrentPeriod"
            class="ml-1 px-2 py-1 bg-white border border-slate-200 text-[10px] font-semibold text-emerald-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Current
          </button>
        </div>

        <!-- Custom Date Range Picker -->
        <div
          v-else
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
            class="bg-transparent border-none text-slate-700 text-xs focus:outline-none cursor-pointer"
          />
          <span class="text-slate-400 font-medium">to</span>
          <input
            type="date"
            v-model="customEndDate"
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

    <!-- Service analytics -->
    <div
      class="order-4 space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
    >
      <!-- Section Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2"
      >
        <div>
          <h2
            class="text-base font-bold text-slate-900 flex items-center gap-2"
          >
            Full breakdown
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">
            All service types completed during {{ activeFilterLabel }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-slate-400"
            >Volume breakdown</span
          >
          <span
            class="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60"
          >
            {{ categoryData.length }} Services
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

      <div
        v-else
        class="grid grid-cols-1 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)] gap-5"
      >
        <section
          class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
        >
          <div class="mb-5 flex items-start justify-between gap-4">
            <div>
              <p
                class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700"
              >
                Service volume
              </p>
              <h2 class="mt-1 text-lg font-bold text-slate-900">
                Completed tickets by service
              </h2>
              <p class="mt-1 text-xs text-slate-500">
                Showing data for {{ activeFilterLabel }}.
              </p>
            </div>
            <span
              class="shrink-0 rounded-full border border-emerald-200/60 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800"
            >
              {{ categoryData.length }} services
            </span>
          </div>
          <BarChart
            :data="chartData"
            :categories="chartCategories"
            :y-axis="['count']"
            x-axis="service"
            :height="320"
            :y-num-ticks="5"
            :y-grid-line="true"
            :legend-position="'bottom'"
            aria-label="Completed tickets by service type"
          />
        </section>

        <section class="rounded-2xl bg-emerald-950 p-5 text-white shadow-sm">
          <div class="mb-4 flex items-start justify-between gap-4">
            <div>
              <p
                class="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300"
              >
                Service mix
              </p>
              <h2 class="mt-1 text-lg font-bold">Share of completed work</h2>
            </div>
            <span class="text-xs text-emerald-200"
              >{{ totalDoneTickets }} total</span
            >
          </div>
          <DonutChart
            :data="donutData"
            :categories="donutCategories"
            :height="220"
            :radius="78"
            :arc-width="28"
            :show-legend="false"
            aria-label="Completed ticket service mix"
          />
          <div class="mt-4 max-h-48 space-y-2 overflow-y-auto pr-1">
            <div
              v-for="item in categoryData"
              :key="item.servicetype"
              class="flex items-center justify-between gap-3 text-sm"
            >
              <span
                class="truncate text-emerald-100"
                :title="item.servicetype"
                >{{ item.servicetype }}</span
              >
              <span class="font-mono font-bold text-amber-300">{{
                item.count
              }}</span>
            </div>
          </div>
        </section>
      </div>
    </div>

    <section
      class="order-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
    >
      <div
        class="flex flex-col gap-2 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
      >
        <div>
          <p
            class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700"
          >
            Filtered records
          </p>
          <h2 class="mt-1 text-lg font-bold text-slate-900">
            Completed tickets
          </h2>
          <p class="mt-1 text-xs text-slate-500">
            ID number, student name, service type, and completion date for
            {{ activeFilterLabel }}.
          </p>
        </div>
        <span
          class="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
        >
          {{ ticketData.length }} tickets
        </span>
      </div>

      <div v-if="loading" class="px-6 py-12 text-center text-sm text-slate-400">
        Loading completed tickets...
      </div>
      <div
        v-else-if="!ticketData.length"
        class="px-6 py-12 text-center text-sm text-slate-400"
      >
        No completed tickets match this filter date range.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-left">
          <thead
            class="bg-slate-50 text-[10px] uppercase tracking-[0.16em] text-slate-400"
          >
            <tr>
              <th class="px-5 py-3 font-black sm:px-6">ID number</th>
              <th class="px-5 py-3 font-black sm:px-6">Full name</th>
              <th class="px-5 py-3 font-black sm:px-6">Service type</th>
              <th class="px-5 py-3 font-black sm:px-6">Ticket</th>
              <th class="px-5 py-3 font-black sm:px-6">Completed</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="ticket in ticketData"
              :key="ticket.id"
              class="transition-colors hover:bg-emerald-50/40"
            >
              <td
                class="whitespace-nowrap px-5 py-4 font-mono text-sm font-semibold text-emerald-900 sm:px-6"
              >
                {{ ticket.idnumber || "-" }}
              </td>
              <td
                class="max-w-[220px] truncate px-5 py-4 text-sm font-semibold text-slate-800 sm:px-6"
                :title="ticket.fullname"
              >
                {{ ticket.fullname || "No name provided" }}
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span
                  class="inline-flex max-w-[220px] truncate rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800"
                  :title="ticket.servicetype"
                >
                  {{ ticket.servicetype }}
                </span>
              </td>
              <td
                class="whitespace-nowrap px-5 py-4 font-mono text-sm font-bold text-slate-700 sm:px-6"
              >
                {{ ticket.ticketnumber }}
              </td>
              <td
                class="whitespace-nowrap px-5 py-4 text-xs text-slate-500 sm:px-6"
              >
                {{ formatTicketDate(ticket.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";

const { status, data: authData } = useAuth();

definePageMeta({
  middleware: [
    async () => {
      const { status, data: authData } = useAuth();

      // If unauthenticated, redirect to login page
      if (status.value === "unauthenticated") {
        return navigateTo("/login");
      }
      if (authData.value?.role?.toLowerCase() !== "admin") {
        return navigateTo("/staff");
      }
    },
  ],
});

// Helper for formatting local date strings as YYYY-MM-DD
const formatDateToYYYYMMDD = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// State
const filterPeriods = ["daily", "weekly", "monthly", "custom"];
const filterType = ref("monthly");
const customStartDate = ref("");
const customEndDate = ref("");
const currentDateOffset = ref(0); // Navigation offset tracking
const loading = ref(false);
const categoryData = ref([]);
const ticketData = ref([]);

const summary = reactive({
  total_tickets: 0,
  completed_tickets: 0,
  skipped_tickets: 0,
  queued_tickets: 0,
});

const exportStartDate = ref("");
const exportEndDate = ref("");
const exporting = ref(false);
const exportError = ref("");

// Computed Metrics
const totalDoneTickets = computed(() =>
  categoryData.value.reduce((acc, curr) => acc + (curr.count || 0), 0),
);

const chartData = computed(() =>
  categoryData.value.map((item) => ({
    service: item.servicetype,
    count: item.count,
  })),
);

const chartCategories = computed(() => ({
  count: { name: "Completed tickets", color: "#047857" },
}));

const donutData = computed(() => categoryData.value.map((item) => item.count));

const donutCategories = computed(() =>
  Object.fromEntries(
    categoryData.value.map((item, index) => [
      String(index),
      {
        name: item.servicetype,
        color: index % 2 === 0 ? "#f59e0b" : "#10b981",
      },
    ]),
  ),
);

// Date Range calculations based on navigation offset
const targetDateRange = computed(() => {
  const base = new Date();

  if (filterType.value === "daily") {
    base.setDate(base.getDate() + currentDateOffset.value);
    const dateStr = formatDateToYYYYMMDD(base);
    return { startDate: dateStr, endDate: dateStr };
  }

  if (filterType.value === "weekly") {
    const day = base.getDay();
    const diffToMonday =
      (day === 0 ? -6 : 1) - day + currentDateOffset.value * 7;
    const start = new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate() + diffToMonday,
    );
    const end = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + 6,
    );

    return {
      startDate: formatDateToYYYYMMDD(start),
      endDate: formatDateToYYYYMMDD(end),
    };
  }

  if (filterType.value === "monthly") {
    const start = new Date(
      base.getFullYear(),
      base.getMonth() + currentDateOffset.value,
      1,
    );
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

    return {
      startDate: formatDateToYYYYMMDD(start),
      endDate: formatDateToYYYYMMDD(end),
    };
  }

  return { startDate: customStartDate.value, endDate: customEndDate.value };
});

const activePeriodLabel = computed(() => {
  const { startDate, endDate } = targetDateRange.value;
  if (!startDate) return "Select Period";

  const opts = { month: "short", day: "numeric", year: "numeric" };
  const d1 = new Date(startDate + "T00:00:00");

  if (filterType.value === "daily") {
    return d1.toLocaleDateString(undefined, opts);
  }

  if (filterType.value === "weekly") {
    const d2 = new Date(endDate + "T00:00:00");
    return `${d1.toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ${d2.toLocaleDateString(undefined, opts)}`;
  }

  if (filterType.value === "monthly") {
    return d1.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  }

  return `${customStartDate.value || "Start"} → ${customEndDate.value || "End"}`;
});

const activeFilterLabel = computed(() => activePeriodLabel.value);

const formatTicketDate = (value) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

// Navigation Handlers
const navigatePeriod = (direction) => {
  currentDateOffset.value += direction;
  fetchReportData();
};

const resetToCurrentPeriod = () => {
  currentDateOffset.value = 0;
  fetchReportData();
};

const setPresetFilter = (type) => {
  filterType.value = type;
  currentDateOffset.value = 0;
  fetchReportData();
};

const setExportPreset = (preset) => {
  const today = new Date();
  const endDateStr = formatDateToYYYYMMDD(today);
  const startDate = new Date();

  if (preset === "7days") {
    startDate.setDate(today.getDate() - 7);
  } else if (preset === "30days") {
    startDate.setDate(today.getDate() - 30);
  }

  exportStartDate.value = formatDateToYYYYMMDD(startDate);
  exportEndDate.value = endDateStr;
};

const fetchReportData = async () => {
  loading.value = true;
  try {
    const query = { filterType: filterType.value };
    const { startDate, endDate } = targetDateRange.value;

    if (filterType.value === "custom") {
      if (customStartDate.value) query.startDate = customStartDate.value;
      if (customEndDate.value) query.endDate = customEndDate.value;
    } else {
      query.startDate = startDate;
      query.endDate = endDate;
    }

    const data = await $fetch("/api/reports", { query });
    const fetchedTickets = data?.tickets || [];
    Object.assign(summary, data?.summary || {});

    ticketData.value = fetchedTickets;

    // Recalculate category totals based on strictly filtered tickets
    if (data?.categories && fetchedTickets.length > 0) {
      const countsByService = fetchedTickets.reduce((acc, ticket) => {
        const type = ticket.servicetype || "Unspecified";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      categoryData.value = Object.entries(countsByService).map(
        ([servicetype, count]) => ({
          servicetype,
          count,
        }),
      );
    } else if (fetchedTickets.length === 0) {
      categoryData.value = [];
    } else {
      categoryData.value = data?.categories || [];
    }
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
