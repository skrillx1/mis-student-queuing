<template>
  <div class="app">
    <div class="container">
      <!-- HEADER -->
      <div class="header">
        <h1>CSUCC MIS QUEUING</h1>
        <p class="subtitle">RFID Student Registration & Verification System</p>
      </div>

      <!-- SCAN CARD -->
      <div class="card">
        <label v-if="mode === 'rfid'">Scan your ID</label>
        <label v-else>Enter Student ID</label>

        <!-- RFID MODE -->
        <input
          v-if="mode === 'rfid'"
          v-model="rfid"
          placeholder="Tap or scan RFID here..."
          @keyup.enter="scanRFID"
          autofocus
        />

        <!-- MANUAL MODE -->
        <input
          v-else
          v-model="studid"
          placeholder="Enter your Student ID..."
          @keyup.enter="scanByStudID"
          autofocus
        />

        <p class="hint">
          {{
            mode === "rfid"
              ? "Scan your RFID card"
              : "Use this if you forgot your ID card"
          }}
        </p>

        <!-- SWITCH BUTTON -->
        <button class="btn link" @click="toggleMode">
          {{
            mode === "rfid"
              ? "Forgot your ID card? Enter ID instead"
              : "Back to RFID scan"
          }}
        </button>
      </div>

      <!-- FOUND STATE -->
      <div v-if="status === 'found'" class="card success">
        <h2>Welcome 🎉</h2>
        <p class="name">
          {{ student?.firstname }} {{ student?.middlename }}
          {{ student?.lastname }}
        </p>
        <span class="badge success-badge">RFID Registered</span>
      </div>

      <!-- NOT FOUND -->
      <div v-if="status === 'not_found'" class="card warning">
        <h2>RFID Not Registered</h2>
        <p>Please bind this RFID to a student record.</p>

        <input v-model="studid" placeholder="Enter Student ID" />

        <button class="btn primary" @click="bindRFID">Check Student</button>
      </div>

      <!-- CONFIRM BIND -->
      <div v-if="status === 'confirm'" class="card info">
        <h2>Confirm Student</h2>

        <div class="student-box">
          <p><b>Name:</b></p>
          <p class="name">
            {{ student.firstname }} {{ student.middlename }}
            {{ student.lastname }}
          </p>
        </div>

        <button class="btn success" @click="confirmBind">
          Confirm Binding
        </button>
      </div>

      <!-- SUCCESS -->
      <div v-if="status === 'success'" class="card success">
        <h2>Success ✅</h2>
        <p>RFID has been successfully linked to student record.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const mode = ref("rfid");
const rfid = ref("");
const studid = ref("");
const status = ref("");
const student = ref(null);

// SWITCH MODE
const toggleMode = () => {
  mode.value = mode.value === "rfid" ? "manual" : "rfid";

  // reset inputs
  rfid.value = "";
  studid.value = "";
};

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

// MANUAL STUDENT ID LOOKUP
const scanByStudID = async () => {
  if (!studid.value) return;

  const res = await $fetch("/api/scan-studid", {
    method: "POST",
    body: { studid: studid.value },
  });

  if (res.status === "found") {
    status.value = "found";
    student.value = res.student;
  } else {
    status.value = "not_found";
  }

  studid.value = "";
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
    return;
  }

  student.value = res.student;
  status.value = "confirm";
};

const confirmBind = () => {
  status.value = "success";
};
</script>

<style scoped>
/* PAGE LAYOUT */
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  color: #fff;
}

.container {
  width: 420px;
}

/* HEADER */
.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 22px;
  letter-spacing: 2px;
}

.subtitle {
  font-size: 12px;
  color: #94a3b8;
}

/* CARD STYLE */
.card {
  background: #111827;
  padding: 18px;
  border-radius: 12px;
  margin-bottom: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

label {
  font-size: 12px;
  color: #94a3b8;
}

/* INPUT */
input {
  width: 100%;
  padding: 10px;
  margin-top: 8px;
  border-radius: 8px;
  border: none;
  outline: none;
  background: #1f2937;
  color: white;
}

.link {
  background: transparent;
  color: #60a5fa;
  border: none;
  font-size: 12px;
  margin-top: 8px;
  cursor: pointer;
  text-decoration: underline;
}

/* HINT */
.hint {
  font-size: 11px;
  color: #64748b;
  margin-top: 5px;
}

/* BUTTONS */
.btn {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.primary {
  background: #3b82f6;
  color: white;
}

.success {
  background: #22c55e;
  color: white;
}

/* STATES */
.success {
  border-left: 4px solid #22c55e;
}

.warning {
  border-left: 4px solid #f59e0b;
}

.info {
  border-left: 4px solid #3b82f6;
}

/* NAME DISPLAY */
.name {
  font-size: 18px;
  font-weight: bold;
  margin-top: 5px;
}

/* BADGE */
.badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  margin-top: 10px;
}

.success-badge {
  background: #14532d;
  color: #4ade80;
}

/* STUDENT BOX */
.student-box {
  margin-top: 10px;
  padding: 10px;
  background: #0b1220;
  border-radius: 8px;
}
</style>
