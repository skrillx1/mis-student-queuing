<template>
  <div class="min-h-screen bg-[#0a210f] text-white p-6">
    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-yellow-500">Staff Queue Control</h1>

      <div class="flex items-center gap-2">
        <!-- FILTER -->
        <select v-model="filters.type" class="input">
          <option value="active">All (Serving + Waiting)</option>
          <option value="done">Done</option>
        </select>

        <input
          v-model="filters.search"
          placeholder="Search name..."
          class="input"
        />
        <input type="date" v-model="filters.date" class="input" />

        <button @click="fetchQueues" class="btn-yellow">Apply</button>
        <button @click="fetchQueues" class="btn-muted">Refresh</button>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <!-- LEFT: QUEUE LIST -->
      <div class="col-span-2 panel">
        <h2 class="font-bold mb-3">Queue List</h2>

        <!-- ACTIVE VIEW -->
        <template v-if="filters.type === 'active'">
          <!-- SERVING -->
          <div v-if="servingQueues.length">
            <p class="section-title text-green-400">Now Serving</p>

            <div
              v-for="q in servingQueues"
              :key="q.id"
              class="queue-item border border-green-500/30"
            >
              <div>
                <p class="text-xs text-green-400">serving</p>
                <p class="font-bold text-yellow-400">{{ q.ticketnumber }}</p>
                <p class="text-xs text-slate-400">
                  {{ q.fullname }} • {{ q.servicetype }}
                </p>
              </div>
            </div>
          </div>

          <!-- SEPARATOR -->
          <div v-if="waitingQueues.length" class="divider"></div>

          <!-- WAITING -->
          <div v-if="waitingQueues.length">
            <p class="section-title text-yellow-400">Waiting List</p>

            <div v-for="q in waitingQueues" :key="q.id" class="queue-item">
              <div>
                <p class="text-xs text-yellow-400">waiting</p>
                <p class="font-bold text-yellow-400">{{ q.ticketnumber }}</p>
                <p class="text-xs text-slate-400">
                  {{ q.fullname }} • {{ q.servicetype }}
                </p>
              </div>

              <div class="flex gap-2">
                <button @click="markDone(q.ticketnumber)" class="btn-gray">
                  Done
                </button>

                <button @click="callTicket(q.ticketnumber)" class="btn-yellow">
                  Call
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- DONE VIEW -->
        <template v-else>
          <p class="section-title text-gray-400">Completed</p>

          <div
            v-for="q in doneQueues"
            :key="q.id"
            class="queue-item opacity-60"
          >
            <div>
              <p class="text-xs text-gray-400">done</p>
              <p class="font-bold text-yellow-400">{{ q.ticketnumber }}</p>
              <p class="text-xs text-slate-400">
                {{ q.fullname }} • {{ q.servicetype }}
              </p>
            </div>
          </div>
        </template>
      </div>

      <!-- RIGHT: CONTROL PANEL -->
      <div class="panel space-y-4">
        <h2 class="font-bold">Controls</h2>

        <div class="p-4 bg-black/30 rounded-xl">
          <p class="text-xs text-slate-400">Now Serving</p>
          <p class="text-3xl font-black text-yellow-500">
            {{ current }}
          </p>
        </div>

        <button @click="nextTicket" class="btn-green">NEXT</button>

        <button @click="recallTicket" class="btn-orange">RECALL</button>

        <input
          v-model="manual"
          placeholder="Enter ticket (001)"
          class="input w-full"
        />

        <button @click="callManual" class="btn-yellow w-full">
          CALL MANUAL
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";

/* ================= STATE ================= */
const queues = ref([]);
const current = ref("---");
const manual = ref("");
const lastCalled = ref(null);

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
  queues.value.filter((q) => q.status === "waiting"),
);

const doneQueues = computed(() =>
  queues.value.filter((q) => q.status === "done"),
);

/* ================= API ================= */
const fetchQueues = async () => {
  const res = await $fetch("/api/staff/queues", {
    query: { ...filters },
  });

  queues.value = res;
};

const callTicket = async (ticket) => {
  if (!ticket) return;

  const res = await $fetch("/api/staff/call", {
    method: "POST",
    body: { ticket },
  });

  current.value = res.current;
  lastCalled.value = ticket;
};

const nextTicket = async () => {
  const res = await $fetch("/api/staff/next", {
    method: "POST",
  });

  current.value = res.current;
  fetchQueues();
};

const recallTicket = async () => {
  if (!current.value || current.value === "---") return;
  await callTicket(current.value);
};

const callManual = async () => {
  if (!manual.value.trim()) return;

  await callTicket(manual.value);
  manual.value = "";
};

const markDone = async (ticket) => {
  await $fetch("/api/staff/done", {
    method: "POST",
    body: { ticket },
  });

  fetchQueues();
};

/* ================= INIT ================= */
onMounted(fetchQueues);
</script>

<style scoped>
.input {
  @apply p-2 bg-black/40 rounded border border-white/10;
}

.panel {
  @apply bg-white/5 p-4 rounded-2xl border border-white/10;
}

.queue-item {
  @apply flex justify-between items-center p-3 bg-black/30 rounded-xl mb-2;
}

.section-title {
  @apply text-xs uppercase mb-2 tracking-widest;
}

.divider {
  @apply my-4 border-t border-white/10;
}

.btn-yellow {
  @apply px-3 py-2 bg-yellow-500 text-black rounded-lg font-bold;
}

.btn-green {
  @apply w-full py-3 bg-green-500 text-black font-bold rounded-xl;
}

.btn-orange {
  @apply w-full py-3 bg-orange-500 text-black font-bold rounded-xl;
}

.btn-gray {
  @apply px-3 py-2 bg-gray-500 rounded-lg;
}

.btn-muted {
  @apply px-3 py-2 bg-white/10 rounded-xl;
}
</style>
