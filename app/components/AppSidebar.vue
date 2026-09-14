<script setup>
const { data, signOut } = useAuth();

// data.value IS the user object directly
const user = computed(() => data.value ?? {});

// Check if current user has admin role
const isAdmin = computed(() => user.value?.role?.toLowerCase() === "admin");

// Dynamic initials based on name or username
const userInitials = computed(() => {
  const name = user.value.name || user.value.username || "";
  if (!name) return "U";

  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
});

const handleSignOut = async () => {
  try {
    await signOut({ redirect: false });
  } catch (error) {
    console.warn("Sign out endpoint error:", error);
  } finally {
    await navigateTo("/login", { replace: true });
  }
};
</script>

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

          <!-- Ticket Management Link -->
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

          <!-- Station Management Link (Admin Only) -->
          <NuxtLink
            v-if="isAdmin"
            to="/stations"
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V10m0 11V10m0 0h4m-4 0H7"
              />
            </svg>
            Station Management
          </NuxtLink>

          <!-- Generate Report Link -->
          <NuxtLink
            to="/reports"
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
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Generate Report
          </NuxtLink>
        </nav>
      </div>
    </div>

    <!-- User Profile & Sign Out Footer -->
    <div class="pt-4 border-t border-slate-100 space-y-3 shrink-0">
      <div class="flex items-center gap-3">
        <!-- Dynamic Avatar Image or Initials -->
        <img
          v-if="user?.image"
          :src="user.image"
          :alt="user.name || 'User Avatar'"
          class="w-8 h-8 rounded-full object-cover shrink-0"
        />
        <div
          v-else
          class="w-8 h-8 rounded-full bg-[#003300] text-white flex items-center justify-center font-bold text-xs shrink-0"
        >
          {{ userInitials }}
        </div>

        <div class="truncate">
          <p class="text-xs font-bold text-slate-800 truncate">
            {{ user?.name || user?.username || "User" }}
          </p>
          <p class="text-[10px] text-slate-400 truncate">
            {{ user?.email || "No email available" }}
          </p>
        </div>
      </div>

      <button
        type="button"
        @click="handleSignOut"
        class="w-full flex items-center gap-3 px-3 py-2 text-xs rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent transition-colors font-semibold"
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
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Sign Out
      </button>
    </div>
  </aside>
</template>
