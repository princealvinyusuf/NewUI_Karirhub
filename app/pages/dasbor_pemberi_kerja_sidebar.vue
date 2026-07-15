<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const logoUrl = "https://karirhub-console.kemnaker.go.id/assets/images/siaker-symbol-white.png"
const profileUrl = "https://account.kemnaker.go.id/users/48abb8e2-0ff0-4bec-a477-e498b4aa060a/picture"
const logoError = ref(false)
const profileError = ref(false)

type RailNotificationLinkType = "internal" | "external"
type RailNotification = {
  id: number
  text: string
  time: string
  target: string
  linkType: RailNotificationLinkType
}

const showRailNotifications = ref(false)
const railNotifications: RailNotification[] = [
  { id: 1, text: "Lamaran Kamu Sudah di lihat HRD", time: "5 menit lalu", target: "https://siapkerja.kemnaker.go.id/", linkType: "external" },
  { id: 2, text: "Lowongan baru cocok dengan profil kamu", time: "12 menit lalu", target: "/karirhub-clone", linkType: "internal" },
  { id: 3, text: "Akun kamu berhasil di verifikasi", time: "20 menit lalu", target: "/karirhub-clone", linkType: "internal" },
  { id: 4, text: "Lowongan berhasil diverifikasi", time: "1 jam lalu", target: "/dasbor_pemberi_kerja", linkType: "internal" },
]

const toggleRailNotifications = () => {
  showRailNotifications.value = !showRailNotifications.value
}

