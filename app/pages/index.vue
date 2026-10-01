<template>
  <div
    @contextmenu.prevent
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
        <!-- SCAN STEP -->
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

        <!-- CLAIM STUDENT ID - ENTER ID -->
        <div v-else-if="step === 'claim'" class="glass-card panel-shell">
          <div class="section-header">
            <div>
              <p class="eyebrow">Claim Student ID</p>
              <h2 class="page-title">Enter Student ID Number</h2>
            </div>

            <button @click="step = 'scan'" class="text-btn">Back</button>
          </div>

          <div class="space-y-5 mt-6">
            <label class="field-label">
              Student ID number
              <input
                v-model="claimForm.studid"
                @keyup.enter="reviewClaimForm"
                placeholder="e.g. 2023-0001"
                class="form-input"
                autofocus
              />
            </label>

            <button
              @click="reviewClaimForm"
              class="primary-btn action-btn w-full"
            >
              Verify Student
            </button>
          </div>
        </div>

        <!-- CLAIM STUDENT ID - VERIFY NAME -->
        <div v-else-if="step === 'claim-review'" class="glass-card panel-shell">
          <div class="section-header center-align">
            <div>
              <p class="eyebrow">Verify Student Details</p>
              <h2 class="page-title">Is this correct?</h2>
            </div>
          </div>

          <div class="confirm-card mt-6">
            <div class="avatar-badge">
              {{
                student?.fullname?.charAt(0) ||
                student?.firstname?.charAt(0) ||
                "S"
              }}
            </div>

            <h3 class="text-2xl font-black text-emerald-950">
              {{
                student?.fullname ||
                `${student?.firstname || ""} ${student?.lastname || ""}`.trim()
              }}
            </h3>

            <p class="text-sm text-slate-500 font-mono mt-1">
              {{ student?.studid }}
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <button @click="step = 'claim'" class="action-btn danger-btn">
              No, go back
            </button>

            <button @click="confirmClaimRequest" class="action-btn primary-btn">
              Yes, correct
            </button>
          </div>
        </div>

        <!-- MANUAL ENTRY STEP -->
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

        <!-- CONFIRM BINDING STEP -->
        <div v-else-if="step === 'confirm'" class="glass-card panel-shell">
          <div class="section-header center-align">
            <div>
              <p class="eyebrow">Confirm Student</p>
              <h2 class="page-title">Is this correct?</h2>
            </div>
          </div>

          <div class="confirm-card mt-6">
            <div class="avatar-badge">
              {{
                student?.fullname?.charAt(0) ||
                student?.firstname?.charAt(0) ||
                "S"
              }}
            </div>

            <h3 class="text-2xl font-black text-emerald-950">
              {{
                student?.fullname ||
                `${student?.firstname || ""} ${student?.lastname || ""}`.trim()
              }}
            </h3>

            <p class="text-sm text-slate-500 font-mono mt-1">
              {{ student?.studid }}
            </p>
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

        <!-- FOUND / CHOOSE SERVICE STEP -->
        <div v-else-if="step === 'found'" class="glass-card panel-shell">
          <div class="section-header">
            <div class="flex items-center gap-3 min-w-0">
              <div class="avatar-badge">
                {{
                  student?.fullname?.charAt(0) ||
                  student?.firstname?.charAt(0) ||
                  "S"
                }}
              </div>

              <div class="min-w-0">
                <p class="eyebrow">Welcome back</p>

                <h2 class="page-title truncate">
                  {{
                    student?.fullname ||
                    `${student?.firstname || ""} ${student?.lastname || ""}`.trim()
                  }}
                </h2>

                <p
                  v-if="student?.studid"
                  class="text-xs text-slate-500 font-mono"
                >
                  {{ student.studid }}
                </p>
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
                <span class="font-bold text-lg text-emerald-900">
                  {{ service }}
                </span>

                <span class="text-xs text-slate-500"> Tap to select </span>
              </button>
            </div>
          </div>
        </div>

        <!-- ID PROCESSING FORM -->
        <div
          v-else-if="step === 'form'"
          class="glass-card panel-shell max-h-[85vh] overflow-y-auto custom-scrollbar p-5 sm:p-7"
        >
          <!-- Header -->
          <div
            class="section-header pb-4 border-b border-slate-200/80 flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div
                class="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl shadow-sm"
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
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3 3 0 00-3 3h6a3 3 0 00-3-3z"
                  />
                </svg>
              </div>

              <div>
                <p
                  class="eyebrow text-emerald-700 font-bold uppercase tracking-wider text-xs"
                >
                  Application
                </p>

                <h2
                  class="page-title text-xl sm:text-2xl font-black text-emerald-950"
                >
                  ID Processing Form
                </h2>
              </div>
            </div>

            <button
              @click="step = 'scan'"
              type="button"
              class="px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Cancel
            </button>
          </div>

          <form @submit.prevent="submitIdProcessing" class="space-y-5 mt-5">
            <!-- SECTION 1: Personal Details -->
            <div
              class="bg-white/70 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4"
            >
              <div
                class="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>

                Personal Information
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-600 mb-1.5">
                    First Name
                    <span class="text-rose-500">*</span>
                  </label>

                  <input
                    v-model="form.firstname"
                    type="text"
                    placeholder="e.g. Juan"
                    class="form-input w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white/90 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                    required
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-600 mb-1.5">
                    Middle Name
                  </label>

                  <input
                    v-model="form.middlename"
                    type="text"
                    placeholder="e.g. Santos"
                    class="form-input w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white/90 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-600 mb-1.5">
                    Last Name
                    <span class="text-rose-500">*</span>
                  </label>

                  <input
                    v-model="form.lastname"
                    type="text"
                    placeholder="e.g. Dela Cruz"
                    class="form-input w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white/90 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- SECTION 2: Academic Info -->
            <div
              class="relative z-20 bg-white/70 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4"
            >
              <div
                class="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  />
                </svg>

                Academic Details
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <!-- Student ID -->
                <div class="md:col-span-1">
                  <label class="block text-xs font-bold text-slate-600 mb-1.5">
                    Student ID
                    <span class="text-rose-500">*</span>
                  </label>

                  <input
                    v-model="form.studid"
                    type="text"
                    placeholder="e.g. 2023-0001"
                    class="form-input w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white/90 text-sm font-mono font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                    required
                  />
                </div>

                <!-- Course & Program Combobox -->
                <div class="md:col-span-2 relative">
                  <label class="block text-xs font-bold text-slate-600 mb-1.5">
                    Course & Program
                    <span class="text-rose-500">*</span>
                  </label>

                  <div class="relative">
                    <input
                      v-model="form.course"
                      @focus="showCourseDropdown = true"
                      @input="showCourseDropdown = true"
                      @keydown.escape="showCourseDropdown = false"
                      type="text"
                      placeholder="Type course code or program name..."
                      class="form-input w-full px-3.5 py-2.5 pr-11 rounded-xl border border-slate-300 bg-white/90 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                      autocomplete="off"
                      required
                    />

                    <!-- Dropdown Icon -->
                    <button
                      type="button"
                      @click="toggleCourseDropdown"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-700 transition-colors"
                      aria-label="Toggle course list"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 transition-transform duration-200"
                        :class="{ 'rotate-180': showCourseDropdown }"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>

                  <!-- Suggestions Popover List -->
                  <div
                    v-if="showCourseDropdown && filteredCourses.length > 0"
                    class="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl divide-y divide-slate-100"
                  >
                    <button
                      v-for="item in filteredCourses"
                      :key="item.code"
                      type="button"
                      @click="selectCourse(item.code)"
                      class="w-full text-left px-3.5 py-2.5 text-xs hover:bg-emerald-50 hover:text-emerald-900 transition flex items-center justify-between gap-2 group"
                    >
                      <span
                        class="font-bold text-emerald-800 group-hover:text-emerald-950 shrink-0"
                      >
                        {{ item.code }}
                      </span>

                      <span
                        class="text-slate-500 text-[11px] truncate max-w-[280px] ml-2"
                      >
                        {{ item.label }}
                      </span>
                    </button>
                  </div>

                  <!-- No Results -->
                  <div
                    v-else-if="
                      showCourseDropdown &&
                      form.course &&
                      filteredCourses.length === 0
                    "
                    class="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl px-4 py-3"
                  >
                    <p class="text-xs text-slate-500 text-center">
                      No matching course or program found.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- SECTION 3: Emergency Contact -->
            <div
              class="relative z-10 bg-white/70 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4"
            >
              <div
                class="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>

                Emergency Contact Information
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-600 mb-1.5">
                    Guardian / Parent Name
                    <span class="text-rose-500">*</span>
                  </label>

                  <input
                    v-model="form.contact_name"
                    type="text"
                    placeholder="Full Name"
                    class="form-input w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white/90 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                    required
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-600 mb-1.5">
                    Guardian Contact Number
                    <span class="text-rose-500">*</span>
                  </label>

                  <input
                    v-model="form.contact_number"
                    type="tel"
                    placeholder="e.g. 09123456789"
                    class="form-input w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white/90 text-sm font-mono font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                    required
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-xs font-bold text-slate-600 mb-1.5">
                    Complete Address
                    <span class="text-rose-500">*</span>
                  </label>

                  <input
                    v-model="form.contact_address"
                    type="text"
                    placeholder="House / Street / Barangay / Municipality / Province"
                    class="form-input w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white/90 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="action-btn primary-btn w-full py-3.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-base shadow-lg shadow-emerald-950/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>

              Submit Application
            </button>
          </form>
        </div>

        <!-- RESULT STEP -->
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
                <span class="text-3xl font-black text-amber-600">
                  {{ countdown }}
                </span>
              </div>
            </div>

            <p class="eyebrow">Your Priority Number</p>

            <h1 class="number-display">
              {{ queueNumber }}
            </h1>

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
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from "vue";

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
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
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
  studid: "",
});

