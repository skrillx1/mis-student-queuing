<template>
  <div class="ui-page max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
    <!-- Header -->
    <header
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <p
          class="text-[10px] font-bold uppercase tracking-wider text-emerald-700"
        >
          Records Management
        </p>
        <h1 class="text-2xl font-black text-slate-900 mt-0.5">
          ID Applications
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          Showing all submitted student ID processing records.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="refresh"
          :disabled="pending"
          aria-label="Refresh ID applications list"
          class="h-9 px-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            class="w-3.5 h-3.5"
            :class="{ 'animate-spin': pending }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>
    </header>

    <!-- Toolbar, Search & Filters -->
    <div
      class="bg-white p-4 border border-slate-200 rounded-2xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-sm"
    >
      <div
        class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1"
      >
        <!-- Quick Sort Button -->
        <button
          type="button"
          @click="toggleSort"
          :aria-label="`Sort by submitted date ${sortDirection === 'asc' ? 'descending' : 'ascending'}`"
          class="h-9 px-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 shrink-0 select-none"
        >
          <svg
            class="w-3.5 h-3.5 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              v-if="sortDirection === 'asc'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7h8M8 12h5M8 17h2M16 16l3 3 3-3M19 19V9"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7h8M8 12h5M8 17h2M16 8l3-3 3 3M19 5v10"
            />
          </svg>

          {{ sortDirection === "asc" ? "ASC" : "DESC" }}
        </button>

        <!-- Search Input -->
        <div class="relative w-full sm:w-72">
          <label for="search-applications" class="sr-only"
            >Search applications</label
          >
          <input
            id="search-applications"
            v-model="searchQuery"
            type="text"
            placeholder="Search by ID, name, course..."
            class="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all placeholder:text-slate-400"
          />
          <svg
            class="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <!-- Date Range Picker -->
        <div class="w-full sm:w-64">
          <VueDatePicker
            v-model="dateRange"
            range
            :auto-apply="false"
            teleport="body"
            :partial-range="false"
            :enable-time-picker="false"
            placeholder="Filter by date range..."
            format="MMM dd, yyyy"
            input-class-name="!h-9 !text-xs !bg-slate-50 !border-slate-200 !rounded-xl focus:!ring-2 focus:!ring-emerald-600/20 focus:!border-emerald-600"
          />
        </div>

        <!-- Reset Button -->
        <button
          v-show="hasActiveFilters"
          type="button"
          @click="clearFilters"
          class="h-9 px-3 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors shrink-0 font-medium"
        >
          Reset Filters
        </button>
      </div>

      <div
        class="text-xs text-slate-500 font-medium self-end lg:self-center shrink-0"
      >
        Total Applications:
        <span class="font-bold text-slate-800">
          {{ filteredApplications.length }}
        </span>
      </div>
    </div>

    <!-- Feedback Banner -->
    <div
      v-if="error"
      class="rounded-xl border bg-rose-50 border-rose-200 text-rose-700 px-4 py-3 text-xs flex items-center justify-between"
      role="alert"
    >
      <span>Failed to load ID applications. Please try again later.</span>
      <button
        type="button"
        @click="refresh"
        class="text-xs font-semibold underline hover:no-underline ml-4"
      >
        Retry
      </button>
    </div>

    <!-- Data Table Container -->
    <section
      class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
    >
      <!-- Loading State -->
      <div
        v-if="pending"
        class="p-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2"
      >
        <svg
          class="w-5 h-5 animate-spin text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <span>Loading ID applications...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="!filteredApplications.length" class="p-12 text-center">
        <p class="text-sm font-semibold text-slate-700">
          No applications found
        </p>
        <p class="text-xs text-slate-400 mt-1">
          {{
            hasActiveFilters
              ? "Try adjusting or resetting your search and date filters."
              : "No records exist in the database."
          }}
        </p>
        <button
          v-if="hasActiveFilters"
          type="button"
          @click="clearFilters"
          class="mt-4 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
        >
          Clear Filters
        </button>
      </div>

      <!-- Data Table -->
      <div v-else>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr
                class="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold"
              >
                <th scope="col" class="py-3 px-4">Student</th>
                <th scope="col" class="py-3 px-4">Course</th>
                <th scope="col" class="py-3 px-4">Emergency Contact</th>
                <th scope="col" class="py-3 px-4">Address</th>
                <th
                  scope="col"
                  class="py-3 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors select-none"
                  @click="toggleSort"
                  title="Click to toggle sort order"
                >
                  Submitted
                  <span class="text-emerald-700 ml-0.5">
                    {{ sortDirection === "asc" ? "↑" : "↓" }}
                  </span>
                </th>
                <th scope="col" class="py-3 px-4 text-center">ID Picture</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr
                v-for="app in paginatedApplications"
                :key="app.id"
                class="hover:bg-slate-50/80 transition-colors"
              >
                <!-- Student Info -->
                <td class="py-3.5 px-4">
                  <div class="font-bold text-slate-900">
                    {{ formatFullName(app) }}
                  </div>
                  <div
                    class="text-[11px] font-mono text-emerald-800 font-semibold mt-0.5"
                  >
                    ID: {{ app.studid || "N/A" }}
                  </div>
                </td>

                <!-- Course -->
                <td class="py-3.5 px-4 font-medium">
                  {{ app.course || "N/A" }}
                </td>

                <!-- Contact Info -->
                <td class="py-3.5 px-4">
                  <div class="font-semibold text-slate-800">
                    {{ app.contact_name || "N/A" }}
                  </div>
                  <div class="text-[11px] text-slate-500 font-mono">
                    {{ app.contact_number || "N/A" }}
                  </div>
                </td>

                <!-- Contact Address -->
                <td
                  class="py-3.5 px-4 max-w-xs truncate text-slate-600"
                  :title="app.contact_address || undefined"
                >
                  {{ app.contact_address || "N/A" }}
                </td>

                <!-- Submitted Date -->
                <td class="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                  {{ formatDate(app.created_at) }}
                </td>

                <!-- ID Picture -->
                <td class="py-3.5 px-4 text-center whitespace-nowrap">
                  <span
                    v-if="app.id_picture_filename"
                    class="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200"
                  >
                    {{ app.id_picture_filename }}
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-400"
                  >
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Bar -->
        <div
          class="border-t border-slate-100 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <!-- Results Info -->
          <p class="text-[11px] text-slate-500">
            Showing
            <span class="font-semibold text-slate-700">{{
              paginationStart
            }}</span>
            -
            <span class="font-semibold text-slate-700">{{
              paginationEnd
            }}</span>
            of
            <span class="font-semibold text-slate-700">{{
              filteredApplications.length
            }}</span>
            applications
          </p>

          <!-- Pagination Controls -->
          <div class="flex items-center gap-1">
            <!-- Previous -->
            <button
              type="button"
              @click="previousPage"
              :disabled="currentPage === 1"
              class="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[11px] font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <!-- Page Buttons -->
            <template
              v-for="(page, idx) in visiblePages"
              :key="typeof page === 'number' ? page : `ellipsis-${idx}`"
            >
              <span
                v-if="page === '...'"
                class="h-8 min-w-8 px-1 flex items-center justify-center text-[11px] text-slate-400 select-none"
              >
                ...
              </span>

              <button
                v-else
                type="button"
                @click="goToPage(page)"
                :aria-current="page === currentPage ? 'page' : undefined"
                :class="
                  page === currentPage
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                "
                class="h-8 min-w-8 px-2 rounded-lg border text-[11px] font-semibold transition-colors"
              >
                {{ page }}
              </button>
            </template>

            <!-- Next -->
            <button
              type="button"
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[11px] font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

