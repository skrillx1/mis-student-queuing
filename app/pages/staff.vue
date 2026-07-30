<template>
  <!-- TOP HEADER & CONTROLS BAR -->
  <header
    class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs"
  >
    <div class="flex items-center gap-3">
      <div class="p-2.5 bg-emerald-800 text-amber-400 rounded-xl shadow-xs">
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <div>
        <h1
          class="text-xl sm:text-2xl font-black tracking-tight text-emerald-950"
        >
          Staff Queue Control
        </h1>
        <p class="text-xs font-medium text-slate-500">
          Caraga State University Queue Management System
        </p>
      </div>
    </div>

    <!-- FILTERS -->
    <div class="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
      <select
        v-model="filters.type"
        class="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all cursor-pointer"
      >
        <option value="active">All (Serving + Waiting)</option>
        <option value="done">Completed Only</option>
      </select>

      <div class="relative flex-1 md:w-56">
        <svg
          class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
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
        <input
          v-model="filters.search"
          placeholder="Search student/client..."
          class="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
        />
      </div>

      <input
        type="date"
        v-model="filters.date"
        class="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all cursor-pointer"
      />
    </div>
  </header>

  <!-- MAIN GRID -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- QUEUE WORKSPACE (LEFT 2 COLS) -->
    <div
      class="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs"
    >
      <div
        class="flex justify-between items-center mb-6 pb-4 border-b border-slate-100"
      >
        <div class="flex items-center gap-2">
          <h2 class="font-bold text-slate-800 text-base tracking-tight">
            Queue Workspace
          </h2>
        </div>
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/60"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          Total Tickets:
          {{ servingQueues.length + waitingQueues.length + doneQueues.length }}
        </span>
      </div>

      <template v-if="filters.type === 'active'">
        <!-- EMPTY STATE -->
        <div
          v-if="!servingQueues.length && !waitingQueues.length"
          class="text-center py-16 px-4 my-4 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200"
        >
          <div
            class="w-12 h-12 mx-auto mb-3 text-slate-300 bg-slate-100 rounded-full flex items-center justify-center"
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
          <p class="text-sm font-semibold text-slate-600">
            No active tickets found
          </p>
          <p class="text-xs text-slate-400 mt-1">
            There are currently no tickets in serving or waiting state.
          </p>
        </div>

        <!-- NOW SERVING SECTION -->
        <div v-if="servingQueues.length" class="mb-6 space-y-3">
          <div class="flex items-center gap-2">
            <span class="relative flex h-2.5 w-2.5">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"
              ></span>
            </span>
            <p
              class="text-xs uppercase font-bold tracking-wider text-emerald-800"
            >
              Now Serving
            </p>
          </div>

          <div
            v-for="q in servingQueues"
            :key="q.id"
            class="group flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl border-l-4 border-l-emerald-600 border border-emerald-200/60 bg-emerald-50/40 hover:bg-emerald-50/80 transition-all shadow-2xs"
          >
            <div class="flex items-center gap-4 flex-1">
              <div
                class="flex flex-col items-center justify-center bg-emerald-900 text-amber-300 font-mono font-black text-2xl tracking-wider px-4 py-2 rounded-xl shadow-xs min-w-[90px] text-center"
              >
                {{ q.ticketnumber }}
              </div>
              <div>
                <h3 class="font-bold text-slate-900 text-base leading-snug">
                  {{ q.fullname }}
                </h3>
                <div class="flex items-center gap-2 mt-0.5">
                  <span
                    class="inline-block text-xs font-semibold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md"
                  >
                    {{ q.servicetype }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Filename Input for ID Processing -->
            <div
              v-if="isIdProcessing(q.servicetype)"
              class="flex flex-col gap-1 w-full sm:w-auto"
            >
              <input
                v-model="idPictureMap[q.id]"
                type="text"
                placeholder="ID Picture Filename..."
                class="h-9 text-xs px-3 bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 w-full sm:w-48 transition-all"
              />
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 justify-end">
              <button
                @click="markDone(q.id)"
                class="h-9 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-lg font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
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
                    stroke-width="2.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Done
              </button>
              <button
                @click="recallTicket(q.id)"
                class="h-9 px-3.5 bg-amber-50 hover:bg-amber-100 active:scale-[0.98] text-amber-800 border border-amber-300 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
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
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                </svg>
                Recall
              </button>
            </div>
          </div>
        </div>

        <hr
          v-if="servingQueues.length && waitingQueues.length"
          class="my-6 border-slate-100"
        />

        <!-- WAITING LIST SECTION -->
        <div v-if="waitingQueues.length" class="space-y-3">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <p
              class="text-xs uppercase font-bold tracking-wider text-amber-800"
            >
              Waiting List ({{ waitingQueues.length }})
            </p>
          </div>

          <div
            v-for="q in waitingQueues"
            :key="q.id"
            class="group flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl border-l-4 border-l-amber-500 border border-slate-200/80 bg-white hover:border-amber-400 hover:shadow-xs transition-all"
          >
            <div class="flex items-center gap-4 flex-1">
              <div
                class="flex flex-col items-center justify-center bg-amber-50 text-amber-900 border border-amber-200/60 font-mono font-bold text-xl tracking-wider px-3.5 py-1.5 rounded-xl min-w-[90px] text-center"
              >
                {{ q.ticketnumber }}
              </div>
              <div>
                <h3 class="font-bold text-slate-800 text-sm sm:text-base">
                  {{ q.fullname }}
                </h3>
                <p class="text-xs font-medium text-slate-500 mt-0.5">
                  {{ q.servicetype }}
                </p>
              </div>
            </div>

            <!-- Filename Input for ID Processing -->
            <div
              v-if="isIdProcessing(q.servicetype)"
              class="flex flex-col gap-1 w-full sm:w-auto"
            >
              <input
                v-model="idPictureMap[q.id]"
                type="text"
                placeholder="ID Picture Filename..."
                class="h-9 text-xs px-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-full sm:w-48 transition-all"
              />
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 justify-end">
              <button
                @click="markDone(q.id)"
                class="h-9 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs transition-all cursor-pointer"
              >
                Done
              </button>
              <button
                @click="callTicket(q.id)"
                :disabled="hasActiveServing"
                :class="[
                  'h-9 px-4 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 rounded-lg',
                  hasActiveServing
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                    : 'bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 cursor-pointer',
                ]"
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
                    stroke-width="2.5"
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                </svg>
                Call
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- COMPLETED SESSIONS SECTION -->
      <template v-else>
        <div class="space-y-3">
          <p class="text-xs uppercase font-bold tracking-wider text-slate-400">
            Completed Sessions
          </p>

          <div
            v-if="!doneQueues.length"
            class="text-center py-16 px-4 my-4 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200"
          >
            <p class="text-sm font-medium text-slate-500">
              No completed tickets found for this period.
            </p>
          </div>

          <div
            v-for="q in doneQueues"
            :key="q.id"
            class="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-slate-200/60 bg-slate-50/60 opacity-80 hover:opacity-100 transition-all"
          >
            <div class="flex items-center gap-4">
              <div
                class="font-mono font-bold text-slate-500 bg-slate-200/60 text-base px-3 py-1 rounded-lg min-w-[80px] text-center"
              >
                {{ q.ticketnumber }}
              </div>
              <div>
                <p class="font-semibold text-slate-700 text-sm">
                  {{ q.fullname }}
                </p>
                <p class="text-xs text-slate-400 mt-0.5">
                  {{ q.servicetype }}
                  <span
                    v-if="q.id_picture_filename"
                    class="font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded ml-1"
                  >
                    {{ q.id_picture_filename }}
                  </span>
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span
                class="hidden sm:inline-block text-[11px] font-medium text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded-full"
              >
                Finished
              </span>
              <button
                @click="recallTicket(q.id)"
                class="h-8 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                Recall
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- SIDEBAR CONTROLS (RIGHT 1 COL) -->
    <div class="space-y-5">
      <div
        class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-6"
      >
        <h2
          class="font-bold text-slate-800 text-base tracking-tight pb-3 border-b border-slate-100 flex items-center justify-between"
        >
          Live Display
          <span
            class="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded"
          >
            <span
              class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
            ></span>
            Live Sync
          </span>
        </h2>

        <!-- CURRENT SERVING DISPLAY -->
        <div
          class="p-6 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-2xl shadow-md text-center relative overflow-hidden border border-emerald-800/50"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:12px_12px] opacity-40"
          ></div>

          <p
            class="text-[11px] uppercase tracking-widest text-emerald-300/80 font-bold mb-1 relative z-10"
          >
            Now Serving
          </p>
          <p
            class="text-5xl font-black tracking-wider text-amber-400 font-mono drop-shadow-md my-2 relative z-10"
          >
            {{ current }}
          </p>
          <p class="text-[10px] text-emerald-200/60 font-medium relative z-10">
            CSU Staff Control Console
          </p>
        </div>

        <!-- PRIMARY ACTION BUTTON -->
        <div>
          <button
            @click="nextTicket"
            class="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-black tracking-wider text-sm rounded-xl transition-all shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>SERVE NEXT TICKET</span>
            <svg
              class="w-4 h-4 text-amber-400 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>

        <!-- MANUAL DISPATCH -->
        <div class="pt-5 border-t border-slate-100 space-y-3">
          <label
            class="block text-xs font-bold text-slate-500 uppercase tracking-wider"
          >
            Manual Call / Dispatch
          </label>
          <div class="flex gap-2">
            <input
              v-model="manual"
              placeholder="Ex. 001"
              class="flex-1 h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono font-bold text-sm tracking-widest placeholder:font-sans placeholder:font-normal placeholder:tracking-normal focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
            <button
              @click="callManual"
              :disabled="hasActiveServing || !manual.trim()"
              :class="[
                'h-10 px-5 font-extrabold text-xs tracking-wider rounded-xl transition-all shadow-xs whitespace-nowrap',
                hasActiveServing || !manual.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 cursor-pointer',
              ]"
            >
              CALL
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
} from "vue";

