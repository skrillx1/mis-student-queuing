<script setup>
const { status, data: authData } = useAuth();

definePageMeta({
  middleware: [
    async () => {
      const { status } = useAuth();
      if (status.value === "unauthenticated") {
        return navigateTo("/login");
      }
    },
  ],
});

const user = computed(() => authData.value ?? {});
const form = reactive({
  name: "",
  email: "",
});
const isLoading = ref(true);
const isSaving = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const userInitials = computed(() => {
  const name = form.name || user.value.username || "U";
  const parts = name.trim().split(/\s+/);
  return parts.length > 1
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
});

watch(
  user,
  (currentUser) => {
    form.name = currentUser.name || "";
    form.email = currentUser.email || "";
    isLoading.value = false;
  },
  { immediate: true },
);

const saveProfile = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!form.name.trim() || !form.email.trim()) {
    errorMessage.value = "Name and email are required.";
    return;
  }

  isSaving.value = true;
  try {
    const updatedUser = await $fetch("/api/auth/user", {
      method: "PUT",
      headers: {
        Authorization: `Bearer session-token-${user.value.id}`,
      },
      body: {
        name: form.name.trim(),
        email: form.email.trim(),
      },
    });

    authData.value = updatedUser;
    successMessage.value = "Your profile has been updated.";
  } catch (error) {
    errorMessage.value =
      error?.data?.statusMessage || "Unable to update your profile.";
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div>
      <p
        class="text-[10px] font-bold uppercase tracking-wider text-emerald-700"
      >
        Account
      </p>
      <h1 class="text-2xl font-bold text-slate-900 mt-1">My Profile</h1>
      <p class="text-sm text-slate-500 mt-1">
        View and update the information connected to your account.
      </p>
    </div>

    <div
      v-if="isLoading"
      class="bg-white border border-slate-200 rounded-2xl p-8"
    >
      <div class="h-5 w-40 bg-slate-200 rounded animate-pulse"></div>
      <div class="h-10 w-full bg-slate-100 rounded-xl animate-pulse mt-6"></div>
    </div>

    <form
      v-else
      @submit.prevent="saveProfile"
      class="bg-white border border-slate-200 rounded-2xl overflow-hidden"
    >
      <div
        class="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-slate-100"
      >
        <div
          class="w-20 h-20 rounded-2xl bg-[#003300] text-[#FFCC00] flex items-center justify-center text-2xl font-black shrink-0"
        >
          {{ userInitials }}
        </div>
        <div class="text-center sm:text-left">
          <h2 class="text-lg font-bold text-slate-900">
            {{ form.name || "Your profile" }}
          </h2>
          <p class="text-sm text-slate-500 mt-1">
            {{ user.role || "Account user" }}
          </p>
          <p class="text-xs text-slate-400 mt-2">
            Username: {{ user.username || "-" }}
          </p>
        </div>
      </div>

      <div class="p-6 sm:p-8 space-y-5">
        <div
          v-if="errorMessage || successMessage"
          :class="[
            'rounded-xl border px-4 py-3 text-sm',
            errorMessage
              ? 'bg-rose-50 border-rose-200 text-rose-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700',
          ]"
          role="status"
        >
          {{ errorMessage || successMessage }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              for="profile-name"
              class="block text-xs font-bold text-slate-700 mb-2"
              >Full name</label
            >
            <input
              id="profile-name"
              v-model="form.name"
              type="text"
              autocomplete="name"
              required
              class="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003300]/20 focus:border-[#003300]"
            />
          </div>
          <div>
            <label
              for="profile-email"
              class="block text-xs font-bold text-slate-700 mb-2"
              >Email address</label
            >
            <input
              id="profile-email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              required
              class="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003300]/20 focus:border-[#003300]"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2"
              >Username</label
            >
            <input
              :value="user.username || '-'"
              type="text"
              disabled
              class="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2"
              >Role</label
            >
            <input
              :value="user.role || '-'"
              type="text"
              disabled
              class="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div
        class="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end"
      >
        <button
          type="submit"
          :disabled="isSaving"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#003300] text-white text-sm font-semibold hover:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg
            v-if="isSaving"
            class="w-4 h-4 animate-spin"
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
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          {{ isSaving ? "Saving..." : "Save changes" }}
        </button>
      </div>
    </form>
  </div>
</template>