/* ================= COURSE COMBOBOX ================= */
const showCourseDropdown = ref(false);

const courseList = [
  {
    code: "BSA",
    label: "BACHELOR OF SCIENCE IN ACCOUNTANCY",
  },
  {
    code: "BSMA",
    label: "BACHELOR OF SCIENCE IN MANAGEMENT ACCOUNTING",
  },
  {
    code: "BSOA",
    label: "BACHELOR OF SCIENCE IN OFFICE ADMINISTRATION",
  },
  {
    code: "BSEntrep",
    label: "BACHELOR OF SCIENCE IN ENTREPRENEURSHIP",
  },
  {
    code: "BSBA-HRM",
    label:
      "BACHELOR OF SCIENCE IN BUSINESS ADMINISTRATION MAJOR IN HUMAN RESOURCE",
  },
  {
    code: "BSBA-FM",
    label:
      "BACHELOR OF SCIENCE IN BUSINESS ADMINISTRATION MAJOR IN FINANCIAL MANAGEMENT",
  },
  {
    code: "BSBA-MM",
    label:
      "BACHELOR OF SCIENCE IN BUSINESS ADMINISTRATION MAJOR IN MARKETING MANAGEMENT",
  },
  {
    code: "BSINFOTECH",
    label: "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY",
  },
  {
    code: "BSEE",
    label: "BACHELOR OF SCIENCE IN ELECTRICAL ENGINEERING",
  },
  {
    code: "BSCpE",
    label: "BACHELOR OF SCIENCE IN COMPUTER ENGINEERING",
  },
  {
    code: "BTVTEd GFDT",
    label:
      "BACHELOR OF TECHNICAL VOCATIONAL TEACHER EDUCATION MAJOR IN GARMENTS FASHION AND DESIGN",
  },
  {
    code: "BTVTEd AT",
    label:
      "BACHELOR OF TECHNICAL VOCATIONAL TEACHER EDUCATION MAJOR IN AUTOMOTIVE TECHNOLOGY",
  },
  {
    code: "BTVTEd CCT",
    label:
      "BACHELOR OF TECHNICAL VOCATIONAL TEACHER EDUCATION MAJOR IN CIVIL AND CONSTRUCTION TECHNOLOGY",
  },
  {
    code: "BTLEd IA",
    label:
      "BACHELOR OF TECHNOLOGY AND LIVELIHOOD EDUCATION MAJOR IN INDUSTRIAL ARTS",
  },
  {
    code: "BTLEd HE",
    label:
      "BACHELOR OF TECHNOLOGY AND LIVELIHOOD EDUCATION MAJOR IN HOME ECONOMICS",
  },
  {
    code: "BTVTEd ADT",
    label:
      "BACHELOR OF TECHNICAL VOCATIONAL TEACHER EDUCATION MAJOR IN ARCHITECTURAL DRAFTING TECHNOLOGY",
  },
  {
    code: "BTVTEd ELT",
    label:
      "BACHELOR OF TECHNICAL VOCATIONAL TEACHER EDUCATION MAJOR IN ELECTRICAL TECHNOLOGY",
  },
  {
    code: "BTVTEd ELX",
    label:
      "BACHELOR OF TECHNICAL VOCATIONAL TEACHER EDUCATION MAJOR IN ELECTRONICS TECHNOLOGY",
  },
  {
    code: "BTVTEd WFT",
    label:
      "BACHELOR OF TECHNICAL VOCATIONAL TEACHER EDUCATION MAJOR IN WELDING AND FABRICATION TECHNOLOGY",
  },
  {
    code: "BIndTech-WFT",
    label:
      "BACHELOR OF INDUSTRIAL TECHNOLOGY MAJOR IN WELDING AND FABRICATION TECHNOLOGY",
  },
  {
    code: "BIndTech-CT",
    label: "BACHELOR OF INDUSTRIAL TECHNOLOGY MAJOR IN CONSTRUCTION TECHNOLOGY",
  },
  {
    code: "BTVTEd FSM",
    label:
      "BACHELOR OF TECHNICAL VOCATIONAL TEACHER EDUCATION MAJOR IN FOOD AND SERVICE MANAGEMENT",
  },
  {
    code: "BIndTech-AFT",
    label:
      "BACHELOR OF INDUSTRIAL TECHNOLOGY MAJOR IN APPAREL AND FASHION TECHNOLOGY",
  },
  {
    code: "BIndTech-AT",
    label: "BACHELOR OF INDUSTRIAL TECHNOLOGY MAJOR IN AUTOMOTIVE TECHNOLOGY",
  },
  {
    code: "BIndTech-CUT",
    label: "BACHELOR OF INDUSTRIAL TECHNOLOGY MAJOR IN CULINARY TECHNOLOGY",
  },
  {
    code: "BIndTech-ELT",
    label: "BACHELOR OF INDUSTRIAL TECHNOLOGY MAJOR IN ELECTRICAL TECHNOLOGY",
  },
  {
    code: "BIndTech-ELX",
    label: "BACHELOR OF INDUSTRIAL TECHNOLOGY MAJOR IN ELECTRONICS TECHNOLOGY",
  },
  {
    code: "BSTM",
    label: "BACHELOR OF SCIENCE IN TOURISM MANAGEMENT",
  },
  {
    code: "BSHM",
    label: "BACHELOR OF SCIENCE IN HOSPITALITY MANAGEMENT",
  },
];

