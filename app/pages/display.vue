<template>
  <div
    class="min-h-screen h-screen bg-slate-50 text-slate-800 flex flex-col font-sans overflow-hidden relative select-none antialiased"
  >
    <!-- AMBIENT BACKGROUND LIGHT GLOWS -->
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-emerald-100/60 rounded-full blur-[100px] pointer-events-none"
    ></div>
    <div
      class="absolute -top-24 -right-24 w-[30vw] h-[30vh] bg-amber-100/50 rounded-full blur-[80px] pointer-events-none"
    ></div>

    <!-- LIGHT MINIMALIST HEADER -->
    <header
      class="px-4 sm:px-8 py-3.5 sm:py-4 border-b border-emerald-900/10 bg-white/80 backdrop-blur-md flex justify-between items-center z-20 shrink-0 shadow-sm"
    >
      <!-- BRANDING -->
      <div class="flex items-center gap-2.5 sm:gap-4">
        <div
          class="h-8 sm:h-10 px-2.5 sm:px-4 bg-emerald-900 rounded-xl flex items-center justify-center shadow-sm"
        >
          <span
            class="text-xs sm:text-base font-black tracking-widest text-amber-400"
          >
            CSU
          </span>
        </div>
        <div>
          <h1
            class="text-sm sm:text-base md:text-lg font-bold tracking-tight uppercase leading-none text-emerald-950 flex items-center gap-1.5 sm:gap-2"
          >
            MIS
            <span class="text-emerald-700 font-extrabold">Queue System</span>
          </h1>
          <p
            class="text-[8px] sm:text-[9px] text-emerald-800/60 uppercase tracking-[0.2em] font-bold mt-0.5 sm:mt-1"
          >
            Management Information System
          </p>
        </div>
      </div>

      <!-- STATUS & CLOCK -->
      <div class="flex gap-3 sm:gap-6 items-center">
        <div
          class="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] sm:text-[11px] font-bold text-emerald-800 uppercase tracking-widest"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"
            ></span>
          </span>
          Live Display
        </div>
        <div class="h-5 w-px bg-slate-200 hidden sm:block"></div>
        <div class="text-right">
          <p
            class="text-lg sm:text-2xl font-mono font-bold text-emerald-950 leading-none tabular-nums tracking-tight"
          >
            {{ currentTime }}
          </p>
        </div>
      </div>
    </header>

    <!-- MAIN DISPLAY AREA (Perfect Centering Container) -->
    <main
      class="flex-grow flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 bg-transparent relative z-10 overflow-hidden min-h-0"
      aria-live="polite"
      aria-atomic="true"
    >
      <!-- SUBTLE WATERMARK -->
      <div
        class="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none"
      >
        <span
          class="text-[25vw] font-black italic tracking-tighter text-emerald-950"
        >
          CSU
        </span>
      </div>

      <!-- STATUS INDICATOR -->
      <div class="z-10 text-center mb-3 sm:mb-4 shrink-0">
        <div
          class="inline-flex items-center gap-2 px-3.5 sm:px-5 py-1 sm:py-1.5 rounded-full border border-emerald-800/15 bg-white/80 text-emerald-900 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] shadow-sm backdrop-blur-sm"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"
            ></span>
          </span>
          Active Stations
        </div>
      </div>

      <!-- AUTO-FITTING FLEX/GRID DISPLAY AREA -->
      <div
        v-if="isLoadingStations"
        class="z-10 my-auto text-center py-12 text-emerald-800/60 text-xs sm:text-sm animate-pulse font-bold tracking-widest uppercase"
      >
        Syncing Stations...
      </div>

      <div
        v-else-if="sortedStationList.length === 0"
        class="z-10 my-auto text-center py-12 text-slate-400 text-xs sm:text-sm font-semibold tracking-wide"
      >
        No active stations configured.
      </div>

      <!-- DYNAMIC AUTO-FIT CONTAINER -->
      <div
        v-else
        class="z-10 w-full max-w-7xl flex-grow flex items-center justify-center min-h-0 overflow-y-auto custom-scrollbar p-1"
      >
        <div
          class="w-full h-full max-h-full flex flex-wrap justify-center items-center content-center gap-4 sm:gap-6"
        >
          <!-- CARD ITEM -->
          <div
            v-for="station in sortedStationList"
            :key="station.code || station.id"
            class="auto-fit-card relative flex flex-col justify-between p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-300 backdrop-blur-md shadow-sm hover:shadow-md"
            :class="[
              activeStation === station.code
                ? 'bg-amber-500/10 border-amber-400/90 shadow-[0_0_25px_rgba(245,158,11,0.2)] scale-[1.02] ring-2 ring-amber-400/40'
                : 'bg-white/90 border-slate-200/80 hover:border-emerald-300',
            ]"
          >
            <!-- CARD HEADER -->
            <div
              class="flex items-center justify-between border-b border-slate-100 pb-2 shrink-0"
            >
              <span
                class="text-[11px] sm:text-xs md:text-sm font-extrabold uppercase tracking-wider truncate mr-2"
                :class="
                  activeStation === station.code
                    ? 'text-amber-800'
                    : 'text-emerald-900'
                "
              >
                {{ station.name || `Station ${station.code}` }}
              </span>
              <span
                v-if="activeStation === station.code && isNew"
                class="bg-amber-400 text-emerald-950 text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse shrink-0"
              >
                Called
              </span>
            </div>

            <!-- TICKET NUMBER (FLUID TYPE SCALING) -->
            <div
              class="my-auto py-2 text-center flex items-center justify-center flex-grow"
            >
              <Transition name="scale" mode="out-in">
                <span
                  :key="stationTickets[station.code]"
                  class="font-mono font-black tabular-nums tracking-tight leading-none text-ticket"
                  :class="
                    stationTickets[station.code] &&
                    stationTickets[station.code] !== '---'
                      ? 'text-emerald-800 drop-shadow-[0_2px_8px_rgba(6,78,59,0.15)]'
                      : 'text-slate-300'
                  "
                >
                  {{ stationTickets[station.code] || "---" }}
                </span>
              </Transition>
            </div>

            <!-- CARD FOOTER -->
            <div class="text-center pt-2 border-t border-slate-100 shrink-0">
              <span
                class="text-[9px] sm:text-[10px] md:text-xs font-extrabold uppercase tracking-widest"
                :class="
                  stationTickets[station.code] &&
                  stationTickets[station.code] !== '---'
                    ? 'text-amber-600'
                    : 'text-slate-400'
                "
              >
                {{
                  stationTickets[station.code] &&
                  stationTickets[station.code] !== "---"
                    ? "Now Serving"
                    : "Available"
                }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- FOOTER INSTRUCTION -->
      <div class="z-10 w-full max-w-sm sm:max-w-lg mx-auto mt-3 shrink-0">
        <div
          class="py-2.5 sm:py-3 px-4 sm:px-6 bg-white/90 border border-emerald-900/10 rounded-full text-center backdrop-blur-sm shadow-sm"
        >
          <p
            class="text-xs sm:text-sm text-slate-600 font-semibold tracking-wide"
          >
            Please proceed to your assigned
            <span class="text-emerald-800 font-extrabold">Station</span> when
            called.
          </p>
        </div>
      </div>
    </main>

    <!-- TICKER FOOTER -->
    <footer
      class="bg-emerald-900 text-emerald-100 py-2 sm:py-2.5 border-t border-emerald-950 overflow-hidden whitespace-nowrap z-20 shrink-0 shadow-inner"
    >
      <div
        class="inline-block animate-marquee font-bold uppercase tracking-widest text-[10px] sm:text-xs"
      >
        Welcome to CSU Management Information System • Claim Student ID •
        Reprinting ID • Institutional Email Concern • Watch screen for your
        ticket call •
      </div>
    </footer>

    <!-- AUDIO UNLOCK OVERLAY -->
    <Transition name="fade">
      <div
        v-if="!audioUnlocked"
        @click="unlockAudio"
        class="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        role="button"
        tabindex="0"
        aria-label="Tap to initialize display"
        @keydown.enter="unlockAudio"
        @keydown.space.prevent="unlockAudio"
      >
        <div
          class="text-center p-6 sm:p-8 max-w-xs sm:max-w-sm bg-white border border-slate-200 rounded-3xl shadow-2xl space-y-4"
        >
          <div
            class="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          </div>
          <div>
            <h2
              class="text-base sm:text-lg font-black text-emerald-950 tracking-tight"
            >
              CSU MIS DISPLAY
            </h2>
            <p class="text-slate-500 text-xs mt-1 font-medium">
              Tap anywhere to activate audio notifications.
            </p>
          </div>
          <div
            class="inline-block bg-emerald-900 hover:bg-emerald-800 text-white font-bold uppercase text-[10px] tracking-widest px-5 py-2.5 rounded-xl transition shadow-sm"
          >
            Launch Display
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

definePageMeta({ layout: false });

/* STATE MANAGEMENT */
const stationList = ref([]);
const stationTickets = ref({});
const isLoadingStations = ref(true);
const activeStation = ref(null);

const sortedStationList = computed(() => {
  return [...stationList.value].sort((a, b) => {
    const valA = parseInt(String(a.code || a.id).replace(/\D/g, ""), 10) || 0;
    const valB = parseInt(String(b.code || b.id).replace(/\D/g, ""), 10) || 0;
    return valA - valB;
  });
});

const currentTime = ref("");
const isNew = ref(false);
const audioUnlocked = ref(false);

let clockInterval = null;
let isNewTimeout = null;
let eventSource = null;

/* LOGIC & METHODS */
const updateClock = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const fetchStations = async () => {
  isLoadingStations.value = true;
  try {
    const res = await $fetch("/api/stations");
    const data = Array.isArray(res) ? res : res?.stations || [];
    stationList.value = data;

    const initialTicketMap = {};
    data.forEach((station) => {
      if (station.code) initialTicketMap[station.code] = "---";
    });
    stationTickets.value = initialTicketMap;
  } catch (err) {
    console.error("Failed to fetch stations:", err);
  } finally {
    isLoadingStations.value = false;
  }
};

const announceTicket = (number, stationCode) => {
  if (
    !number ||
    number === "---" ||
    typeof window === "undefined" ||
    !window.speechSynthesis
  )
    return;

  window.speechSynthesis.cancel();
  const stationText = stationCode
    ? `proceed to station ${stationCode}`
    : "proceed to the station";
  const msg = new SpeechSynthesisUtterance(
    `Ticket number ${number}, please ${stationText}.`,
  );
  msg.rate = 0.85;
  msg.pitch = 1.0;
  window.speechSynthesis.speak(msg);
};

const unlockAudio = () => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
  }
  audioUnlocked.value = true;
};

