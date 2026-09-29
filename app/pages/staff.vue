<template>
  <div v-if="staffStationView" class="ui-page max-w-5xl">
    <!-- Header Section -->
    <header
      class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
    >
      <div>
        <p
          class="text-[10px] font-bold uppercase tracking-wider text-emerald-700"
        >
          Staff station
        </p>
        <h1 class="ui-page-title mt-1">My tickets</h1>
        <p class="text-sm text-slate-500 mt-1">
          Only tickets assigned to your station are shown here.
        </p>
      </div>

      <div v-if="staffStation" class="text-left sm:text-right">
        <p
          class="text-[10px] uppercase tracking-wider font-bold text-slate-400"
        >
          Assigned station
        </p>
        <p class="text-lg font-black text-emerald-900">
          {{ staffStation.name }}
        </p>
        <p class="text-xs font-mono text-slate-500">
          Station {{ staffStation.code }}
        </p>
      </div>

      <button
        v-if="notificationsSupported && notificationPermission !== 'granted'"
        type="button"
        @click="requestNotificationPermission"
        class="h-8 px-2.5 bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100 rounded-lg text-[11px] font-semibold transition-colors"
      >
        Enable alerts
      </button>
    </header>

    <!-- Feedback Banner -->
    <div
      v-if="staffError || staffSuccess"
      :class="[
        'rounded-xl border px-4 py-3 text-sm transition-all',
        staffError
          ? 'bg-rose-50 border-rose-200 text-rose-700'
          : 'bg-emerald-50 border-emerald-200 text-emerald-700',
      ]"
      role="status"
    >
      {{ staffError || staffSuccess }}
    </div>

    <!-- Assigned Tickets Section -->
    <section
      class="bg-white border border-slate-200 rounded-2xl overflow-hidden"
    >
      <div
        class="px-5 py-4 border-b border-slate-100 flex items-center justify-between"
      >
        <h2 class="font-bold text-slate-900">Assigned tickets</h2>
        <div class="flex items-center gap-3 text-xs text-slate-400">
          <span>{{ staffServingTickets.length }} serving</span>
          <span>{{ staffOnHoldTickets.length }} on hold</span>
        </div>
      </div>

      <!-- State: Loading -->
      <div v-if="staffLoading" class="p-10 text-center text-sm text-slate-400">
        Loading station tickets...
      </div>

      <!-- State: No Station Assigned -->
      <div v-else-if="!staffStation" class="p-10 text-center">
        <p class="text-sm font-semibold text-slate-700">No station assigned</p>
        <p class="text-xs text-slate-400 mt-1">
          Ask an administrator to assign a station to your account.
        </p>
      </div>

      <!-- State: Empty Tickets -->
      <div v-else-if="!staffTickets.length" class="p-10 text-center">
        <p class="text-sm font-semibold text-slate-700">No assigned tickets</p>
        <p class="text-xs text-slate-400 mt-1">
          Tickets assigned to {{ staffStation.name }} will appear here.
        </p>
      </div>

      <!-- State: Ticket Lists -->
      <div v-else class="flex flex-col">
        <!-- Serving Tickets -->
        <div
          v-if="staffServingTickets.length"
          class="order-1 divide-y divide-slate-100"
        >
          <div class="px-5 py-3 bg-emerald-50/60">
            <h3
              class="text-xs font-bold uppercase tracking-wider text-emerald-800"
            >
              Serving tickets
            </h3>
          </div>
          <article
            v-for="ticket in staffServingTickets"
            :key="ticket.id"
            class="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div class="flex items-center gap-4 min-w-0">
              <div
                class="min-w-[92px] px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-center font-mono font-black text-xl text-emerald-900"
              >
                {{ ticket.ticketnumber }}
              </div>
              <div class="min-w-0">
                <h3 class="font-bold text-slate-800 truncate">
                  {{ ticket.fullname || "No Name Provided" }}
                </h3>
                <p class="text-xs text-slate-500 mt-1 truncate">
                  {{ ticket.servicetype }}
                </p>
              </div>
            </div>

            <div
              class="flex flex-col sm:flex-row sm:items-center gap-2 sm:shrink-0"
            >
              <div
                v-if="isIdProcessing(ticket.servicetype)"
                class="flex flex-col gap-1 w-full sm:w-52"
              >
                <input
                  v-model="idPictureMap[ticket.id]"
                  type="text"
                  placeholder="ID picture filename"
                  class="h-9 text-xs px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 w-full transition-all"
                />
              </div>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="skipTicket(ticket)"
                  :disabled="staffUpdating === ticket.id"
                  class="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 disabled:opacity-50 transition-colors"
                >
                  Skip
                </button>
                <button
                  type="button"
                  @click="updateStaffTicket(ticket, 'onhold')"
                  :disabled="staffUpdating === ticket.id"
                  class="px-4 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs font-semibold hover:bg-amber-100 disabled:opacity-50 transition-colors"
                >
                  On hold
                </button>
                <button
                  type="button"
                  @click="updateStaffTicket(ticket, 'done')"
                  :disabled="staffUpdating === ticket.id"
                  class="px-4 py-2 rounded-xl bg-[#003300] text-white text-xs font-semibold hover:bg-emerald-900 disabled:opacity-50 transition-colors"
                >
                  Mark done
                </button>
              </div>
            </div>
          </article>
        </div>

        <!-- On-Hold Tickets -->
        <div
          v-if="staffOnHoldTickets.length"
          class="order-2 border-b border-slate-100 divide-y divide-slate-100"
        >
          <div class="px-5 py-3 bg-amber-50/60">
            <h3
              class="text-xs font-bold uppercase tracking-wider text-amber-800"
            >
              On-hold tickets assigned to you
            </h3>
          </div>
          <article
            v-for="ticket in staffOnHoldTickets"
            :key="ticket.id"
            class="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div class="flex items-center gap-4 min-w-0">
              <div
                class="min-w-[92px] px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-center font-mono font-black text-xl text-amber-900"
              >
                {{ ticket.ticketnumber }}
              </div>
              <div class="min-w-0">
                <h3 class="font-bold text-slate-800 truncate">
                  {{ ticket.fullname || "No Name Provided" }}
                </h3>
                <p class="text-xs text-slate-500 mt-1 truncate">
                  {{ ticket.servicetype }}
                </p>
              </div>
            </div>
            <button
              type="button"
              @click="updateStaffTicket(ticket, 'serving')"
              :disabled="staffUpdating === ticket.id"
              class="px-4 py-2 rounded-xl bg-[#003300] text-white text-xs font-semibold hover:bg-emerald-900 disabled:opacity-50 transition-colors"
            >
              Serve ticket
            </button>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";

