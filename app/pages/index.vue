<template>
  <div
    class="min-h-screen bg-[#0a210f] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#143a1b] via-[#0a210f] to-[#051308] text-slate-100 flex items-center justify-center p-6 font-sans"
  >
    <div
      class="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden min-h-[500px] flex flex-col"
    >
      <!-- HEADER SECTION - Stays consistent -->
      <div class="p-8 text-center border-b border-white/5">
        <h1
          class="text-3xl font-black tracking-tight text-yellow-500 uppercase"
        >
          CSU Queuing System
        </h1>
        <p class="text-slate-400 text-sm mt-1">
          Management Information System Services
        </p>
      </div>

      <div class="p-8 flex-grow flex flex-col justify-center">
        <!-- STEP: SCAN -->
        <div
          v-if="step === 'scan'"
          class="space-y-8 py-4 text-center animate-in fade-in zoom-in-95"
        >
          <div class="flex justify-center">
            <div class="p-6 bg-yellow-500/10 rounded-full animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-16 w-16 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
          </div>
          <div class="space-y-2">
            <h2 class="text-2xl font-semibold">Ready to Scan</h2>
            <p class="text-slate-400">
              Please tap your RFID card on the reader
            </p>
          </div>
          <input
            ref="rfidInput"
            v-model="rfid"
            @keyup.enter="scanRFID"
            placeholder="Waiting for RFID..."
            class="w-full bg-black/40 border-2 border-white/10 rounded-2xl p-5 text-center text-xl focus:border-yellow-500 focus:outline-none transition-all placeholder:text-slate-600"
            autofocus
          />
          <div class="space-y-2">
            <button
              @click="manualEntry"
              class="w-full bg-white/5 hover:bg-white/10 py-3 rounded-xl text-sm font-medium"
            >
              Enter ID Number Manually
            </button>

            <button
              @click="startIdProcessing"
              class="w-full bg-yellow-500/20 hover:bg-yellow-500 text-yellow-400 hover:text-[#0a210f] py-3 rounded-xl font-bold transition"
            >
              No ID yet? Process New ID
            </button>
          </div>
        </div>

        <!-- STEP: MANUAL INPUT -->
        <div
          v-if="step === 'input'"
          class="space-y-6 animate-in slide-in-from-right-4"
        >
          <h2 class="text-xl font-bold">Manual Entry</h2>
          <div class="space-y-4">
            <input
              v-model="studid"
              placeholder="e.g. 2023-0001"
              class="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-yellow-500 outline-none"
            />
            <div class="flex gap-3">
              <button
                @click="step = 'scan'"
                class="w-1/3 bg-white/10 hover:bg-white/20 py-4 rounded-xl font-bold transition-all"
              >
                Back
              </button>
              <button
                @click="checkStudent"
                class="w-2/3 bg-yellow-500 hover:bg-yellow-400 text-[#0a210f] font-bold py-4 rounded-xl transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        </div>

        <!-- STEP: CONFIRM -->
        <div
          v-if="step === 'confirm'"
          class="space-y-6 text-center animate-in zoom-in-95"
        >
          <h2 class="text-xl font-bold text-yellow-500">Confirm Student</h2>

          <div class="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <p class="text-slate-400 text-sm">Is this correct?</p>

            <h1 class="text-3xl font-bold mt-2">
              {{ student?.firstname }} {{ student?.lastname }}
            </h1>

            <p class="text-slate-400 mt-1">
              {{ student?.studid }}
            </p>
          </div>

          <div class="flex gap-4">
            <!-- NO -->
            <button
              @click="step = 'input'"
              class="w-1/2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-4 rounded-xl font-bold transition"
            >
              No, Go Back
            </button>

            <!-- YES -->
            <button
              @click="confirmBinding"
              class="w-1/2 bg-yellow-500 hover:bg-yellow-400 text-[#0a210f] py-4 rounded-xl font-bold transition"
            >
              Yes, Correct
            </button>
          </div>
        </div>

        <!-- STEP: FOUND / SERVICES -->
        <div
          v-if="step === 'found'"
          class="space-y-8 animate-in slide-in-from-right-8"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div
                class="h-12 w-12 bg-yellow-500 rounded-full flex items-center justify-center text-[#0a210f] font-bold text-xl"
              >
                {{ student?.firstname[0] }}
              </div>
              <div>
                <p class="text-slate-400 text-sm">Welcome back,</p>
                <h2 class="text-2xl font-bold">
                  {{ student?.firstname }} {{ student?.lastname }}
                </h2>
              </div>
            </div>

            <!-- LARGE USER-FRIENDLY CANCEL BAR -->
            <div class="mt-auto pt-6 border-t border-white/5">
              <button
                @click="cancelSelection"
                class="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-500 transition-all font-bold uppercase tracking-widest active:scale-95"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Cancel
              </button>
            </div>
          </div>

          <!-- SERVICES GRID -->
          <div class="grid grid-cols-2 gap-4">
            <button
              v-for="service in services"
              :key="service"
              @click="selectService(service)"
              class="p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-yellow-500 hover:text-[#0a210f] transition-all group active:scale-95"
            >
              <span class="block font-semibold">{{ service }}</span>
              <span class="text-xs opacity-60 group-hover:opacity-100"
                >Tap to select</span
              >
            </button>
          </div>
        </div>

        <!-- STEP: ID FORM (MODERN KIOSK MODE) -->
        <div
          v-if="step === 'form'"
          class="space-y-4 animate-in slide-in-from-bottom-8"
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-yellow-500 uppercase">
              ID Processing Form
            </h2>
            <button
              @click="step = 'scan'"
              class="text-slate-400 text-sm hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              v-model="form.firstname"
              placeholder="First Name"
              class="form-input"
            />
            <input
              v-model="form.middlename"
              placeholder="Middle Name"
              class="form-input"
            />
            <input
              v-model="form.lastname"
              placeholder="Last Name"
              class="form-input md:col-span-2"
            />
            <input
              v-model="form.studid"
              placeholder="Student ID"
              class="form-input"
            />
            <input
              v-model="form.course"
              placeholder="Course"
              class="form-input"
            />
            <div class="md:col-span-2 border-t border-white/5 pt-2 mt-2">
              <p class="text-xs text-slate-500">Emergency Contact</p>
            </div>
            <input
              v-model="form.contact_name"
              placeholder="Name"
              class="form-input"
            />
            <input
              v-model="form.contact_number"
              placeholder="Number"
              class="form-input"
            />
            <input
              v-model="form.contact_address"
              placeholder="Full Address"
              class="form-input md:col-span-2"
            />
          </div>

          <button
            @click="submitIdProcessing"
            class="w-full bg-yellow-500 hover:bg-yellow-400 text-[#0a210f] font-black py-5 rounded-2xl shadow-lg mt-4 uppercase tracking-widest active:scale-95 transition-all"
          >
            Submit Application
          </button>
        </div>

        <!-- STEP: RESULT (SUCCESS SCREEN) -->
        <div
          v-if="step === 'result'"
          class="py-6 text-center animate-in zoom-in-95 flex flex-col items-center"
        >
          <!-- Visual Success Indicator -->
          <div class="mb-6 relative">
            <!-- Progress Ring Background -->
            <svg class="h-24 w-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                stroke-width="8"
                fill="transparent"
                class="text-white/10"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                stroke-width="8"
                fill="transparent"
                :stroke-dasharray="251.2"
                :stroke-dashoffset="251.2 - (251.2 * countdown) / 6"
                class="text-yellow-500 transition-all duration-1000 ease-linear"
              />
            </svg>
            <!-- Counter Number inside Ring -->
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-2xl font-black text-yellow-500">{{
                countdown
              }}</span>
            </div>
          </div>

          <p class="text-slate-400 uppercase tracking-[0.2em] text-sm">
            Your Priority Number
          </p>

          <h1
            class="text-9xl font-black text-yellow-500 my-2 drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]"
          >
            {{ queueNumber }}
          </h1>

          <!-- Instruction for User -->
          <div
            class="mt-4 p-6 bg-white/5 border border-white/10 rounded-2xl max-w-sm"
          >
            <div
              class="flex items-center justify-center gap-3 text-yellow-500 mb-2"
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
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span class="font-bold uppercase text-sm"
                >Please take a picture</span
              >
            </div>
            <p class="text-slate-300 text-sm leading-relaxed">
              Keep a copy of your number. This screen will reset automatically.
            </p>
          </div>

          <!-- Manual Close Button -->
          <button
            @click="forceReset"
            class="mt-10 px-10 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 rounded-xl text-red-500 font-bold transition-all active:scale-95 flex items-center gap-2"
          >
            Close & Finish
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from "vue";

