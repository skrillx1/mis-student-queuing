<template>
  <div
    class="min-h-screen h-screen bg-slate-50 text-slate-800 flex flex-col font-sans overflow-hidden relative select-none antialiased"
  >
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-emerald-100/60 rounded-full blur-[100px] pointer-events-none"
    ></div>
    <div
      class="absolute -top-24 -right-24 w-[30vw] h-[30vh] bg-amber-100/50 rounded-full blur-[80px] pointer-events-none"
    ></div>

    <header
      class="px-4 sm:px-8 py-3.5 sm:py-4 border-b border-emerald-900/10 bg-white/80 backdrop-blur-md flex justify-between items-center z-20 shrink-0 shadow-sm"
    >
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
          Queue Kiosk
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

    <main
      class="flex-grow flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 bg-transparent relative z-10 overflow-hidden min-h-0"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        class="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none"
      >
        <span
          class="text-[25vw] font-black italic tracking-tighter text-emerald-950"
        >
          CSU
        </span>
      </div>

      <div class="z-10 w-full max-w-5xl">
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
            Queue Kiosk
          </div>
        </div>

        <div v-if="step === 'scan'" class="glass-card panel-shell text-center">
          <div class="flex justify-center mb-6">
            <div class="status-icon-wrap">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-16 w-16 text-emerald-700"
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

          <div class="space-y-3 mb-6">
            <div class="chip">Queue Kiosk</div>
            <h2 class="text-3xl sm:text-4xl font-black text-emerald-950">
              Ready to Scan
            </h2>
            <p class="text-sm sm:text-base text-slate-500">
              Please tap your RFID card or choose your service below.
            </p>
          </div>

          <div class="rfid-box">
            <input
              ref="rfidInput"
              v-model="rfid"
              @keyup.enter="scanRFID"
              placeholder="Waiting for RFID..."
              class="rfid-input"
              autofocus
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <button @click="manualEntry" class="action-btn secondary-btn">
              Enter ID Number Manually
            </button>
            <button @click="startIdProcessing" class="action-btn primary-btn">
              Process New ID
            </button>
            <button
              @click="claimStudentId"
              class="action-btn success-btn sm:col-span-2"
            >
              Claim Student ID
            </button>
          </div>
        </div>

        <div v-else-if="step === 'claim'" class="glass-card panel-shell">
          <div class="section-header">
            <div>
              <p class="eyebrow">Claim Student ID</p>
              <h2 class="page-title">Enter your details</h2>
            </div>
            <button @click="step = 'scan'" class="text-btn">Back</button>
          </div>

          <div class="space-y-5 mt-6">
            <label class="field-label">
              Student ID number
              <input
                v-model="claimForm.studid"
                placeholder="e.g. 2023-0001"
                class="form-input"
              />
            </label>

            <label class="field-label">
              First name
              <input
                v-model="claimForm.firstname"
                placeholder="First name"
                class="form-input"
              />
            </label>

            <label class="field-label">
              Last name
              <input
                v-model="claimForm.lastname"
                placeholder="Last name"
                class="form-input"
              />
            </label>

            <button
              @click="reviewClaimForm"
              class="primary-btn action-btn w-full"
            >
              Continue
            </button>
          </div>
        </div>

        <div v-else-if="step === 'claim-review'" class="glass-card panel-shell">
          <div class="section-header center-align">
            <div>
              <p class="eyebrow">Verify details</p>
              <h2 class="page-title">Is this correct?</h2>
            </div>
          </div>

          <div class="confirm-card mt-6">
            <div class="avatar-badge">
              {{ claimForm.firstname?.charAt(0) || "S" }}
            </div>
            <h3 class="text-2xl font-black text-emerald-950">
              {{ claimForm.firstname }} {{ claimForm.lastname }}
            </h3>
            <p class="text-sm text-slate-500">{{ claimForm.studid }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <button @click="step = 'claim'" class="action-btn danger-btn">
              No, edit
            </button>
            <button @click="confirmClaimRequest" class="action-btn primary-btn">
              Yes, correct
            </button>
          </div>
        </div>

        <div v-else-if="step === 'input'" class="glass-card panel-shell">
          <div class="section-header">
            <div>
              <p class="eyebrow">Manual Entry</p>
              <h2 class="page-title">Find your record</h2>
            </div>
            <button @click="step = 'scan'" class="text-btn">Back</button>
          </div>

          <div class="space-y-5 mt-6">
            <label class="field-label">
              Student ID or reference number
              <input
                v-model="studid"
                placeholder="e.g. 2023-0001"
                class="form-input"
              />
            </label>

            <button @click="checkStudent" class="primary-btn action-btn w-full">
              Continue
            </button>
          </div>
        </div>

        <div v-else-if="step === 'confirm'" class="glass-card panel-shell">
          <div class="section-header center-align">
            <div>
              <p class="eyebrow">Confirm Student</p>
              <h2 class="page-title">Is this correct?</h2>
            </div>
          </div>

          <div class="confirm-card mt-6">
            <div class="avatar-badge">
              {{ student?.firstname?.charAt(0) || "S" }}
            </div>
            <h3 class="text-2xl font-black text-emerald-950">
              {{ student?.firstname }} {{ student?.lastname }}
            </h3>
            <p class="text-sm text-slate-500">{{ student?.studid }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <button @click="step = 'input'" class="action-btn danger-btn">
              No, go back
            </button>
            <button @click="confirmBinding" class="action-btn primary-btn">
              Yes, correct
            </button>
          </div>
        </div>

        <div v-else-if="step === 'found'" class="glass-card panel-shell">
          <div class="section-header">
            <div class="flex items-center gap-3 min-w-0">
              <div class="avatar-badge">
                {{ student?.firstname?.charAt(0) || "S" }}
              </div>
              <div class="min-w-0">
                <p class="eyebrow">Welcome back</p>
                <h2 class="page-title truncate">
                  {{ student?.firstname }} {{ student?.lastname }}
                </h2>
              </div>
            </div>
            <button @click="cancelSelection" class="text-btn danger-text">
              Cancel
            </button>
          </div>

          <div class="mt-6">
            <p class="eyebrow mb-3">Choose a service</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                v-for="service in services"
                :key="service"
                @click="selectService(service)"
                class="service-card"
              >
                <span class="font-bold text-lg text-emerald-900">{{
                  service
                }}</span>
                <span class="text-xs text-slate-500">Tap to select</span>
              </button>
            </div>
          </div>
        </div>

        <div v-else-if="step === 'form'" class="glass-card panel-shell">
          <div class="section-header">
            <div>
              <p class="eyebrow">Application</p>
              <h2 class="page-title">ID Processing Form</h2>
            </div>
            <button @click="step = 'scan'" class="text-btn">Cancel</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
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
              placeholder="Student ID Number"
              class="form-input"
            />
            <input
              v-model="form.course"
              placeholder="Course Code"
              class="form-input"
            />
            <div class="md:col-span-2 mt-2 pt-2 border-t border-slate-200">
              <p
                class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400"
              >
                Emergency Contact
              </p>
            </div>
            <input
              v-model="form.contact_name"
              placeholder="Guardian Name"
              class="form-input"
            />
            <input
              v-model="form.contact_number"
              placeholder="Guardian Contact Number"
              class="form-input"
            />
            <input
              v-model="form.contact_address"
              placeholder="Complete Address"
              class="form-input md:col-span-2"
            />
          </div>

          <button
            @click="submitIdProcessing"
            class="action-btn primary-btn w-full mt-6"
          >
            Submit application
          </button>
        </div>

        <div
          v-else-if="step === 'result'"
          class="glass-card panel-shell text-center"
        >
          <div class="flex flex-col items-center">
            <div class="mb-6 relative">
              <svg class="h-28 w-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="44"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="transparent"
                  class="text-slate-200"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="44"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="transparent"
                  :stroke-dasharray="276.5"
                  :stroke-dashoffset="276.5 - (276.5 * countdown) / 6"
                  class="text-amber-500 transition-all duration-1000 ease-linear"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-3xl font-black text-amber-600">{{
                  countdown
                }}</span>
              </div>
            </div>

            <p class="eyebrow">Your Priority Number</p>
            <h1 class="number-display">{{ queueNumber }}</h1>

            <div class="info-strip mt-6">
              <div
                class="flex items-center justify-center gap-3 text-amber-700 font-bold"
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
                Please take a picture
              </div>
              <p class="mt-3 text-sm text-slate-500">
                Keep a copy of your number. This screen resets automatically.
              </p>
            </div>

            <button @click="forceReset" class="action-btn danger-btn mt-8">
              Close & finish
            </button>
          </div>
        </div>
      </div>
    </main>

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
const currentTime = ref(
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
);

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

