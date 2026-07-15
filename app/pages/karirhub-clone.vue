<script setup lang="ts">
const router = useRouter()

type JobItem = {
  title: string
  company: string
  location: string
  salary: string
  deadline: string
  remaining: string
  source: "HiredToday" | "Karirhub"
}

type PopularField = {
  name: string
  total: string
}

type NotificationItem = {
  id: number
  title: string
  time: string
  isRead: boolean
  target: string
  linkType: "internal" | "external"
}

const menuItems = ["Tentang Karirhub", "Lowongan Dalam Negeri", "Lowongan Luar Negeri", "Jobfair", "Media Center"]

const trendingJobs: JobItem[] = [
  {
    title: "Digital Marketing Manager",
    company: "Lomo Boutique Hotel",
    location: "KAB. BADUNG, BALI, Indonesia",
    salary: "Dirahasiakan",
    deadline: "29 Agt 2026",
    remaining: "1 lowongan",
    source: "HiredToday",
  },
  {
    title: "Digital Marketing Executive",
    company: "Lomo Boutique Hotel",
    location: "KAB. BADUNG, BALI, Indonesia",
    salary: "Dirahasiakan",
    deadline: "29 Agt 2026",
    remaining: "1 lowongan",
    source: "HiredToday",
  },
  {
    title: "BANKIR PEMBERDAYA - LAMPUNG",
    company: "PT Bank BTPN Syariah, Tbk",
    location: "Kota Bandar Lampung, Lampung, Indonesia",
    salary: "Rp 3,3 jt - Rp 3,5 jt",
    deadline: "31 Des 2026",
    remaining: "20 lowongan",
    source: "Karirhub",
  },
  {
    title: "Kasir",
    company: "PT Medikaloka Bitung",
    location: "Kabupaten Tangerang, Banten, Indonesia",
    salary: "Dirahasiakan",
    deadline: "31 Agt 2026",
    remaining: "1 lowongan",
    source: "Karirhub",
  },
]

const popularFields: PopularField[] = [
  { name: "Penjualan dan Pemasaran", total: "11881 Lowongan" },
  { name: "Operator", total: "6058 Lowongan" },
  { name: "Operasi Perbankan", total: "5441 Lowongan" },
  { name: "Marketing dan Relasi Publik", total: "4500 Lowongan" },
  { name: "Manufaktur dan Produksi", total: "3292 Lowongan" },
  { name: "Operasional", total: "3215 Lowongan" },
  { name: "Supir", total: "2575 Lowongan" },
  { name: "Logistik", total: "2524 Lowongan" },
  { name: "Layanan Pelanggan", total: "2453 Lowongan" },
  { name: "Kolektor", total: "2149 Lowongan" },
]

const employerAdvantages = [
  {
    icon: "fa-solid fa-building-user",
    title: "Platform rekruitmen terbaik",
    description:
      "Platform rekruitmen gratis terbaik bagi perusahaan yang ter-integrasi dengan ekosistem ketenagakerjaan.",
  },
  {
    icon: "fa-solid fa-id-card",
    title: "Pencarian kerja terverifikasi",
    description:
      "Identitas dan kontak para pencari kerja yang terdaftar di Karirhub sudah terverifikasi dengan Dukcapil atau Disnaker setempat.",
  },
  {
    icon: "fa-solid fa-file-circle-plus",
    title: "Publikasi lowongan tanpa batas",
    description: "Publikasi lowongan pekerjaan secara cepat, tanpa batas dan gratis.",
  },
  {
    icon: "fa-solid fa-users-viewfinder",
    title: "Talent match",
    description: "Nikmati fitur talent match Karirhub untuk menemukan para pencari kerja sesuai kualifikasi.",
  },
]

