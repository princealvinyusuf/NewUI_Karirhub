<script setup lang="ts">
type OtpStatus = "Terkirim" | "Terverifikasi" | "Kadaluwarsa"
type OtpGeneratorRole = "Pencaker" | "Admin"

type OtpHistory = {
  kodeOtp: string
  statusOtp: OtpStatus
  waktuGenerate: string
  channel: "SMS" | "System"
  generatedByRole: OtpGeneratorRole
  generatedByName: string
}

type OtpUser = {
  no: number
  nama: string
  nik: string
  noHp: string
  email: string
  alamat: string
  statusOtp: OtpStatus
  waktu: string
  otpHistory: OtpHistory[]
}

const otpRows: OtpUser[] = [
  {
    no: 1,
    nama: "Rina Aulia",
    nik: "3174024901880001",
    noHp: "081234567001",
    email: "rina.aulia@mail.com",
    alamat: "Jl. Tebet Timur Dalam VIII No.17",
    statusOtp: "Terkirim",
    waktu: "28 Mei 2026 09:14",
    otpHistory: [
      {
        kodeOtp: "839102",
        statusOtp: "Kadaluwarsa",
        waktuGenerate: "27 Mei 2026 19:45",
        channel: "SMS",
        generatedByRole: "Pencaker",
        generatedByName: "Generate by Rina Aulia",
      },
      {
        kodeOtp: "492187",
        statusOtp: "Terkirim",
        waktuGenerate: "28 Mei 2026 09:14",
        channel: "SMS",
        generatedByRole: "Pencaker",
        generatedByName: "Generate by Rina Aulia",
      },
    ],
  },
  {
    no: 2,
    nama: "Fadli Pratama",
    nik: "3201142204930002",
    noHp: "081234567002",
    email: "fadli.pratama@mail.com",
    alamat: "Jl. Cempaka Putih Tengah No. 21",
    statusOtp: "Terverifikasi",
    waktu: "28 Mei 2026 09:18",
    otpHistory: [
      {
        kodeOtp: "128904",
        statusOtp: "Terkirim",
        waktuGenerate: "28 Mei 2026 09:15",
        channel: "SMS",
        generatedByRole: "Pencaker",
        generatedByName: "Generate by Fadli Pratama",
      },
      {
        kodeOtp: "128904",
        statusOtp: "Terverifikasi",
        waktuGenerate: "28 Mei 2026 09:18",
        channel: "SMS",
        generatedByRole: "Pencaker",
        generatedByName: "Generate byFadli Pratama",
      },
    ],
  },
  {
    no: 3,
    nama: "Nadia Putri",
    nik: "3276031207990003",
    noHp: "081234567003",
    email: "nadia.putri@mail.com",
    alamat: "Jl. Sukamulya RT 03/RW 02",
    statusOtp: "Kadaluwarsa",
    waktu: "28 Mei 2026 09:27",
    otpHistory: [
      {
        kodeOtp: "773650",
        statusOtp: "Kadaluwarsa",
        waktuGenerate: "28 Mei 2026 09:27",
        channel: "SMS",
        generatedByRole: "Pencaker",
        generatedByName: "Generate by Nadia Putri",
      },
    ],
  },
  {
    no: 4,
    nama: "Dedi Gunawan",
    nik: "1371040101800004",
    noHp: "081234567004",
    email: "dedi.gunawan@mail.com",
    alamat: "Komplek Merdeka Blok B3 No. 10",
    statusOtp: "Terkirim",
    waktu: "28 Mei 2026 09:35",
    otpHistory: [
      {
        kodeOtp: "611284",
        statusOtp: "Kadaluwarsa",
        waktuGenerate: "28 Mei 2026 08:50",
        channel: "SMS",
        generatedByRole: "Pencaker",
        generatedByName: "Generate by Dedi Gunawan",
      },
      {
        kodeOtp: "951274",
        statusOtp: "Terkirim",
        waktuGenerate: "28 Mei 2026 09:35",
        channel: "SMS",
        generatedByRole: "Pencaker",
        generatedByName: "Generate byDedi Gunawan",
      },
    ],
  },
]

