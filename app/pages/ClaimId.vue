<template>
  <div
    class="h-screen w-screen bg-[#051409] text-white flex flex-col font-sans overflow-hidden select-none"
  >
    <!-- HEADER BAR -->
    <header
      class="h-20 px-8 bg-black/40 backdrop-blur-md border-b border-white/10 flex justify-between items-center z-20 shrink-0"
    >
      <div class="flex items-center gap-4">
        <div
          class="h-11 w-24 bg-gradient-to-br from-[#0a210f] to-black border border-yellow-500/40 rounded-lg flex items-center justify-center shadow-lg"
        >
          <span class="text-xl font-black tracking-tight text-yellow-500"
            >CSUCC</span
          >
        </div>
        <div>
          <h1
            class="text-xl font-bold tracking-tight uppercase leading-none text-slate-100"
          >
            MIS <span class="text-yellow-500">Queuing System</span>
          </h1>
          <p
            class="text-[10px] text-slate-400 uppercase tracking-[0.25em] font-medium mt-1"
          >
            Management Information System
          </p>
        </div>
      </div>

      <div class="flex items-center gap-6">
        <div class="text-right">
          <p
            class="text-2xl font-mono font-bold text-yellow-500 leading-none tracking-tight"
          >
            {{ currentTime }}
          </p>
          <p
            class="text-[10px] uppercase tracking-widest text-slate-400 font-medium mt-1"
          >
            Cabadbaran City, Caraga
          </p>
        </div>
      </div>
    </header>

    <!-- MAIN CONTENT BODY (70% / 30% SPLIT) -->
    <main class="flex-grow flex z-10 overflow-hidden">
      <!-- ================================================================= -->
      <!-- LEFT SECTION: DISPLAY MONITOR (70% WIDTH)                         -->
      <!-- ================================================================= -->
      <section
        class="w-[70%] flex flex-col justify-between p-10 border-r border-white/10 bg-radial-gradient from-[#143a1b] via-[#0a210f] to-[#051308] relative"
      >
        <!-- Subtle Background Watermark -->
        <div
          class="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none"
        >
          <h1 class="text-[32rem] font-black italic text-white">CSU</h1>
        </div>

        <!-- Serving Status Badge -->
        <div class="flex items-center justify-between z-10">
          <div
            class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-sm"
          >
            <span class="relative flex h-2.5 w-2.5">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500"
              ></span>
            </span>
            <span
              class="text-xs font-bold text-yellow-500 uppercase tracking-widest"
            >
              Live Now Serving
            </span>
          </div>

          <Transition name="fade">
            <div
              v-if="isNew"
              class="bg-red-600 text-white text-xs font-bold px-4 py-1 rounded-full animate-pulse uppercase tracking-wider shadow-lg"
            >
              Next Ticket Called
            </div>
          </Transition>
        </div>

        <!-- Primary Ticket Display -->
        <div class="text-center z-10 my-auto">
          <p
            class="text-slate-400 uppercase tracking-[0.25em] text-sm font-semibold mb-2"
          >
            Claim Student ID
          </p>

          <Transition name="scale" mode="out-in">
            <div :key="currentServing.ticket" class="space-y-2">
              <h1
                class="text-[12rem] xl:text-[14rem] font-black leading-none text-yellow-500 drop-shadow-[0_0_35px_rgba(234,179,8,0.35)] tabular-nums tracking-tighter"
              >
                {{ currentServing.ticket || "---" }}
              </h1>
              <div
                v-if="currentServing.name"
                class="text-3xl font-bold text-white tracking-wide"
              >
                {{ currentServing.name }}
              </div>
            </div>
          </Transition>

          <div
            class="mt-6 inline-block px-10 py-3.5 bg-[#0a210f]/90 border border-yellow-500/30 backdrop-blur-md rounded-2xl shadow-2xl"
          >
            <p class="text-lg xl:text-xl text-slate-200 font-medium">
              Please proceed to
              <span
                class="text-yellow-500 font-bold underline underline-offset-4 decoration-yellow-500/40"
                >Window {{ currentServing.window || "1" }}</span
              >
            </p>
          </div>
        </div>

        <!-- Sub-Info: Next Up & Recent History Footer Grid -->
        <div class="z-10">
          <h2
            class="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3"
          >
            Recently Called
          </h2>
          <div class="grid grid-cols-4 gap-4">
            <!-- Next Line Panel -->
            <div
              class="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex flex-col justify-between backdrop-blur-sm"
            >
              <p
                class="text-[10px] font-bold text-yellow-500/90 uppercase tracking-widest"
              >
                Next Up
              </p>
              <p
                class="text-3xl font-black text-yellow-400 tabular-nums tracking-tight mt-1"
              >
                {{ nextTicket || "---" }}
              </p>
            </div>

            <!-- History Panels -->
            <div
              v-for="(item, index) in recentServed.slice(0, 3)"
              :key="item.ticket"
              class="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between backdrop-blur-md transition-all"
              :style="{ opacity: 1 - index * 0.25 }"
            >
              <div class="flex justify-between items-center">
                <p
                  class="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate"
                >
                  {{ item.name || "Student" }}
                </p>
                <span class="text-[10px] text-emerald-400 font-semibold"
                  >Win {{ item.window }}</span
                >
              </div>
              <p class="text-2xl font-bold text-yellow-500 tabular-nums mt-1">
                {{ item.ticket }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- RIGHT SECTION: KIOSK INTERACTION (30% WIDTH)                      -->
      <!-- ================================================================= -->
      <aside
        class="w-[30%] bg-black/50 backdrop-blur-2xl p-8 flex flex-col justify-between z-10 border-l border-white/10"
      >
        <!-- Kiosk Header -->
        <div class="border-b border-white/10 pb-4 text-center">
          <h2
            class="text-xl font-bold text-yellow-500 uppercase tracking-wider"
          >
            Kiosk Station
          </h2>
          <p class="text-slate-400 text-xs mt-1">
            Tap below to retrieve your priority ticket
          </p>
        </div>

        <!-- Dynamic Kiosk Steps -->
        <div class="my-auto py-6">
          <!-- STEP 1: IDLE STATE -->
          <div
            v-if="kioskStep === 'idle'"
            class="space-y-6 text-center animate-in fade-in"
          >
            <div class="flex justify-center">
              <div
                class="p-6 bg-emerald-500/10 rounded-full animate-pulse border border-emerald-500/20 shadow-inner"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-14 w-14 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6"
                  />
                </svg>
              </div>
            </div>

            <div class="space-y-2">
              <h3 class="text-2xl font-bold text-white">Student ID Release</h3>
              <p
                class="text-slate-400 text-xs leading-relaxed max-w-[240px] mx-auto"
              >
                Generate your queue ticket to claim your ID at the counter.
              </p>
            </div>

            <button
              @click="claimStudentId"
              class="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-[#051409] font-black py-6 rounded-2xl shadow-xl hover:shadow-emerald-500/20 text-lg uppercase tracking-wider transition-all"
            >
              Claim Student ID
            </button>
          </div>

          <!-- STEP 2: TICKET ISSUED RESULT -->
          <div
            v-if="kioskStep === 'result'"
            class="text-center animate-in zoom-in-95 flex flex-col items-center"
          >
            <!-- Radial Countdown Progress Ring -->
            <div class="mb-4 relative">
              <svg class="h-20 w-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="currentColor"
                  stroke-width="6"
                  fill="transparent"
                  class="text-white/10"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="currentColor"
                  stroke-width="6"
                  fill="transparent"
                  :stroke-dasharray="213.6"
                  :stroke-dashoffset="213.6 - (213.6 * countdown) / 10"
                  class="text-yellow-500 transition-all duration-1000 ease-linear"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-xl font-black text-yellow-500">{{
                  countdown
                }}</span>
              </div>
            </div>

            <p
              class="text-slate-400 uppercase tracking-[0.2em] text-xs font-bold"
            >
              Your Priority Number
            </p>

            <h1
              class="text-6xl font-black text-yellow-500 my-2 drop-shadow-[0_0_20px_rgba(234,179,8,0.4)] tabular-nums"
            >
              {{ generatedTicket }}
            </h1>

            <div
              class="mt-2 p-4 bg-white/5 border border-white/10 rounded-2xl w-full text-center space-y-1"
            >
              <div
                class="flex items-center justify-center gap-2 text-yellow-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                </svg>
                <span class="font-bold uppercase text-xs">Take a Photo</span>
              </div>
              <p class="text-slate-300 text-xs leading-normal">
                Save your ticket number. The kiosk screen resets automatically.
              </p>
            </div>

            <button
              @click="resetKiosk"
              class="mt-6 w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98]"
            >
              Finish & Reset
            </button>
          </div>
        </div>

        <!-- Footer System Specs -->
        <div class="border-t border-white/10 pt-4 text-center">
          <p class="text-xs text-slate-500">
            CSU MIS Services &bull; Automated Queuing Kiosk
          </p>
        </div>
      </aside>
    </main>

    <!-- FOOTER TICKER -->
    <footer
      class="h-10 bg-yellow-500 border-t border-black/20 flex items-center overflow-hidden whitespace-nowrap z-20 shrink-0"
    >
      <div
        class="inline-block animate-marquee text-[#051409] font-black uppercase tracking-tight text-sm italic"
      >
        Welcome to CSU Management Information System (MIS) • Please have your
        Student ID or details ready • Stay alert for your ticket announcement •
        Follow University protocols at all times •
      </div>
    </footer>

    <!-- INITIAL AUDIO / SYSTEM UNLOCK OVERLAY -->
    <Transition name="fade">
      <div
        v-if="!audioUnlocked"
        @click="unlockAudio"
        class="fixed inset-0 z-[100] bg-[#051409]/98 flex items-center justify-center cursor-pointer backdrop-blur-3xl"
      >
        <div class="text-center">
          <div class="mb-6 relative inline-block">
            <div
              class="absolute inset-0 bg-yellow-500 blur-2xl opacity-20 animate-pulse"
            ></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-20 w-20 text-yellow-500 mx-auto relative z-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          </div>
          <h2 class="text-4xl font-black text-white tracking-tight mb-2">
            CSU QUEUE SYSTEM
          </h2>
          <p
            class="text-yellow-500/80 font-bold tracking-[0.3em] uppercase text-xs animate-pulse"
          >
            Click anywhere to activate kiosk screen
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