const testimonials = [
  {
    name: "Aristia",
    role: "Human Resource",
    text: "Makasih banyak SIAPkerja! Lowongannya sangat membantu aku yang belum bekerja ini.",
  },
  {
    name: "Adi Septian",
    role: "Software Engineer",
    text: "Mulai kenal Karirhub, cari lowongan sekarang udah gak ribet lagi.",
  },
  {
    name: "Yunita",
    role: "Legal & Compliance",
    text: "Sangat membantu buat yang lagi nganggur dapet kerjaan sesuai passion.",
  },
]

const showNotifications = ref(false)
const notifications = ref<NotificationItem[]>([
  {
    id: 1,
    title: "Lamaran Kamu Sudah di lihat HRD",
    time: "5 menit lalu",
    isRead: false,
    target: "https://siapkerja.kemnaker.go.id/",
    linkType: "external",
  },
  {
    id: 2,
    title: "Lowongan baru cocok dengan profil kamu",
    time: "20 menit lalu",
    isRead: false,
    target: "/karirhub-clone",
    linkType: "internal",
  },
  {
    id: 3,
    title: "Akun kamu berhasil di verifikasi",
    time: "1 jam lalu",
    isRead: true,
    target: "/karirhub-clone",
    linkType: "internal",
  },
])

const unreadNotificationCount = computed(() => notifications.value.filter((item) => !item.isRead).length)

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const openNotificationTarget = (item: NotificationItem) => {
  showNotifications.value = false

  if (item.linkType === "external") {
    if (import.meta.client) {
      window.location.assign(item.target)
    }
    return
  }

  void router.push(item.target)
}

const goToEmployerDashboard = () => {
  void router.push("/dasbor_pemberi_kerja")
}
</script>

