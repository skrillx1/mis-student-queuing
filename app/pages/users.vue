<script setup>
const { status, data: authData } = useAuth();

definePageMeta({
  middleware: [
    async () => {
      const { status, data: authData } = useAuth();
      if (status.value === "unauthenticated") {
        return navigateTo("/login");
      }
      if (authData.value?.role?.toLowerCase() !== "admin") {
        return navigateTo("/staff");
      }
    },
  ],
});

const currentUser = computed(() => authData.value ?? {});
const users = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const showAddModal = ref(false);
const searchQuery = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const form = reactive({
  username: "",
  name: "",
  email: "",
  password: "",
  role: "staff",
});

const isAdmin = computed(
  () => currentUser.value?.role?.toLowerCase() === "admin",
);

const filteredUsers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return users.value;
  return users.value.filter((user) =>
    [user.username, user.name, user.email, user.role].some((value) =>
      value?.toLowerCase().includes(query),
    ),
  );
});

const fetchUsers = async () => {
  isLoading.value = true;
  try {
    users.value = await $fetch("/api/auth/users", {
      headers: {
        Authorization: `Bearer session-token-${currentUser.value.id}`,
      },
    });
  } catch (error) {
    errorMessage.value = error?.data?.statusMessage || "Unable to load users.";
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  form.username = "";
  form.name = "";
  form.email = "";
  form.password = "";
  form.role = "staff";
};

const openAddModal = () => {
  errorMessage.value = "";
  successMessage.value = "";
  resetForm();
  showAddModal.value = true;
};

const closeAddModal = () => {
  if (!isSaving.value) showAddModal.value = false;
};

const createUser = async () => {
  errorMessage.value = "";
  successMessage.value = "";
  isSaving.value = true;

  try {
    await $fetch("/api/auth/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer session-token-${currentUser.value.id}`,
      },
      body: { ...form },
    });
    showAddModal.value = false;
    successMessage.value = "User account created successfully.";
    await fetchUsers();
  } catch (error) {
    errorMessage.value = error?.data?.statusMessage || "Unable to create user.";
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  if (isAdmin.value) fetchUsers();
  else isLoading.value = false;
});
</script>

<template>
  <div
    v-if="!isAdmin"
    class="max-w-xl mx-auto mt-10 bg-white border border-rose-200 rounded-2xl p-8 text-center"
  >
    <h1 class="text-xl font-bold text-slate-900">Access restricted</h1>
    <p class="text-sm text-slate-500 mt-2">
      Only administrators can manage user accounts.
    </p>
  </div>

  <div v-else class="max-w-6xl mx-auto space-y-6">
    <div
      class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
    >
      <div>
        <p
          class="text-[10px] font-bold uppercase tracking-wider text-emerald-700"
        >
          Administration
        </p>
        <h1 class="text-2xl font-bold text-slate-900 mt-1">User Management</h1>
        <p class="text-sm text-slate-500 mt-1">
          Create and review accounts that can access the queueing system.
        </p>
      </div>
      <button
        type="button"
        @click="openAddModal"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#003300] text-white text-sm font-semibold hover:bg-emerald-900 transition-colors"
      >
        <span class="text-lg leading-none">+</span>
        Add user
      </button>
    </div>

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

    <section
      class="bg-white border border-slate-200 rounded-2xl overflow-hidden"
    >
      <div
        class="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <h2 class="font-bold text-slate-900">
          System users
          <span class="text-slate-400 font-normal"
            >({{ filteredUsers.length }})</span
          >
        </h2>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search users..."
          class="w-full sm:w-64 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003300]/20 focus:border-[#003300]"
        />
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead
            class="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500"
          >
            <tr>
              <th class="px-5 py-3">Name</th>
              <th class="px-5 py-3">Username</th>
              <th class="px-5 py-3">Email</th>
              <th class="px-5 py-3">Role</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr v-if="isLoading">
              <td colspan="4" class="px-5 py-10 text-center text-slate-400">
                Loading users...
              </td>
            </tr>
            <tr v-else-if="filteredUsers.length === 0">
              <td colspan="4" class="px-5 py-10 text-center text-slate-400">
                No users found.
              </td>
            </tr>
            <template v-else>
              <tr
                v-for="user in filteredUsers"
                :key="user.id"
                class="hover:bg-slate-50/70"
              >
                <td class="px-5 py-3 font-semibold">{{ user.name || "-" }}</td>
                <td class="px-5 py-3">{{ user.username }}</td>
                <td class="px-5 py-3 text-slate-500">
                  {{ user.email || "-" }}
                </td>
                <td class="px-5 py-3">
                  <span
                    class="inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800"
                    >{{ user.role }}</span
                  >
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </section>

    <div
      v-if="showAddModal"
      class="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/40 p-4"
      @click.self="closeAddModal"
    >
      <form
        @submit.prevent="createUser"
        class="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div
          class="p-6 border-b border-slate-100 flex items-start justify-between gap-4"
        >
          <div>
            <h2 class="text-lg font-bold text-slate-900">Add new user</h2>
            <p class="text-xs text-slate-500 mt-1">
              Set the account details and initial password.
            </p>
          </div>
          <button
            type="button"
            @click="closeAddModal"
            class="text-slate-400 hover:text-slate-700 text-xl"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              for="new-username"
              class="block text-xs font-bold text-slate-700 mb-1.5"
              >Username</label
            ><input
              id="new-username"
              v-model="form.username"
              required
              autocomplete="off"
              class="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003300]/20"
            />
          </div>
          <div>
            <label
              for="new-name"
              class="block text-xs font-bold text-slate-700 mb-1.5"
              >Full name</label
            ><input
              id="new-name"
              v-model="form.name"
              required
              autocomplete="name"
              class="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003300]/20"
            />
          </div>
          <div>
            <label
              for="new-email"
              class="block text-xs font-bold text-slate-700 mb-1.5"
              >Email</label
            ><input
              id="new-email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              class="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003300]/20"
            />
          </div>
          <div>
            <label
              for="new-role"
              class="block text-xs font-bold text-slate-700 mb-1.5"
              >Role</label
            ><select
              id="new-role"
              v-model="form.role"
              class="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#003300]/20"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="sm:col-span-2">
            <label
              for="new-password"
              class="block text-xs font-bold text-slate-700 mb-1.5"
              >Temporary password</label
            ><input
              id="new-password"
              v-model="form.password"
              type="password"
              required
              minlength="8"
              autocomplete="new-password"
              class="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003300]/20"
            />
            <p class="text-[11px] text-slate-400 mt-1">
              Use at least 8 characters.
            </p>
          </div>
        </div>
        <div
          class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3"
        >
          <button
            type="button"
            @click="closeAddModal"
            class="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-white"
          >
            Cancel</button
          ><button
            type="submit"
            :disabled="isSaving"
            class="px-4 py-2.5 rounded-xl bg-[#003300] text-white text-sm font-semibold hover:bg-emerald-900 disabled:opacity-50"
          >
            {{ isSaving ? "Creating..." : "Create user" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
