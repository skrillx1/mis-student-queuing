<script setup>
const { status, data: authData } = useAuth();

definePageMeta({
  middleware: [
    async () => {
      const { status } = useAuth();

      // If unauthenticated, redirect to login page
      if (status.value === "unauthenticated") {
        return navigateTo("/login");
      }
    },
  ],
});

const currentUser = computed(() => authData.value ?? {});

// State
const stations = ref([]);
const isLoading = ref(true);
const searchQuery = ref("");
const isSubmitting = ref(false);

// Modal states
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);

// Form / Selected Station State
const selectedStation = ref(null);
const form = reactive({
  name: "",
  description: "",
});

// Fetch Stations
const fetchStations = async () => {
  isLoading.value = true;
  try {
    const data = await $fetch("/api/stations");
    stations.value = data || [];
  } catch (error) {
    console.error("Failed to fetch stations:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchStations();
});

// Filtered Stations (Search)
const filteredStations = computed(() => {
  if (!searchQuery.value.trim()) return stations.value;
  const q = searchQuery.value.toLowerCase();
  return stations.value.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q)),
  );
});

// Modal Actions
const openAddModal = () => {
  form.name = "";
  form.description = "";
  showAddModal.value = true;
};

const openEditModal = (station) => {
  selectedStation.value = station;
  form.name = station.name;
  form.description = station.description || "";
  showEditModal.value = true;
};

const openDeleteModal = (station) => {
  selectedStation.value = station;
  showDeleteModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  showDeleteModal.value = false;
  selectedStation.value = null;
  form.name = "";
  form.description = "";
};

// CRUD Operations
const handleCreateStation = async () => {
  if (!form.name.trim()) return;
  isSubmitting.value = true;
  try {
    await $fetch("/api/stations", {
      method: "POST",
      body: {
        name: form.name.trim(),
        description: form.description.trim(),
        created_by: currentUser.value?.id,
      },
    });
    closeModal();
    await fetchStations();
  } catch (error) {
    console.error("Error creating station:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleUpdateStation = async () => {
  if (!form.name.trim() || !selectedStation.value) return;
  isSubmitting.value = true;
  try {
    await $fetch(`/api/stations/${selectedStation.value.id}`, {
      method: "PUT",
      body: {
        name: form.name.trim(),
        description: form.description.trim(),
      },
    });
    closeModal();
    await fetchStations();
  } catch (error) {
    console.error("Error updating station:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleDeleteStation = async () => {
  if (!selectedStation.value) return;
  isSubmitting.value = true;
  try {
    await $fetch(`/api/stations/${selectedStation.value.id}`, {
      method: "DELETE",
    });
    closeModal();
    await fetchStations();
  } catch (error) {
    console.error("Error deleting station:", error);
  } finally {
    isSubmitting.value = false;
  }
};

// Date formatting utility
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Header Section -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-xl font-bold text-slate-900">Station Management</h1>
        <p class="text-xs text-slate-500 mt-0.5">
          Manage system stations, routing locations, and desk allocations.
        </p>
      </div>
      <button
        type="button"
        @click="openAddModal"
        class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#003300] hover:bg-emerald-900 text-white font-medium text-xs rounded-xl shadow-sm transition-colors"
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Station
      </button>
    </div>

    <!-- Controls Bar -->
    <div
      class="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200"
    >
      <div class="relative w-full sm:w-72">
        <svg
          class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search stations..."
          class="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003300]/20 focus:border-[#003300]"
        />
      </div>
      <span class="text-xs text-slate-400 font-medium">
        Total: {{ filteredStations.length }}
      </span>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold"
            >
              <th class="py-3 px-4">ID</th>
              <th class="py-3 px-4">Station Name</th>
              <th class="py-3 px-4">Description</th>
              <th class="py-3 px-4">Created Date</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
            <tr v-if="isLoading">
              <td colspan="5" class="py-8 text-center text-slate-400">
                Loading stations...
              </td>
            </tr>
            <tr v-else-if="filteredStations.length === 0">
              <td colspan="5" class="py-8 text-center text-slate-400">
                No stations found.
              </td>
            </tr>
            <tr
              v-else
              v-for="station in filteredStations"
              :key="station.id"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <td class="py-3 px-4 font-mono text-slate-500">
                #{{ station.id }}
              </td>
              <td class="py-3 px-4 font-semibold text-slate-900">
                {{ station.name }}
              </td>
              <td class="py-3 px-4 text-slate-500 max-w-xs truncate">
                {{ station.description || "—" }}
              </td>
              <td class="py-3 px-4 text-slate-500">
                {{ formatDate(station.created_at) }}
              </td>
              <td class="py-3 px-4 text-right space-x-2">
                <button
                  @click="openEditModal(station)"
                  class="px-2.5 py-1 text-slate-600 hover:text-[#003300] hover:bg-emerald-50 rounded-lg transition-colors font-medium"
                >
                  Edit
                </button>
                <button
                  @click="openDeleteModal(station)"
                  class="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <div
      v-if="showAddModal || showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
    >
      <div
        class="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-4"
      >
        <h3 class="text-base font-bold text-slate-900">
          {{ showAddModal ? "Create New Station" : "Edit Station" }}
        </h3>
        <form
          @submit.prevent="
            showAddModal ? handleCreateStation() : handleUpdateStation()
          "
          class="space-y-4"
        >
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1"
              >Station Name</label
            >
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="e.g. Station 1"
              class="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003300]/20 focus:border-[#003300]"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1"
              >Description</label
            >
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="e.g. Handles email & general support concerns"
              class="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003300]/20 focus:border-[#003300]"
            ></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 text-xs font-medium text-white bg-[#003300] hover:bg-emerald-900 rounded-xl transition-colors disabled:opacity-50"
            >
              {{
                isSubmitting
                  ? "Saving..."
                  : showAddModal
                    ? "Create"
                    : "Save Changes"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
    >
      <div
        class="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-sm p-6 space-y-4"
      >
        <h3 class="text-base font-bold text-slate-900">Delete Station</h3>
        <p class="text-xs text-slate-600">
          Are you sure you want to delete
          <strong class="text-slate-900">{{ selectedStation?.name }}</strong
          >? This action cannot be undone.
        </p>
        <div class="flex justify-end gap-2 pt-2">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="handleDeleteStation"
            :disabled="isSubmitting"
            class="px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors disabled:opacity-50"
          >
            {{ isSubmitting ? "Deleting..." : "Delete" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
