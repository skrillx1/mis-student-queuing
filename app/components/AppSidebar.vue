<!-- components/AppSidebar.vue -->
<template>
  <aside
    class="w-64 bg-white border-r border-slate-200 h-full p-4 flex flex-col justify-between shrink-0 overflow-y-auto"
  >
    <div class="space-y-6">
      <!-- Navigation Group -->
      <div>
        <p
          class="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2"
        >
          Main Menu
        </p>
        <nav class="space-y-1">
          <!-- Dashboard Link -->
          <NuxtLink
            to="/dashboard"
            active-class="bg-emerald-50 text-[#003300] border-emerald-200/60 font-bold"
            class="flex items-center gap-3 px-3 py-2.5 text-xs rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent transition-colors"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            Dashboard
          </NuxtLink>

          <!-- Staff Link -->
          <NuxtLink
            to="/staff"
            active-class="bg-emerald-50 text-[#003300] border-emerald-200/60 font-bold"
            class="flex items-center gap-3 px-3 py-2.5 text-xs rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent transition-colors"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Ticket Management
          </NuxtLink>
        </nav>
      </div>
    </div>

    <!-- User Profile Footer -->
    <div
      class="pt-4 border-t border-slate-100 flex items-center gap-3 shrink-0"
    >
      <div
        class="w-8 h-8 rounded-full bg-[#003300] text-white flex items-center justify-center font-bold text-xs shrink-0"
      >
        ADMIN
      </div>
      <div class="truncate">
        <p class="text-xs font-bold text-slate-800 truncate">MIS Staff</p>
        <p class="text-[10px] text-slate-400 truncate">mis@csu.edu.ph</p>
      </div>
    </div>
  </aside>
</template>