<template>
  <div class="karirhub-page">
    <header class="navbar">
      <div class="container nav-content">
        <div class="brand">
          <div class="brand-badge">
            <i class="fa-solid fa-briefcase" />
          </div>
          <div class="brand-text">
            <strong>Karirhub</strong>
            <span>oleh Kemnaker</span>
          </div>
        </div>

        <nav class="desktop-nav">
          <a v-for="item in menuItems" :key="item" href="#">{{ item }}</a>
        </nav>

        <div class="nav-right">
          <div class="notification-wrapper">
            <button class="notification-button" type="button" @click="toggleNotifications">
              <i class="fa-regular fa-bell" />
              <span v-if="unreadNotificationCount > 0" class="notification-badge">{{ unreadNotificationCount }}</span>
            </button>

            <div v-if="showNotifications" class="notification-dropdown">
              <p class="notification-title">Notifikasi</p>
              <ul>
                <li v-for="item in notifications" :key="item.id" :class="{ unread: !item.isRead }">
                  <button type="button" class="notification-link" @click="openNotificationTarget(item)">
                    <span>{{ item.title }}</span>
                    <small>{{ item.time }}</small>
                  </button>
                </li>
              </ul>
              <NuxtLink class="see-all-notifications" to="/notifikasi">Lihat semua notifikasi</NuxtLink>
            </div>
          </div>

          <button class="dashboard-chip" type="button" @click="goToEmployerDashboard">
            <span>Dasbor Pengelola</span>
            <span class="dashboard-avatar">
              <i class="fa-solid fa-user" />
            </span>
          </button>
        </div>
      </div>
    </header>

    <main>
      <section class="hero">
        <div class="container hero-grid">
          <div class="hero-content">
            <p class="hero-kicker">Karirhub oleh Kemnaker</p>
            <h1>Dapatkan pekerjaan dari seluruh dunia</h1>
            <p class="hero-description">
              Temukan peluang kerja terbaik, lowongan terverifikasi, dan jalur karir yang sesuai dengan kemampuanmu.
            </p>

            <div class="search-box">
              <div class="search-item">
                <i class="fa-solid fa-magnifying-glass" />
                <input type="text" placeholder="Cari Lowongan" />
              </div>
              <button class="btn btn-primary">Cari Lowongan</button>
            </div>
          </div>

          <div class="hero-visual">
            <div class="hero-card">
              <p>Lowongan aktif</p>
              <strong>68.000+</strong>
              <small>Terhubung dengan perusahaan terbaik</small>
            </div>
            <div class="hero-card muted">
              <p>Pencari kerja</p>
              <strong>1,2 Juta+</strong>
              <small>Sudah terverifikasi ekosistem Kemnaker</small>
            </div>
          </div>
        </div>
      </section>

      <section class="section container">
        <div class="section-head">
          <div>
            <h2>Lowongan kerja yang sedang trending</h2>
            <p>Temukan lowongan pekerjaan teratas yang banyak dilamar oleh para pencari kerja.</p>
          </div>
          <button class="btn btn-ghost">Lihat Lebih Banyak</button>
        </div>

        <div class="job-grid">
          <article v-for="job in trendingJobs" :key="job.title" class="job-card">
            <p class="posted-time">dalam waktu sekitar 6 jam</p>
            <h3>{{ job.title }}</h3>
            <p class="company">{{ job.company }}</p>
            <p class="location">{{ job.location }}</p>
            <div class="meta">
              <p><strong>Kisaran Gaji</strong> {{ job.salary }}</p>
              <p><strong>Lamar sebelum</strong> {{ job.deadline }}</p>
              <p><strong>Tersisa</strong> {{ job.remaining }}</p>
            </div>
            <span class="chip">Lowongan dari {{ job.source }}</span>
          </article>
        </div>
      </section>

      <section class="section section-soft">
        <div class="container">
          <h2>Bidang pekerjaan terpopuler</h2>
          <p class="section-description">Kategori dengan lowongan paling banyak dan paling diminati.</p>

          <div class="popular-grid">
            <article v-for="field in popularFields" :key="field.name" class="popular-card">
              <h3>{{ field.name }}</h3>
              <p>{{ field.total }}</p>
            </article>
          </div>

          <div class="center-actions">
            <p>Tidak menemukan bidang yang dicari?</p>
            <button class="btn btn-primary">Bidang Lainnya</button>
          </div>
        </div>
      </section>

      <section class="section container split">
        <div class="split-content">
          <h2>Jobfair oleh Kemnaker</h2>
          <p>
            Hadiri job fair kami dan temukan peluang karirmu. Mempertemukan para pemberi kerja terbaik dari berbagai
            industri untuk bertemu langsung dengan para pencari kerja.
          </p>
          <button class="btn btn-primary">Lihat Jadwal Jobfair</button>
        </div>
        <div class="split-panel">
          <div class="floating-stat">
            <strong>100+</strong>
            <span>Perusahaan ikut serta</span>
          </div>
          <div class="floating-stat">
            <strong>20.000+</strong>
            <span>Kunjungan pencari kerja</span>
          </div>
        </div>
      </section>

      <section class="section container">
        <div class="section-head">
          <div>
            <h2>Platform rekruitmen terbaik untuk pemberi kerja</h2>
            <p>Fitur lengkap dan gratis untuk publikasi lowongan serta pencarian kandidat yang tepat.</p>
          </div>
          <button class="btn btn-ghost">Pelajari Sebagai Pemberi Kerja</button>
        </div>

        <div class="advantages-grid">
          <article v-for="item in employerAdvantages" :key="item.title" class="advantage-card">
            <i :class="item.icon" />
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </article>
        </div>
      </section>

      <section class="section section-soft">
        <div class="container dual-feature">
          <article class="feature-card">
            <h3>Lowongan dalam negeri</h3>
            <p>Temukan banyak kesempatan karir di dalam negeri yang sesuai dengan kualifikasimu.</p>
            <button class="btn btn-primary">Lihat Lowongan</button>
          </article>
          <article class="feature-card dark">
            <h3>Lowongan luar negeri</h3>
            <p>Jelajahi dunia dan temukan karir impianmu di luar negeri yang terverifikasi.</p>
            <button class="btn btn-light">Lihat Lowongan</button>
          </article>
        </div>
      </section>

      <section class="section container">
        <h2 class="center-title">Yang mereka katakan tentang Karirhub</h2>
        <p class="section-description center-text">
          Wawasan berharga dari karyawan dan mantan karyawan tentang pengalaman mereka.
        </p>

        <div class="testimonials-grid">
          <article v-for="person in testimonials" :key="person.name" class="testimonial-card">
            <h3>{{ person.name }}</h3>
            <span>{{ person.role }}</span>
            <p>{{ person.text }}</p>
          </article>
        </div>
      </section>

      <section class="bottom-cta">
        <div class="container bottom-cta-content">
          <div>
            <h2>Temukan pekerjaan yang diinginkan</h2>
            <p>Dapatkan akses ke berbagai daftar pekerjaan dan informasi lowongan terbaru.</p>
          </div>
          <button class="btn btn-light">Cari Lowongan Sekarang</button>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
