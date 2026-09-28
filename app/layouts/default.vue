<!-- layouts/default.vue -->
<template>
  <div
    class="app-shell flex min-h-screen flex-col bg-slate-50 font-sans text-slate-800 lg:h-screen lg:overflow-hidden"
  >
    <!-- Header (Fixed top height) -->
    <AppHeader class="sticky top-0 z-30 shrink-0" />

    <!-- Body Layout (Sidebar + Main Content area) -->
    <div class="flex flex-1 flex-col lg:min-h-0 lg:flex-row">
      <AppSidebar />

      <!-- Scrollable Main Content -->
      <a
        href="#main-content"
        class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-emerald-950 focus:shadow-lg"
      >
        Skip to main content
      </a>
      <main
        id="main-content"
        tabindex="-1"
        class="app-content min-h-0 min-w-0 flex-1 p-4 sm:p-6 lg:overflow-y-auto lg:p-8"
      >
        <slot />
      </main>
    </div>
  </div>
</template>
