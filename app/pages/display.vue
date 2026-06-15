<template>
  <div
    class="min-h-screen bg-[#061a0c] text-white flex flex-col font-sans overflow-hidden relative"
  >
    <!-- CSU BACKGROUND DECOR -->
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#1a4d2e_0%,transparent_50%)] opacity-40"
    ></div>
    <div
      class="absolute bottom-0 right-0 w-96 h-96 bg-yellow-600/5 blur-[150px] rounded-full"
    ></div>

    <!-- HEADER BAR -->
    <header
      class="p-6 bg-black/40 backdrop-blur-2xl border-b border-white/10 flex justify-between items-center z-10 shadow-2xl"
    >
      <div class="flex items-center gap-6">
        <div class="relative">
          <div
            class="absolute -inset-1 bg-yellow-500 rounded-xl blur opacity-25"
          ></div>
          <div
            class="h-14 w-28 bg-gradient-to-br from-[#0a210f] to-black border border-yellow-500/50 rounded-xl flex items-center justify-center shadow-inner relative"
          >
            <span class="text-2xl font-black tracking-tighter text-yellow-500"
              >CSUCC</span
            >
          </div>
        </div>
        <div>
          <h1
            class="text-3xl font-black tracking-tighter uppercase leading-none"
          >
            MIS <span class="text-yellow-500">Queuing System</span>
          </h1>
          <p
            class="text-[10px] text-slate-400 uppercase tracking-[0.4em] font-bold mt-1"
          >
            Management Information System
          </p>
        </div>
      </div>

      <div class="flex gap-8 items-center">
        <div class="h-10 w-px bg-white/10"></div>
        <div class="text-right">
          <p class="text-3xl font-mono font-bold text-yellow-500 leading-none">
            {{ currentTime }}
          </p>
          <p
            class="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1"
          >
            Cabadbaran City, Caraga
          </p>
        </div>
      </div>
    </header>

    <main class="flex-grow flex z-10">
      <!-- LEFT SECTION: NOW SERVING -->
      <section
        class="flex-[3] flex flex-col items-center justify-center relative border-r border-white/5 bg-gradient-to-b from-white/[0.01] to-transparent"
      >
        <!-- Watermark -->
        <div
          class="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none"
        >
          <h1 class="text-[40rem] font-black italic">CSU</h1>
        </div>

        <div class="text-center z-10">
          <div
            class="inline-flex items-center gap-3 px-4 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/5 mb-6"
          >
            <span class="relative flex h-3 w-3">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"
              ></span>
            </span>
            <p
              class="text-sm font-black text-yellow-500 uppercase tracking-[0.4em]"
            >
              Live Now Serving
            </p>
          </div>

          <div class="relative">
            <Transition name="scale" mode="out-in">
              <h1
                :key="current"
                class="text-[26rem] font-black leading-none text-yellow-500 drop-shadow-[0_20px_70px_rgba(234,179,8,0.3)] tabular-nums tracking-tighter"
              >
                {{ current }}
              </h1>
            </Transition>
          </div>

          <div class="mt-6 space-y-4">
            <Transition name="fade">
              <div
                v-if="isNew"
                class="inline-block bg-red-600 text-white text-xs font-black px-4 py-1.5 rounded-full animate-bounce uppercase italic tracking-widest shadow-lg"
              >
                Next Ticket Called
              </div>
            </Transition>
            <div
              class="block px-12 py-5 bg-[#0a210f]/80 border border-white/10 backdrop-blur-md rounded-3xl shadow-2xl"
            >
              <p class="text-2xl text-slate-200 font-medium tracking-wide">
                Please proceed to the
                <span
                  class="text-yellow-500 font-bold underline decoration-yellow-500/30 underline-offset-8"
                  >MIS Main Counter</span
                >
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- RIGHT SECTION: QUEUE LIST -->
      <aside
        class="flex-1 bg-black/40 backdrop-blur-sm flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.3)]"
      >
        <!-- NEXT UP -->
        <div
          class="p-8 border-b border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent"
        >
          <p
            class="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2"
          >
            Next in line
          </p>
          <div class="relative group">
            <div
              class="absolute -inset-0.5 bg-gradient-to-r from-yellow-500/50 to-transparent rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"
            ></div>
            <div
              class="relative bg-[#0a210f]/60 border border-white/10 rounded-3xl p-10 text-center shadow-xl"
            >
              <Transition name="slide-up" mode="out-in">
                <h2
                  :key="next"
                  class="text-8xl font-black text-white tabular-nums tracking-tighter"
                >
                  {{ next }}
                </h2>
              </Transition>
            </div>
          </div>
        </div>

        <!-- HISTORY -->
        <div class="p-8 flex-grow overflow-hidden bg-black/20">
          <p
            class="text-xs font-black text-slate-600 uppercase tracking-[0.3em] mb-8"
          >
            Recently Called
          </p>
          <div class="space-y-4">
            <TransitionGroup name="list">
              <div
                v-for="(num, index) in history"
                :key="num"
                class="group flex justify-between items-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl transition-all"
                :style="{ opacity: 1 - index * 0.22 }"
              >
                <span
                  class="font-bold text-3xl text-slate-300 group-hover:text-yellow-500 transition-colors"
                  >{{ num }}</span
                >
                <div class="flex items-center gap-2">
                  <div class="h-1.5 w-1.5 rounded-full bg-slate-700"></div>
                  <span
                    class="text-[10px] font-bold uppercase text-slate-600 tracking-widest"
                    >Completed</span
                  >
                </div>
              </div>
            </TransitionGroup>
            <div
              v-if="history.length === 0"
              class="text-center py-10 opacity-20 italic"
            >
              No recent history
            </div>
          </div>
        </div>
      </aside>
    </main>

    <!-- FOOTER TICKER -->
    <footer
      class="bg-yellow-500 py-4 border-t border-black/20 overflow-hidden whitespace-nowrap z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.4)]"
    >
      <div
        class="inline-block animate-marquee text-[#061a0c] font-black uppercase tracking-tighter text-xl italic"
      >
        Welcome to CSU Management Information System (MIS) • Please have your
        RFID or Student ID ready • Stay alert for your number announcement •
        Follow University health protocols at all times •
      </div>
    </footer>

    <!-- INTERACTION OVERLAY -->
    <Transition name="fade">
      <div
        v-if="!audioUnlocked"
        @click="unlockAudio"
        class="fixed inset-0 z-[100] bg-[#061a0c]/98 flex items-center justify-center cursor-pointer backdrop-blur-3xl"
      >
        <div class="text-center">
          <div class="mb-10 relative inline-block">
            <div
              class="absolute inset-0 bg-yellow-500 blur-3xl opacity-20 animate-pulse"
            ></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-32 w-32 text-yellow-500 mx-auto relative z-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          </div>
          <h2 class="text-6xl font-black text-white tracking-tighter mb-4">
            CSU QUEUE MONITOR
          </h2>
          <p
            class="text-yellow-500/60 font-bold tracking-[0.5em] uppercase animate-pulse"
          >
            Click anywhere to start
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";

