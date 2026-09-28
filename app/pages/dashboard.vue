<!-- pages/dashboard.vue -->
<template>
  <div class="ui-page">
    <!-- Page Header & Actions Bar -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1 class="ui-page-title">MIS Queueing Dashboard</h1>
        <p class="ui-page-description font-medium">
          Real-time overview of completed services across categories
        </p>
      </div>

      <!-- Quick Refresh Button -->
      <button
        @click="handleRefresh"
        :disabled="pending"
        class="ui-button-secondary shrink-0"
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
        class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden"
      >
        <div class="absolute top-0 left-0 bottom-0 w-2 bg-[#003300]"></div>

        <!-- Left: Live Summary Title -->
        <div class="space-y-1 shrink-0">
          <div
            class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60"
          >
            <span
              class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
            ></span>
            Live Queue Summary
          </div>
          <h2 class="text-xl font-bold text-slate-900">
            Queue Metrics Overview
          </h2>
          <p class="text-xs text-slate-500">
            Real-time active, pending, and completed service metrics
          </p>
        </div>

        <!-- Right: Metrics & Filter Controls -->
        <div
          class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-wrap lg:flex-nowrap"
        >
          <!-- Search / Filter Input -->
          <div class="relative w-full sm:w-52">
            <input
              v-model="searchQuery"
              type="text"
              aria-label="Filter service categories"
              placeholder="Filter category..."
              class="ui-input pl-9 text-xs"
            />
            <svg
              class="w-4 h-4 text-slate-400 absolute left-3 top-3"
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

          <!-- Metric Badges Group -->
          <div class="grid grid-cols-3 gap-2.5 w-full sm:w-auto shrink-0">
            <!-- Serving Badge -->
            <div
              class="flex flex-col items-center sm:items-start bg-blue-50/60 px-4 py-2.5 rounded-xl border border-blue-200/60 shrink-0 min-w-[90px]"
            >
              <span
                class="text-xs font-bold uppercase tracking-wider text-blue-700"
              >
                Serving
              </span>
              <span class="text-2xl font-black text-blue-900 tracking-tight">
                {{ totalServing }}
              </span>
            </div>

            <!-- Waiting Badge -->
            <div
              class="flex flex-col items-center sm:items-start bg-amber-50/60 px-4 py-2.5 rounded-xl border border-amber-200/60 shrink-0 min-w-[90px]"
            >
              <span
                class="text-xs font-bold uppercase tracking-wider text-amber-700"
              >
                Waiting
              </span>
              <span class="text-2xl font-black text-amber-900 tracking-tight">
                {{ totalWaiting }}
              </span>
            </div>

            <!-- Total Done Badge -->
            <div
              class="flex flex-col items-center sm:items-start bg-emerald-50/60 px-4 py-2.5 rounded-xl border border-emerald-200/60 shrink-0 min-w-[90px]"
            >
              <span
                class="text-xs font-bold uppercase tracking-wider text-[#003300]"
              >
                Done
              </span>
              <span class="text-2xl font-black text-[#003300] tracking-tight">
                {{ totalDone }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Operations overview -->
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total Today Card -->
        <article class="metric-card border-slate-200 bg-white">
          <div class="metric-icon bg-slate-100 text-slate-700">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
          </div>
          <p class="metric-label">Total today</p>
          <p class="metric-value">{{ stats.overview?.totalToday || 0 }}</p>
          <p class="metric-note">All registered tickets</p>
        </article>

        <!-- Completed Today Card -->
        <article class="metric-card border-emerald-200 bg-emerald-50/60">
          <div class="metric-icon bg-emerald-100 text-emerald-800">
            <svg
              class="w-5 h-5"
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
          <p class="metric-label text-emerald-800">Completed today</p>
          <p class="metric-value text-emerald-950">
            {{ stats.overview?.completedToday || 0 }}
          </p>
          <p class="metric-note text-emerald-700/70">Successfully served</p>
        </article>

        <!-- Still in Queue Card -->
        <article class="metric-card border-amber-200 bg-amber-50/60">
          <div class="metric-icon bg-amber-100 text-amber-800">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <p class="metric-label text-amber-800">Still in queue</p>
          <p class="metric-value text-amber-950">
            {{ stats.overview?.waitingNow || 0 }}
          </p>
          <p class="metric-note text-amber-700/70">Waiting or on hold</p>
        </article>

        <!-- Estimated Wait Card -->
        <article class="metric-card border-blue-200 bg-blue-50/60">
          <div class="metric-icon bg-blue-100 text-blue-800">
            <svg
              class="w-5 h-5"
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
          <p class="metric-label text-blue-800">Estimated wait</p>
          <p class="metric-value text-blue-950">
            {{ stats.overview?.estimatedWaitMinutes || 0
            }}<span class="text-base font-bold">m</span>
          </p>
          <p class="metric-note text-blue-700/70">Approx. at 5 min/ticket</p>
        </article>
      </section>

      <section class="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_0.8fr]">
        <div
          class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
        >
          <div
            class="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p class="section-kicker">Live queue</p>
              <h2 class="section-title">What is happening now</h2>
            </div>
            <span
              class="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800"
            >
              <span
                class="h-2 w-2 animate-pulse rounded-full bg-emerald-500"
              ></span>
              {{ stats.overview?.servingNow || 0 }} active counters
            </span>
          </div>
          <div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="rounded-2xl bg-emerald-950 p-5 text-white">
              <p
                class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200"
              >
                Now serving
              </p>
              <p
                class="mt-3 font-mono text-5xl font-black tracking-tight text-amber-300"
              >
                {{ stats.current?.ticketnumber || "---" }}
              </p>
              <p class="mt-3 truncate text-sm font-semibold text-emerald-100">
                {{ stats.current?.fullname || "No active ticket" }}
              </p>
              <p class="mt-1 text-xs text-emerald-300">
                {{ stats.current?.servicetype || "Waiting for the next call" }}
                · Counter {{ stats.current?.station || "-" }}
              </p>
            </div>
            <div class="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p
                class="text-[10px] font-black uppercase tracking-[0.2em] text-amber-800"
              >
                Next in line
              </p>
              <p
                class="mt-3 font-mono text-5xl font-black tracking-tight text-amber-900"
              >
                {{ stats.next?.ticketnumber || "---" }}
              </p>
              <p class="mt-3 truncate text-sm font-semibold text-slate-800">
                {{ stats.next?.fullname || "No waiting ticket" }}
              </p>
              <p class="mt-1 text-xs text-slate-500">
                {{ stats.next?.servicetype || "Queue is clear" }} · Waiting
                {{ stats.next?.waiting_minutes || 0 }} min
              </p>
            </div>
          </div>
          <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div class="soft-stat">
              <span>Waiting</span
              ><strong>{{ stats.overview?.waitingNow || 0 }}</strong>
            </div>
            <div class="soft-stat">
              <span>Active today</span
              ><strong>{{ stats.overview?.activeToday || 0 }}</strong>
            </div>
            <div class="soft-stat">
              <span>Avg wait</span
              ><strong>{{ stats.overview?.averageWaitMinutes || 0 }}m</strong>
            </div>
            <div class="soft-stat">
              <span>Skipped</span
              ><strong>{{ stats.overview?.skippedToday || 0 }}</strong>
            </div>
            <div class="soft-stat">
              <span>Avg service</span
              ><strong class="text-[10px]">Not tracked</strong>
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
        >
          <div class="border-b border-slate-100 pb-4">
            <p class="section-kicker">Daily flow</p>
            <h2 class="section-title">Queue volume by hour</h2>
          </div>
          <div class="mt-6 flex h-40 items-end gap-2">
            <div
              v-for="hour in stats.hourly || []"
              :key="hour.hour"
              class="group flex min-w-0 flex-1 flex-col items-center gap-2"
            >
              <span
                class="text-[10px] font-bold text-slate-500 opacity-0 transition-opacity group-hover:opacity-100"
                >{{ hour.total }}</span
              >
              <div
                class="flex h-28 w-full items-end rounded-lg bg-slate-50 px-1"
              >
                <div
                  class="w-full rounded-md bg-emerald-600 transition-all group-hover:bg-amber-500"
                  :style="{
                    height: `${Math.max((hour.total / Math.max(...(stats.hourly || []).map((item) => item.total), 1)) * 100, 6)}%`,
                  }"
                ></div>
              </div>
              <span class="text-[10px] font-semibold text-slate-400"
                >{{ hour.hour }}:00</span
              >
            </div>
            <p
              v-if="!(stats.hourly || []).length"
              class="w-full self-center text-center text-xs text-slate-400"
            >
              No activity recorded yet.
            </p>
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

      <section class="grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_0.8fr]">
        <div
          class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
        >
          <div
            class="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p class="section-kicker">Operations</p>
              <h2 class="section-title">Today’s queue</h2>
            </div>
            <span
              class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"
              >{{ (stats.tickets || []).length }} records</span
            >
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full text-left">
              <thead
                class="bg-slate-50 text-[10px] uppercase tracking-[0.16em] text-slate-400"
              >
                <tr>
                  <th class="px-5 py-3 font-black">Queue</th>
                  <th class="px-5 py-3 font-black">Customer</th>
                  <th class="px-5 py-3 font-black">Service</th>
                  <th class="px-5 py-3 font-black">Counter</th>
                  <th class="px-5 py-3 font-black">Status</th>
                  <th class="px-5 py-3 font-black">Wait</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="ticket in (stats.tickets || []).slice(0, 12)"
                  :key="ticket.id"
                  class="hover:bg-emerald-50/40"
                >
                  <td
                    class="whitespace-nowrap px-5 py-3 font-mono text-sm font-black text-emerald-900"
                  >
                    {{ ticket.ticketnumber }}
                  </td>
                  <td
                    class="max-w-[180px] truncate px-5 py-3 text-sm font-semibold text-slate-700"
                    :title="ticket.fullname"
                  >
                    {{ ticket.fullname || "No name provided" }}
                  </td>
                  <td
                    class="max-w-[150px] truncate px-5 py-3 text-xs text-slate-500"
                    :title="ticket.servicetype"
                  >
                    {{ ticket.servicetype || "-" }}
                  </td>
                  <td class="px-5 py-3 text-xs font-semibold text-slate-600">
                    {{ ticket.station || "-" }}
                  </td>
                  <td class="px-5 py-3">
                    <span
                      :class="statusClass(ticket.status)"
                      class="inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide"
                      >{{ ticket.status }}</span
                    >
                  </td>
                  <td
                    class="whitespace-nowrap px-5 py-3 text-xs font-semibold text-slate-500"
                  >
                    {{ ticket.waiting_minutes || 0 }} min
                  </td>
                </tr>
                <tr v-if="!(stats.tickets || []).length">
                  <td
                    colspan="6"
                    class="px-5 py-12 text-center text-sm text-slate-400"
                  >
                    No tickets recorded today.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
        >
          <div class="border-b border-slate-100 pb-4">
            <p class="section-kicker">Counter management</p>
            <h2 class="section-title">Active windows</h2>
          </div>
          <div class="mt-4 space-y-3">
            <div
              v-for="counter in stats.counters || []"
              :key="counter.id"
              class="rounded-xl border border-slate-100 bg-slate-50/70 p-3"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="min-w-0">
                  <p class="truncate text-sm font-bold text-slate-800">
                    {{ counter.name || `Counter ${counter.code}` }}
                  </p>
                  <p class="truncate text-xs text-slate-500">
                    {{ counter.assigned_user_name || "Unassigned" }}
                  </p>
                </div>
                <span
                  :class="
                    counter.status === 'Serving'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  "
                  class="rounded-full px-2 py-1 text-[10px] font-black uppercase"
                  >{{ counter.status }}</span
                >
              </div>
              <div class="mt-3 flex items-center justify-between text-xs">
                <span class="font-mono font-bold text-emerald-900">{{
                  counter.current_ticket || "Available"
                }}</span
                ><span class="text-slate-500"
                  >{{ counter.served_today }} served today</span
                >
              </div>
            </div>
            <p
              v-if="!(stats.counters || []).length"
              class="py-8 text-center text-sm text-slate-400"
            >
              No counters configured.
            </p>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from "vue";

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

