<template>
  <div
    class="min-h-screen h-screen bg-[#020b05] text-slate-100 flex flex-col font-sans overflow-hidden relative select-none antialiased"
  >
    <!-- HEADER BAR -->
    <header
      class="px-8 py-4 bg-[#041409] border-b border-emerald-900/60 flex justify-between items-center z-20 shrink-0"
    >
      <!-- BRANDING (LEFT) -->
      <div class="flex items-center gap-4">
        <div
          class="h-10 px-4 bg-[#020b05] border border-amber-500/60 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.1)]"
        >
          <span class="text-xl font-black tracking-tighter text-amber-400">
            CSUCC
          </span>
        </div>
        <div>
          <h1
            class="text-lg md:text-xl font-extrabold tracking-tight uppercase leading-none text-white flex items-center gap-2"
          >
            MIS <span class="text-amber-400">Queuing System</span>
          </h1>
          <p
            class="text-[9px] text-emerald-500/80 uppercase tracking-[0.25em] font-bold mt-0.5"
          >
            Management Information System
          </p>
        </div>
      </div>

      <!-- SYSTEM STATUS & CLOCK (RIGHT) -->
      <div class="flex gap-6 items-center">
        <div
          class="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-[11px] font-bold text-emerald-400 uppercase tracking-wider"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
            ></span>
          </span>
          System Live
        </div>
        <div class="h-6 w-px bg-emerald-900 hidden sm:block"></div>
        <div class="text-right">
          <p
            class="text-2xl font-mono font-black text-amber-400 leading-none tabular-nums tracking-tight"
          >
            {{ currentTime }}
          </p>
          <p
            class="text-[9px] uppercase tracking-widest text-slate-400 font-bold mt-1"
          >
            Cabadbaran City, Caraga
          </p>
        </div>
      </div>
    </header>

    <!-- MAIN SECTION: 70% / 30% SIMPLE COLUMN LAYOUT -->
    <main class="flex-grow flex flex-col lg:flex-row z-10 overflow-hidden">
      <!-- LEFT COLUMN (70% WIDTH): NOW SERVING DISPLAY -->
      <section
        class="w-full lg:w-[70%] flex flex-col items-center justify-between p-8 border-b lg:border-b-0 lg:border-r border-emerald-900/60 bg-[#020b05] relative overflow-hidden"
        aria-live="polite"
        aria-atomic="true"
      >
        <!-- Background Watermark -->
        <div
          class="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none"
        >
          <h1
            class="text-[40rem] font-black italic tracking-tighter text-white"
          >
            CSU
          </h1>
        </div>

        <!-- TOP: STATUS BADGE -->
        <div class="z-10 pt-2">
          <div
            class="inline-flex items-center gap-2 px-5 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 text-xs font-black uppercase tracking-[0.3em]"
          >
            <span class="relative flex h-2.5 w-2.5">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"
              ></span>
            </span>
            Now Serving
          </div>
        </div>

        <!-- CENTER: MAXIMIZED & HIGH-NOTICEABLE TICKET NUMBER -->
        <div
          class="z-10 flex flex-col items-center justify-center my-auto w-full max-w-full overflow-hidden px-6"
        >
          <Transition name="scale" mode="out-in">
            <h1
              :key="current"
              class="font-black leading-none text-amber-400 tabular-nums tracking-tighter text-center max-w-full truncate select-none drop-shadow-none"
              style="font-size: min(18vw, 30vh)"
            >
              {{ current }}
            </h1>
          </Transition>

          <!-- New Ticket Pulse Banner -->
          <Transition name="fade">
            <div
              v-if="isNew"
              class="bg-amber-400 text-black text-xs md:text-sm font-black px-6 py-1.5 rounded-full uppercase tracking-widest mt-4 animate-bounce shrink-0"
            >
              Next Ticket Called
            </div>
          </Transition>
        </div>

        <!-- BOTTOM: INSTRUCTIONS PANEL -->
        <div class="z-10 w-full max-w-xl pb-2">
          <div
            class="py-4 px-8 bg-[#041409] border border-emerald-900/80 rounded-2xl text-center"
          >
            <p
              class="text-xl md:text-2xl text-slate-200 font-medium tracking-wide"
            >
              Please proceed to
              <span
                class="text-amber-400 font-black underline decoration-amber-400/40 underline-offset-8"
              >
                MIS Main Counter
              </span>
            </p>
          </div>
        </div>
      </section>

      <!-- RIGHT COLUMN (30% WIDTH): SELF-SERVICE KIOSK STATION -->
      <aside
        class="w-full lg:w-[30%] bg-[#041409] p-6 lg:p-8 flex flex-col justify-center border-l border-emerald-900/60 z-20 overflow-y-auto"
      >
        <!-- STEP 1: DIRECT SERVICE SELECTION & TICKET GENERATION -->
        <div
          v-if="step === 'scan'"
          class="space-y-6 text-center animate-in fade-in"
        >
          <div class="space-y-2">
            <span
              class="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full shadow-inner"
            >
              Self-Service Kiosk
            </span>
            <h2
              class="text-2xl lg:text-3xl font-black uppercase text-amber-400 pt-2"
            >
              Select Service
            </h2>
            <p class="text-slate-400 text-xs max-w-xs mx-auto">
              Tap a service to immediately generate your queue ticket.
            </p>
          </div>

          <!-- Kiosk Action Box -->
          <div
            class="p-5 bg-[#020b05] rounded-2xl border border-emerald-900/80 flex flex-col items-center space-y-4"
          >
            <p class="text-[11px] text-slate-400 font-medium pt-1">
              Tap any option above to get your queue ticket
            </p>

            <!-- Enhanced Service Selection Direct Action Buttons -->
            <div class="w-full space-y-3">
              <button
                v-for="service in availableServices"
                :key="service.title"
                @click="claimStudentId(service.title)"
                :disabled="isClaiming"
                type="button"
                class="relative w-full p-4 rounded-2xl text-left transition-all duration-200 flex items-center justify-between border bg-gradient-to-r from-[#041409] to-[#020b05] border-emerald-900/80 hover:border-amber-400/80 hover:from-emerald-950 hover:to-[#041409] shadow-md hover:shadow-[0_0_20px_rgba(251,191,36,0.12)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <!-- Left Content: Icon + Labels -->
                <div class="flex items-center gap-3.5 min-w-0">
                  <div
                    class="h-11 w-11 rounded-xl bg-emerald-950 border border-emerald-800/80 group-hover:border-amber-400/50 group-hover:bg-amber-500/10 flex items-center justify-center text-emerald-400 group-hover:text-amber-400 transition-colors shrink-0"
                  >
                    <!-- Service Icons -->
                    <svg
                      v-if="service.icon === 'id'"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3 3 0 00-3 3h6a3 3 0 00-3-3z"
                      />
                    </svg>

                    <svg
                      v-else-if="service.icon === 'print'"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
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

                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  <div class="text-left truncate">
                    <p
                      class="text-xs font-black uppercase tracking-wider text-emerald-700 group-hover:text-amber-400 transition-colors truncate"
                    >
                      {{ service.title }}
                    </p>
                    <p
                      class="text-[10px] text-slate-400 font-medium truncate mt-0.5"
                    >
                      {{ service.subtitle }}
                    </p>
                  </div>
                </div>

                <!-- Right Action Indicator / Spinner -->
                <div class="shrink-0 pl-2">
                  <template
                    v-if="isClaiming && selectedService === service.title"
                  >
                    <svg
                      class="animate-spin h-5 w-5 text-amber-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </template>

                  <template v-else>
                    <div
                      class="h-8 w-8 rounded-lg bg-emerald-950/60 border border-emerald-900 group-hover:border-amber-400/60 group-hover:bg-amber-400 group-hover:text-black flex items-center justify-center text-emerald-500 transition-all"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 group-hover:translate-x-0.5 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2.5"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </template>
                </div>
              </button>
            </div>

            <!-- Error Banner -->
            <div
              v-if="errorMessage"
              class="w-full p-3 bg-red-950/50 border border-red-800 rounded-lg text-red-400 text-xs font-semibold text-center"
              role="alert"
            >
              {{ errorMessage }}
            </div>
          </div>
        </div>

        <!-- STEP 2: TICKET RESULT DISPLAY -->
        <div
          v-if="step === 'result'"
          class="text-center animate-in zoom-in flex flex-col items-center space-y-5"
          aria-live="assertive"
        >
          <div
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold uppercase tracking-wider"
          >
            ✓ Ticket Generated
          </div>

          <!-- Countdown Visual Ring -->
          <div class="relative my-1 flex items-center justify-center">
            <svg class="h-24 w-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                stroke-width="6"
                fill="transparent"
                class="text-emerald-950"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                stroke-width="6"
                fill="transparent"
                :stroke-dasharray="251.3"
                :stroke-dashoffset="251.3 - (251.3 * countdown) / 10"
                class="text-amber-400 transition-all duration-1000 ease-linear"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span
                class="text-2xl font-mono font-black text-amber-400 leading-none"
              >
                {{ countdown }}
              </span>
            </div>
          </div>

          <!-- Priority Number -->
          <div class="space-y-1 w-full">
            <p
              class="text-slate-400 uppercase tracking-widest text-xs font-bold"
            >
              Your Priority Number
            </p>
            <h3
              class="text-8xl md:text-9xl font-black text-amber-400 tabular-nums tracking-tight leading-none drop-shadow-[0_0_25px_rgba(251,191,36,0.15)]"
            >
              {{ queueNumber }}
            </h3>
            <p
              class="text-xs font-semibold text-slate-300 uppercase tracking-wider pt-2"
            >
              Service:
              <span class="text-amber-400">{{ activeServiceSubmitted }}</span>
            </p>
          </div>

          <div
            class="w-full max-w-xs p-4 bg-[#020b05] border border-emerald-900/80 rounded-xl text-center space-y-1"
          >
            <p class="text-slate-500 text-xs font-medium">
              Please take a picture of your ticket.
            </p>
            <p class="text-slate-700 text-[11px]">
              Screen resets in {{ countdown }} seconds.
            </p>
          </div>

          <button
            @click="forceReset"
            aria-label="Close ticket confirmation early"
            class="w-full py-3 px-4 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 rounded-lg text-slate-600 hover:text-white font-bold text-xs uppercase tracking-wider transition focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            Done / Close
          </button>
        </div>
      </aside>
    </main>

    <!-- FOOTER TICKER -->
    <footer
      class="bg-amber-400 py-2.5 border-t border-amber-500/40 overflow-hidden whitespace-nowrap z-20 shrink-0"
    >
      <div
        class="inline-block animate-marquee text-[#020b05] font-black uppercase tracking-tight text-xs md:text-sm italic"
      >
        Welcome to CSU Management Information System (MIS) • Claim Student ID •
        Reprinting ID • Institutional Email Concern • Please watch the main
        display for your ticket call •
      </div>
    </footer>

    <!-- AUDIO UNLOCK OVERLAY -->
    <Transition name="fade">
      <div
        v-if="!audioUnlocked"
        @click="unlockAudio"
        class="fixed inset-0 z-[100] bg-[#020b05]/98 flex items-center justify-center cursor-pointer"
        role="button"
        tabindex="0"
        aria-label="Tap anywhere to activate audio announcements and launch display"
        @keydown.enter="unlockAudio"
        @keydown.space.prevent="unlockAudio"
      >
        <div
          class="text-center p-8 max-w-md bg-[#041409] border border-emerald-900 rounded-2xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 text-amber-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
          <h2 class="text-2xl font-black text-white tracking-tight mb-2">
            CSU MIS QUEUE DISPLAY
          </h2>
          <p class="text-slate-400 text-xs mb-6">
            Audio announcements are required for queue notifications.
          </p>
          <div
            class="inline-block bg-amber-400 text-slate-950 font-black uppercase text-xs tracking-[0.2em] px-6 py-3 rounded-lg"
          >
            Tap Anywhere To Launch
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

