<!-- components/AppHeader.vue -->
<template>
  <header
    class="border-b border-emerald-950 bg-emerald-950 text-white shadow-sm"
  >
    <div
      class="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-lg font-black text-emerald-950"
        >
          CSU
        </div>
        <div>
          <p class="text-sm font-bold tracking-tight text-white sm:text-base">
            CSU MIS Queueing System
          </p>
          <p class="hidden text-xs font-medium text-emerald-100/80 sm:block">
            Administrative Management Portal
          </p>
        </div>
      </div>

      <slot name="actions" />
    </div>
  </header>
</template>