// --- Constants ---
const ITEMS_PER_PAGE = 10;

// Reusable Date Formatter instance (avoids recreation inside render loops)
const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

// --- State ---
const searchQuery = ref("");
const dateRange = ref([]);
const sortDirection = ref("desc"); // 'asc' = oldest first, 'desc' = newest first
const currentPage = ref(1);

// --- Data Fetching ---
// Non-blocking fetch pattern (omitting top-level await lets loading skeleton render instantly)
const { data, pending, error, refresh } = useFetch("/api/id-applications");

const applications = computed(() => data.value?.applications || []);

// --- Helpers ---
const formatFullName = (app) => {
  if (!app) return "No Name Provided";
  const nameParts = [app.firstname, app.middlename, app.lastname].filter(
    Boolean,
  );
  return nameParts.join(" ") || "No Name Provided";
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "N/A" : dateTimeFormatter.format(date);
};

// --- Actions ---
const toggleSort = () => {
  sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
};

const clearFilters = () => {
  searchQuery.value = "";
  dateRange.value = [];
};

// --- Computed Properties ---
const hasActiveFilters = computed(() => {
  const hasQuery = Boolean(searchQuery.value.trim());
  const hasValidDateRange =
    Array.isArray(dateRange.value) &&
    dateRange.value.length === 2 &&
    Boolean(dateRange.value[0]) &&
    Boolean(dateRange.value[1]);

  return hasQuery || hasValidDateRange;
});

