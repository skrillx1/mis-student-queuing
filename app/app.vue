<script setup>
const { status, signOut } = useAuth();

let midnightTimer;

const scheduleEndOfDayLogout = () => {
  if (midnightTimer) clearTimeout(midnightTimer);
  if (status.value !== "authenticated") return;

  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);

  midnightTimer = setTimeout(async () => {
    try {
      await signOut({ redirect: false });
    } finally {
      await navigateTo("/login", { replace: true });
    }
  }, nextMidnight.getTime() - now.getTime());
};

onMounted(scheduleEndOfDayLogout);
watch(status, scheduleEndOfDayLogout);
onBeforeUnmount(() => {
  if (midnightTimer) clearTimeout(midnightTimer);
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