const handleRailNotificationClick = (item: RailNotification) => {
  showRailNotifications.value = false
  if (item.linkType === "external") {
    if (import.meta.client) {
      window.location.assign(item.target)
    }
    return
  }
  if (route.path === item.target) return
  void router.push(item.target)
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
  "LOWONGAN::Posting Lowongan": "/dasbor_pemberi_kerja_sidebar",
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
  Invitation: "fas fa-paper-plane",
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

type StatusSlice = {
  name: string
  percentage: number
  color: string
}

const summaryCards = [
  { title: "LOWONGAN TERBIT", value: "84.136" },
  { title: "LOWONGAN DITUTUP", value: "3.714" },
  { title: "LOWONGAN MENUNGGU VERIFIKASI", value: "22.694" },
]

const statusSlices: StatusSlice[] = [
  { name: "Terverifikasi", percentage: 62.4, color: "#4db8ef" },
  { name: "Menunggu Verifikasi", percentage: 25.6, color: "#f59e0b" },
  { name: "Ditutup", percentage: 12, color: "#ef4444" },
]

const totalVacancies = "84.136"
const donutBackground = computed(() => {
  if (statusSlices.length < 3) {
    return "conic-gradient(#4db8ef 0 100%)"
  }
  const first = statusSlices[0]
  const second = statusSlices[1]
  const third = statusSlices[2]
  if (!first || !second || !third) {
    return "conic-gradient(#4db8ef 0 100%)"
  }
  const secondLimit = first.percentage + second.percentage
  return `conic-gradient(${first.color} 0 ${first.percentage}%, ${second.color} ${first.percentage}% ${secondLimit}%, ${third.color} ${secondLimit}% 100%)`
})

type VacancySummary = {
  label: string
  value: number
}

type VacancyRow = {
  id: number
  title: string
  location: string
  status: string
  stats: VacancySummary[]
}

type PendingVacancyRecord = {
  id: number
  title: string
  location: string
  status: "Menunggu Verifikasi"
  createdAt: string
}

const pendingVacancyStorageKey = "karirhub_pending_vacancies_sidebar"

const baseVacancyRows: VacancyRow[] = [
  {
    id: 1,
    title: "IT Manager",
    location: "Amban, Manokwari Barat, Kab. Manokwari, Papua Barat, Indonesia",
    status: "Lowongan Ditutup",
    stats: [
      { label: "LEADS", value: 152118 },
      { label: "LAMARAN", value: 0 },
      { label: "BOOKMARK", value: 0 },
      { label: "DITAWARKAN", value: 0 },
      { label: "WAWANCARA", value: 0 },
      { label: "DITERIMA", value: 0 },
      { label: "ARSIP", value: 0 },
    ],
  },
  {
    id: 2,
    title: "Kasir",
    location: "Bojongcae, Cibadak, Kab. Lebak, Banten, Indonesia",
    status: "Lowongan Ditutup",
    stats: [
      { label: "LEADS", value: 149538 },
      { label: "LAMARAN", value: 0 },
      { label: "BOOKMARK", value: 0 },
      { label: "DITAWARKAN", value: 0 },
      { label: "WAWANCARA", value: 0 },
      { label: "DITERIMA", value: 0 },
      { label: "ARSIP", value: 0 },
    ],
  },
  {
    id: 3,
    title: "Finance Accounting",
    location: "Soreang, Soreang, Kab. Bandung, Jawa Barat, Indonesia",
    status: "Lowongan Ditutup",
    stats: [
      { label: "LEADS", value: 846 },
      { label: "LAMARAN", value: 0 },
      { label: "BOOKMARK", value: 0 },
      { label: "DITAWARKAN", value: 0 },
      { label: "WAWANCARA", value: 0 },
      { label: "DITERIMA", value: 0 },
      { label: "ARSIP", value: 0 },
    ],
  },
]

const vacancyRows = ref<VacancyRow[]>([...baseVacancyRows])

const goToPostingLowongan = () => {
  if (route.path === "/posting-lowongan") return
  void router.push("/posting-lowongan")
}

const getVacancyStatusClass = (status: string) => {
  if (status === "Menunggu Verifikasi") return "vacancy-status-pending"
  return "vacancy-status-closed"
}

const mapPendingVacancyToRow = (item: PendingVacancyRecord): VacancyRow => ({
  id: item.id,
  title: item.title,
  location: item.location,
  status: item.status,
  stats: [
    { label: "LEADS", value: 0 },
    { label: "LAMARAN", value: 0 },
    { label: "BOOKMARK", value: 0 },
    { label: "DITAWARKAN", value: 0 },
    { label: "WAWANCARA", value: 0 },
    { label: "DITERIMA", value: 0 },
    { label: "ARSIP", value: 0 },
  ],
})

onMounted(() => {
  if (!import.meta.client) return
  try {
    const pendingRaw = localStorage.getItem(pendingVacancyStorageKey)
    const pendingRecords = pendingRaw ? (JSON.parse(pendingRaw) as PendingVacancyRecord[]) : []
    const pendingRows = pendingRecords
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(mapPendingVacancyToRow)
    vacancyRows.value = [...pendingRows, ...baseVacancyRows]
  } catch {
    vacancyRows.value = [...baseVacancyRows]
  }
})
</script>

<template>
  <div class="screen">
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
              <button type="button" class="rail-notif-link" @click="handleRailNotificationClick(item)">
                {{ item.text }}
              </button>
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
            <button class="menu-item" :class="{ active: isMenuItemActive(section.title, item) }" @click="handleMenuItemClick(section.title, item)">
              <i :class="['item-icon', iconByItem[item] || 'far fa-square']" aria-hidden="true" />
              <span>{{ item }}</span>
              <span v-if="isAktivitasPencariParent(section.title, item)" class="menu-item-caret">
                {{ isAktivitasPencariExpanded ? "▲" : "▼" }}
              </span>
            </button>
            <div v-if="isAktivitasPencariParent(section.title, item) && isAktivitasPencariExpanded" class="menu-sublist">
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
      <div class="employer-dashboard-page">
        <section class="graph-section">
          <div class="container">
            <div class="graph-head">
              <div>
                <h1>Ringkasan Lowongan</h1>
                <p>Performa lowongan berdasarkan status publikasi saat ini.</p>
              </div>
              <button type="button" class="ringkasan-posting-btn" @click="goToPostingLowongan">
                <i class="fa-solid fa-plus" aria-hidden="true" />
                <span>Posting</span>
              </button>
            </div>
            <div class="stats-layout">
              <div class="summary-stack">
                <article v-for="card in summaryCards" :key="card.title" class="summary-card chart-card">
                  <p class="summary-title">{{ card.title }}</p>
                  <p class="summary-value">{{ card.value }}</p>
                </article>
              </div>
              <div class="chart-card">
                <div class="chart-head">
                  <span>LOWONGAN BERDASARKAN STATUS</span>
                  <span>({{ totalVacancies }} TOTAL)</span>
                </div>
                <div class="chart-body">
                  <div class="donut-wrap">
                    <div class="donut" :style="{ background: donutBackground }">
                      <div class="donut-hole" />
                    </div>
                  </div>
                  <div class="legend">
                    <div v-for="item in statusSlices" :key="item.name" class="legend-item">
                      <span class="legend-dot" :style="{ background: item.color }" />
                      <span>{{ item.name }} ({{ item.percentage.toFixed(1) }}%)</span>
                    </div>
                  </div>
                </div>
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
              <article v-for="row in vacancyRows" :key="row.id" class="vacancy-card">
                <div class="vacancy-head">
                  <div>
                    <h3>{{ row.title }}</h3>
                    <p>
                      <i class="fa-solid fa-location-dot" aria-hidden="true" />
                      <span>{{ row.location }}</span>
                    </p>
                  </div>
                  <span class="vacancy-status" :class="getVacancyStatusClass(row.status)">{{ row.status }}</span>
                </div>
                <div class="vacancy-metrics">
                  <div v-for="metric in row.stats" :key="metric.label" class="metric-item">
                    <strong>{{ metric.value }}</strong>
                    <span>{{ metric.label }}</span>
                  </div>
                </div>
              </article>
            </section>
          </div>
        </main>
      </div>
    </main>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.screen {
  min-height: 100dvh;
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

.rail-notif-link {
  border: 0;
  background: transparent;
  padding: 0;
  text-align: left;
  font-size: 11px;
  color: #274868;
  font-weight: 600;
  cursor: pointer;
}

.rail-notif-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
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
  background: #ffffff;
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

.content-panel {
  background: #fff;
  overflow: auto;
  padding: 0;
}

.employer-dashboard-page {
  min-height: 100%;
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

.notif-link {
  border: 0;
  background: transparent;
  padding: 0;
  text-align: left;
  color: #274868;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.notif-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
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

.graph-section {
  padding: 20px 0 8px;
}

.graph-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.graph-head h1 {
  margin: 0;
  font-size: 30px;
  letter-spacing: -0.5px;
  color: #052346;
}

.graph-head p {
  margin: 8px 0 0;
  font-size: 12px;
  color: #6c757d;
}

.ringkasan-posting-btn {
  height: 34px;
  border: 1px solid #0b8f84;
  border-radius: 8px;
  background: #0b8f84;
  color: #fff;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.ringkasan-posting-btn:hover {
  background: #08786f;
  border-color: #08786f;
}

.stats-layout {
  margin-top: 14px;
  display: grid;
  grid-template-columns: minmax(320px, 420px) 1fr;
  gap: 12px;
}

.summary-stack {
  display: grid;
  gap: 10px;
}

.chart-card {
  border: 1px solid #dfe6ee;
  border-radius: 10px;
  background: #fff;
  padding: 12px;
}

.summary-title {
  margin: 0;
  color: #5f6b7a;
  font-size: 11px;
  font-weight: 700;
}

.summary-value {
  margin: 8px 0 0;
  color: #0f2743;
  font-size: 28px;
  font-weight: 800;
}

.chart-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: #30475e;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.chart-body {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 180px 1fr;
  align-items: center;
  gap: 16px;
}

.donut-wrap {
  display: grid;
  place-items: center;
}

.donut {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  display: grid;
  place-items: center;
}

.donut-hole {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: #fff;
}

.legend {
  display: grid;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #3c5066;
  font-size: 12px;
  font-weight: 600;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
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
  display: grid;
  gap: 14px;
}

.vacancy-card {
  border-radius: 10px;
  border: 1px solid #edf1f5;
  overflow: hidden;
  background: #fff;
}

.vacancy-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 22px 14px;
}

.vacancy-head h3 {
  margin: 0;
  color: #23425f;
  font-size: 32px;
  font-weight: 700;
}

.vacancy-head p {
  margin: 6px 0 0;
  color: #8c97a4;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.vacancy-status {
  border-radius: 999px;
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}

.vacancy-status-closed {
  background: #e53d57;
  color: #fff;
}

.vacancy-status-pending {
  background: #facc15;
  color: #5b4100;
}

.vacancy-metrics {
  background: #f2f4f7;
  border-top: 1px solid #edf1f5;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.metric-item {
  min-height: 84px;
  display: grid;
  place-items: center;
  text-align: center;
  border-right: 1px solid #e7ebf0;
  padding: 8px;
}

.metric-item:last-child {
  border-right: 0;
}

.metric-item strong {
  display: block;
  color: #274868;
  font-size: 34px;
  line-height: 1;
}

.metric-item span {
  margin-top: 6px;
  color: #687787;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

@media (max-width: 1400px) {
  .screen {
    grid-template-columns: 80px 240px 1fr;
  }
}

@media (max-width: 1200px) {
  .main-nav {
    display: none;
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

@media (max-width: 900px) {
  .stats-layout {
    grid-template-columns: 1fr;
  }

  .chart-body {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .graph-head h1 {
    font-size: 24px;
  }

  .graph-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .vacancy-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .vacancy-head h3 {
    font-size: 24px;
  }

  .vacancy-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .metric-item {
    border-right: 1px solid #e7ebf0;
    border-bottom: 1px solid #e7ebf0;
  }

  .metric-item:nth-child(2n) {
    border-right: 0;
  }

  .metric-item strong {
    font-size: 24px;
  }

  .metric-item span {
    font-size: 12px;
  }
}
</style>
