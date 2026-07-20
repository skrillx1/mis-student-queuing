<!-- components/AppHeader.vue -->
<template>
  <header
    class="bg-[#003300] text-white shadow-lg border-b-4 border-[#FFCC00] sticky top-0 z-20"
  >
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl bg-[#FFCC00] text-[#003300] flex items-center justify-center font-black text-lg shadow-inner shrink-0"
        >
          CSU
        </div>
        <div>
          <h1 class="text-xl font-black tracking-tight text-[#FFCC00]">
            CSU MIS Queueing System
          </h1>
          <p class="text-xs text-emerald-100/80 font-medium">
            Administrative Management Portal
          </p>
        </div>
      </div>

      <slot name="actions" />
    </div>
  </header>
</template>