definePageMeta({ layout: false });

/* -------------------------------------------------------------------------- */
/* STATE MANAGEMENT                                                           */
/* -------------------------------------------------------------------------- */

// Display State
const current = ref("---");
const currentTime = ref("");
const isNew = ref(false);
const audioUnlocked = ref(false);

// Structured Service Options
const availableServices = [
  {
    title: "Claim Student ID",
    subtitle: "New or newly processed IDs",
    icon: "id",
  },
  {
    title: "Reprinting ID",
    subtitle: "Replacement for lost or damaged IDs",
    icon: "print",
  },
  {
    title: "Institutional Email Concern",
    subtitle: "Password reset or account issues",
    icon: "email",
  },
];

const selectedService = ref("Claim Student ID");
const activeServiceSubmitted = ref("");

// Kiosk / Ticket Generation State
const step = ref("scan");
const queueNumber = ref(null);
const countdown = ref(10);
const isClaiming = ref(false);
const errorMessage = ref("");

// Interval & Timer Handles
let clockInterval = null;
let timerInterval = null;
let isNewTimeout = null;
let eventSource = null;

/* -------------------------------------------------------------------------- */
/* METHODS & LOGIC                                                            */
/* -------------------------------------------------------------------------- */

const updateClock = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const claimStudentId = async (serviceName) => {
  if (isClaiming.value) return;

  const targetService = serviceName || selectedService.value;
  selectedService.value = targetService;
  isClaiming.value = true;
  errorMessage.value = "";

  try {
    const res = await $fetch("/api/queue", {
      method: "POST",
      body: { service: targetService },
    });

    if (res && res.queueNumber) {
      queueNumber.value = res.queueNumber;
      activeServiceSubmitted.value = targetService;
      step.value = "result";
      startCountdown();
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (err) {
    console.error("Queue generation error:", err);
    errorMessage.value = "Unable to generate ticket. Please try again.";
  } finally {
    isClaiming.value = false;
  }
};

const startCountdown = () => {
  countdown.value = 10;
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (countdown.value <= 1) {
      forceReset();
    } else {
      countdown.value--;
    }
  }, 1000);
};

