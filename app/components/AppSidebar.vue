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
    class="flex w-full shrink-0 flex-col justify-between border-b border-slate-200 bg-white p-3 lg:h-full lg:w-64 lg:overflow-y-auto lg:border-b-0 lg:border-r lg:p-4"
  >
    <div class="space-y-6">
      <!-- Navigation Group -->
      <div>
        <p
          class="mb-2 hidden px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 lg:block"
        >
          Main Menu
        </p>
        <nav
          aria-label="Main menu"
          class="flex min-w-0 gap-1 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0"
        >
          <!-- Dashboard Link -->
          <NuxtLink
            v-if="isAdmin"
            to="/dashboard"
            active-class="sidebar-link-active"
            class="sidebar-link"
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
            v-if="isAdmin"
            to="/ticket-management"
            active-class="sidebar-link-active"
            class="sidebar-link"
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

          <!-- Staff Station Link -->
          <NuxtLink
            to="/staff"
            active-class="sidebar-link-active"
            class="sidebar-link"
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
                d="M9 7h6m-3-3v6m-7 9h14a2 2 0 002-2V7a2 2 0 00-2-2h-1.172a2 2 0 01-1.414-.586l-.828-.828A2 2 0 0015.172 3H8.828a2 2 0 00-1.414.586l-.828.828A2 2 0 015.172 5H4a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Staff Station
          </NuxtLink>

          <NuxtLink
            to="/id-applications"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors"
            active-class="bg-emerald-50 text-emerald-800 font-bold"
            inactive-class="text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <!-- ID Card / Document Icon -->
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6"
              />
            </svg>
            <span>ID Applications</span>
          </NuxtLink>

          <!-- Station Management Link (Admin Only) -->
          <NuxtLink
            v-if="isAdmin"
            to="/stations"
            active-class="sidebar-link-active"
            class="sidebar-link"
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

          <!-- User Management Link (Admin Only) -->
          <NuxtLink
            v-if="isAdmin"
            to="/users"
            active-class="sidebar-link-active"
            class="sidebar-link"
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            User Management
          </NuxtLink>

          <!-- Generate Report Link -->
          <NuxtLink
            v-if="isAdmin"
            to="/reports"
            active-class="sidebar-link-active"
            class="sidebar-link"
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
    <div
      class="mt-2 flex shrink-0 items-center justify-between gap-2 border-t border-slate-100 pt-2 lg:mt-auto lg:block lg:space-y-3 lg:pt-4"
    >
      <NuxtLink
        to="/profile"
        class="flex min-w-0 items-center gap-2 rounded-xl p-1 transition-colors hover:bg-slate-50 lg:-mx-2 lg:gap-3 lg:p-2"
      >
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
      </NuxtLink>

      <button
        type="button"
        @click="handleSignOut"
        class="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-rose-600 lg:w-full"
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
