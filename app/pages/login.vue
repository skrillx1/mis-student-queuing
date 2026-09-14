<template>
  <div
    class="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50/80 via-slate-50 to-amber-50/50 overflow-hidden px-4 py-12 sm:px-6 lg:px-8"
  >
    <!-- Light & Soft Decorative Background Shapes -->
    <div
      class="absolute -top-24 -left-24 w-96 h-96 bg-emerald-200/50 rounded-full blur-3xl pointer-events-none"
    ></div>
    <div
      class="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-200/60 rounded-full blur-3xl pointer-events-none"
    ></div>
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-300/30 rounded-full blur-[100px] pointer-events-none"
    ></div>

    <!-- Floating Geometry Grid Lines -->
    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,#065f4610_1px,transparent_1px),linear-gradient(to_bottom,#065f4610_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"
    ></div>

    <!-- Main Card Container -->
    <div
      class="relative w-full max-w-md bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-emerald-950/5 border border-emerald-100/80 space-y-8"
    >
      <!-- Branding & Header -->
      <div class="text-center space-y-3">
        <!-- Logo Badge -->
        <div
          class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-900 text-amber-300 font-black text-xl shadow-md border border-emerald-700/30"
        >
          CSU
        </div>

        <div>
          <h1
            class="text-xl font-bold tracking-tight text-emerald-950 uppercase"
          >
            CSUCC MIS
          </h1>
          <p
            class="text-xs font-bold text-amber-600 tracking-wider uppercase mt-0.5"
          >
            Queuing System
          </p>
        </div>
      </div>

      <!-- Login Form -->
      <form class="space-y-5" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <!-- Username Input -->
          <div>
            <label
              for="username"
              class="block text-xs font-bold text-emerald-900/80 uppercase tracking-wider mb-1.5"
            >
              Username
            </label>
            <div class="relative">
              <input
                id="username"
                v-model="username"
                type="text"
                placeholder="Enter your username"
                required
                class="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-emerald-100 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent focus:bg-white transition duration-200"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <label
              for="password"
              class="block text-xs font-bold text-emerald-900/80 uppercase tracking-wider mb-1.5"
            >
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                type="password"
                placeholder="••••••••"
                required
                class="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-emerald-100 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent focus:bg-white transition duration-200"
              />
            </div>
          </div>
        </div>

        <!-- Error Alert -->
        <transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
        >
          <div
            v-if="errorMessage"
            class="p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-xs text-red-600 text-center font-medium"
          >
            {{ errorMessage }}
          </div>
        </transition>

        <!-- Submit Button (Primary Action - CSU Forest Green) -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 shadow-lg shadow-emerald-900/20"
        >
          <!-- Loading Spinner -->
          <svg
            v-if="loading"
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ loading ? "Signing in..." : "Sign In" }}
        </button>
      </form>

      <!-- Footer Branding -->
      <div class="pt-3 text-center border-t border-slate-100">
        <p
          class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider"
        >
          Caraga State University Cabadbaran Campus
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Disables default layout (Hides AppSidebar/AppHeader)
definePageMeta({
  layout: false,
});

const { signIn } = useAuth();

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);

const handleLogin = async () => {
  errorMessage.value = "";
  loading.value = true;

  try {
    const response = await signIn(
      { username: username.value, password: password.value },
      { redirect: false },
    );

    if (response?.error) {
      errorMessage.value = "Invalid username or password";
    } else {
      await navigateTo("/dashboard");
    }
  } catch (err: any) {
    errorMessage.value = "Invalid login credentials";
  } finally {
    loading.value = false;
  }
};
</script>