const forceReset = () => {
  if (timerInterval) clearInterval(timerInterval);
  step.value = "scan";
  queueNumber.value = null;
  errorMessage.value = "";
  isClaiming.value = false;
};

const announceTicket = (number) => {
  if (
    !number ||
    number === "---" ||
    typeof window === "undefined" ||
    !window.speechSynthesis
  ) {
    return;
  }

  window.speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(
    `Now serving ticket number ${number}. Please proceed to the M I S station.`,
  );
  msg.rate = 0.85;
  msg.pitch = 1.1;
  window.speechSynthesis.speak(msg);
};

const unlockAudio = () => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
  }
  audioUnlocked.value = true;
  if (current.value !== "---") {
    announceTicket(current.value);
  }
};

const fetchQueue = async () => {
  try {
    const res = await $fetch("/api/queue/display");
    current.value = res.current || "---";
  } catch (err) {
    console.error("Failed to sync initial queue display:", err);
  }
};

/* -------------------------------------------------------------------------- */
/* LIFECYCLE HOOKS                                                            */
/* -------------------------------------------------------------------------- */

onMounted(async () => {
  // Live clock initialization
  updateClock();
  clockInterval = setInterval(updateClock, 1000);

  // Initial queue state fetch
  await fetchQueue();

  // SSE Listener Setup
  if (typeof window !== "undefined") {
    eventSource = new EventSource("/api/queue/events");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.heartbeat) return;

        if (data.type === "serving" || data.type === "recall") {
          current.value = data.ticket;

          if (audioUnlocked.value) {
            announceTicket(data.ticket);
          }

          if (data.type === "serving") {
            isNew.value = true;
            if (isNewTimeout) clearTimeout(isNewTimeout);
            isNewTimeout = setTimeout(() => {
              isNew.value = false;
            }, 3000);
          }
        }
      } catch (e) {
        console.error("Error processing SSE message:", e);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Connection Error:", err);
    };
  }
});

onBeforeUnmount(() => {
  // Clear all registered intervals & timeouts
  if (clockInterval) clearInterval(clockInterval);
  if (timerInterval) clearInterval(timerInterval);
  if (isNewTimeout) clearTimeout(isNewTimeout);

  // Close SSE connection
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
});
</script>

<style scoped>
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
  animation: marquee 28s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-marquee {
    animation: none;
  }
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-enter-from {
  opacity: 0;
  transform: scale(0.7);
}

.scale-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
