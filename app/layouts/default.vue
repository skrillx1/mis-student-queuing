<!-- layouts/default.vue -->
<template>
  <div
    class="h-screen w-screen flex flex-col bg-slate-50/80 overflow-hidden text-slate-800 antialiased font-sans"
  >
    <!-- Header (Fixed top height) -->
    <AppHeader class="shrink-0" />

    <!-- Body Layout (Sidebar + Main Content area) -->
    <div class="flex flex-1 overflow-hidden">
      <AppSidebar />

      <!-- Scrollable Main Content -->
      <main class="flex-1 overflow-y-auto p-6 md:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
