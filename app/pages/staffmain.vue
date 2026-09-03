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
        <option value="active">All Active (Waiting / Station Assigned)</option>
        <option value="onhold">On Hold Only</option>
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

  <!-- STATIONS HEADER DROP ZONES (SERVING TICKETS HERE) -->
  <section class="mb-6">
    <div class="flex items-center justify-between mb-3">
      <h2 class="font-bold text-slate-800 text-sm uppercase tracking-wider">
        Counter Stations (Drag Ticket to Assign Station)
      </h2>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      <div
        v-for="stationNum in stations"
        :key="stationNum"
        :draggable="!!getStationTicket(stationNum)"
        @dragstart="
          getStationTicket(stationNum) &&
          onDragStart($event, getStationTicket(stationNum))
        "
        @dragover.prevent="onDragOver($event, stationNum)"
        @dragleave="onDragLeave(stationNum)"
        @drop="onDrop($event, stationNum)"
        :class="[
          'p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between min-h-[140px]',
          getStationTicket(stationNum)
            ? 'cursor-grab active:cursor-grabbing'
            : '',
          activeStationHover === stationNum
            ? 'border-dashed border-emerald-500 bg-emerald-100/70 scale-[1.02]'
            : getStationTicket(stationNum)
              ? 'border-solid border-emerald-600/40 bg-emerald-50/50 shadow-xs'
              : 'border-dashed border-slate-200 bg-slate-50/60',
        ]"
      >
        <div class="flex items-center justify-between w-full">
          <span
            class="text-xs font-black uppercase text-slate-500 tracking-wider"
          >
            Station {{ stationNum }}
          </span>
          <span
            v-if="getStationTicket(stationNum)"
            class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"
          ></span>
        </div>

        <div v-if="getStationTicket(stationNum)" class="my-1">
          <div class="font-mono font-black text-2xl text-emerald-950">
            {{ getStationTicket(stationNum).ticketnumber }}
          </div>
          <div
            class="text-[11px] font-bold text-slate-700 truncate max-w-[130px]"
          >
            {{ getStationTicket(stationNum).fullname || "No Name Provided" }}
          </div>
        </div>

        <div v-else class="my-auto text-center py-2">
          <p class="text-[11px] font-medium text-slate-400">Drop ticket here</p>
        </div>

        <!-- STATION ACTIONS (RECALL, HOLD & DONE FOR SERVING TICKETS) -->
        <div
          v-if="getStationTicket(stationNum)"
          class="pt-2 border-t border-emerald-200/50 flex items-center justify-between gap-1"
        >
          <button
            @click="recallTicket(getStationTicket(stationNum).id, stationNum)"
            class="text-[10px] font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
          >
            Recall
          </button>
          <button
            @click="holdTicket(getStationTicket(stationNum).id)"
            class="text-[10px] font-bold text-orange-700 hover:text-orange-900 underline cursor-pointer"
          >
            Hold
          </button>
          <button
            @click="markDone(getStationTicket(stationNum).id)"
            class="text-[10px] font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- MAIN QUEUE WORKSPACE -->
  <div
    class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs"
  >
    <div
      class="flex justify-between items-center mb-6 pb-4 border-b border-slate-100"
    >
      <h2 class="font-bold text-slate-800 text-base tracking-tight">
        Queue Workspace
      </h2>
      <span
        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/60"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
        Total Tickets:
        {{
          waitingQueues.length +
          onHoldQueues.length +
          doneQueues.length +
          servingQueues.length
        }}
      </span>
    </div>

    <!-- ACTIVE / WAITING TICKETS -->
    <template v-if="filters.type === 'active'">
      <div
        v-if="!waitingQueues.length && !servingQueues.length"
        class="text-center py-16 px-4 my-4 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200"
      >
        <p class="text-sm font-semibold text-slate-600">
          No active tickets found
        </p>
        <p class="text-xs text-slate-400 mt-1">
          There are currently no tickets waiting to be assigned.
        </p>
      </div>

      <div v-else class="space-y-3">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <p class="text-xs uppercase font-bold tracking-wider text-amber-800">
            Waiting List ({{ waitingQueues.length }})
          </p>
        </div>

        <div
          v-for="q in waitingQueues"
          :key="q.id"
          draggable="true"
          @dragstart="onDragStart($event, q)"
          class="group flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl border-l-4 border-l-amber-500 border border-slate-200/80 bg-white hover:border-amber-400 hover:shadow-xs transition-all cursor-grab active:cursor-grabbing"
        >
          <div class="flex items-center gap-4 flex-1">
            <div
              class="flex flex-col items-center justify-center bg-amber-50 text-amber-900 border border-amber-200/60 font-mono font-bold text-xl tracking-wider px-3.5 py-1.5 rounded-xl min-w-[90px] text-center"
            >
              {{ q.ticketnumber }}
            </div>
            <div>
              <h3 class="font-bold text-slate-800 text-sm sm:text-base">
                {{ q.fullname || "No Name" }}
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
          </div>
        </div>
      </div>
    </template>

    <!-- ON HOLD TICKETS -->
    <template v-else-if="filters.type === 'onhold'">
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
          <p class="text-xs uppercase font-bold tracking-wider text-orange-800">
            On Hold Tickets ({{ onHoldQueues.length }})
          </p>
        </div>

        <div
          v-if="!onHoldQueues.length"
          class="text-center py-16 px-4 my-4 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200"
        >
          <p class="text-sm font-medium text-slate-500">
            No on-hold tickets found.
          </p>
        </div>

        <div
          v-for="q in onHoldQueues"
          :key="q.id"
          draggable="true"
          @dragstart="onDragStart($event, q)"
          class="flex items-center justify-between gap-4 p-4 rounded-xl border-l-4 border-l-orange-500 border border-slate-200/80 bg-white hover:border-orange-400 hover:shadow-xs transition-all cursor-grab active:cursor-grabbing"
        >
          <div class="flex items-center gap-4 flex-1">
            <div
              class="flex flex-col items-center justify-center bg-orange-50 text-orange-900 border border-orange-200/60 font-mono font-bold text-xl tracking-wider px-3.5 py-1.5 rounded-xl min-w-[90px] text-center"
            >
              {{ q.ticketnumber }}
            </div>
            <div>
              <h3 class="font-bold text-slate-800 text-sm sm:text-base">
                {{ q.fullname || "No Name" }}
              </h3>
              <p class="text-xs font-medium text-slate-500 mt-0.5">
                {{ q.servicetype }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 justify-end">
            <button
              @click="markDone(q.id)"
              class="h-9 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- COMPLETED SESSIONS -->
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
          class="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-slate-200/60 bg-slate-50/60 opacity-80"
        >
          <div class="flex items-center gap-4">
            <div
              class="font-mono font-bold text-slate-500 bg-slate-200/60 text-base px-3 py-1 rounded-lg min-w-[80px] text-center"
            >
              {{ q.ticketnumber }}
            </div>
            <div>
              <p class="font-semibold text-slate-700 text-sm">
                {{ q.fullname || "No Name" }}
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

          <span
            class="hidden sm:inline-block text-[11px] font-medium text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded-full"
          >
            Finished
          </span>
        </div>
      </div>
    </template>
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
const idPictureMap = reactive({});
const stations = [1, 2, 3, 4, 5];
const activeStationHover = ref(null);

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

const onHoldQueues = computed(() =>
  queues.value
    .filter((q) => q.status === "onhold")
    .sort((a, b) => Number(a.ticketnumber) - Number(b.ticketnumber)),
);

const doneQueues = computed(() =>
  queues.value.filter((q) => q.status === "done"),
);

/* ================= HELPER FUNCTIONS ================= */
const isIdProcessing = (serviceType) => {
  return serviceType?.toLowerCase().includes("id processing");
};

// Gets the active ticket matching a specific station number
const getStationTicket = (stationNum) => {
  return servingQueues.value.find((q) => Number(q.station) === stationNum);
};

/* ================= DRAG & DROP HANDLERS ================= */
const onDragStart = (event, ticket) => {
  event.dataTransfer.setData("text/plain", JSON.stringify(ticket));
  event.dataTransfer.effectAllowed = "move";
};

const onDragOver = (event, stationNum) => {
  activeStationHover.value = stationNum;
};

const onDragLeave = (stationNum) => {
  if (activeStationHover.value === stationNum) {
    activeStationHover.value = null;
  }
};

const onDrop = async (event, stationNum) => {
  activeStationHover.value = null;
  const rawData = event.dataTransfer.getData("text/plain");
  if (!rawData) return;

  const ticket = JSON.parse(rawData);

  // Avoid unnecessary API calls if dropped on the exact same station
  if (ticket.status === "serving" && Number(ticket.station) === stationNum) {
    return;
  }

  const existingTicket = getStationTicket(stationNum);

  // Scenario A: The target station already has a serving ticket
  if (existingTicket) {
    // Option 1 (Default): If dropping a ticket onto an occupied station, swap their stations
    if (ticket.status === "serving" && ticket.station) {
      await Promise.all([
        assignStation(ticket.id, stationNum),
        assignStation(existingTicket.id, Number(ticket.station)),
      ]);
      return;
    }

    // Option 2: If dragging from waiting/on-hold to an occupied station, notify/prevent overwrite
    alert(
      `Station ${stationNum} is currently serving ticket #${existingTicket.ticketnumber}. Clear or complete it first.`,
    );
    return;
  }

  // Scenario B: Drop onto an empty target station
  await assignStation(ticket.id, stationNum);
};

/* ================= POLLING LOGIC ================= */
const startPolling = () => {
  if (pollInterval) return;
  pollInterval = setInterval(async () => {
    await fetchQueues();
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

const assignStation = async (ticketId, stationNum) => {
  if (!ticketId || !stationNum) return;

  await $fetch("/api/staff/call", {
    method: "POST",
    body: {
      id: ticketId,
      station: stationNum,
      status: "serving",
    },
  });

  await fetchQueues();
};

const recallTicket = async (ticketId, stationNum) => {
  if (!ticketId || !stationNum) return;

  // Triggers call endpoint to re-broadcast WebSocket / SSE notification for audio/display announcements
  await $fetch("/api/staff/call", {
    method: "POST",
    body: {
      id: ticketId,
      station: stationNum,
      status: "serving",
    },
  });
};

const holdTicket = async (id) => {
  if (!id) return;

  await $fetch("/api/staff/hold", {
    method: "POST",
    body: { id },
  });

  await fetchQueues();
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

/* ================= INIT & LIFECYCLE ================= */
onMounted(async () => {
  await fetchQueues();
  managePollingState();
});

onBeforeUnmount(() => {
  stopPolling();
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});
</script>