:root {
  color-scheme: light;
}

* {
  box-sizing: border-box;
}

.karirhub-page {
  min-height: 100vh;
  color: #111827;
  background: #f8fafc;
  font-family: "Inter", "Segoe UI", Arial, sans-serif;
}

.container {
  width: min(1160px, calc(100% - 2rem));
  margin-inline: auto;
}

.navbar {
  background: #ffffff;
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
}

.brand-text span {
  color: #64748b;
  font-size: 0.78rem;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.desktop-nav a {
  color: #374151;
  text-decoration: none;
  font-size: 0.86rem;
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
  width: 100%;
  border: none;
  background: transparent;
  padding: 0;
  text-align: left;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

.notification-link:hover span {
  color: #1d4ed8;
  text-decoration: underline;
}

.see-all-notifications {
  margin-top: 0.6rem;
  padding: 0.2rem 0;
  display: inline-block;
  text-decoration: none;
  color: #2563eb;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
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
  cursor: pointer;
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

.btn {
  border: 0;
  border-radius: 0.75rem;
  padding: 0.7rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary {
  color: #fff;
  background: #2563eb;
}

.btn-ghost {
  color: #0f172a;
  background: #e2e8f0;
}

.btn-light {
  color: #0f172a;
  background: #fff;
}

.hero {
  background: radial-gradient(circle at right top, #dbeafe 2%, transparent 45%),
    linear-gradient(180deg, #eef4ff 0%, #f8fafc 70%);
  padding: 4rem 0 3rem;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 2rem;
  align-items: center;
}

.hero-kicker {
  display: inline-flex;
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.84rem;
  margin-bottom: 1rem;
}

h1 {
  margin: 0;
  font-size: clamp(1.8rem, 3.5vw, 3rem);
  line-height: 1.15;
}

.hero-description {
  max-width: 560px;
  color: #334155;
  margin: 1rem 0 1.5rem;
}

.search-box {
  background: #fff;
  border: 1px solid #dbe2ea;
  border-radius: 1rem;
  padding: 0.6rem;
  display: flex;
  gap: 0.6rem;
  max-width: 650px;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex: 1;
  padding: 0 0.75rem;
}

.search-item i {
  color: #64748b;
}

.search-item input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 0.95rem;
}

.hero-visual {
  display: grid;
  gap: 1rem;
}

.hero-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1.25rem;
}

.hero-card p {
  margin: 0;
  color: #64748b;
}

.hero-card strong {
  display: block;
  margin: 0.4rem 0;
  font-size: 1.8rem;
}

.hero-card small {
  color: #334155;
}

.hero-card.muted {
  background: #eff6ff;
}

.section {
  padding: 3.2rem 0;
}

.section-soft {
  background: #eef2ff;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 1rem;
  margin-bottom: 1.4rem;
}

.section-head h2,
.section h2 {
  margin: 0 0 0.5rem;
  font-size: clamp(1.5rem, 2.7vw, 2.1rem);
}

.section-head p,
.section-description {
  margin: 0;
  color: #475569;
}

.job-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.job-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1rem;
}

.posted-time {
  margin: 0 0 0.5rem;
  color: #64748b;
  font-size: 0.82rem;
}

.job-card h3 {
  margin: 0;
  font-size: 1.1rem;
}

.company {
  color: #2563eb;
  margin: 0.5rem 0 0.2rem;
  font-weight: 600;
}

.location {
  margin: 0 0 0.9rem;
  color: #475569;
}

.meta p {
  margin: 0.2rem 0;
  font-size: 0.9rem;
}

.chip {
  margin-top: 0.8rem;
  display: inline-flex;
  border-radius: 999px;
  background: #dbeafe;
  color: #1e3a8a;
  padding: 0.3rem 0.75rem;
  font-size: 0.8rem;
}

.popular-grid {
  margin-top: 1.2rem;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.8rem;
}

.popular-card {
  background: #fff;
  border: 1px solid #dbe3ff;
  border-radius: 0.9rem;
  padding: 0.9rem;
}

.popular-card h3 {
  margin: 0 0 0.35rem;
  font-size: 0.9rem;
}

.popular-card p {
  margin: 0;
  color: #334155;
  font-weight: 600;
  font-size: 0.85rem;
}

.center-actions {
  margin-top: 1.4rem;
  text-align: center;
}

.center-actions p {
  margin-bottom: 0.75rem;
  color: #475569;
}

.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.split-content p {
  color: #475569;
  max-width: 560px;
}

.split-panel {
  display: grid;
  gap: 1rem;
}

.floating-stat {
  border-radius: 1rem;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: #fff;
  padding: 1.3rem;
}

.floating-stat strong {
  font-size: 1.6rem;
  display: block;
}

.advantages-grid {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.advantage-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1rem;
}

.advantage-card i {
  color: #2563eb;
  font-size: 1.25rem;
}

.advantage-card h3 {
  margin: 0.75rem 0 0.5rem;
}

.advantage-card p {
  margin: 0;
  color: #475569;
  font-size: 0.9rem;
}

.dual-feature {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.feature-card {
  background: #fff;
  border: 1px solid #dce5f8;
  border-radius: 1rem;
  padding: 1.4rem;
}

.feature-card p {
  color: #475569;
}

.feature-card.dark {
  color: #fff;
  background: #1e293b;
  border-color: #1e293b;
}

.feature-card.dark p {
  color: #dbeafe;
}

.center-title,
.center-text {
  text-align: center;
}

.testimonials-grid {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.testimonial-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1rem;
}

.testimonial-card h3 {
  margin: 0;
}

.testimonial-card span {
  color: #2563eb;
  display: block;
  margin: 0.3rem 0 0.7rem;
  font-weight: 600;
}

.testimonial-card p {
  margin: 0;
  color: #475569;
}

.bottom-cta {
  background: linear-gradient(135deg, #2563eb, #1e3a8a);
  color: #fff;
  margin-top: 2.5rem;
}

.bottom-cta-content {
  min-height: 190px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.bottom-cta-content p {
  margin: 0;
  color: #dbeafe;
}

@media (max-width: 1080px) {
  .desktop-nav {
    display: none;
  }

  .hero-grid,
  .split,
  .dual-feature {
    grid-template-columns: 1fr;
  }

  .popular-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .advantages-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
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

  .search-box {
    flex-direction: column;
  }

  .job-grid,
  .popular-grid,
  .testimonials-grid,
  .advantages-grid {
    grid-template-columns: 1fr;
  }

  .section-head {
    flex-direction: column;
    align-items: start;
  }

  .bottom-cta-content {
    flex-direction: column;
    align-items: start;
    justify-content: center;
    padding: 1.8rem 0;
  }
}
</style>
