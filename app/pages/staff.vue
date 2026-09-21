<template>
  <div v-if="staffStationView" class="max-w-5xl mx-auto space-y-6">
    <div
      class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
    >
      <div>
        <p
          class="text-[10px] font-bold uppercase tracking-wider text-emerald-700"
        >
          Staff station
        </p>
        <h1 class="text-2xl font-bold text-slate-900 mt-1">My tickets</h1>
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
    </div>
    <div
      v-if="staffError || staffSuccess"
      :class="[
        'rounded-xl border px-4 py-3 text-sm',
        staffError
          ? 'bg-rose-50 border-rose-200 text-rose-700'
          : 'bg-emerald-50 border-emerald-200 text-emerald-700',
      ]"
      role="status"
    >
      {{ staffError || staffSuccess }}
    </div>
    <section
      class="bg-white border border-slate-200 rounded-2xl overflow-hidden"
    >
      <div
        class="px-5 py-4 border-b border-slate-100 flex items-center justify-between"
      >
        <h2 class="font-bold text-slate-900">Assigned tickets</h2>
        <span class="text-xs text-slate-400"
          >{{ staffTickets.length }} active</span
        >
      </div>
      <div v-if="staffLoading" class="p-10 text-center text-sm text-slate-400">
        Loading station tickets...
      </div>
      <div v-else-if="!staffStation" class="p-10 text-center">
        <p class="text-sm font-semibold text-slate-700">No station assigned</p>
        <p class="text-xs text-slate-400 mt-1">
          Ask an administrator to assign a station to your account.
        </p>
      </div>
      <div v-else-if="!staffTickets.length" class="p-10 text-center">
        <p class="text-sm font-semibold text-slate-700">No assigned tickets</p>
        <p class="text-xs text-slate-400 mt-1">
          Tickets assigned to {{ staffStation.name }} will appear here.
        </p>
      </div>
      <div v-else class="divide-y divide-slate-100">
        <article
          v-for="ticket in staffTickets"
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
              <span
                class="inline-flex mt-2 px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600"
                >{{ ticket.status }}</span
              >
            </div>
          </div>
          <div class="flex items-center gap-2 sm:shrink-0">
            <button
              type="button"
              @click="updateStaffTicket(ticket, 'onhold')"
              :disabled="staffUpdating === ticket.id"
              class="px-4 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs font-semibold hover:bg-amber-100 disabled:opacity-50"
            >
              On hold
            </button>
            <button
              type="button"
              @click="updateStaffTicket(ticket, 'done')"
              :disabled="staffUpdating === ticket.id"
              class="px-4 py-2 rounded-xl bg-[#003300] text-white text-xs font-semibold hover:bg-emerald-900 disabled:opacity-50"
            >
              Mark done
            </button>
          </div>
        </article>
      </div>
    </section>
  </div>

  <div v-else>
    <!-- COMPACT CONTROLS BAR -->
    <header
      class="flex justify-end items-center gap-2 mb-3 bg-white px-3 py-2 rounded-xl border border-slate-200/80 shadow-xs"
    >
      <!-- FILTERS & NOTIFICATION CONTROLS -->
      <div class="flex flex-wrap items-center justify-end gap-2 w-full">
        <!-- NOTIFICATION SOUND TOGGLE -->
        <button
          @click="isMuted = !isMuted"
          type="button"
          :title="isMuted ? 'Unmute queue alerts' : 'Mute queue alerts'"
          :class="[
            'h-8 px-2.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer',
            isMuted
              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
          ]"
        >
          <svg
            v-if="!isMuted"
            class="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
          <svg
            v-else
            class="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          </svg>
          <span>{{ isMuted ? "Sound Off" : "Sound On" }}</span>
        </button>

        <!-- DESKTOP NOTIFICATION PERMISSION TOGGLE -->
        <button
          v-if="notificationsSupported && notificationPermission !== 'granted'"
          @click="requestNotificationPermission"
          type="button"
          title="Enable desktop notifications"
          class="h-8 px-2.5 bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <svg
            class="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span>Enable Alerts</span>
        </button>

        <input
          type="date"
          v-model="filters.date"
          class="h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all cursor-pointer"
        />
      </div>
    </header>

    <!-- STATIONS HEADER DROP ZONES (SERVING TICKETS HERE) -->
    <section class="mb-3">
      <div class="flex items-center justify-between mb-2">
        <h2 class="font-bold text-slate-800 text-xs uppercase tracking-wider">
          Counter Stations (Drag Ticket to Assign Station)
        </h2>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        <div
          v-for="station in sortedStations"
          :key="station.code"
          :draggable="!!getStationTicket(station.code)"
          @dragstart="
            getStationTicket(station.code) &&
            onDragStart($event, getStationTicket(station.code))
          "
          @dragover.prevent="onDragOver($event, station.code)"
          @dragleave="onDragLeave(station.code)"
          @drop="onDrop($event, station.code)"
          :class="[
            'p-2.5 rounded-xl border transition-all flex flex-col justify-between min-h-[104px]',
            getStationTicket(station.code)
              ? 'cursor-grab active:cursor-grabbing'
              : '',
            activeStationHover === station.code
              ? 'border-dashed border-emerald-500 bg-emerald-100/70 scale-[1.02]'
              : getStationTicket(station.code)
                ? 'border-solid border-emerald-600/40 bg-emerald-50/50 shadow-xs'
                : 'border-dashed border-slate-200 bg-slate-50/60',
          ]"
        >
          <div class="flex items-center justify-between w-full">
            <span
              class="text-[10px] font-black uppercase text-slate-500 tracking-wider truncate"
            >
              {{ station.name || `Station ${station.code}` }}
            </span>
            <span
              v-if="getStationTicket(station.code)"
              class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"
            ></span>
          </div>

          <div v-if="getStationTicket(station.code)" class="my-0.5">
            <div class="font-mono font-black text-xl text-emerald-950">
              {{ getStationTicket(station.code).ticketnumber }}
            </div>
            <div
              class="text-[10px] font-bold text-slate-700 truncate max-w-[130px]"
            >
              {{
                getStationTicket(station.code).fullname || "No Name Provided"
              }}
            </div>
          </div>

          <div v-else class="my-auto text-center py-2">
            <p class="text-[10px] font-medium text-slate-400">
              Drop ticket here
            </p>
          </div>

          <!-- STATION ACTIONS (ONLY RENDER IF A TICKET IS CURRENTLY SERVING) -->
          <div
            v-if="getStationTicket(station.code)"
            class="pt-1.5 border-t border-emerald-200/60 grid grid-cols-3 gap-1"
          >
            <!-- RECALL BUTTON -->
            <button
              @click="
                recallTicket(getStationTicket(station.code).id, station.code)
              "
              type="button"
              title="Re-announce ticket"
              class="inline-flex items-center justify-center gap-1 py-0.5 px-1 rounded-md text-[9px] font-bold text-sky-700 bg-sky-50 border border-sky-200/80 hover:bg-sky-600 hover:text-white hover:border-sky-600 active:scale-95 transition-all cursor-pointer shadow-2xs"
            >
              <svg
                class="w-3 h-3 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.2"
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.684A1.76 1.76 0 013 12c0-.97.784-1.76 1.76-1.76.31 0 .6.08.852.222"
                />
              </svg>
              <span>Recall</span>
            </button>

            <!-- HOLD BUTTON -->
            <button
              @click="holdTicket(getStationTicket(station.code).id)"
              type="button"
              title="Put ticket on hold"
              class="inline-flex items-center justify-center gap-1 py-0.5 px-1 rounded-md text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 hover:bg-amber-600 hover:text-white hover:border-amber-600 active:scale-95 transition-all cursor-pointer shadow-2xs"
            >
              <svg
                class="w-3 h-3 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.2"
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Hold</span>
            </button>

            <!-- DONE BUTTON -->
            <button
              @click="markDone(getStationTicket(station.code).id)"
              type="button"
              title="Complete ticket session"
              class="inline-flex items-center justify-center gap-1 py-0.5 px-1 rounded-md text-[9px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300/80 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 active:scale-95 transition-all cursor-pointer shadow-2xs"
            >
              <svg
                class="w-3 h-3 shrink-0"
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
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- MAIN QUEUE WORKSPACE -->
    <div
      class="bg-white rounded-xl p-3 sm:p-4 border border-slate-200/80 shadow-xs relative"
    >
      <div
        class="flex justify-between items-center mb-3 pb-2 border-b border-slate-100"
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
            waitingQueues.length + onHoldQueues.length + servingQueues.length
          }}
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start min-h-0">
        <!-- WAITING TICKETS -->
        <section class="min-w-0">
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-2 border-b border-slate-100"
          >
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              <p class="text-sm font-bold text-slate-800">Waiting list</p>
            </div>
            <p class="text-xs font-medium text-slate-400">
              {{ waitingQueues.length }}
              {{ waitingQueues.length === 1 ? "ticket" : "tickets" }} awaiting
              assignment
            </p>
          </div>

          <div
            v-if="!waitingQueues.length"
            class="text-center py-12 px-4 mt-3 bg-slate-50/50 rounded-xl border border-dashed border-slate-200"
          >
            <p class="text-sm font-semibold text-slate-600">
              No waiting tickets
            </p>
            <p class="text-xs text-slate-400 mt-1">
              New tickets will appear here.
            </p>
          </div>

          <div
            v-else
            class="max-h-96 lg:max-h-[calc(100vh-24rem)] min-h-0 overflow-y-auto pr-1 custom-scrollbar"
          >
            <div class="divide-y divide-slate-100">
              <div
                v-for="q in waitingQueues"
                :key="q.id"
                draggable="true"
                @dragstart="onDragStart($event, q)"
                @dragend="onDragEnd"
                :class="[
                  'group flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 first:pt-2 last:pb-2 cursor-grab active:cursor-grabbing transition-all duration-200',
                  draggingTicketId === q.id
                    ? 'relative z-10 my-1 rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-md ring-1 ring-emerald-100'
                    : 'hover:bg-slate-50/70',
                ]"
              >
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    class="flex items-center justify-center bg-amber-50 text-amber-900 border border-amber-200/70 font-mono font-bold text-base tracking-wide px-3 py-2 rounded-lg min-w-[76px]"
                  >
                    {{ q.ticketnumber }}
                  </div>
                  <div class="min-w-0">
                    <h3 class="font-semibold text-slate-800 text-sm truncate">
                      {{ q.fullname || "No Name" }}
                    </h3>
                    <p class="text-xs text-slate-500 mt-0.5 truncate">
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
                    placeholder="ID picture filename"
                    class="h-9 text-xs px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-full sm:w-48 transition-all"
                  />
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2 justify-end">
                  <button
                    @click="rejectTicket(q.id)"
                    class="h-8 px-3 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-lg font-medium text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ON HOLD DROP ZONE -->
        <section
          class="min-w-0 rounded-xl border transition-all duration-200"
          :class="[
            queueDropTarget === 'onhold'
              ? 'border-orange-300 bg-orange-50/70 ring-2 ring-orange-200/70'
              : 'border-slate-100 bg-slate-50/30',
          ]"
          @dragover.prevent="onQueueDragOver('onhold')"
          @dragleave="onQueueDragLeave('onhold')"
          @drop="onDropOnHold"
        >
          <div class="flex items-center justify-between gap-2 p-4 pb-2">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-500"></span>
              <p class="text-sm font-bold text-slate-800">On-hold tickets</p>
            </div>
            <span class="text-xs font-medium text-slate-400">{{
              onHoldQueues.length
            }}</span>
          </div>
          <p class="px-4 pb-3 text-xs text-slate-400">
            Drag a ticket here to place it on hold.
          </p>
          <div
            v-if="!onHoldQueues.length"
            class="text-center py-12 px-4 mx-3 mb-3 bg-white/70 rounded-xl border border-dashed border-slate-200"
          >
            <p class="text-sm font-medium text-slate-500">No tickets on hold</p>
          </div>

          <div
            v-else
            class="max-h-96 lg:max-h-[calc(100vh-24rem)] min-h-0 overflow-y-auto custom-scrollbar"
          >
            <div>
              <div
                v-for="q in onHoldQueues"
                :key="q.id"
                draggable="true"
                @dragstart="onDragStart($event, q)"
                @dragend="onDragEnd"
                class="mx-3 flex items-center justify-between gap-3 p-3.5 border-b border-slate-200/70 last:border-b-0 cursor-grab active:cursor-grabbing"
              >
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    class="flex items-center justify-center bg-orange-50 text-orange-900 border border-orange-200/60 font-mono font-bold text-base tracking-wide px-3 py-2 rounded-lg min-w-[76px]"
                  >
                    {{ q.ticketnumber }}
                  </div>
                  <div class="min-w-0">
                    <h3 class="font-semibold text-slate-800 text-sm truncate">
                      {{ q.fullname || "No Name" }}
                    </h3>
                    <p class="text-xs text-slate-500 mt-0.5 truncate">
                      {{ q.servicetype }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2 justify-end">
                  <button
                    @click="markDone(q.id)"
                    class="h-8 px-3 bg-white hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 rounded-lg font-medium text-xs transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- VISUAL TOAST NOTIFICATION CONTAINER -->
    <Transition
      enter-active-class="transition transform duration-300 ease-out"
      enter-from-class="translate-y-5 opacity-0 scale-95"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition transform duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100 scale-100"
      leave-to-class="translate-y-5 opacity-0 scale-95"
    >
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-900 text-white p-4 rounded-2xl shadow-xl border border-emerald-700/50 max-w-sm"
      >
        <div class="p-2 bg-emerald-800 rounded-xl shrink-0 text-amber-400">
          <svg
            class="w-6 h-6 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
        <div class="flex-1 pr-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-amber-400">
            New Ticket Joined
          </h4>
          <p class="text-sm font-extrabold font-mono text-white mt-0.5">
            #{{ toast.ticketnumber }} - {{ toast.fullname }}
          </p>
          <p class="text-[11px] text-emerald-200 truncate">
            {{ toast.servicetype }}
          </p>
        </div>
        <button
          @click="toast.show = false"
          class="text-emerald-300 hover:text-white p-1 rounded-lg transition-colors"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </Transition>
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

// ================ AUTHENTICATION CHECK =================
const { status, data: authData } = useAuth();

const staffStationView = ref(true);
const staffStation = ref(null);
const staffTickets = ref([]);
const staffLoading = ref(true);
const staffUpdating = ref(null);
const staffError = ref("");
const staffSuccess = ref("");

const fetchStaffTickets = async () => {
  staffLoading.value = true;
  staffError.value = "";
  try {
    const response = await $fetch("/api/staff/tickets", {
      headers: {
        Authorization: `Bearer session-token-${authData.value?.id}`,
      },
    });
    staffStation.value = response.station;
    staffTickets.value = response.tickets || [];
  } catch (error) {
    staffError.value =
      error?.data?.statusMessage || "Unable to load station tickets.";
  } finally {
    staffLoading.value = false;
  }
};

const updateStaffTicket = async (ticket, nextStatus) => {
  staffUpdating.value = ticket.id;
  staffError.value = "";
  staffSuccess.value = "";
  try {
    await $fetch("/api/staff/ticket-action", {
      method: "POST",
      headers: {
        Authorization: `Bearer session-token-${authData.value?.id}`,
      },
      body: { ticketId: ticket.id, status: nextStatus },
    });
    staffSuccess.value =
      nextStatus === "done"
        ? `Ticket ${ticket.ticketnumber} was marked done.`
        : `Ticket ${ticket.ticketnumber} was placed on hold.`;
    await fetchStaffTickets();
  } catch (error) {
    staffError.value =
      error?.data?.statusMessage || "Unable to update this ticket.";
  } finally {
    staffUpdating.value = null;
  }
};

let staffRefreshTimer = null;
onMounted(async () => {
  await fetchStaffTickets();
  staffRefreshTimer = setInterval(fetchStaffTickets, 5000);
});
onBeforeUnmount(() => {
  if (staffRefreshTimer) clearInterval(staffRefreshTimer);
});

definePageMeta({
  middleware: [
    async (to) => {
      const { status } = useAuth();

      // If unauthenticated, redirect to login page
      if (status.value === "unauthenticated") {
        return navigateTo("/login");
      }
    },
  ],
});

/* ================= STATE & SERVER DATA ================= */
const queues = ref([]);
const idPictureMap = reactive({});
const activeStationHover = ref(null);
const draggingTicketId = ref(null);
const queueDropTarget = ref(null);

// Fetch stations dynamic array using server endpoint
const { data: stations } = await useAsyncData("stations", () =>
  $fetch("/api/stations"),
);

// Sort stations numerically by code (1, 2, 3...)
const sortedStations = computed(() => {
  if (!stations.value || !Array.isArray(stations.value)) return [];
  return [...stations.value].sort((a, b) => Number(a.code) - Number(b.code));
});

// Notification and audio settings
const isMuted = ref(false);
const notificationsSupported = ref(false);
const notificationPermission = ref("default");
const previousQueueIds = ref(new Set());
const isInitialLoad = ref(true);

const toast = reactive({
  show: false,
  ticketnumber: "",
  fullname: "",
  servicetype: "",
});

let toastTimeout = null;
let pollInterval = null;
const filters = reactive({
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

/* ================= NOTIFICATION & AUDIO HELPER ================= */
const playChimeSound = () => {
  if (isMuted.value) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playNote = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + startTime + duration,
      );

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    playNote(587.33, 0, 0.25); // D5
    playNote(880, 0.15, 0.4); // A5
  } catch {
    // Graceful fallback
  }
};

const requestNotificationPermission = async () => {
  if ("Notification" in window) {
    const permission = await Notification.requestPermission();
    notificationPermission.value = permission;
  }
};

const triggerNewQueueNotification = (ticket) => {
  playChimeSound();

  toast.ticketnumber = ticket.ticketnumber;
  toast.fullname = ticket.fullname || "New Client";
  toast.servicetype = ticket.servicetype || "General Service";
  toast.show = true;

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.show = false;
  }, 5000);

  if (
    notificationsSupported.value &&
    notificationPermission.value === "granted"
  ) {
    new Notification(`New Ticket #${ticket.ticketnumber}`, {
      body: `${ticket.fullname || "Client"} - ${ticket.servicetype}`,
      icon: "/favicon.ico",
    });
  }
};