const filteredCourses = computed(() => {
  const query = String(form.course || "")
    .trim()
    .toLowerCase();

  if (!query) {
    return courseList;
  }

  return courseList.filter(
    (course) =>
      course.code.toLowerCase().includes(query) ||
      course.label.toLowerCase().includes(query),
  );
});

const selectCourse = (code) => {
  form.course = code;
  showCourseDropdown.value = false;
};

const toggleCourseDropdown = () => {
  showCourseDropdown.value = !showCourseDropdown.value;
};

/* ================= PAGE META ================= */
definePageMeta({
  layout: false,
});

/* ================= ENTRY POINT FOR ID PROCESSING ================= */
const startIdProcessing = () => {
  clearForm();
  showCourseDropdown.value = false;
  step.value = "form";
};

/* ================= CLAIM STUDENT ID FLOW ================= */
const claimStudentId = () => {
  claimForm.studid = "";
  student.value = null;
  step.value = "claim";
};

const reviewClaimForm = async () => {
  if (!claimForm.studid) {
    alert("Please enter your student ID number.");
    return;
  }

  try {
    const res = await $fetch("/api/scan-studid", {
      method: "POST",
      body: {
        studid: claimForm.studid,
      },
    });

    if (res.status !== "found") {
      alert("Student ID not found in database.");
      return;
    }

    student.value = res.student;
    step.value = "claim-review";
  } catch (error) {
    alert("Failed to query student record.");
  }
};

