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
          class="h-9 px-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <svg
            class="w-3.5 h-3.5"
            :class="{ 'animate-spin': pending }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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

    <!-- Toolbar & Search -->
    <div
      class="bg-white p-4 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm"
    >
      <div class="relative w-full sm:w-80">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by ID, name, course..."
          class="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
        />
        <svg
          class="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <div class="text-xs text-slate-500 font-medium self-end sm:self-center">
        Total Applications:
        <span class="font-bold text-slate-800">{{
          filteredApplications.length
        }}</span>
      </div>
    </div>

    <!-- Feedback Banner -->
    <div
      v-if="error"
      class="rounded-xl border bg-rose-50 border-rose-200 text-rose-700 px-4 py-3 text-xs"
      role="alert"
    >
      Failed to load ID applications. Please try again later.
    </div>

    <!-- Data Table Container -->
    <section
      class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
    >
      <div v-if="pending" class="p-12 text-center text-xs text-slate-400">
        Loading ID applications...
      </div>

      <div v-else-if="!filteredApplications.length" class="p-12 text-center">
        <p class="text-sm font-semibold text-slate-700">
          No applications found
        </p>
        <p class="text-xs text-slate-400 mt-1">
          {{
            searchQuery
              ? "Try adjusting your search criteria."
              : "No records exist in the database."
          }}
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr
              class="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold"
            >
              <th class="py-3 px-4">Student</th>
              <th class="py-3 px-4">Course</th>
              <th class="py-3 px-4">Emergency Contact</th>
              <th class="py-3 px-4">Address</th>
              <th class="py-3 px-4">Submitted</th>
              <th class="py-3 px-4 text-center">ID Picture</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr
              v-for="app in filteredApplications"
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
                  ID: {{ app.studid }}
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
                :title="app.contact_address"
              >
                {{ app.contact_address || "N/A" }}
              </td>

              <!-- Submitted Date -->
              <td class="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                {{ formatDate(app.created_at) }}
              </td>

              <!-- ID Picture Status / Filename -->
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
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// State
const searchQuery = ref("");

// Fetch Applications
const { data, pending, error, refresh } = await useFetch(
  "/api/id-applications",
);

const applications = computed(() => data.value?.applications || []);

// Filter Applications by Search Query
const filteredApplications = computed(() => {
  if (!searchQuery.value.trim()) return applications.value;

  const q = searchQuery.value.toLowerCase().trim();
  return applications.value.filter((app) => {
    const fullName = formatFullName(app).toLowerCase();
    const studId = (app.studid || "").toLowerCase();
    const course = (app.course || "").toLowerCase();
    const contact = (app.contact_name || "").toLowerCase();

    return (
      fullName.includes(q) ||
      studId.includes(q) ||
      course.includes(q) ||
      contact.includes(q)
    );
  });
});

// Helpers
const formatFullName = (app) => {
  const parts = [app.firstname, app.middlename, app.lastname].filter(Boolean);
  return parts.join(" ") || "No Name Provided";
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
