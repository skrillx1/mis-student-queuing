<template>
  <div>
    <h1>CSUCC MIS Queuing</h1>

    <input v-model="rfid" placeholder="Scan RFID" @keyup.enter="scanRFID" />

    <div v-if="status === 'not_found'">
      <p>RFID not registered</p>

      <input v-model="studid" placeholder="Enter Student ID" />
      <button @click="bindRFID">Bind RFID</button>
    </div>

    <div v-if="status === 'confirm'">
      <p>
        Confirm:
        {{ student.firstname }}
        {{ student.middlename }}
        {{ student.lastname }} ?
      </p>

      <button @click="confirmBind">Confirm</button>
    </div>

    <div v-if="status === 'success'">
      <p>RFID Linked Successfully!</p>
    </div>

    <div v-if="status === 'found'">
      <p>
        Welcome,
        {{ student.firstname }}
        {{ student.lastname }}
      </p>
    </div>
  </div>
</template>

<script setup>
const rfid = ref("");
const studid = ref("");
const status = ref("");
const student = ref(null);

const scanRFID = async () => {
  const res = await $fetch("/api/scan", {
    method: "POST",
    body: { rfid: rfid.value },
  });

  if (res.status === "found") {
    status.value = "found";
    student.value = res.student;
  } else {
    status.value = "not_found";
  }
};

const bindRFID = async () => {
  const res = await $fetch("/api/bind", {
    method: "POST",
    body: {
      studid: studid.value,
      rfid: rfid.value,
    },
  });

  if (res.status === "invalid_id") {
    alert("Student ID not found");
  } else {
    student.value = res.student;
    status.value = "confirm";
  }
};

const confirmBind = () => {
  status.value = "success";
};
</script>
