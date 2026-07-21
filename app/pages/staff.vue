<template>
  <div
    class="min-h-screen bg-slate-50 text-slate-800 antialiased p-6 font-sans"
  >
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-5 border-b border-slate-200"
    >
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-emerald-900">
          Staff Queue Control
        </h1>
        <p class="text-xs text-slate-500 mt-0.5">
          Caraga State University Queue Management System
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
        <select v-model="filters.type" class="input max-w-[200px]">
          <option value="active">All (Serving + Waiting)</option>
          <option value="done">Completed Only</option>
        </select>

        <div class="relative flex-1 md:flex-initial">
          <input
            v-model="filters.search"
            placeholder="Search name..."
            class="input pl-3 pr-8"
          />
        </div>

        <input type="date" v-model="filters.date" class="input" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 panel shadow-sm bg-white">
        <div
          class="flex justify-between items-center mb-5 pb-2 border-b border-slate-100"
        >
          <h2 class="font-bold text-slate-700 tracking-tight">
            Queue Workspace
          </h2>
          <span
            class="text-xs bg-slate-100 px-2.5 py-1 rounded-full font-medium text-slate-600"
          >
            Total Tickets:
            {{
              servingQueues.length + waitingQueues.length + doneQueues.length
            }}
          </span>
        </div>

        <template v-if="filters.type === 'active'">
          <div
            v-if="!servingQueues.length && !waitingQueues.length"
            class="text-center py-12 text-slate-400"
          >
            <p class="text-sm">
              No active tickets found in the queue right now.
            </p>
          </div>

          <!-- NOW SERVING SECTION -->
          <div v-if="servingQueues.length" class="mb-6">
            <p class="section-title text-emerald-700 font-semibold">
              Now Serving
            </p>

            <div
              v-for="q in servingQueues"
              :key="q.id"
              class="queue-item flex-col sm:flex-row items-stretch sm:items-center gap-3 border-l-4 border-emerald-600 bg-emerald-50/40 hover:bg-emerald-50 transition-colors"
            >
              <div class="flex items-center gap-4 flex-1">
                <div
                  class="text-2xl font-black tracking-wider text-emerald-800 bg-emerald-100/60 px-3 py-1.5 rounded-lg min-w-[85px] text-center"
                >
                  {{ q.ticketnumber }}
                </div>
                <div>
                  <p class="font-semibold text-slate-800 text-sm">
                    {{ q.fullname }}
                  </p>
                  <p class="text-xs text-slate-500 font-medium mt-0.5">
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
                  class="input text-xs py-1.5 px-2.5 w-full sm:w-48 border-emerald-300 focus:border-emerald-600"
                />
              </div>

              <div class="flex gap-1.5 justify-end">
                <button @click="markDone(q.id)" class="btn-action-done">
                  Done
                </button>
                <button @click="recallTicket(q.id)" class="btn-action-call">
                  Recall
                </button>
              </div>
            </div>
          </div>

          <div
            v-if="servingQueues.length && waitingQueues.length"
            class="divider"
          ></div>

          <!-- WAITING LIST SECTION -->
          <div v-if="waitingQueues.length">
            <p class="section-title text-amber-700 font-semibold">
              Waiting List
            </p>

            <div
              v-for="q in waitingQueues"
              :key="q.id"
              class="queue-item flex-col sm:flex-row items-stretch sm:items-center gap-3 border-l-4 border-amber-500 bg-white shadow-sm hover:border-amber-600 transition-all"
            >
              <div class="flex items-center gap-4 flex-1">
                <div
                  class="text-xl font-bold tracking-wider text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg min-w-[85px] text-center border border-amber-100"
                >
                  {{ q.ticketnumber }}
                </div>
                <div>
                  <p class="font-semibold text-slate-800 text-sm">
                    {{ q.fullname }}
                  </p>
                  <p class="text-xs text-slate-500 font-medium mt-0.5">
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
                  class="input text-xs py-1.5 px-2.5 w-full sm:w-48 border-amber-300 focus:border-amber-500"
                />
              </div>

              <div class="flex gap-1.5 justify-end">
                <button @click="markDone(q.id)" class="btn-action-done">
                  Done
                </button>
                <button @click="callTicket(q.id)" class="btn-action-call">
                  Call
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- COMPLETED SESSIONS SECTION -->
        <template v-else>
          <p class="section-title text-slate-500">Completed Sessions</p>

          <div
            v-if="!doneQueues.length"
            class="text-center py-12 text-slate-400"
          >
            <p class="text-sm">No completed tickets found for this period.</p>
          </div>

          <div
            v-for="q in doneQueues"
            :key="q.id"
            class="queue-item border-l-4 border-slate-300 bg-slate-50 opacity-75"
          >
            <div class="flex items-center gap-4">
              <div
                class="text-lg font-bold text-slate-500 min-w-[85px] text-center"
              >
                {{ q.ticketnumber }}
              </div>
              <div>
                <p class="font-medium text-slate-700 text-sm">
                  {{ q.fullname }}
                </p>
                <p class="text-xs text-slate-400">
                  {{ q.servicetype }}
                  <span
                    v-if="q.id_picture_filename"
                    class="font-mono text-slate-500 ml-1"
                  >
                    ({{ q.id_picture_filename }})
                  </span>
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span
                class="text-xs font-medium text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded"
              >
                Finished
              </span>
              <button @click="recallTicket(q.id)" class="btn-action-call">
                Recall
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- SIDEBAR CONTROLS -->
      <div class="panel bg-white shadow-sm space-y-5 border border-slate-200">
        <h2
          class="font-bold text-slate-800 tracking-tight pb-2 border-b border-slate-100"
        >
          Live Controls
        </h2>

        <div
          class="p-5 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-xl shadow-inner text-center relative overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:16px_16px] opacity-30"
          ></div>
          <p
            class="text-[10px] uppercase tracking-widest text-emerald-300 font-bold mb-1 relative z-10"
          >
            Now Serving
          </p>
          <p
            class="text-4xl font-black tracking-wide text-amber-400 font-mono drop-shadow-sm relative z-10"
          >
            {{ current }}
          </p>
        </div>

        <div class="grid grid-cols-1 gap-2">
          <button @click="nextTicket" class="btn-emerald shadow-sm">
            <span>SERVE NEXT TICKET</span>
          </button>
        </div>

        <div class="pt-4 border-t border-slate-100 space-y-2">
          <label
            class="text-xs font-semibold text-slate-500 uppercase tracking-wider"
            >Manual Dispatch</label
          >
          <div class="flex gap-2">
            <input
              v-model="manual"
              placeholder="Ex. 001"
              class="input w-full text-center font-mono font-bold tracking-widest placeholder:font-sans placeholder:font-normal placeholder:tracking-normal"
            />
            <button
              @click="callManual"
              class="btn-gold whitespace-nowrap px-4 text-xs tracking-wide"
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