interface CategoryStat {
  servicetype: string;
  done: number;
  serving?: number;
  waiting?: number;
}

interface StatsResponse {
  categories: CategoryStat[];
  overview: {
    totalToday: number;
    completedToday: number;
    skippedToday: number;
    activeToday: number;
    servingNow: number;
    waitingNow: number;
    averageWaitMinutes: number;
    estimatedWaitMinutes: number;
  };
  current: QueueTicket | null;
  next: QueueTicket | null;
  tickets: QueueTicket[];
  hourly: { hour: number; total: number; completed: number }[];
  counters: Counter[];
}

interface QueueTicket {
  id: number;
  ticketnumber: string;
  idnumber?: string;
  fullname?: string;
  servicetype?: string;
  status: string;
  station?: string;
  waiting_minutes?: number;
}

interface Counter {
  id: number;
  code: string;
  name?: string;
  assigned_user_name?: string;
  current_ticket?: string;
  status: string;
  served_today: number;
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

const totalServing = computed(() => {
  if (!stats.value?.categories) return 0;
  return stats.value.categories.reduce(
    (acc, cat) => acc + (cat.serving || 0),
    0,
  );
});

const totalWaiting = computed(() => {
  if (!stats.value?.categories) return 0;
  return stats.value.categories.reduce(
    (acc, cat) => acc + (cat.waiting || 0),
    0,
  );
});

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

const statusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case "serving":
      return "bg-blue-100 text-blue-800";
    case "waiting":
      return "bg-amber-100 text-amber-800";
    case "onhold":
      return "bg-orange-100 text-orange-800";
    case "done":
      return "bg-emerald-100 text-emerald-800";
    case "rejected":
    case "skipped":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
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

<style scoped>
.metric-card {
  @apply relative rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md;
}

.metric-icon {
  @apply mb-5 flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black;
}

.metric-label {
  @apply text-[11px] font-black uppercase tracking-[0.16em] text-slate-500;
}

.metric-value {
  @apply mt-2 text-3xl font-black tracking-tight text-slate-950;
}

.metric-note {
  @apply mt-1 text-[11px] font-medium text-slate-400;
}

.section-kicker {
  @apply text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700;
}

.section-title {
  @apply mt-1 text-lg font-bold text-slate-900;
}

.soft-stat {
  @apply flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500;
}

.soft-stat strong {
  @apply font-mono text-sm font-black text-slate-800;
}
</style>
