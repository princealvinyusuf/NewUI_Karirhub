<script setup lang="ts">
type NotificationItem = {
  id: number
  title: string
  message: string
  category: string
  time: string
  isRead: boolean
}

const route = useRoute()
const router = useRouter()

const logoUrl = "https://karirhub-console.kemnaker.go.id/assets/images/siaker-symbol-white.png"
const profileUrl = "https://account.kemnaker.go.id/users/48abb8e2-0ff0-4bec-a477-e498b4aa060a/picture"
const logoError = ref(false)
const profileError = ref(false)

const showRailNotifications = ref(false)
const railNotifications = [
  { id: 1, text: "Lamaran kamu sudah dilihat HRD", time: "5 menit lalu" },
  { id: 2, text: "Lowongan baru cocok dengan profil kamu", time: "20 menit lalu" },
  { id: 3, text: "Akun kamu berhasil diverifikasi", time: "1 jam lalu" },
]

const toggleRailNotifications = () => {
  showRailNotifications.value = !showRailNotifications.value
}

const notificationDetails = ref<NotificationItem[]>([
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
  {
    id: 5,
    title: "Profil perusahaan membutuhkan pembaruan",
    message: "Lengkapi data alamat dan kontak perusahaan untuk meningkatkan kepercayaan pelamar.",
    category: "Akun",
    time: "2 hari lalu",
    isRead: false,
  },
])

const unreadNotificationCount = computed(() => notificationDetails.value.filter((item) => !item.isRead).length)

const markAllAsRead = () => {
  notificationDetails.value = notificationDetails.value.map((item) => ({
    ...item,
    isRead: true,
  }))
}

const openAllNotifications = () => {
  showRailNotifications.value = false
  if (route.path === "/notifikasi-detail") return
  void router.push("/notifikasi-detail")
}

const menuSections = [
  {
    title: "DASHBOARD",
    items: ["Ringkasan", "Pencari Kerja", "Lowongan", "Data Warehouse", "Penilaian Diri", "Luar Negeri"],
  },
  {
    title: "AKTIVITAS SAYA",
    items: ["Pencari Kerja", "Pelamar Kerja", "Penilaian Diri"],
  },
  {
    title: "PMI",
    items: ["Pengajuan CPMI", "Perubahan Data", "PP", "Selesai Bekerja", "Pembatalan PP"],
  },
  {
    title: "LOWONGAN",
    items: ["Perusahaan", "UMKM", "Proyek", "Posting Lowongan"],
  },
  {
    title: "PEMBERI KERJA",
    items: ["Perusahaan", "Invitation", "Individual"],
  },
  {
    title: "LAMARAN",
    items: ["Perusahaan", "UMKM", "Proyek"],
  },
  {
    title: "ULASAN",
    items: ["Perusahaan", "Interview", "Gaji"],
  },
  {
    title: "KONTEN",
    items: ["Perusahaan Diminati"],
  },
  {
    title: "AKUN",
    items: ["Administrator"],
  },
  {
    title: "TAMBAHAN",
    items: ["Kredit Talent"],
  },
  {
    title: "KONFIGURASI",
    items: ["Dokumen", "Industri", "Bidang Pekerjaan", "Profil Dinas", "Jabatan", "Pengiriman PP"],
  },
]

const menuRouteMap: Record<string, string> = {
  "PEMBERI KERJA::Invitation": "/",
  "LOWONGAN::Posting Lowongan": "/posting-lowongan",
}

const isAktivitasPencariExpanded = ref(false)
const aktivitasPencariChoices = [
  { label: "Daftar Pencari Kerja", route: "/pencari-kerja" },
  { label: "OTP Pencari Kerja", route: "/otp-pencari-kerja" },
]

const isAktivitasPencariParent = (sectionTitle: string, item: string) => {
  return sectionTitle === "AKTIVITAS SAYA" && item === "Pencari Kerja"
}

const getMenuRoute = (sectionTitle: string, item: string) => {
  const bySectionKey = `${sectionTitle}::${item}`
  return menuRouteMap[bySectionKey] ?? null
}

