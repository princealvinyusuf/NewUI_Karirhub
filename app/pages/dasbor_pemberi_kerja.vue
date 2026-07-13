<script setup lang="ts">
const navItems = ["Daftar Pekerjaan", "Talent Search", "Profil + Ulasan Perusahaan", "Jadwal Wawancara"]
const router = useRouter()

const showNotifications = ref(false)
const notifications = [
  { id: 1, title: "Lowongan baru menunggu review", time: "5 menit lalu" },
  { id: 2, title: "Ada 3 pelamar baru untuk posisi UI/UX", time: "20 menit lalu" },
  { id: 3, title: "Profil perusahaan berhasil diperbarui", time: "1 jam lalu" },
]
const notificationCount = computed(() => notifications.length)

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const openAllNotifications = () => {
  showNotifications.value = false
  void router.push("/semua-notifikasi")
}
</script>

<template>
  <div class="employer-dashboard-page">
    <header class="topbar">
      <div class="container topbar-inner">
        <div class="brand">
          <div class="brand-mark">
            <i class="fa-solid fa-building-user" aria-hidden="true" />
          </div>
          <p>Kementerian Ketenagakerjaan Republik Indonesia</p>
        </div>

        <nav class="main-nav">
          <a v-for="item in navItems" :key="item" href="#">{{ item }}</a>
        </nav>

        <div class="topbar-actions">
          <div class="notif-wrap">
            <button class="icon-btn" type="button" aria-label="Notifikasi" @click="toggleNotifications">
              <i class="fa-regular fa-bell" aria-hidden="true" />
              <span v-if="notificationCount > 0" class="notif-badge">{{ notificationCount }}</span>
            </button>
            <div v-if="showNotifications" class="notif-dropdown">
              <p class="notif-title">Notifikasi</p>
              <ul>
                <li v-for="item in notifications" :key="item.id">
                  <span>{{ item.title }}</span>
                  <small>{{ item.time }}</small>
                </li>
              </ul>
              <button type="button" class="notif-see-all" @click="openAllNotifications">Lihat semua notifikasi</button>
            </div>
          </div>
          <button class="profile-btn" type="button" aria-label="Profil">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
              alt="Foto profil"
            />
          </button>
          <button class="chip-btn ghost" type="button">
            <i class="fa-solid fa-plus" aria-hidden="true" />
            <span>Posting</span>
          </button>
          <button class="chip-btn solid" type="button">PT. Pandu Jaya Abadi</button>
          <button class="chip-btn ghost" type="button">
            <i class="fa-solid fa-table-cells-large" aria-hidden="true" />
            <span>Layanan</span>
          </button>
        </div>
      </div>
    </header>

    <section class="hero">
      <div class="container">
        <h1>Daftar Lowongan Kerja</h1>

        <div class="search-panel">
          <div class="search-field keyword">
            <input type="text" placeholder="Cari berdasarkan judul lowongan atau nama perusahaan" />
          </div>
          <div class="search-field location">
            <input type="text" placeholder="Masukkan Lokasi" />
            <i class="fa-solid fa-caret-down" aria-hidden="true" />
          </div>
          <button class="search-btn" type="button" aria-label="Cari">
            <i class="fa-solid fa-magnifying-glass" aria-hidden="true" />
          </button>
          <div class="toggle-group">
            <button class="toggle-btn active" type="button">Lowongan Kerja</button>
            <button class="toggle-btn" type="button">Proyek</button>
          </div>
        </div>
      </div>
    </section>

    <main class="content">
      <div class="container">
        <div class="status-row">
          <p>Status Lowongan: <strong>Lowongan Aktif</strong></p>
          <i class="fa-solid fa-caret-down" aria-hidden="true" />
        </div>

        <p class="note">
          Perhatian: Data lowongan pekerjaan yang kamu input, akan masuk ke rencana penggunaan tenaga kerja pada layanan
          <strong> Wajib Lapor Ketenagakerjaan</strong>
        </p>

        <section class="empty-card">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
            alt="Ilustrasi lowongan kerja"
          />
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.employer-dashboard-page {
  min-height: 100vh;
  background: #f4f4f4;
  color: #1f2937;
  font-family: "Inter", "Segoe UI", Arial, sans-serif;
}

.container {
  width: min(1180px, calc(100% - 3rem));
  margin-inline: auto;
}