definePageMeta({
  middleware: [
    () => {
      const { status } = useAuth();
      if (status.value === "unauthenticated") {
        return navigateTo("/login");
      }
    },
  ],
});

// Authentication & Core State
const { data: authData } = useAuth();

const staffStationView = ref(true);
const staffStation = ref(null);
const staffTickets = ref([]);
const staffLoading = ref(true);
const staffUpdating = ref(null);
const staffError = ref("");
const staffSuccess = ref("");

const idPictureMap = reactive({});
const staffKnownTicketIds = ref(new Set());
const staffHasLoadedTickets = ref(false);

// Browser Notifications State
const notificationsSupported = ref(false);
const notificationPermission = ref("default");
let staffEventSource = null;

// Computeds
const staffServingTickets = computed(() =>
  staffTickets.value.filter((ticket) => ticket.status === "serving"),
);

const staffOnHoldTickets = computed(() =>
  staffTickets.value
    .filter((ticket) => ticket.status === "onhold")
    .sort((a, b) => Number(b.id) - Number(a.id)),
);

// Helpers
const isIdProcessing = (serviceType) =>
  serviceType?.toLowerCase().includes("id processing");

const authHeaders = computed(() => ({
  Authorization: `Bearer session-token-${authData.value?.id}`,
}));

// Notification Actions
const requestNotificationPermission = async () => {
  if (typeof window !== "undefined" && "Notification" in window) {
    const permission = await Notification.requestPermission();
    notificationPermission.value = permission;
  }
};