/* ================= HELPER FUNCTIONS ================= */
const isIdProcessing = (serviceType) => {
  return serviceType?.toLowerCase().includes("id processing");
};

// Returns ticket assigned to station.code
const getStationTicket = (stationCode) => {
  return servingQueues.value.find(
    (q) => String(q.station) === String(stationCode),
  );
};

/* ================= DRAG & DROP HANDLERS ================= */
const onDragStart = (event, ticket) => {
  draggingTicketId.value = ticket.id;
  event.dataTransfer.setData("text/plain", JSON.stringify(ticket));
  event.dataTransfer.effectAllowed = "move";
};

const onDragEnd = () => {
  draggingTicketId.value = null;
  queueDropTarget.value = null;
};

const onQueueDragOver = (target) => {
  queueDropTarget.value = target;
};

const onQueueDragLeave = (target) => {
  if (queueDropTarget.value === target) queueDropTarget.value = null;
};

const onDropOnHold = async (event) => {
  queueDropTarget.value = null;
  const rawData = event.dataTransfer.getData("text/plain");
  if (!rawData) return;

  const ticket = JSON.parse(rawData);
  if (ticket.status === "onhold") return;

  await holdTicket(ticket.id);
};

const onDragOver = (event, stationCode) => {
  activeStationHover.value = stationCode;
};