/* ================= STATE ================= */
const step = ref("scan");
const rfid = ref("");
const studid = ref("");
const student = ref(null);
const selectedService = ref(null);
const queueNumber = ref(null);
const countdown = ref(10);

const rfidInput = ref(null);
let timerInterval = null;

/* ================= FORM ================= */
const form = reactive({
  firstname: "",
  middlename: "",
  lastname: "",
  studid: "",
  course: "",
  contact_name: "",
  contact_address: "",
  contact_number: "",
});

// Disable default layout (AppHeader and AppSidebar) for this page
definePageMeta({
  layout: false,
});

/* ================= ENTRY POINT FOR ID PROCESSING ================= */
const startIdProcessing = () => {
  clearForm();
  step.value = "form";
};

/* ================= CONSTANTS ================= */
const services = ["Re-ID", "Account Problem", "Clearance Signing", "Inquiry"];

/* ================= HELPERS ================= */
const clearForm = () => {
  Object.keys(form).forEach((key) => (form[key] = ""));
};

const focusRFID = async () => {
  await nextTick();
  rfidInput.value?.focus();
};

const resetState = () => {
  step.value = "scan";
  student.value = null;
  studid.value = "";
  rfid.value = "";
  queueNumber.value = null;
  clearForm();
  focusRFID();
};