definePageMeta({
  layout: false,
});

/* ================= DISPLAY STATE ================= */
const currentServing = ref({
  ticket: "CID-102",
  name: "Juan Dela Cruz",
  window: "1",
});
const nextTicket = ref("CID-103");
const recentServed = ref([
  { ticket: "CID-101", name: "Maria Santos", window: "2" },
  { ticket: "CID-100", name: "Alex Reyes", window: "1" },
  { ticket: "CID-099", name: "Chris Cruz", window: "3" },
]);

const currentTime = ref("");
const isNew = ref(false);
const audioUnlocked = ref(false);
let eventSource = null;

/* ================= KIOSK STATE ================= */
const kioskStep = ref("idle");
const generatedTicket = ref(null);
const countdown = ref(10);
let countdownTimer = null;

/* ================= CLOCK ================= */
const updateClock = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

/* ================= AUDIO ANNOUNCEMENTS ================= */
const announceTicket = (item) => {
  if (!item?.ticket || item.ticket === "---" || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const namePhrase = item.name ? `, ${item.name}` : "";
  const msg = new SpeechSynthesisUtterance(
    `Now serving ticket number ${item.ticket}${namePhrase}. Please proceed to Window ${item.window || 1}.`,
  );
  msg.rate = 0.85;
  msg.pitch = 1.1;
  window.speechSynthesis.speak(msg);
};

const unlockAudio = () => {
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
  audioUnlocked.value = true;
  if (currentServing.value?.ticket) announceTicket(currentServing.value);
};

/* ================= QUEUE DISPLAY DATA ================= */
const fetchQueue = async () => {
  try {
    const res = await $fetch("/api/queue/display");
    if (res.current) currentServing.value = res.current;
    if (res.next) nextTicket.value = res.next;
    if (res.history) recentServed.value = res.history;
  } catch (e) {
    console.error("Display fetch error", e);
  }
};

/* ================= KIOSK ACTIONS ================= */
const claimStudentId = async () => {
  try {
    const res = await $fetch("/api/queue", {
      method: "POST",
      body: { service: "Claim Student ID" },
    });
    generatedTicket.value = res.queueNumber;
  } catch (e) {
    // Fallback mock generator
    generatedTicket.value = "CID-" + Math.floor(100 + Math.random() * 900);
  }

  kioskStep.value = "result";
  startCountdown();
  fetchQueue();
};

const startCountdown = () => {
  countdown.value = 10;
  if (countdownTimer) clearInterval(countdownTimer);

  countdownTimer = setInterval(() => {
    if (countdown.value <= 1) {
      resetKiosk();
    } else {
      countdown.value--;
    }
  }, 1000);
};

const resetKiosk = () => {
  if (countdownTimer) clearInterval(countdownTimer);
  kioskStep.value = "idle";
  generatedTicket.value = null;
};

/* ================= LIFECYCLE HOOKS ================= */
onMounted(async () => {
  updateClock();
  setInterval(updateClock, 1000);

  await fetchQueue();

  // SSE Stream Listener
  eventSource = new EventSource("/api/queue/events");

  eventSource.onmessage = async (event) => {
    const data = JSON.parse(event.data);
    if (data.heartbeat) return;

    if (data.type === "serving" || data.type === "recall") {
      await fetchQueue();
      if (audioUnlocked.value && data.ticket) {
        announceTicket({
          ticket: data.ticket,
          name: data.name,
          window: data.window,
        });
      }

      isNew.value = true;
      setTimeout(() => (isNew.value = false), 3000);
    } else {
      await fetchQueue();
    }
  };

  window.speechSynthesis?.getVoices();
});

onBeforeUnmount(() => {
  eventSource?.close();
  if (countdownTimer) clearInterval(countdownTimer);
});
</script>

<style scoped>
/* ANIMATIONS */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.scale-enter-from {
  opacity: 0;
  transform: scale(0.7);
}
.scale-leave-to {
  opacity: 0;
  transform: scale(1.15);
  filter: blur(10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
.animate-marquee {
  display: inline-block;
  animation: marquee 30s linear infinite;
}

.animate-in {
  animation-duration: 300ms;
  animation-fill-mode: both;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoom-in {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