const onDragLeave = (stationCode) => {
  if (activeStationHover.value === stationCode) {
    activeStationHover.value = null;
  }
};

const onDrop = async (event, stationCode) => {
  activeStationHover.value = null;
  const rawData = event.dataTransfer.getData("text/plain");
  if (!rawData) return;

  const ticket = JSON.parse(rawData);

  if (
    ticket.status === "serving" &&
    String(ticket.station) === String(stationCode)
  ) {
    return;
  }

  const existingTicket = getStationTicket(stationCode);

  if (existingTicket) {
    if (ticket.status === "serving" && ticket.station) {
      await Promise.all([
        assignStation(ticket.id, stationCode),
        assignStation(existingTicket.id, ticket.station),
      ]);
      return;
    }

    alert(
      `Station ${stationCode} is currently serving ticket #${existingTicket.ticketnumber}. Clear or complete it first.`,
    );
    return;
  }

  await assignStation(ticket.id, stationCode);
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

/* ================= WATCHERS ================= */
watch(
  () => filters.date,
  () => {
    fetchQueues();
  },
);

/* ================= API ACTIONS ================= */
const fetchQueues = async () => {
  const res = await $fetch("/api/staff/queues", {
    query: { date: filters.date },
  });

  const incomingQueues = res || [];

  if (!isInitialLoad.value) {
    const freshWaiting = incomingQueues.filter(
      (q) => q.status === "waiting" && !previousQueueIds.value.has(q.id),
    );

    if (freshWaiting.length > 0) {
      triggerNewQueueNotification(freshWaiting[freshWaiting.length - 1]);
    }
  }

  previousQueueIds.value = new Set(incomingQueues.map((q) => q.id));
  isInitialLoad.value = false;

  queues.value = incomingQueues;
};

const assignStation = async (ticketId, stationCode) => {
  if (!ticketId || !stationCode) return;

  await $fetch("/api/staff/call", {
    method: "POST",
    body: {
      id: ticketId,
      station: stationCode,
      status: "serving",
    },
  });

  await fetchQueues();
};

const recallTicket = async (ticketId, stationCode) => {
  if (!ticketId || !stationCode) return;

  await $fetch("/api/staff/call", {
    method: "POST",
    body: {
      id: ticketId,
      station: stationCode,
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

const rejectTicket = async (id) => {
  if (!id) return;

  const confirmed = confirm(
    "Are you sure you want to cancel/reject this waiting ticket?",
  );
  if (!confirmed) return;

  await $fetch("/api/staff/cancel", {
    method: "POST",
    body: { id, status: "rejected" },
  });

  if (idPictureMap[id]) {
    delete idPictureMap[id];
  }

  await fetchQueues();
};

/* ================= INIT & LIFECYCLE ================= */
onMounted(async () => {
  if (typeof window !== "undefined" && "Notification" in window) {
    notificationsSupported.value = true;
    notificationPermission.value = Notification.permission;
  }

  await fetchQueues();
  startPolling();
});

onBeforeUnmount(() => {
  stopPolling();
  if (toastTimeout) clearTimeout(toastTimeout);
});
</script>