const nikSearchInput = ref("")
const nikSearch = ref("")
const statusFilter = ref<"Semua" | OtpStatus>("Semua")
const pendingStatusFilter = ref<"Semua" | OtpStatus>("Semua")
const showStatusFilter = ref(false)
const showDetailModal = ref(false)
const selectedUser = ref<OtpUser | null>(null)
const otpRowsVersion = ref(0)

const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
const monthIndexByName: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Mei: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Agu: 7,
  Sep: 8,
  Oct: 9,
  Okt: 9,
  Nov: 10,
  Dec: 11,
  Des: 11,
}
const toTwoDigits = (value: number) => String(value).padStart(2, "0")
const formatOtpDateTime = (date: Date) => {
  const day = toTwoDigits(date.getDate())
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()
  const hour = toTwoDigits(date.getHours())
  const minute = toTwoDigits(date.getMinutes())
  return `${day} ${month} ${year} ${hour}:${minute}`
}
const generateOtpCode = () => String(Math.floor(100000 + Math.random() * 900000))
const parseOtpDateTimeToTimestamp = (dateText: string) => {
  const match = dateText.match(/^(\d{1,2})\s([A-Za-z]{3})\s(\d{4})\s(\d{2}):(\d{2})$/)
  if (!match) return 0
  const [, dayText, monthTextRaw, yearText, hourText, minuteText] = match
  if (!monthTextRaw) return 0
  const monthIndex = monthIndexByName[monthTextRaw]
  if (monthIndex === undefined) return 0
  return new Date(Number(yearText), monthIndex, Number(dayText), Number(hourText), Number(minuteText)).getTime()
}

const hasNikQuery = computed(() => nikSearch.value.trim().length > 0)
const filteredOtpRows = computed(() => {
  otpRowsVersion.value
  const query = nikSearch.value.trim().toLowerCase()
  if (!query) return []
  return otpRows.filter((row) => {
    const matchNik = row.nik.toLowerCase().includes(query)
    const matchStatus = statusFilter.value === "Semua" || row.statusOtp === statusFilter.value
    return matchNik && matchStatus
  })
})
const resultSummary = computed(() => {
  if (!hasNikQuery.value) return "Masukkan NIK untuk melihat data OTP."
  const statusText = statusFilter.value === "Semua" ? "semua status" : `status ${statusFilter.value}`
  return `${filteredOtpRows.value.length} data ditemukan dengan ${statusText}.`
})
const sortedSelectedUserOtpHistory = computed(() => {
  const history = selectedUser.value?.otpHistory ?? []
  return [...history].sort(
    (firstItem, secondItem) =>
      parseOtpDateTimeToTimestamp(secondItem.waktuGenerate) - parseOtpDateTimeToTimestamp(firstItem.waktuGenerate),
  )
})
const searchByNik = () => {
  nikSearch.value = nikSearchInput.value.trim()
}

const openDetailModal = (user: OtpUser) => {
  selectedUser.value = user
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedUser.value = null
}

const toggleStatusFilter = () => {
  if (showStatusFilter.value) {
    showStatusFilter.value = false
    return
  }
  pendingStatusFilter.value = statusFilter.value
  showStatusFilter.value = true
}

const applyStatusFilter = () => {
  statusFilter.value = pendingStatusFilter.value
  showStatusFilter.value = false
}

const resetStatusFilter = () => {
  pendingStatusFilter.value = "Semua"
  statusFilter.value = "Semua"
  showStatusFilter.value = false
}

const regenerateOtp = () => {
  if (!selectedUser.value) return

  const nowText = formatOtpDateTime(new Date())
  const history = selectedUser.value.otpHistory
  const latestHistory = history[history.length - 1]
  const otpAdminName = "Generate by John Doe"

  if (latestHistory) {
    latestHistory.statusOtp = "Kadaluwarsa"
  }

  const newOtp: OtpHistory = {
    kodeOtp: generateOtpCode(),
    channel: "System",
    statusOtp: "Terkirim",
    waktuGenerate: nowText,
    generatedByRole: "Admin",
    generatedByName: otpAdminName,
  }

  history.push(newOtp)
  selectedUser.value.statusOtp = "Terkirim"
  selectedUser.value.waktu = nowText
  otpRowsVersion.value += 1
}
</script>