let eventSource = null;
const current = ref("---");
const next = ref("---");
const history = ref([]);
const currentTime = ref("");
const isNew = ref(false);
const audioUnlocked = ref(false);
const lastAnnounced = ref(null);

const updateClock = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const announceTicket = (number) => {
  if (!number || number === "---" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(
    `Now serving ticket number ${number}, Please proceed to the M I S station.`,
  );
  msg.rate = 0.85;
  msg.pitch = 1.1;
  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = voices.find(
    (v) =>
      v.lang.includes("en") &&
      (v.name.includes("Female") || v.name.includes("Google")),
  );
  if (femaleVoice) msg.voice = femaleVoice;
  window.speechSynthesis.speak(msg);
};

const fetchQueue = async () => {
  try {
    const res = await $fetch("/api/queue/display");

    const newCurrent = res.current || "---";

    if (newCurrent !== current.value) {
      if (current.value !== "---") {
        history.value.unshift(current.value);

        if (history.value.length > 5) {
          history.value.pop();
        }
      }

      isNew.value = true;

      setTimeout(() => {
        isNew.value = false;
      }, 8000);

      if (
        audioUnlocked.value &&
        newCurrent !== "---" &&
        lastAnnounced.value !== newCurrent
      ) {
        lastAnnounced.value = newCurrent;
        announceTicket(newCurrent);
      }
    }

    current.value = newCurrent;
    next.value = res.next || "---";
  } catch (err) {
    console.error("Monitor Error:", err);
  }
};

const unlockAudio = () => {
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
  audioUnlocked.value = true;
  if (current.value !== "---") announceTicket(current.value);
};

onMounted(async () => {
  updateClock();

  setInterval(updateClock, 1000);

  await fetchQueue();

  eventSource = new EventSource("/api/queue/events");

  eventSource.onmessage = async (event) => {
    const data = JSON.parse(event.data);

    if (data.heartbeat) return;

    await fetchQueue();

    if (
      audioUnlocked.value &&
      (data.type === "recall" || data.type === "serving")
    ) {
      announceTicket(data.ticket);
    }
  };

  eventSource.onerror = () => {
    console.log("SSE disconnected");
  };

  window.speechSynthesis.getVoices();
});

onBeforeUnmount(() => {
  eventSource?.close();
});
</script>

<style scoped>
/* PREMIUM ANIMATIONS */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.scale-enter-from {
  opacity: 0;
  transform: scale(0.5);
}
.scale-leave-to {
  opacity: 0;
  transform: scale(1.2);
  filter: blur(20px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
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
  animation: marquee 35s linear infinite;
}
</style>