/* ================= API ================= */
const fetchQueues = async () => {
  const res = await $fetch("/api/staff/queues", {
    query: { ...filters },
  });
  queues.value = res;
};

const callTicket = async (payload) => {
  if (!payload) return;

  const requestBody = typeof payload === "object" ? payload : { id: payload };

  const res = await $fetch("/api/staff/call", {
    method: "POST",
    body: requestBody,
  });
  current.value = res.current;
  await fetchQueues();
};

const nextTicket = async () => {
  // If the currently serving ticket is ID Processing, ensure filename was provided before serving next
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
  await callTicket({ id });
};

const callManual = async () => {
  const code = manual.value.trim();
  if (!code) return;

  await callTicket({ ticket: code });
  manual.value = "";
};

const markDone = async (id) => {
  if (!id) return;

  const ticket = queues.value.find((q) => q.id === id);
  const filename = idPictureMap[id]?.trim();

  // Validate requirement if service is ID Processing
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

  // Clean up input state
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

<style scoped>
/* INPUTS & SELECTS */
.input {
  @apply p-2.5 bg-white text-slate-800 rounded-lg border border-slate-300 text-sm transition-all focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10;
}

/* CARDS AND PANELS */
.panel {
  @apply bg-white p-5 rounded-xl border border-slate-200/80;
}

.queue-item {
  @apply flex justify-between items-center p-3.5 bg-slate-50/60 rounded-xl mb-2.5 border border-slate-100;
}

.section-title {
  @apply text-xs uppercase mb-3 tracking-widest font-bold;
}

.divider {
  @apply my-5 border-t border-slate-200/60;
}

/* ACTIONS BUTTONS */
.btn-gold {
  @apply px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-semibold text-sm transition-colors;
}

.btn-emerald {
  @apply w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold tracking-wide rounded-xl transition-all shadow-sm active:scale-[0.99];
}

.btn-outline-amber {
  @apply w-full py-2.5 bg-white border border-amber-500 text-amber-700 font-semibold text-xs tracking-wider rounded-xl hover:bg-amber-50 transition-colors;
}

.btn-action-call {
  @apply px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg text-xs font-bold transition-all shadow-sm;
}

.btn-action-done {
  @apply px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-all;
}

.btn-muted {
  @apply p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors;
}
</style>