const showStaffTicketNotification = (ticket) => {
  if (
    !notificationsSupported.value ||
    notificationPermission.value !== "granted"
  ) {
    return;
  }

  const notification = new Notification(
    `Ticket ${ticket.ticketnumber} assigned`,
    {
      body: `${ticket.fullname || "Client"} - ${ticket.servicetype || "Service"}`,
      tag: `staff-ticket-${ticket.id}`,
    },
  );

  notification.onclick = () => {
    window.focus();
    notification.close();
    navigateTo("/staff");
  };
};

// API Interactions
const fetchStaffTickets = async () => {
  staffLoading.value = true;
  staffError.value = "";

  try {
    const response = await $fetch("/api/staff/tickets", {
      headers: authHeaders.value,
    });

    staffStation.value = response.station;
    const nextTickets = response.tickets || [];

    if (staffHasLoadedTickets.value) {
      const newTickets = nextTickets.filter(
        (ticket) =>
          !staffKnownTicketIds.value.has(ticket.id) &&
          ticket.status === "serving",
      );
      newTickets.forEach(showStaffTicketNotification);
    }

    staffKnownTicketIds.value = new Set(nextTickets.map((t) => t.id));
    staffHasLoadedTickets.value = true;
    staffTickets.value = nextTickets;
  } catch (error) {
    staffError.value =
      error?.data?.statusMessage || "Unable to load station tickets.";
  } finally {
    staffLoading.value = false;
  }
};

const skipTicket = async (ticket) => {
  if (!ticket?.id) return;

  const confirmed = confirm(
    `Are you sure you want to skip ticket #${ticket.ticketnumber}?`,
  );
  if (!confirmed) return;

  staffUpdating.value = ticket.id;
  staffError.value = "";
  staffSuccess.value = "";

  try {
    await $fetch("/api/staff/cancel", {
      method: "POST",
      headers: authHeaders.value,
      body: { id: ticket.id, status: "skipped" },
    });

    if (idPictureMap[ticket.id]) {
      delete idPictureMap[ticket.id];
    }

    staffSuccess.value = `Ticket ${ticket.ticketnumber} was skipped.`;
    await fetchStaffTickets();
  } catch (error) {
    staffError.value =
      error?.data?.statusMessage || "Unable to skip this ticket.";
  } finally {
    staffUpdating.value = null;
  }
};

const updateStaffTicket = async (ticket, nextStatus) => {
  staffUpdating.value = ticket.id;
  staffError.value = "";
  staffSuccess.value = "";

  try {
    if (nextStatus === "done" && isIdProcessing(ticket.servicetype)) {
      const filename = (idPictureMap[ticket.id] || "").trim();
      if (!filename) {
        staffError.value =
          "Please enter the ID picture filename before marking this ticket as done.";
        return;
      }

      await $fetch("/api/staff/done", {
        method: "POST",
        headers: authHeaders.value,
        body: {
          id: ticket.id,
          id_picture_filename: filename,
        },
      });

      delete idPictureMap[ticket.id];
    } else {
      await $fetch("/api/staff/ticket-action", {
        method: "POST",
        headers: authHeaders.value,
        body: { ticketId: ticket.id, status: nextStatus },
      });
    }

    const messages = {
      done: `Ticket ${ticket.ticketnumber} was marked done.`,
      serving: `Ticket ${ticket.ticketnumber} is now serving.`,
      onhold: `Ticket ${ticket.ticketnumber} was placed on hold.`,
    };
    staffSuccess.value = messages[nextStatus] || "Ticket updated.";

    await fetchStaffTickets();
  } catch (error) {
    staffError.value =
      error?.data?.statusMessage || "Unable to update this ticket.";
  } finally {
    staffUpdating.value = null;
  }
};

// Lifecycle Hooks
onMounted(async () => {
  if (typeof window !== "undefined" && "Notification" in window) {
    notificationsSupported.value = true;
    notificationPermission.value = Notification.permission;
  }

  await fetchStaffTickets();

  if (typeof window !== "undefined") {
    staffEventSource = new EventSource("/api/queue/events");
    staffEventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data.heartbeat && !data.connected) fetchStaffTickets();
      } catch (error) {
        console.error("Failed to process queue update:", error);
      }
    };
  }
});

onBeforeUnmount(() => {
  if (staffEventSource) {
    staffEventSource.close();
    staffEventSource = null;
  }
});
</script>