const confirmClaimRequest = async () => {
  if (!student.value) return;

  try {
    const res = await $fetch("/api/queue", {
      method: "POST",
      body: {
        service: "Claim Student ID",
        studid: student.value.studid || claimForm.studid,
        firstname: student.value.firstname || "",
        middlename: student.value.middlename || "",
        lastname: student.value.lastname || "",
      },
    });

    queueNumber.value = res.queueNumber;
    step.value = "result";
    startCountdown();
    claimForm.studid = "";
  } catch (error) {
    alert("Failed to generate ticket. Please try again.");
  }
};

/* ================= CONSTANTS ================= */
const services = ["Account Problem", "Clearance Signing", "Inquiry"];

/* ================= HELPERS ================= */
const clearForm = () => {
  Object.keys(form).forEach((key) => {
    form[key] = "";
  });

  showCourseDropdown.value = false;
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
  claimForm.studid = "";
  selectedService.value = null;
  showCourseDropdown.value = false;

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
    body: {
      rfid: rfid.value,
    },
  });

  student.value = res.status === "found" ? res.student : null;
  step.value = res.status === "found" ? "found" : "input";

  rfid.value = "";
};

const manualEntry = () => {
  step.value = "input";
};

/* ================= STUDENT LOOKUP ================= */
const checkStudent = async () => {
  if (!studid.value) return;

  try {
    const res = await $fetch("/api/scan-studid", {
      method: "POST",
      body: {
        studid: studid.value,
      },
    });

    if (res.status !== "found") {
      alert("Student ID not found in enrolment database.");
      return;
    }

    student.value = res.student;
    step.value = "confirm";
  } catch (error) {
    alert("Failed to query enrolment record.");
  }
};