const iconByItem: Record<string, string> = {
  Ringkasan: "fas fa-chart-pie",
  "Pencari Kerja": "fas fa-user-graduate",
  Lowongan: "fas fa-envelope",
  "Data Warehouse": "fas fa-cubes",
  "Penilaian Diri": "fas fa-star-half-alt",
  "Luar Negeri": "fas fa-globe",
  "Pelamar Kerja": "fas fa-inbox",
  "Pengajuan CPMI": "fas fa-hard-hat",
  "Perubahan Data": "far fa-edit",
  PP: "far fa-id-badge",
  "Selesai Bekerja": "fas fa-user-check",
  "Pembatalan PP": "fas fa-user-times",
  Perusahaan: "fas fa-building",
  "Invitation": "fas fa-paper-plane",
  UMKM: "fas fa-handshake",
  Proyek: "fas fa-building",
  Individual: "fas fa-user",
  Interview: "fas fa-comments",
  Gaji: "fas fa-dollar-sign",
  "Perusahaan Diminati": "fas fa-thumbs-up",
  Administrator: "fas fa-user-secret",
  "Kredit Talent": "fas fa-award",
  Dokumen: "fas fa-file-alt",
  Industri: "fas fa-industry",
  "Bidang Pekerjaan": "fas fa-briefcase",
  "Profil Dinas": "fas fa-map",
  Jabatan: "fas fa-address-book",
  "Pengiriman PP": "fas fa-paper-plane",
}

const isMenuItemActive = (sectionTitle: string, item: string) => {
  if (isAktivitasPencariParent(sectionTitle, item)) {
    return aktivitasPencariChoices.some((choice) => route.path === choice.route)
  }
  const menuRoute = getMenuRoute(sectionTitle, item)
  if (!menuRoute) return false
  if ((route.path === "/" || route.path === "/app.vue") && menuRoute === "/") return true
  return route.path === menuRoute
}

const handleMenuItemClick = (sectionTitle: string, item: string) => {
  if (isAktivitasPencariParent(sectionTitle, item)) {
    isAktivitasPencariExpanded.value = !isAktivitasPencariExpanded.value
    return
  }
  const menuRoute = getMenuRoute(sectionTitle, item)
  if (!menuRoute) return
  if (menuRoute === route.path) return
  void router.push(menuRoute)
}

const isAktivitasChoiceActive = (targetRoute: string) => route.path === targetRoute

const handleAktivitasChoiceClick = (targetRoute: string) => {
  if (route.path === targetRoute) return
  void router.push(targetRoute)
}