/* ================= STATE ================= */
const queues = ref([]);
const current = ref("---");
const manual = ref("");
const idPictureMap = reactive({}); // Stores filename by ticket ID: { [ticketId]: 'filename.jpg' }

let pollInterval = null;
let searchTimeout = null;

const filters = reactive({
  type: "active",
  search: "",
  date: "",
});

/* ================= COMPUTED ================= */
const servingQueues = computed(() =>
  queues.value.filter((q) => q.status === "serving"),
);

const waitingQueues = computed(() =>
  queues.value
    .filter((q) => q.status === "waiting")
    .sort((a, b) => Number(a.ticketnumber) - Number(b.ticketnumber)),
);

const doneQueues = computed(() =>
  queues.value.filter((q) => q.status === "done"),
);

// Flag to check if any ticket is actively serving
const hasActiveServing = computed(() => servingQueues.value.length > 0);

/* ================= HELPER FUNCTIONS ================= */
const isIdProcessing = (serviceType) => {
  return serviceType?.toLowerCase().includes("id processing");
};

/* ================= POLLING LOGIC ================= */
const startPolling = () => {
  if (pollInterval) return;
  pollInterval = setInterval(async () => {
    await fetchAllData();
  }, 5000);
};

const stopPolling = () => {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
};

const managePollingState = () => {
  if (filters.search.trim() !== "") {
    stopPolling();
  } else {
    startPolling();
  }
};