/* ================= CONFIRMATION & BINDING ================= */
const confirmBinding = async () => {
  try {
    const bindRes = await $fetch("/api/bind", {
      method: "POST",
      body: {
        studid: student.value.studid,
        fullname: student.value.fullname,
        rfid: lastScannedRFID.value || "",
      },
    });

    if (bindRes.status !== "bound") {
      alert("Failed to store student record.");
      return;
    }

    student.value = bindRes.student;
    step.value = "found";
    studid.value = "";
    lastScannedRFID.value = "";
  } catch (error) {
    alert("Error saving student to queuing database.");
  }
};

/* ================= SERVICE ================= */
const selectService = (service) => {
  selectedService.value = service;

  if (service === "ID Processing") {
    form.firstname = student.value?.firstname || "";
    form.lastname = student.value?.lastname || "";
    form.studid = student.value?.studid || "";

    showCourseDropdown.value = false;
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

  if (timerInterval) {
    clearInterval(timerInterval);
  }

  timerInterval = setInterval(() => {
    if (countdown.value <= 1) {
      forceReset();
    } else {
      countdown.value--;
    }
  }, 1000);
};

const forceReset = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

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

/* ================= LIFECYCLE ================= */
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

  onUnmounted(() => {
    clearInterval(clockInterval);
  });
});

onUnmounted(() => {
  window.removeEventListener("click", keepFocus);
  window.removeEventListener("focus", focusRFID);

  if (timerInterval) {
    clearInterval(timerInterval);
  }
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
