<script setup lang="ts">
type NotificationDetail = {
  id: number
  title: string
  message: string
  category: string
  time: string
  isRead: boolean
}

const router = useRouter()
const navItems = ["Daftar Pekerjaan", "Talent Search", "Profil + Ulasan Perusahaan", "Jadwal Wawancara"]

const notificationDetails = ref<NotificationDetail[]>([
  {
    id: 1,
    title: "Lamaran kamu sudah dilihat HRD",
    message: "Perusahaan PT Maju Bersama sudah melihat profil dan CV kamu untuk posisi UI/UX Designer.",
    category: "Lamaran Kerja",
    time: "5 menit lalu",
    isRead: false,
  },
  {
    id: 2,
    title: "Lowongan baru cocok dengan profil kamu",
    message: "Ditemukan 3 lowongan baru yang sesuai dengan keahlian Digital Marketing dan lokasi pilihanmu.",
    category: "Rekomendasi",
    time: "20 menit lalu",
    isRead: false,
  },
  {
    id: 3,
    title: "Akun kamu berhasil diverifikasi",
    message: "Data akun dan identitas kamu telah diverifikasi. Sekarang kamu bisa melamar semua lowongan.",
    category: "Akun",
    time: "1 jam lalu",
    isRead: true,
  },
  {
    id: 4,
    title: "Undangan interview",
    message: "Kamu mendapat undangan interview online untuk posisi Frontend Developer pada tanggal 2 Juli 2026.",
    category: "Interview",
    time: "Kemarin",
    isRead: true,
  },
])

const showNotifications = ref(false)
const quickNotifications = [
  { id: 1, title: "Lowongan baru menunggu review", time: "5 menit lalu" },
  { id: 2, title: "Ada 3 pelamar baru untuk posisi UI/UX", time: "20 menit lalu" },
  { id: 3, title: "Profil perusahaan berhasil diperbarui", time: "1 jam lalu" },
]

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const openAllNotifications = () => {
  showNotifications.value = false
}

const unreadNotificationCount = computed(() => notificationDetails.value.filter((item) => !item.isRead).length)

const markAllAsRead = () => {
  notificationDetails.value = notificationDetails.value.map((item) => ({
    ...item,
    isRead: true,
  }))
}

const goToDashboard = () => {
  void router.push("/dasbor_pemberi_kerja")
}
</script>

<template>
  <div class="notification-page">
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
              <span v-if="unreadNotificationCount > 0" class="notif-badge">{{ unreadNotificationCount }}</span>
            </button>
            <div v-if="showNotifications" class="notif-dropdown">
              <p class="notif-title">Notifikasi</p>
              <ul>
                <li v-for="item in quickNotifications" :key="item.id">
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

    <section class="page-header">
      <div class="container">
        <button type="button" class="back-link" @click="goToDashboard">
          <i class="fa-solid fa-arrow-left" />
          <span>Kembali ke Beranda</span>
        </button>
        <h1>Semua Notifikasi</h1>
        <p>Lihat detail semua notifikasi terbaru dari akun Karirhub kamu.</p>
      </div>
    </section>

    <section class="container content-actions">
      <p class="unread-text">{{ unreadNotificationCount }} notifikasi belum dibaca</p>
      <button type="button" class="mark-read-btn" @click="markAllAsRead">Tandai semua dibaca</button>
    </section>

    <main class="container page-content">
      <NuxtLink
        v-for="item in notificationDetails"
        :key="item.id"
        to="/notifikasi-detail"
        class="notification-item"
        :class="{ unread: !item.isRead }"
      >
        <div class="item-top">
          <span class="category">{{ item.category }}</span>
          <time>{{ item.time }}</time>
        </div>
        <h2>{{ item.title }}</h2>
        <p>{{ item.message }}</p>
      </NuxtLink>
    </main>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.notification-page {
  min-height: 100vh;
  background: #f8fafc;
  color: #111827;
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

.page-header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 1.2rem 0 1.1rem;
}

.page-header .container {
  width: min(960px, calc(100% - 2rem));
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  text-decoration: none;
  color: #2563eb;
  font-size: 0.9rem;
  margin-bottom: 0.9rem;
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
}

.page-header h1 {
  margin: 0;
  font-size: 1.8rem;
}

.page-header p {
  margin: 0.45rem 0 0;
  color: #475569;
}

.content-actions {
  width: min(960px, calc(100% - 2rem));
  margin: 0.9rem auto 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.unread-text {
  margin: 0;
  color: #64748b;
  font-size: 0.84rem;
}

.mark-read-btn {
  border: 0;
  background: transparent;
  color: #2563eb;
  font-size: 0.86rem;
  font-weight: 700;
  padding: 0;
  cursor: pointer;
}

.page-content {
  padding: 1.3rem 0 2rem;
  display: grid;
  gap: 0.8rem;
  width: min(960px, calc(100% - 2rem));
  margin-inline: auto;
}

.notification-item {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.85rem;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
}

.notification-item.unread {
  border-color: #bfdbfe;
  background: #eff6ff;
}

.item-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
}

.category {
  display: inline-flex;
  border-radius: 999px;
  background: #dbeafe;
  color: #1e3a8a;
  padding: 0.2rem 0.7rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.item-top time {
  color: #6b7280;
  font-size: 0.8rem;
}

.notification-item h2 {
  margin: 0.65rem 0 0.35rem;
  font-size: 1.05rem;
}

.notification-item p {
  margin: 0;
  color: #334155;
}

@media (max-width: 1200px) {
  .main-nav {
    display: none;
  }
}

@media (max-width: 760px) {
  .topbar-inner {
    min-height: auto;
    padding: 10px 0;
    flex-wrap: wrap;
  }

  .topbar-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .notif-dropdown {
    right: auto;
    left: 0;
    width: min(300px, calc(100vw - 2rem));
  }

  .content-actions {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
