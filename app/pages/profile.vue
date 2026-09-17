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
const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const isLoading = ref(true);
const isSaving = ref(false);
const isChangingPassword = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const passwordErrorMessage = ref("");
const passwordSuccessMessage = ref("");
const activeSection = ref("view");

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

const changePassword = async () => {
  passwordErrorMessage.value = "";
  passwordSuccessMessage.value = "";

  if (
    !passwordForm.currentPassword ||
    !passwordForm.newPassword ||
    !passwordForm.confirmPassword
  ) {
    passwordErrorMessage.value = "Complete all password fields.";
    return;
  }
  if (passwordForm.newPassword.length < 8) {
    passwordErrorMessage.value = "New password must be at least 8 characters.";
    return;
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrorMessage.value = "New passwords do not match.";
    return;
  }

  isChangingPassword.value = true;
  try {
    await $fetch("/api/auth/user/password", {
      method: "POST",
      headers: {
        Authorization: `Bearer session-token-${user.value.id}`,
      },
      body: {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      },
    });

    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";
    passwordSuccessMessage.value = "Your password has been changed.";
  } catch (error) {
    passwordErrorMessage.value =
      error?.data?.statusMessage || "Unable to change your password.";
  } finally {
    isChangingPassword.value = false;
  }
};

const showSection = (section) => {
  activeSection.value = section;
  errorMessage.value = "";
  successMessage.value = "";
  passwordErrorMessage.value = "";
  passwordSuccessMessage.value = "";
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

    <div
      v-else
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
        <div
          class="flex flex-wrap justify-center sm:justify-end gap-2 sm:ml-auto"
        >
          <button
            type="button"
            @click="showSection(activeSection === 'edit' ? 'view' : 'edit')"
            :aria-pressed="activeSection === 'edit'"
            :class="[
              'px-3 py-2 rounded-xl text-xs font-semibold transition-colors',
              activeSection === 'edit'
                ? 'bg-[#003300] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            ]"
          >
            {{ activeSection === "edit" ? "Close editor" : "Edit information" }}
          </button>
          <button
            type="button"
            @click="
              showSection(activeSection === 'password' ? 'view' : 'password')
            "
            :aria-pressed="activeSection === 'password'"
            :class="[
              'px-3 py-2 rounded-xl text-xs font-semibold transition-colors',
              activeSection === 'password'
                ? 'bg-[#003300] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            ]"
          >
            {{
              activeSection === "password" ? "Close editor" : "Change password"
            }}
          </button>
        </div>
      </div>

      <div v-if="activeSection === 'view'" class="p-6 sm:p-8">
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <dt
              class="text-xs font-bold uppercase tracking-wider text-slate-400"
            >
              Full name
            </dt>
            <dd class="mt-1 text-sm font-semibold text-slate-800">
              {{ form.name || "-" }}
            </dd>
          </div>
          <div>
            <dt
              class="text-xs font-bold uppercase tracking-wider text-slate-400"
            >
              Email address
            </dt>
            <dd class="mt-1 text-sm font-semibold text-slate-800">
              {{ form.email || "-" }}
            </dd>
          </div>
          <div>
            <dt
              class="text-xs font-bold uppercase tracking-wider text-slate-400"
            >
              Username
            </dt>
            <dd class="mt-1 text-sm font-semibold text-slate-800">
              {{ user.username || "-" }}
            </dd>
          </div>
          <div>
            <dt
              class="text-xs font-bold uppercase tracking-wider text-slate-400"
            >
              Role
            </dt>
            <dd class="mt-1 text-sm font-semibold capitalize text-slate-800">
              {{ user.role || "-" }}
            </dd>
          </div>
        </dl>
      </div>

      <form
        v-if="activeSection === 'edit'"
        @submit.prevent="saveProfile"
        class="p-6 sm:p-8 space-y-5"
      >
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
        <div
          class="-mx-6 -mb-6 sm:-mx-8 sm:-mb-8 px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end"
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

      <form
        v-if="activeSection === 'password'"
        @submit.prevent="changePassword"
        class="p-6 sm:p-8 space-y-5"
      >
        <div
          v-if="passwordErrorMessage || passwordSuccessMessage"
          :class="[
            'rounded-xl border px-4 py-3 text-sm',
            passwordErrorMessage
              ? 'bg-rose-50 border-rose-200 text-rose-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700',
          ]"
          role="status"
        >
          {{ passwordErrorMessage || passwordSuccessMessage }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label
              for="current-password"
              class="block text-xs font-bold text-slate-700 mb-2"
              >Current password</label
            >
            <input
              id="current-password"
              v-model="passwordForm.currentPassword"
              type="password"
              autocomplete="current-password"
              required
              class="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003300]/20 focus:border-[#003300]"
            />
          </div>
          <div>
            <label
              for="new-password"
              class="block text-xs font-bold text-slate-700 mb-2"
              >New password</label
            >
            <input
              id="new-password"
              v-model="passwordForm.newPassword"
              type="password"
              autocomplete="new-password"
              minlength="8"
              required
              class="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003300]/20 focus:border-[#003300]"
            />
          </div>
          <div>
            <label
              for="confirm-password"
              class="block text-xs font-bold text-slate-700 mb-2"
              >Confirm new password</label
            >
            <input
              id="confirm-password"
              v-model="passwordForm.confirmPassword"
              type="password"
              autocomplete="new-password"
              minlength="8"
              required
              class="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003300]/20 focus:border-[#003300]"
            />
          </div>
        </div>

        <div
          class="-mx-6 -mb-6 sm:-mx-8 sm:-mb-8 px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end"
        >
          <button
            type="submit"
            :disabled="isChangingPassword"
            class="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#003300] text-white text-sm font-semibold hover:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isChangingPassword ? "Changing..." : "Change password" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