watch(
  () => route.path,
  (currentPath) => {
    if (aktivitasPencariChoices.some((choice) => choice.route === currentPath)) {
      isAktivitasPencariExpanded.value = true
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="screen notification-detail-page">
    <aside class="icon-rail">
      <div class="logo-box">
        <img v-if="!logoError" :src="logoUrl" alt="Karirhub Logo" class="logo-image" @error="logoError = true" />
        <i v-else class="fas fa-briefcase logo-fallback" aria-hidden="true" />
      </div>
      <div class="rail-spacer" />
      <div class="notif-wrap">
        <button class="notif-btn" type="button" aria-label="Notifikasi" @click="toggleRailNotifications">
          <i class="fa-regular fa-bell" aria-hidden="true" />
          <span class="notif-badge">{{ railNotifications.length }}</span>
        </button>
        <div v-if="showRailNotifications" class="rail-notif-dropdown">
          <p class="rail-notif-title">Notifikasi</p>
          <ul>
            <li v-for="item in railNotifications" :key="item.id">
              <span>{{ item.text }}</span>
              <small>{{ item.time }}</small>
            </li>
          </ul>
          <button type="button" class="rail-notif-see-all" @click="openAllNotifications">Lihat semua notifikasi</button>
        </div>
      </div>
      <div class="profile-dot">
        <img v-if="!profileError" :src="profileUrl" alt="User profile" class="profile-image" @error="profileError = true" />
        <i v-else class="fas fa-user profile-fallback" aria-hidden="true" />
      </div>
    </aside>

    <aside class="menu-panel">
      <div class="menu-scroll">
        <h2 class="menu-title">Karirhub</h2>

        <section v-for="section in menuSections" :key="section.title" class="menu-section">
          <p class="section-label">{{ section.title }}</p>
          <template v-for="item in section.items" :key="`${section.title}-${item}`">
            <button
              class="menu-item"
              :class="{ active: isMenuItemActive(section.title, item) }"
              @click="handleMenuItemClick(section.title, item)"
            >
              <i :class="['item-icon', iconByItem[item] || 'far fa-square']" aria-hidden="true" />
              <span>{{ item }}</span>
              <span v-if="isAktivitasPencariParent(section.title, item)" class="menu-item-caret">
                {{ isAktivitasPencariExpanded ? "▲" : "▼" }}
              </span>
            </button>
            <div
              v-if="isAktivitasPencariParent(section.title, item) && isAktivitasPencariExpanded"
              class="menu-sublist"
            >
              <button
                v-for="choice in aktivitasPencariChoices"
                :key="`${section.title}-${choice.label}`"
                class="menu-subitem"
                :class="{ active: isAktivitasChoiceActive(choice.route) }"
                @click="handleAktivitasChoiceClick(choice.route)"
              >
                <span>{{ choice.label }}</span>
              </button>
            </div>
          </template>
        </section>
      </div>
    </aside>

    <main class="content-panel">
      <section class="page-header">
        <h1>Semua Notifikasi</h1>
        <p>Lihat detail semua notifikasi terbaru dari akun Karirhub kamu.</p>
      </section>

      <section class="content-actions">
        <p class="unread-text">{{ unreadNotificationCount }} notifikasi belum dibaca</p>
        <button type="button" class="mark-read-btn" @click="markAllAsRead">Tandai semua dibaca</button>
      </section>

      <section class="notification-grid">
        <article
          v-for="item in notificationDetails"
          :key="item.id"
          class="notification-item"
          :class="{ unread: !item.isRead }"
        >
          <div class="item-top">
            <span class="category">{{ item.category }}</span>
            <time>{{ item.time }}</time>
          </div>
          <h2>{{ item.title }}</h2>
          <p>{{ item.message }}</p>
          <span class="status" :class="{ unread: !item.isRead }">{{ item.isRead ? "Dibaca" : "Belum Dibaca" }}</span>
        </article>
      </section>
    </main>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.notification-detail-page {
  min-height: 100vh;
  background: #f4f7fb;
  color: #111827;
  font-family: "Inter", "Segoe UI", Arial, sans-serif;
}

.screen {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 80px 273px 1fr;
  background: #f7fbfd;
}

.icon-rail {
  background: #098f83;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 2;
}

.logo-box {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  display: grid;
  place-items: center;
  margin-bottom: 10px;
  overflow: hidden;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 2px;
}

.logo-fallback {
  color: #fff;
  font-size: 16px;
}

.rail-spacer {
  flex: 1;
}

.notif-wrap {
  position: relative;
  margin-bottom: 10px;
}

.notif-btn {
  width: 34px;
  height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  display: grid;
  place-items: center;
  cursor: pointer;
  position: relative;
}

.notif-btn i {
  color: #fff;
  font-size: 14px;
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

.rail-notif-dropdown {
  position: absolute;
  left: 42px;
  bottom: 0;
  width: 270px;
  background: #fff;
  border: 1px solid #dbe5f0;
  border-radius: 10px;
  box-shadow: 0 12px 24px rgba(15, 35, 60, 0.18);
  padding: 10px;
  z-index: 40;
}

.rail-notif-title {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  color: #1e3b59;
}

.rail-notif-dropdown ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 7px;
}

.rail-notif-dropdown li {
  border: 1px solid #e6edf5;
  border-radius: 8px;
  padding: 7px 8px;
  background: #f8fbff;
  display: grid;
  gap: 3px;
}

.rail-notif-dropdown li span {
  font-size: 11px;
  color: #274868;
  font-weight: 600;
}

.rail-notif-dropdown li small {
  font-size: 10px;
  color: #74879a;
}

.rail-notif-see-all {
  margin-top: 8px;
  border: 0;
  background: transparent;
  padding: 0;
  color: #2563eb;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.profile-dot {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.85);
  margin-bottom: 8px;
  overflow: hidden;
  display: grid;
  place-items: center;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-fallback {
  color: #fff;
  font-size: 12px;
}

.menu-panel {
  border-right: 1px solid #e4e7ea;
  background: #fff;
  overflow: hidden;
  min-height: 100dvh;
}

.menu-scroll {
  height: 100%;
  min-height: 100dvh;
  overflow-y: auto;
  padding: 12px 16px 16px;
}

.menu-title {
  margin: 0 0 10px;
  font-size: 46px;
  line-height: 1.1;
  letter-spacing: -1px;
  font-weight: 900;
  color: #0f2743;
}

.menu-section {
  margin-top: 14px;
}

.section-label {
  margin: 0 0 3px;
  font-size: 11px;
  color: #a5adba;
  letter-spacing: 1px;
  font-weight: 700;
  text-transform: uppercase;
}

.menu-item {
  width: 100%;
  border: 0;
  background: transparent;
  border-radius: 5px;
  padding: 8px 12px 7px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #9da4ae;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-item-caret {
  margin-left: auto;
  font-size: 10px;
}

.item-icon {
  width: 23px;
  flex: 0 0 23px;
  text-align: center;
  color: #9da4ae;
  font-size: 16px;
}

.menu-sublist {
  margin: 2px 0 4px;
  display: grid;
  gap: 2px;
}

.menu-subitem {
  width: calc(100% - 8px);
  margin-left: 8px;
  border: 0;
  background: transparent;
  border-radius: 5px;
  padding: 7px 10px;
  font-size: 12px;
  color: #7e8793;
  text-align: left;
  cursor: pointer;
}

.menu-subitem:hover {
  background: #f2f8fd;
  color: #2f4f66;
}

.menu-subitem.active {
  background: #e6f8f6;
  color: #09b8a7;
  font-weight: 700;
}

.menu-item:hover {
  background: #f4fafc;
  color: #365569;
}

.menu-item.active {
  background: #e6f8f6;
  color: #09b8a7;
  font-weight: 700;
}

.menu-item.active .item-icon {
  color: #09b8a7;
}

.content-panel {
  padding: 20px;
  overflow: auto;
  background: #fff;
}

.page-header h1 {
  margin: 0;
  font-size: 30px;
  color: #0f2743;
}

.page-header p {
  margin: 8px 0 0;
  color: #5b6b7c;
  font-size: 14px;
}

.content-actions {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.unread-text {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.mark-read-btn {
  border: none;
  background: transparent;
  color: #1d4d8f;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.notification-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.notification-item {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
  padding: 14px;
  min-height: 156px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notification-item.unread {
  border-color: #bfdbfe;
  background: #eff6ff;
}

.item-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.category {
  display: inline-flex;
  border-radius: 999px;
  background: #dbeafe;
  color: #1e3a8a;
  padding: 3px 9px;
  font-size: 11px;
  font-weight: 700;
}

.item-top time {
  color: #6b7280;
  font-size: 11px;
}

.notification-item h2 {
  margin: 0;
  color: #0f2743;
  font-size: 16px;
  line-height: 1.35;
}

.notification-item p {
  margin: 0;
  color: #334155;
  font-size: 13px;
  line-height: 1.5;
}

.status {
  margin-top: auto;
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
}

.status.unread {
  color: #1d4ed8;
}

@media (max-width: 1280px) {
  .screen {
    grid-template-columns: 80px 240px 1fr;
  }
}

@media (max-width: 1080px) {
  .screen {
    grid-template-columns: 80px 1fr;
  }

  .menu-panel {
    display: none;
  }
}
</style>