<template>
  <div class="otp-page">
    <header class="otp-head">
      <div>
        <h1>OTP Pencari Kerja</h1>
        <p>Daftar pengguna dan status OTP pencari kerja.</p>
      </div>
      <button class="otp-refresh-btn" type="button">Refresh</button>
    </header>

    <section class="otp-table-wrap">
      <div class="otp-tools">
        <div class="otp-search-block">
          <label class="otp-search-label" for="otp-nik-search">Cari NIK Pencari Kerja</label>
          <div class="otp-search-input-row">
            <input id="otp-nik-search" v-model="nikSearchInput" type="text" placeholder="Contoh: 3174024901880001" />
            <button type="button" class="otp-search-btn" @click="searchByNik">Search</button>
          </div>
        </div>
        <div class="otp-tools-right">
          <p class="otp-result-note">{{ resultSummary }}</p>
          <div v-if="hasNikQuery" class="otp-filter-wrap">
            <button type="button" class="otp-filter-btn" @click="toggleStatusFilter">Filter Status <span>{{ showStatusFilter ? "▲" : "▼" }}</span></button>
          <div v-if="showStatusFilter" class="otp-filter-dropdown">
            <label class="otp-filter-field">
              <span>Status OTP</span>
              <select v-model="pendingStatusFilter" class="otp-filter-select">
                <option value="Semua">Semua Status OTP</option>
                <option value="Terkirim">Terkirim</option>
                <option value="Terverifikasi">Terverifikasi</option>
                <option value="Kadaluwarsa">Kadaluwarsa</option>
              </select>
            </label>
            <div class="otp-filter-actions">
              <button type="button" class="otp-filter-action secondary" @click="resetStatusFilter">Reset</button>
              <button type="button" class="otp-filter-action primary" @click="applyStatusFilter">Terapkan</button>
            </div>
          </div>
        </div>
        </div>
      </div>
      <p v-if="!hasNikQuery" class="otp-empty otp-empty-intro">Masukkan NIK terlebih dahulu untuk menampilkan data OTP pencari kerja.</p>
      <div v-else class="otp-table-scroll">
        <table class="otp-table">
          <thead>
            <tr>
              <th>NO.</th>
              <th>NAMA</th>
              <th>NIK</th>
              <th>NO. HP</th>
              <th>STATUS OTP</th>
              <th>WAKTU</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in filteredOtpRows" :key="row.no">
              <td>{{ row.no }}</td>
              <td>{{ row.nama }}</td>
              <td>{{ row.nik }}</td>
              <td>{{ row.noHp }}</td>
              <td>
                <span class="otp-status" :class="`otp-status-${row.statusOtp.toLowerCase()}`">{{ row.statusOtp }}</span>
              </td>
              <td>{{ row.waktu }}</td>
              <td>
                <button type="button" class="otp-detail-btn" @click="openDetailModal(row)">Detail</button>
              </td>
            </tr>
            <tr v-if="!filteredOtpRows.length">
              <td colspan="7" class="otp-empty">Data dengan NIK tersebut tidak ditemukan.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="showDetailModal && selectedUser" class="otp-modal-overlay" @click.self="closeDetailModal">
      <section class="otp-modal">
        <button class="otp-modal-close" type="button" @click="closeDetailModal" aria-label="Close detail">×</button>
        <h2>Detail Pengguna OTP</h2>
        <div class="otp-user-grid">
          <div class="otp-user-field">
            <p>Nama</p>
            <strong>{{ selectedUser.nama }}</strong>
          </div>
          <div class="otp-user-field">
            <p>NIK</p>
            <strong>{{ selectedUser.nik }}</strong>
          </div>
          <div class="otp-user-field">
            <p>No. HP</p>
            <strong>{{ selectedUser.noHp }}</strong>
          </div>
          <div class="otp-user-field">
            <p>Email</p>
            <strong>{{ selectedUser.email }}</strong>
          </div>
          <div class="otp-user-field otp-user-field-full">
            <p>Alamat</p>
            <strong>{{ selectedUser.alamat }}</strong>
          </div>
        </div>

        <div class="otp-history-head">
          <h3>Riwayat OTP yang Dihasilkan</h3>
          <button type="button" class="otp-regenerate-btn" @click="regenerateOtp">Regenerate OTP</button>
        </div>
        <div class="otp-history-wrap">
          <table class="otp-history-table">
            <thead>
              <tr>
                <th>KODE OTP</th>
                <th>CHANNEL</th>
                <th>STATUS</th>
                <th>WAKTU GENERATE</th>
                <th>KETERANGAN</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in sortedSelectedUserOtpHistory" :key="`${item.kodeOtp}-${index}`">
                <td>{{ item.kodeOtp }}</td>
                <td>{{ item.channel }}</td>
                <td>
                  <span class="otp-status" :class="`otp-status-${item.statusOtp.toLowerCase()}`">{{ item.statusOtp }}</span>
                </td>
                <td>{{ item.waktuGenerate }}</td>
                <td>{{ item.generatedByName }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.otp-page { padding: 10px 0 2px; }
.otp-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 14px;
}
.otp-head h1 {
  margin: 0;
  color: #12395d;
  font-size: 25px;
  letter-spacing: 0.2px;
}
.otp-head p {
  margin: 6px 0 0;
  color: #64778d;
  font-size: 12px;
}
.otp-refresh-btn {
  border: 1px solid #c8d7e6;
  background: linear-gradient(180deg, #fff 0%, #f4f8fc 100%);
  color: #1e3b59;
  border-radius: 10px;
  height: 34px;
  padding: 0 14px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}
.otp-refresh-btn:hover { box-shadow: 0 8px 16px rgba(16, 60, 108, 0.12); transform: translateY(-1px); }

.otp-table-wrap {
  border: 1px solid #dfe8f3;
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 14px 28px rgba(20, 54, 92, 0.08);
}
.otp-tools {
  padding: 14px;
  background: linear-gradient(180deg, #f9fbff 0%, #f3f8ff 100%);
  border-bottom: 1px solid #e2ebf5;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
}
.otp-search-block { display: grid; gap: 7px; min-width: min(100%, 320px); }
.otp-search-label { font-size: 12px; color: #294766; font-weight: 700; }
.otp-search-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.otp-tools input {
  width: 340px;
  max-width: 100%;
  height: 38px;
  border: 1px solid #c9d7e5;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 12px;
  color: #12395d;
  background: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.otp-tools input:focus {
  outline: none;
  border-color: #3e8bff;
  box-shadow: 0 0 0 3px rgba(62, 139, 255, 0.18);
}
.otp-search-btn {
  height: 38px;
  border: 1px solid #0d6efd;
  border-radius: 10px;
  padding: 0 14px;
  background: linear-gradient(180deg, #2e8cff 0%, #0d6efd 100%);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.otp-search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 15px rgba(13, 110, 253, 0.24);
}

.otp-tools-right { margin-left: auto; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.otp-result-note {
  margin: 0;
  font-size: 11px;
  color: #5a7089;
  font-weight: 600;
  background: #fff;
  border: 1px solid #d6e3f0;
  border-radius: 999px;
  padding: 8px 12px;
}

.otp-filter-wrap { position: relative; }
.otp-filter-btn {
  border: 1px solid #c2d2e3;
  background: #fff;
  color: #1e3b59;
  border-radius: 10px;
  height: 36px;
  padding: 0 12px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease;
}
.otp-filter-btn:hover { background: #f3f8ff; border-color: #8ab8f2; }
.otp-filter-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 240px;
  border: 1px solid #d9e5f1;
  border-radius: 12px;
  box-shadow: 0 16px 30px rgba(11, 27, 49, 0.16);
  background: #fff;
  padding: 12px;
  z-index: 15;
}
.otp-filter-field { display: grid; gap: 6px; }
.otp-filter-field span { font-size: 12px; color: #324b66; font-weight: 700; }
.otp-filter-select {
  height: 36px;
  border: 1px solid #ced8e4;
  border-radius: 8px;
  padding: 0 10px;
  font-size: 12px;
  color: #203952;
  background: #fff;
}
.otp-filter-actions { margin-top: 12px; display: flex; justify-content: flex-end; gap: 8px; }
.otp-filter-action {
  height: 32px;
  border-radius: 8px;
  padding: 0 12px;
  border: 1px solid transparent;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}
.otp-filter-action.secondary { background: #fff; color: #1f3558; border-color: #d0d7de; }
.otp-filter-action.primary { background: #0d6efd; border-color: #0d6efd; color: #fff; }

.otp-table-scroll { overflow-x: auto; }
.otp-table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 900px; }
.otp-table th,
.otp-table td {
  padding: 12px 12px;
  text-align: left;
  border-bottom: 1px solid #ebf1f8;
  font-size: 11px;
}
.otp-table th {
  color: #1d3f64;
  font-weight: 800;
  background: #f4f8fe;
  letter-spacing: 0.2px;
}
.otp-table tbody tr { transition: background 0.18s ease; }
.otp-table tbody tr:hover { background: #f8fbff; }
.otp-table td { color: #203952; }

.otp-empty { text-align: center !important; color: #6b7c91 !important; font-weight: 600; }
.otp-empty-intro {
  padding: 20px 12px;
  margin: 0;
  border-top: 1px solid #ebf1f8;
  background: linear-gradient(180deg, #fcfdff 0%, #f6faff 100%);
}
.otp-detail-btn {
  border: 1px solid #1d71ea;
  background: linear-gradient(180deg, #2e8cff 0%, #0d6efd 100%);
  color: #fff;
  border-radius: 8px;
  height: 28px;
  padding: 0 12px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;
}
.otp-detail-btn:hover { box-shadow: 0 8px 15px rgba(13, 110, 253, 0.26); transform: translateY(-1px); }
.otp-status {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  padding: 5px 11px;
  border: 1px solid transparent;
}
.otp-status-terkirim { background: #e9f2ff; color: #174aa8; border-color: #cce0ff; }
.otp-status-terverifikasi { background: #e6f8ee; color: #10653f; border-color: #bde9d0; }
.otp-status-kadaluwarsa { background: #ffeaea; color: #9d1f1f; border-color: #f8c9c9; }

.otp-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(11, 23, 39, 0.58);
  backdrop-filter: blur(2px);
  display: grid;
  place-items: center;
  padding: 14px;
  z-index: 40;
}
.otp-modal {
  width: min(860px, 100%);
  background: #fff;
  border-radius: 16px;
  border: 1px solid #dce6f2;
  box-shadow: 0 24px 48px rgba(16, 42, 67, 0.3);
  padding: 18px;
  position: relative;
}
.otp-modal-close {
  position: absolute;
  top: 12px;
  right: 14px;
  border: 0;
  background: transparent;
  color: #2d4665;
  font-size: 30px;
  line-height: 1;
  cursor: pointer;
}
.otp-modal h2 { margin: 0; font-size: 24px; color: #153a5f; }
.otp-user-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid #e8edf4;
}
.otp-user-field {
  border: 1px solid #e7eef6;
  border-radius: 10px;
  padding: 10px;
  background: #fbfdff;
}
.otp-user-field p { margin: 0 0 4px; color: #5e7087; font-size: 11px; }
.otp-user-field strong { color: #0f2d4b; font-size: 14px; font-weight: 700; }
.otp-user-field-full { grid-column: 1 / -1; }
.otp-history-head {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.otp-history-head h3 { margin: 0; color: #153a5f; font-size: 16px; }
.otp-regenerate-btn {
  height: 34px;
  border: 1px solid #f5a524;
  background: linear-gradient(180deg, #ffbe4e 0%, #f59e0b 100%);
  color: #fff;
  border-radius: 9px;
  padding: 0 13px;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.otp-regenerate-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 14px rgba(245, 158, 11, 0.3); }
.otp-history-wrap {
  margin-top: 10px;
  border: 1px solid #e4ebf3;
  border-radius: 10px;
  overflow: auto;
}
.otp-history-table { width: 100%; border-collapse: collapse; min-width: 820px; }
.otp-history-table th,
.otp-history-table td {
  padding: 10px 9px;
  text-align: left;
  border-bottom: 1px solid #edf2f7;
  font-size: 11px;
}
.otp-history-table th { color: #1d3f64; font-weight: 700; background: #f8fbfe; }
.otp-history-table td { color: #203952; }

@media (max-width: 768px) {
  .otp-head { flex-direction: column; }
  .otp-tools { align-items: stretch; }
  .otp-tools-right { margin-left: 0; width: 100%; justify-content: space-between; }
  .otp-result-note { width: 100%; border-radius: 10px; }
  .otp-modal h2 { font-size: 20px; padding-right: 24px; }
  .otp-user-grid { grid-template-columns: 1fr; }
  .otp-history-head { align-items: stretch; flex-direction: column; }
}
</style>