/* ================= WATCHERS ================= */
watch(
  () => [filters.type, filters.date],
  () => {
    fetchQueues();
  },
);

watch(
  () => filters.search,
  () => {
    managePollingState();

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    searchTimeout = setTimeout(() => {
      fetchQueues();
    }, 300);
  },
);

/* ================= API ACTIONS ================= */
const fetchQueues = async () => {
  const res = await $fetch("/api/staff/queues", {
    query: { ...filters },
  });
  queues.value = res;
};

const callTicket = async (payload) => {
  if (!payload) return;

  const targetId = typeof payload === "object" ? payload.id : payload;
  const isCurrentlyServing = servingQueues.value.some((q) => q.id === targetId);

  // GUARD: Prevent serving a new ticket if another ticket is already active
  if (hasActiveServing.value && !isCurrentlyServing) {
    alert(
      "You are currently serving a ticket. Please mark the active ticket as 'Done' before serving a new one.",
    );
    return;
  }

  const requestBody = typeof payload === "object" ? payload : { id: payload };

  const res = await $fetch("/api/staff/call", {
    method: "POST",
    body: requestBody,
  });
  current.value = res.current;
  await fetchQueues();
};

const nextTicket = async () => {
  const activeServing = servingQueues.value[0];

  if (activeServing && isIdProcessing(activeServing.servicetype)) {
    const filename = idPictureMap[activeServing.id]?.trim();
    if (!filename) {
      alert(
        "Please enter the ID Picture Filename for the currently serving ticket before calling the next one.",
      );
      return;
    }
  }

  const payload = activeServing
    ? {
        id: activeServing.id,
        id_picture_filename: idPictureMap[activeServing.id],
      }
    : {};

  const res = await $fetch("/api/staff/next", {
    method: "POST",
    body: payload,
  });
  current.value = res.current;
  await fetchQueues();
};

const recallTicket = async (id) => {
  if (!id) return;
  // Recalls bypass the active-serving block for the same ticket
  const requestBody = { id };
  const res = await $fetch("/api/staff/call", {
    method: "POST",
    body: requestBody,
  });
  current.value = res.current;
  await fetchQueues();
};

const callManual = async () => {
  const code = manual.value.trim();
  if (!code) return;

  // GUARD: Block manual calls if a ticket is being served
  if (hasActiveServing.value) {
    alert(
      "Please complete (Mark Done) the currently serving ticket before dispatching a manual code.",
    );
    return;
  }

  await callTicket({ ticket: code });
  manual.value = "";
};

const markDone = async (id) => {
  if (!id) return;

  const ticket = queues.value.find((q) => q.id === id);
  const filename = idPictureMap[id]?.trim();

  if (ticket && isIdProcessing(ticket.servicetype) && !filename) {
    alert(
      "Please enter the ID Picture Filename before marking this ticket as done.",
    );
    return;
  }

  await $fetch("/api/staff/done", {
    method: "POST",
    body: {
      id,
      id_picture_filename: filename || null,
    },
  });

  delete idPictureMap[id];
  await fetchQueues();
};

const fetchCurrentServing = async () => {
  const res = await $fetch("/api/staff/current");
  current.value = res.current || "---";
};

const fetchAllData = async () => {
  await Promise.all([fetchQueues(), fetchCurrentServing()]);
};

/* ================= INIT & LIFECYCLE ================= */
onMounted(async () => {
  await fetchAllData();
  managePollingState();
});

onBeforeUnmount(() => {
  stopPolling();
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});
</script>
