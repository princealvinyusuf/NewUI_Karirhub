<script setup lang="ts">
const backToHome = () => navigateTo("/")
const contactSupport = () => navigateTo("/profil-perusahaan")
</script>

<template>
  <div class="status-page">
    <main class="status-shell">
      <header class="brand-row">
        <!-- <div class="brand-pill">
          <i class="fas fa-briefcase" aria-hidden="true" />
          <span>Karirhub</span>
        </div> -->
      </header>

      <section class="status-card">
        <div class="icon-wrap danger">
          <i class="fas fa-link-slash" aria-hidden="true" />
        </div>

        <p class="badge">Tautan Tidak Valid</p>
        <h1>Link Invalid atau Sudah Dicabut</h1>
        <p class="description">
          Tautan ini tidak dapat digunakan karena tidak valid, sudah dicabut, atau pernah dipakai sebelumnya. Mohon
          hubungi admin pusat (Pusat Pasar Kerja) untuk meminta tautan baru agar proses aktivasi akun dapat dilanjutkan.
        </p>

        <div class="action-row">
          <button type="button" class="btn secondary" @click="backToHome">Kembali ke Beranda</button>
          <!-- <button type="button" class="btn primary" @click="contactSupport">Hubungi Admin</button> -->
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
:global(body) {
  margin: 0;
  font-family: "Inter", "Segoe UI", Arial, sans-serif;
  background: linear-gradient(180deg, #0b3b66 0, #0b3b66 210px, #f3f7fb 210px);
}

.status-page {
  min-height: 100dvh;
  padding: 24px;
}

.status-shell {
  max-width: 940px;
  margin: 0 auto;
}

.brand-row {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 16px;
}

.brand-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  padding: 9px 14px;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-weight: 700;
  font-size: 14px;
}

.status-card {
  background: #fff;
  border: 1px solid #d9e5f1;
  border-radius: 14px;
  box-shadow: 0 18px 34px rgba(13, 42, 71, 0.14);
  padding: 34px 32px;
}

.icon-wrap {
  width: 66px;
  height: 66px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-size: 28px;
  margin-bottom: 16px;
}

.icon-wrap.danger {
  color: #be123c;
  background: #ffe2ec;
}

.badge {
  margin: 0;
  color: #8b1336;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.9px;
}

h1 {
  margin: 9px 0 0;
  color: #103b61;
  font-size: 34px;
  line-height: 1.2;
}

.description {
  margin: 14px 0 0;
  color: #48627f;
  max-width: 700px;
  line-height: 1.65;
}

.action-row {
  margin-top: 24px;
  display: flex;
  gap: 12px;
}

.btn {
  height: 42px;
  border-radius: 9px;
  border: 0;
  padding: 0 18px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.btn.secondary {
  background: #fff;
  border: 1px solid #c9d7e4;
  color: #234768;
}

.btn.primary {
  background: #0f9388;
  border: 1px solid #0f9388;
  color: #fff;
}

@media (max-width: 768px) {
  .status-page {
    padding: 14px;
  }

  .status-card {
    padding: 24px 18px;
  }

  h1 {
    font-size: 28px;
  }

  .action-row {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