const claimForm = reactive({
  firstname: "",
  lastname: "",
  studid: "",
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

/* ================= CLAIM STUDENT ID ================= */
const claimStudentId = () => {
  claimForm.firstname = "";
  claimForm.lastname = "";
  claimForm.studid = "";
  step.value = "claim";
};

const reviewClaimForm = () => {
  if (!claimForm.studid || !claimForm.firstname || !claimForm.lastname) {
    alert("Please enter your student ID number, first name, and last name.");
    return;
  }

  step.value = "claim-review";
};

const confirmClaimRequest = async () => {
  const res = await $fetch("/api/queue", {
    method: "POST",
    body: {
      service: "Claim Student ID",
      studid: claimForm.studid || null,
      firstname: claimForm.firstname,
      middlename: "",
      lastname: claimForm.lastname,
    },
  });

  queueNumber.value = res.queueNumber;
  step.value = "result";
  startCountdown();
  Object.keys(claimForm).forEach((key) => (claimForm[key] = ""));
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
  Object.keys(claimForm).forEach((key) => (claimForm[key] = ""));
  clearForm();
  focusRFID();
};

/* ================= RFID FLOW ================= */
const lastScannedRFID = ref("");

const scanRFID = async () => {
  if (!rfid.value) return;

  lastScannedRFID.value = rfid.value;

  const res = await $fetch("/api/scan", {
    method: "POST",
    body: { rfid: rfid.value },
  });

  student.value = res.status === "found" ? res.student : null;
  step.value = res.status === "found" ? "found" : "input";

  rfid.value = "";
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
  step.value = "confirm";
};

/* ================= CONFIRMATION & BINDING ================= */
const confirmBinding = async () => {
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

  step.value = "found";
  studid.value = "";
  lastScannedRFID.value = "";
};

/* ================= SERVICE ================= */
const selectService = (service) => {
  selectedService.value = service;

  if (service === "ID Processing") {
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

  const updateClock = () => {
    currentTime.value = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  updateClock();
  const clockInterval = setInterval(updateClock, 1000 * 30);
  onUnmounted(() => clearInterval(clockInterval));
});

onUnmounted(() => {
  window.removeEventListener("click", keepFocus);
});
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(6, 78, 59, 0.08);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.panel-shell {
  @apply rounded-[28px] p-5 sm:p-8 border border-slate-200/80 shadow-sm;
}

.status-icon-wrap {
  @apply flex items-center justify-center rounded-full bg-emerald-100 border border-emerald-200 p-6 shadow-sm;
}

.chip {
  @apply inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-800;
}

.section-header {
  @apply flex items-center justify-between gap-3 border-b border-slate-100 pb-4;
}

.center-align {
  @apply justify-center text-center;
}

.eyebrow {
  @apply text-[10px] font-black uppercase tracking-[0.25em] text-slate-400;
}

.page-title {
  @apply mt-1 text-2xl font-black text-emerald-950;
}

.rfid-box {
  @apply rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3 shadow-inner;
}

.rfid-input {
  @apply w-full bg-white/90 border border-emerald-200 rounded-2xl p-4 text-center text-lg font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all;
}

.field-label {
  @apply block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500;
}

.form-input {
  @apply mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all;
}

.action-btn {
  @apply inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-200 active:scale-[0.98] shadow-sm;
}

.primary-btn {
  @apply bg-emerald-900 text-white hover:bg-emerald-800;
}

.secondary-btn {
  @apply border border-slate-200 bg-white text-slate-700 hover:bg-slate-50;
}

.success-btn {
  @apply bg-amber-500 text-emerald-950 hover:bg-amber-400;
}

.danger-btn {
  @apply border border-red-200 bg-red-50 text-red-700 hover:bg-red-100;
}

.text-btn {
  @apply rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-100 transition-colors;
}

.danger-text {
  @apply text-red-600 hover:text-red-700;
}

.confirm-card {
  @apply flex flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-emerald-50/80 p-6 text-center;
}

.avatar-badge {
  @apply flex h-16 w-16 items-center justify-center rounded-full bg-emerald-900 text-xl font-black text-amber-400 shadow-md;
}

.service-card {
  @apply flex min-h-[110px] flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md active:scale-[0.99];
}

.info-strip {
  @apply w-full max-w-md rounded-2xl border border-amber-100 bg-amber-50/80 p-4 text-center;
}

.number-display {
  @apply my-2 text-6xl sm:text-7xl md:text-8xl font-black leading-none tracking-tight text-amber-600 drop-shadow-[0_10px_30px_rgba(245,158,11,0.18)];
}

@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  animation: marquee 18s linear infinite;
}
</style>
