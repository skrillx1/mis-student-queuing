<template>
  <div
    class="min-h-screen bg-[#0a210f] text-white flex font-sans selection:bg-yellow-500/30"
  >
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-24 -left-24 w-96 h-96 bg-green-700/20 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"
      ></div>
    </div>

    <div
      class="w-[35%] lg:w-[30%] z-10 p-10 bg-black/30 backdrop-blur-md border-r border-white/10 flex flex-col shadow-2xl"
    >
      <div class="mb-10 flex items-center gap-4">
        <div
          class="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.4)]"
        >
          <span class="text-green-900 font-black text-xl">C</span>
        </div>
        <div>
          <h1
            class="text-2xl font-black tracking-tighter text-yellow-500 uppercase"
          >
            CSUCC MIS
          </h1>
          <p
            class="text-[10px] uppercase tracking-[0.2em] text-green-400 font-bold"
          >
            RFID Queuing System
          </p>
        </div>
      </div>

      <div class="flex-grow flex flex-col justify-center">
        <div v-if="step === 'scan'" class="space-y-6">
          <div class="space-y-2">
            <h2 class="text-3xl font-bold">Ready to Scan</h2>
            <p class="text-slate-400 text-sm">
              Please tap your Student ID on the RFID reader to begin.
            </p>
          </div>

          <div class="relative group">
            <div
              class="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-green-600 rounded-xl blur opacity-25 group-focus-within:opacity-75 transition duration-1000"
            ></div>
            <input
              v-model="rfid"
              placeholder="Waiting for RFID..."
              @keyup.enter="scanRFID"
              autofocus
              class="relative w-full p-5 rounded-xl bg-slate-900 border border-white/10 outline-none focus:border-yellow-500 transition-all text-xl font-mono tracking-widest text-yellow-400"
            />
          </div>

          <div class="flex items-center gap-4 py-2">
            <div class="h-[1px] flex-grow bg-white/10"></div>
            <span class="text-xs text-slate-500 uppercase font-bold">Or</span>
            <div class="h-[1px] flex-grow bg-white/10"></div>
          </div>

          <button
            @click="manualEntry"
            class="w-full py-4 px-6 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-yellow-500/50 transition-all text-sm font-semibold text-slate-300"
          >
            Forgot ID? Enter Manually
          </button>
        </div>

        <div
          v-if="step === 'input'"
          class="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div
            class="bg-gradient-to-br from-slate-900 to-black p-8 rounded-2xl border border-yellow-500/30 shadow-xl"
          >
            <div
              class="w-12 h-12 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center mb-4"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-white">
              {{ lastScannedRFID ? "Register RFID" : "Manual Entry" }}
            </h2>
            <p class="text-sm text-slate-400 mt-2">
              Please provide your official Student ID number.
            </p>

            <input
              v-model="studid"
              placeholder="e.g. 2023-0001"
              @keyup.enter="checkStudent"
              class="w-full mt-6 p-4 rounded-xl bg-black border border-white/10 focus:border-yellow-500 outline-none transition-all"
            />

            <div class="grid grid-cols-2 gap-3 mt-6">
              <button
                @click="resetAll"
                class="py-3 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                @click="checkStudent"
                class="py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-green-950 font-bold transition-transform active:scale-95 shadow-lg shadow-yellow-500/20"
              >
                Continue
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="step === 'confirm'"
          class="bg-green-900/40 p-8 rounded-2xl border border-green-500/30 text-center"
        >
          <p
            class="text-green-400 text-xs font-bold uppercase tracking-widest mb-2"
          >
            Confirm Identity
          </p>
          <h2 class="text-2xl font-bold mb-6 italic">
            "{{ student.firstname }} {{ student.lastname }}"
          </h2>
          <button
            @click="confirmBind"
            class="w-full py-4 bg-green-500 hover:bg-green-400 text-green-950 font-black rounded-xl mb-3 shadow-lg transition-all"
          >
            YES, THAT'S ME
          </button>
          <button
            @click="step = 'input'"
            class="text-slate-400 text-sm hover:text-white transition-colors"
          >
            Not you? Click here
          </button>
        </div>

        <div
          v-if="
            step === 'found' || (step === 'result' && bindStatus === 'success')
          "
          class="text-center p-10 bg-yellow-500 rounded-3xl shadow-[0_20px_50px_rgba(234,179,8,0.3)] animate-bounce-short"
        >
          <span class="text-6xl mb-4 block">🎊</span>
          <h2 class="text-green-950 text-3xl font-black italic uppercase">
            Welcome!
          </h2>
          <p class="text-green-900 font-bold text-xl mt-2">
            {{ student?.firstname }}
          </p>
          <div
            class="mt-6 py-2 px-4 bg-green-900/10 rounded-full inline-block text-green-900 text-xs font-bold uppercase tracking-tighter"
          >
            Positioned in Queue
          </div>
        </div>
      </div>

      <div
        class="mt-auto pt-6 border-t border-white/5 text-[10px] text-slate-500 text-center italic"
      >
        Property of CSUCC Management Information System © 2026
      </div>
    </div>

    <div
      class="flex-grow flex flex-col items-center justify-center relative overflow-hidden"
    >
      <div
        class="absolute opacity-[0.03] pointer-events-none transform -rotate-12 scale-150"
      >
        <h1 class="text-[40rem] font-black">CSU</h1>
      </div>

      <div class="relative z-10 flex flex-col items-center gap-12">
        <div class="text-center group">
          <div
            class="inline-block px-6 py-1 bg-yellow-500 text-green-950 font-black text-sm uppercase tracking-[0.4em] rounded-full mb-4 shadow-xl"
          >
            Now Serving
          </div>
          <div class="relative">
            <div
              class="absolute inset-0 bg-yellow-500/20 blur-[100px] rounded-full"
            ></div>
            <h1
              class="text-[14rem] leading-none font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 drop-shadow-2xl"
            >
              {{ currentQueue }}
            </h1>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 w-full max-w-md">
          <div
            class="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex items-center justify-between shadow-2xl"
          >
            <span
              class="text-green-400 font-bold uppercase tracking-widest text-sm"
              >Next in Line</span
            >
            <span class="text-5xl font-black text-yellow-500 italic">{{
              nextQueue
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const step = ref("scan");

const rfid = ref("");
const studid = ref("");
const student = ref(null);
const bindStatus = ref("");

const lastScannedRFID = ref("");

// QUEUE
const currentQueue = ref("Q-001");
const nextQueue = ref("Q-002");

// SCAN RFID
const scanRFID = async () => {
  if (!rfid.value) return;

  const scannedRFID = rfid.value;
  lastScannedRFID.value = scannedRFID;

  rfid.value = "";

  const res = await $fetch("/api/scan", {
    method: "POST",
    body: { rfid: scannedRFID },
  });

  if (res.status === "found") {
    student.value = res.student;
    step.value = "found";

    generateQueue();
    autoReset();
  } else {
    step.value = "input";
  }
};

const manualEntry = () => {
  lastScannedRFID.value = ""; // 🔥 no RFID
  step.value = "input";
};

// CHECK STUDENT
const checkStudent = async () => {
  if (!studid.value) return;

  const res = await $fetch("/api/scan-studid", {
    method: "POST",
    body: { studid: studid.value },
  });

  if (res.status === "found") {
    student.value = res.student;

    // 🔥 IF RFID EXISTS → bind flow
    if (lastScannedRFID.value) {
      step.value = "confirm";
    }
    // 🔥 IF MANUAL → skip binding, go directly to found
    else {
      step.value = "found";
      generateQueue();
      autoReset();
    }
  } else {
    alert("Student not found");
  }
};

// CONFIRM BIND
const confirmBind = async () => {
  const res = await $fetch("/api/bind", {
    method: "POST",
    body: {
      studid: studid.value,
      rfid: lastScannedRFID.value,
    },
  });

  bindStatus.value = res.status === "bound" ? "success" : "failed";
  step.value = "result";

  autoReset();
};

// QUEUE
const generateQueue = () => {
  let num = parseInt(currentQueue.value.split("-")[1]);
  num++;

  currentQueue.value = `Q-${String(num).padStart(3, "0")}`;
  nextQueue.value = `Q-${String(num + 1).padStart(3, "0")}`;
};

// RESET SYSTEM
const resetAll = () => {
  step.value = "scan";
  rfid.value = "";
  studid.value = "";
  student.value = null;
  bindStatus.value = "";
};

// AUTO RESET AFTER RESULT
const autoReset = () => {
  setTimeout(() => {
    resetAll();
  }, 2000);
};
</script>

<style scoped>
@keyframes bounce-short {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
.animate-bounce-short {
  animation: bounce-short 2s ease-in-out infinite;
}
</style>