const filteredApplications = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  // Extract date boundary timestamps once per filter calculation
  let startTime = null;
  let endTime = null;
  if (
    Array.isArray(dateRange.value) &&
    dateRange.value.length === 2 &&
    dateRange.value[0] &&
    dateRange.value[1]
  ) {
    startTime = new Date(dateRange.value[0]).setHours(0, 0, 0, 0);
    endTime = new Date(dateRange.value[1]).setHours(23, 59, 59, 999);
  }

  // 1. Filter
  const filtered = applications.value.filter((app) => {
    if (query) {
      const fullName = formatFullName(app).toLowerCase();
      const studId = (app.studid || "").toLowerCase();
      const course = (app.course || "").toLowerCase();
      const contact = (app.contact_name || "").toLowerCase();

      const matches =
        fullName.includes(query) ||
        studId.includes(query) ||
        course.includes(query) ||
        contact.includes(query);

      if (!matches) return false;
    }

    if (startTime !== null && endTime !== null) {
      if (!app.created_at) return false;
      const appTime = new Date(app.created_at).getTime();
      if (isNaN(appTime) || appTime < startTime || appTime > endTime) {
        return false;
      }
    }

    return true;
  });

  // 2. Sort (create array copy to prevent unexpected side effects)
  const isAsc = sortDirection.value === "asc";
  return [...filtered].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    const dateDiff = isAsc ? dateA - dateB : dateB - dateA;

    if (dateDiff !== 0) return dateDiff;

    // Tie-breaker by ID
    const idA = Number(a.id) || 0;
    const idB = Number(b.id) || 0;
    return isAsc ? idA - idB : idB - idA;
  });
});

// --- Pagination Computed Properties ---
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredApplications.value.length / ITEMS_PER_PAGE)),
);

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  return filteredApplications.value.slice(start, start + ITEMS_PER_PAGE);
});

const paginationStart = computed(() => {
  if (!filteredApplications.value.length) return 0;
  return (currentPage.value - 1) * ITEMS_PER_PAGE + 1;
});

const paginationEnd = computed(() =>
  Math.min(
    currentPage.value * ITEMS_PER_PAGE,
    filteredApplications.value.length,
  ),
);

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }

  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, "...", current - 1, current, current + 1, "...", total];
});

// --- Pagination Actions ---
const goToPage = (page) => {
  if (page === "...") return;
  currentPage.value = Math.min(Math.max(Number(page), 1), totalPages.value);
};

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// --- Watchers ---
// Reset to page 1 whenever search, date filters, or sorting change
watch([searchQuery, dateRange, sortDirection], () => {
  currentPage.value = 1;
});

// Ensure current page remains valid when total pages change
watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) {
    currentPage.value = newTotal;
  }
});
</script>