const fetchQueue = async () => {
  try {
    const res = await $fetch("/api/queue/display");
    if (res && res.stations) {
      stationTickets.value = { ...stationTickets.value, ...res.stations };
    }
  } catch (err) {
    console.error("Failed to sync initial queue:", err);
  }
};

/* LIFECYCLE */
onMounted(async () => {
  updateClock();
  clockInterval = setInterval(updateClock, 1000);

  await fetchStations();
  await fetchQueue();

  if (typeof window !== "undefined") {
    eventSource = new EventSource("/api/queue/events");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.heartbeat) return;

        if (
          data.type === "serving" ||
          data.type === "recall" ||
          data.type === "transfer"
        ) {
          const targetStationCode = data.station;

          Object.keys(stationTickets.value).forEach((code) => {
            if (stationTickets.value[code] === data.ticket) {
              stationTickets.value[code] = "---";
            }
          });

          stationTickets.value[targetStationCode] = data.ticket;
          activeStation.value = targetStationCode;

          if (audioUnlocked.value)
            announceTicket(data.ticket, targetStationCode);

          if (data.type === "serving" || data.type === "transfer") {
            isNew.value = true;
            if (isNewTimeout) clearTimeout(isNewTimeout);
            isNewTimeout = setTimeout(() => {
              isNew.value = false;
            }, 3000);
          }
        }
      } catch (e) {
        console.error("SSE parsing error:", e);
      }
    };
  }
});

onBeforeUnmount(() => {
  if (clockInterval) clearInterval(clockInterval);
  if (isNewTimeout) clearTimeout(isNewTimeout);
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
});
</script>

<style scoped>
/* AUTO-FIT RESPONSIVE CARD STYLING */
.auto-fit-card {
  flex: 1 1 calc(220px + 2vw);
  max-width: clamp(240px, 28vw, 380px);
  min-height: clamp(160px, 22vh, 260px);
}

.text-ticket {
  font-size: clamp(2.5rem, 5.5vh + 1.5vw, 5rem);
}

@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-marquee {
  display: inline-block;
  animation: marquee 35s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-marquee {
    animation: none;
  }
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.scale-enter-from {
  opacity: 0;
  transform: scale(0.85);
}

.scale-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* CUSTOM SCROLLBAR FOR LIGHT THEME */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(6, 78, 59, 0.15);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(6, 78, 59, 0.3);
}
</style>