.topbar {
  background: #0f3c6f;
}

.topbar-inner {
  min-height: 68px;
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: #fff;
  flex-shrink: 0;
}

.brand-mark {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  display: grid;
  place-items: center;
}

.brand p {
  margin: 0;
  max-width: 140px;
  font-size: 9px;
  line-height: 1.2;
  text-transform: uppercase;
  font-weight: 600;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 1.15rem;
  margin-left: 0.45rem;
}

.main-nav a {
  color: rgba(255, 255, 255, 0.95);
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.topbar-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.notif-wrap {
  position: relative;
}

.icon-btn {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  cursor: pointer;
  position: relative;
}

.notif-badge {
  position: absolute;
  top: -5px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #dc2626;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: grid;
  place-items: center;
  padding: 0 3px;
}

.notif-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 260px;
  border: 1px solid #d8e2ef;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.16);
  padding: 10px;
  z-index: 30;
}

.notif-title {
  margin: 0 0 8px;
  color: #1e3b59;
  font-size: 12px;
  font-weight: 700;
}

.notif-dropdown ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 6px;
}

.notif-dropdown li {
  border: 1px solid #e6edf5;
  border-radius: 8px;
  padding: 7px 8px;
  background: #f8fbff;
  display: grid;
  gap: 2px;
}

.notif-dropdown li span {
  color: #274868;
  font-size: 11px;
  font-weight: 600;
}

.notif-dropdown li small {
  color: #74879a;
  font-size: 10px;
}

.notif-see-all {
  margin-top: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #2563eb;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.profile-btn {
  width: 30px;
  height: 30px;
  padding: 0;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.profile-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chip-btn {
  height: 32px;
  border-radius: 6px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.chip-btn.ghost {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.28);
}

.chip-btn.solid {
  color: #fff;
  background: #16a39a;
}

.hero {
  background: #0f3c6f;
  padding: 20px 0 26px;
}

.hero h1 {
  margin: 0;
  color: #fff;
  font-size: 38px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.search-panel {
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 0;
  max-width: 790px;
}

.search-field {
  height: 48px;
  background: #fff;
  border: 1px solid #cbd5e1;
  display: flex;
  align-items: center;
}

.search-field input {
  width: 100%;
  border: 0;
  outline: none;
  height: 100%;
  font-size: 13px;
  color: #1f2937;
  padding: 0 14px;
}

.search-field.keyword {
  width: 330px;
  border-right: 0;
  border-radius: 6px 0 0 6px;
}

.search-field.location {
  width: 220px;
  border-right: 0;
  padding-right: 12px;
}

.search-field.location i {
  color: #475569;
  font-size: 12px;
}

.search-btn {
  width: 48px;
  height: 48px;
  border: 1px solid #0f917c;
  background: #15a39c;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.toggle-group {
  margin-left: 16px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  display: inline-flex;
}

.toggle-btn {
  border: 0;
  width: 110px;
  background: #1b4f85;
  color: rgba(255, 255, 255, 0.88);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.toggle-btn.active {
  background: #15a39c;
  color: #fff;
}

.content {
  padding: 16px 0 28px;
}

.status-row {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #4b5563;
  font-size: 12px;
}

.status-row p {
  margin: 0;
}

.note {
  margin: 18px 0 0;
  border-top: 1px solid #d1d5db;
  padding-top: 14px;
  color: #6b7280;
  font-size: 14px;
}

.empty-card {
  margin-top: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #fff;
  min-height: 360px;
  overflow: hidden;
  display: grid;
  place-items: center;
}

.empty-card img {
  width: min(720px, 100%);
  height: 360px;
  object-fit: cover;
  opacity: 0.9;
}

@media (max-width: 1200px) {
  .main-nav {
    display: none;
  }
}

@media (max-width: 900px) {
  .hero h1 {
    font-size: 30px;
  }

  .search-panel {
    flex-wrap: wrap;
    gap: 8px;
    max-width: 100%;
  }

  .search-field.keyword,
  .search-field.location {
    width: 100%;
    border-right: 1px solid #cbd5e1;
    border-radius: 6px;
  }

  .search-btn {
    border-radius: 6px;
  }

  .toggle-group {
    margin-left: 0;
    width: 100%;
  }

  .toggle-btn {
    width: 50%;
  }
}
</style>