/* ================= RFID FLOW ================= */
const lastScannedRFID = ref(""); // ADD THIS

const scanRFID = async () => {
  if (!rfid.value) return;

  lastScannedRFID.value = rfid.value; // SAVE IT FIRST

  const res = await $fetch("/api/scan", {
    method: "POST",
    body: { rfid: rfid.value },
  });

  student.value = res.status === "found" ? res.student : null;
  step.value = res.status === "found" ? "found" : "input";

  rfid.value = ""; // safe to clear
};

const manualEntry = () => (step.value = "input");

/* ================= STUDENT ================= */
const checkStudent = async () => {
  if (!studid.value) return;

  const res = await $fetch("/api/scan-studid", {
    method: "POST",
    body: { studid: studid.value },
  });

  if (res.status !== "found") {
    alert("Student record not found.");
    return;
  }

  student.value = res.student;

  // 👉 go to confirmation instead of binding
  step.value = "confirm";
};

/* ================= CONFIRMATION & BINDING ================= */
const confirmBinding = async () => {
  // only bind if RFID came from scan
  if (lastScannedRFID.value) {
    const bindRes = await $fetch("/api/bind", {
      method: "POST",
      body: {
        studid: student.value.studid,
        rfid: lastScannedRFID.value,
      },
    });

    if (bindRes.status !== "bound") {
      alert("Failed to bind RFID.");
      return;
    }

    student.value = bindRes.student;
  }

  // move forward
  step.value = "found";

  // cleanup
  studid.value = "";
  lastScannedRFID.value = "";
};

/* ================= SERVICE ================= */
const selectService = (service) => {
  selectedService.value = service;

  if (service === "ID Processing") {
    // prefill
    form.firstname = student.value?.firstname || "";
    form.lastname = student.value?.lastname || "";
    form.studid = student.value?.studid || "";

    step.value = "form";
  } else {
    createQueue(service);
  }
};

/* ================= QUEUE ================= */
const createQueue = async (service) => {
  const res = await $fetch("/api/queue", {
    method: "POST",
    body: {
      service,
      studid: student.value?.studid || form.studid || null,

      firstname: student.value?.firstname || form.firstname,
      middlename: student.value?.middlename || form.middlename,
      lastname: student.value?.lastname || form.lastname,
    },
  });

  queueNumber.value = res.queueNumber;
  step.value = "result";

  startCountdown();
};

/* ================= FORM SUBMIT ================= */
const submitIdProcessing = async () => {
  await $fetch("/api/id-processing", {
    method: "POST",
    body: form,
  });

  await createQueue("ID Processing");
};

/* ================= COUNTDOWN ================= */
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
  resetState();
};

/* ================= CANCEL ================= */
const cancelSelection = () => {
  resetState();
};

/* ================= FOCUS CONTROL ================= */
const keepFocus = (event) => {
  if (step.value !== "scan") return;

  const allowed = ["BUTTON", "INPUT", "TEXTAREA", "A"];
  if (!allowed.includes(event.target.tagName)) {
    rfidInput.value?.focus();
  }
};

onMounted(() => {
  window.addEventListener("click", keepFocus);
  window.addEventListener("focus", focusRFID);
  focusRFID();
});

onUnmounted(() => {
  window.removeEventListener("click", keepFocus);
});
</script>

<style scoped>
.form-input {
  @apply w-full bg-white/10 border border-white/10 rounded-xl p-3 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder:text-slate-500 text-white;
}

.animate-in {
  animation-duration: 400ms;
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
