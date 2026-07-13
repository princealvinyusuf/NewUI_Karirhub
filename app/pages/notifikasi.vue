<script setup lang="ts">
type NotificationDetail = {
  id: number
  title: string
  message: string
  category: string
  time: string
  isRead: boolean
}

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

const unreadNotificationCount = computed(() => notificationDetails.value.filter((item) => !item.isRead).length)
const showNotifications = ref(false)

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const markAllAsRead = () => {
  notificationDetails.value = notificationDetails.value.map((item) => ({
    ...item,
    isRead: true,
  }))
}
</script>

<template>
  <div class="notification-page">
    <header class="navbar">
      <div class="header-container nav-content">
        <NuxtLink to="/karirhub-clone" class="brand">
          <div class="brand-badge">
            <i class="fa-solid fa-briefcase" />
          </div>
          <div class="brand-text">
            <strong>Karirhub</strong>
            <span>oleh Kemnaker</span>
          </div>
        </NuxtLink>

        <div class="nav-right">
          <div class="notification-wrapper">
            <button class="notification-button" type="button" aria-label="Notifikasi" @click="toggleNotifications">
              <i class="fa-regular fa-bell" />
              <span v-if="unreadNotificationCount > 0" class="notification-badge">{{ unreadNotificationCount }}</span>
            </button>

            <div v-if="showNotifications" class="notification-dropdown">
              <p class="notification-title">Notifikasi</p>
              <ul>
                <li v-for="item in notificationDetails.slice(0, 3)" :key="item.id" :class="{ unread: !item.isRead }">
                  <NuxtLink class="notification-link" to="/karirhub-clone">
                    <span>{{ item.title }}</span>
                    <small>{{ item.time }}</small>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>

          <button class="dashboard-chip" type="button">
            <span>Dasbor Pengelola</span>
            <span class="dashboard-avatar">
              <i class="fa-solid fa-user" />
            </span>
          </button>
        </div>
      </div>
    </header>

    <section class="page-header">
      <div class="container">
        <NuxtLink to="/karirhub-clone" class="back-link">
          <i class="fa-solid fa-arrow-left" />
          <span>Kembali ke Beranda</span>
        </NuxtLink>
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
        to="/karirhub-clone"
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
  width: min(960px, calc(100% - 2rem));
  margin-inline: auto;
}

.header-container {
  width: min(1160px, calc(100% - 2rem));
  margin-inline: auto;
}

.navbar {
  background: #fff;
  border-bottom: 1px solid #d1d5db;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 64px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.brand-badge {
  width: 2.4rem;
  height: 2.4rem;
  display: grid;
  place-items: center;
  border-radius: 0.75rem;
  color: white;
  background: linear-gradient(130deg, #2563eb, #0f172a);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand-text strong {
  font-size: 1rem;
  color: #111827;
}

.brand-text span {
  color: #64748b;
  font-size: 0.78rem;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.notification-wrapper {
  position: relative;
}

.notification-button {
  position: relative;
  width: 2.45rem;
  height: 2.45rem;
  border: 1px solid #d1d5db;
  border-radius: 0.6rem;
  background: #fff;
  color: #1f2937;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.notification-button i {
  font-size: 1rem;
}

.notification-badge {
  position: absolute;
  top: -0.42rem;
  right: -0.42rem;
  min-width: 1.2rem;
  height: 1.2rem;
  padding: 0 0.28rem;
  border-radius: 999px;
  background: #dc2626;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  display: grid;
  place-items: center;
}

.notification-dropdown {
  position: absolute;
  top: calc(100% + 0.55rem);
  right: 0;
  width: 290px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.12);
  padding: 0.75rem;
  z-index: 30;
}

.notification-title {
  margin: 0 0 0.55rem;
  font-size: 0.88rem;
  font-weight: 700;
  color: #111827;
}

.notification-dropdown ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.3rem;
}

.notification-dropdown li {
  border-radius: 0.55rem;
  padding: 0.55rem;
  display: grid;
  gap: 0.2rem;
  background: #f8fafc;
}

.notification-dropdown li.unread {
  background: #eff6ff;
}

.notification-dropdown li span {
  font-size: 0.82rem;
  color: #1f2937;
}

.notification-dropdown li small {
  font-size: 0.74rem;
  color: #6b7280;
}

.notification-link {
  display: grid;
  gap: 0.2rem;
  color: inherit;
  text-decoration: none;
}

.dashboard-chip {
  border: none;
  background: #ffffff;
  color: #111827;
  border-radius: 0;
  padding: 0.5rem 0.7rem 0.5rem 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 0.95rem;
  font-weight: 600;
}

.dashboard-avatar {
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #475569, #0f172a);
  display: grid;
  place-items: center;
  color: #fff;
  border: 1px solid #9ca3af;
}

.dashboard-avatar i {
  font-size: 0.78rem;
}

.page-header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 1.4rem 0;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  text-decoration: none;
  color: #2563eb;
  font-size: 0.9rem;
  margin-bottom: 0.9rem;
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
  margin-top: 0.9rem;
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

@media (max-width: 760px) {
  .nav-content {
    flex-wrap: wrap;
    padding: 0.75rem 0;
  }

  .nav-right {
    width: 100%;
    justify-content: space-between;
  }

  .dashboard-chip {
    width: calc(100% - 3rem);
    justify-content: space-between;
  }

  .notification-dropdown {
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
