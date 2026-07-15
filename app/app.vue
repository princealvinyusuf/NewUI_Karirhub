<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const showMainShell = computed(() =>
  ["/", "/app.vue", "/pencari-kerja", "/otp-pencari-kerja", "/posting-lowongan"].includes(route.path),
)
const isShellNuxtPage = computed(() =>
  ["/pencari-kerja", "/otp-pencari-kerja", "/posting-lowongan"].includes(route.path),
)

const quickIcons = [
  { key: "home", icon: "fas fa-chart-pie" },
  { key: "talent", icon: "fas fa-user-graduate" },
  { key: "vacancy", icon: "fas fa-envelope" },
  { key: "company", icon: "fas fa-building" },
  { key: "config", icon: "fas fa-cog" },
]

const logoUrl = "https://karirhub-console.kemnaker.go.id/assets/images/siaker-symbol-white.png"
const profileUrl = "https://account.kemnaker.go.id/users/48abb8e2-0ff0-4bec-a477-e498b4aa060a/picture"
const logoError = ref(false)
const profileError = ref(false)
const showRailNotifications = ref(false)
type RailNotificationLinkType = "internal" | "external"
type RailNotification = {
  id: number
  text: string
  time: string
  target: string
  linkType: RailNotificationLinkType
}

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

const summaryCards = [
  { title: "KEMENTERIAN/LEMBAGA TERVERIFIKASI", value: "84.136" },
  { title: "KEMENTERIAN/LEMBAGA TERVERIFIKASI BULAN INI", value: "3.714" },
  { title: "KEMENTERIAN/LEMBAGA TERVERIFIKASI TAHUN INI", value: "22.694" },
]

type StatusSlice = {
  name: string
  percentage: number
  color: string
}

const statusSlices: StatusSlice[] = [
  { name: "Terverifikasi", percentage: 3.42, color: "#4db8ef" },
  { name: "Belum Terverifikasi", percentage: 96.58, color: "#5fbe5a" },
]

const totalCompanies = "84.136"
const verifiedSlice = statusSlices[0] ?? { name: "Terverifikasi", percentage: 0, color: "#4db8ef" }
const unverifiedSlice = statusSlices[1] ?? { name: "Belum Terverifikasi", percentage: 0, color: "#5fbe5a" }
const donutBackground = computed(
  () =>
    `conic-gradient(${verifiedSlice.color} 0 ${verifiedSlice.percentage}%, ${unverifiedSlice.color} ${verifiedSlice.percentage}% 100%)`,
)

const activeSlice = ref<StatusSlice | null>(null)
const tooltipPosition = ref({ x: 0, y: 0 })

const firstSliceLimit = verifiedSlice.percentage * 3.6

const handleChartHover = (event: MouseEvent) => {
  const wrap = event.currentTarget as HTMLElement | null
  if (!wrap) return

  const rect = wrap.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const dx = event.clientX - centerX
  const dy = event.clientY - centerY
  const distance = Math.sqrt(dx * dx + dy * dy)
  const outerRadius = rect.width / 2
  const innerRadius = rect.width * 0.24

  tooltipPosition.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top - 14,
  }

  if (distance < innerRadius || distance > outerRadius) {
    activeSlice.value = null
    return
  }

  const angle = (Math.atan2(dy, dx) * 180) / Math.PI
  const normalizedAngle = (angle + 450) % 360
  activeSlice.value = normalizedAngle <= firstSliceLimit ? verifiedSlice : unverifiedSlice
}

const clearChartHover = () => {
  activeSlice.value = null
}

type InvitationLog = {
  date: string
  message: string
  status: "Terkirim" | "Dibaca" | "Diterima" | "Ditolak"
}

type CandidateRow = {
  no: number
  tanggalDaftar: string
  nama: string
  jabatan: string
  email: string
  kontak: string
  invitationRequestId?: string
  nomorSurat?: string
  tanggalSurat?: string
  namaInstansi?: string
  pejabatPenandatanganan?: string
  tanggalBerdiri?: string
  alamatInstansi?: string
  provinsi?: string
  kabupatenKota?: string
  kecamatan?: string
  kelurahan?: string
  kodePos?: string
  nomorTeleponInstansi?: string
  emailResmiInstansi?: string
  situsWeb?: string
  deskripsiSingkat?: string
  logoInstansiUrl?: string
  lokasi?: string
  namaAdminPengelola?: string
  nomorTeleponAdminPengelola?: string
  nomorTeleponAlternatif?: string
  emailAdminPengelola?: string
  dokumenPendukungUrl?: string
  dokumenPendukungNama?: string
  invitationStatus?: "Terkirim" | "Pending" | "Gagal"
  nik?: string
  nip?: string
  instansi?: string
  status?: "Aktif" | "Nonaktif"
  invitationLogs?: InvitationLog[]
  isSelected?: boolean
}

const candidateRows = ref<CandidateRow[]>([
  {
    no: 1,
    tanggalDaftar: "30 Apr 2026",
    nama: "Rossa lima juniar",
    jabatan: "Staff Administrasi",
    email: "rossa.juniar@instansi.go.id",
    kontak: "0812-3456-7001",
    nik: "321204450660003",
    nip: "198604152010011001",
    instansi: "Kementerian Ketenagakerjaan",
    status: "Aktif",
    invitationLogs: [
      { date: "30 Apr 2026 09:12", message: "Undangan akun admin dikirim ke email.", status: "Terkirim" },
      { date: "30 Apr 2026 09:44", message: "Undangan telah dibaca oleh penerima.", status: "Dibaca" },
      { date: "30 Apr 2026 10:05", message: "Undangan diterima dan akun diaktifkan.", status: "Diterima" },
    ],
  },
  {
    no: 2,
    tanggalDaftar: "30 Apr 2026",
    nama: "EMA HERMAWATI",
    jabatan: "Analis Kepegawaian",
    email: "ema.hermawati@instansi.go.id",
    kontak: "0812-3456-7002",
    nik: "3213095601740001",
    nip: "197912202007012003",
    instansi: "Dinas Ketenagakerjaan Provinsi Jawa Barat",
    status: "Aktif",
  },
  {
    no: 3,
    tanggalDaftar: "30 Apr 2026",
    nama: "NAILI KHASANAH",
    jabatan: "Operator Data",
    email: "naili.khasanah@instansi.go.id",
    kontak: "0812-3456-7003",
    nik: "3308134612040004",
    nip: "199012112015042001",
    instansi: "Dinas Ketenagakerjaan Provinsi Jawa Barat",
    status: "Aktif",
  },
  {
    no: 4,
    tanggalDaftar: "30 Apr 2026",
    nama: "INTAN NUR ALIFAH",
    jabatan: "Verifikator",
    email: "intan.alifah@instansi.go.id",
    kontak: "0812-3456-7004",
    nik: "320956305080003",
    nip: "199411052018032002",
    instansi: "Dinas Ketenagakerjaan Provinsi Jawa Barat",
    status: "Aktif",
  },
  {
    no: 5,
    tanggalDaftar: "30 Apr 2026",
    nama: "ENDRO PINEM",
    jabatan: "Pengelola Layanan",
    email: "endro.pinem@instansi.go.id",
    kontak: "0812-3456-7005",
    nik: "1205035607990005",
    nip: "198108242006041004",
    instansi: "Dinas Ketenagakerjaan Provinsi Jawa Barat",
    status: "Aktif",
  },
  {
    no: 6,
    tanggalDaftar: "30 Apr 2026",
    nama: "LUTFIA SAVITRI MAURIS TANIA",
    jabatan: "Staff Pelayanan",
    email: "lutfia.tania@instansi.go.id",
    kontak: "0812-3456-7006",
    nik: "350728500100001",
    nip: "199703142020122001",
    instansi: "Dinas Ketenagakerjaan Provinsi Jawa Barat",
    status: "Aktif",
  },
  {
    no: 7,
    tanggalDaftar: "30 Apr 2026",
    nama: "LAZARUS LAMET",
    jabatan: "Pengawas Lapangan",
    email: "lazarus.lamet@instansi.go.id",
    kontak: "0812-3456-7007",
    nik: "610307090790001",
    nip: "198910102013031002",
    instansi: "Dinas Ketenagakerjaan Provinsi Jawa Barat",
    status: "Aktif",
  },
  {
    no: 8,
    tanggalDaftar: "30 Apr 2026",
    nama: "HERMA YANTI",
    jabatan: "Pranata Komputer",
    email: "herma.yanti@instansi.go.id",
    kontak: "0812-3456-7008",
    nik: "320515411820013",
    nip: "199809222021022001",
    instansi: "Dinas Ketenagakerjaan Provinsi Jawa Barat",
    status: "Aktif",
  },
  {
    no: 9,
    tanggalDaftar: "30 Apr 2026",
    nama: "MOH.IRFAN",
    jabatan: "Koordinator Bidang",
    email: "moh.irfan@instansi.go.id",
    kontak: "0812-3456-7009",
    nik: "7203141011020005",
    nip: "199601162019021003",
    instansi: "Dinas Ketenagakerjaan Provinsi Jawa Barat",
    status: "Aktif",
    isSelected: true,
  },
  {
    no: 10,
    tanggalDaftar: "30 Apr 2026",
    nama: "YUDI WAHYUDIN",
    jabatan: "Analis SDM",
    email: "yudi.wahyudin@instansi.go.id",
    kontak: "0812-3456-7010",
    nik: "32140106390007",
    nip: "198705092011012005",
    instansi: "Dinas Ketenagakerjaan Provinsi Jawa Barat",
    status: "Aktif",
  },
  {
    no: 11,
    tanggalDaftar: "30 Apr 2026",
    nama: "Junius Kosasih",
    jabatan: "Supervisor",
    email: "junius.kosasih@instansi.go.id",
    kontak: "0812-3456-7011",
    nik: "1771020706990007",
    nip: "198311302009031001",
    instansi: "Dinas Ketenagakerjaan Provinsi Jawa Barat",
    status: "Aktif",
  },
  {
    no: 12,
    tanggalDaftar: "30 Apr 2026",
    nama: "SRI MULYANI",
    jabatan: "Admin Layanan",
    email: "sri.mulyani@instansi.go.id",
    kontak: "0812-3456-7012",
    nik: "3276014502920001",
    nip: "199202052017022003",
    instansi: "Dinas Ketenagakerjaan Provinsi Jawa Barat",
    status: "Aktif",
  },
  {
    no: 13,
    tanggalDaftar: "30 Apr 2026",
    nama: "RUDI HARTONO",
    jabatan: "Staff Verifikasi",
    email: "rudi.hartono@instansi.go.id",
    kontak: "0812-3456-7013",
    nik: "3204070911950003",
    nip: "199511092019031002",
    instansi: "Dinas Ketenagakerjaan Provinsi Jawa Barat",
    status: "Aktif",
  },
  {
    no: 14,
    tanggalDaftar: "30 Apr 2026",
    nama: "MAYA ANGGRAINI",
    jabatan: "Analis Data",
    email: "maya.anggraini@instansi.go.id",
    kontak: "0812-3456-7014",
    nik: "3174035804970002",
    nip: "199704182021012001",
    instansi: "Dinas Ketenagakerjaan Provinsi Jawa Barat",
    status: "Aktif",
  },
  {
    no: 15,
    tanggalDaftar: "30 Feb 2026",
    nama: "FEBRIAN SYAHPUTRA",
    jabatan: "Koordinator Admin",
    email: "febrian.syahputra@instansi.go.id",
    kontak: "0812-3456-7015",
    nik: "1203061209980004",
    nip: "199809122022011004",
    instansi: "Dinas Ketenagakerjaan Provinsi Jawa Barat",
    status: "Aktif",
  },
])

const monthOptions = [
  { value: "", label: "Semua Bulan" },
  { value: "Jan", label: "Januari" },
  { value: "Feb", label: "Februari" },
  { value: "Mar", label: "Maret" },
  { value: "Apr", label: "April" },
  { value: "May", label: "Mei" },
  { value: "Jun", label: "Juni" },
  { value: "Jul", label: "Juli" },
  { value: "Aug", label: "Agustus" },
  { value: "Sep", label: "September" },
  { value: "Oct", label: "Oktober" },
  { value: "Nov", label: "November" },
  { value: "Dec", label: "Desember" },
]

const filterMenuRef = ref<HTMLElement | null>(null)
const isFilterMenuOpen = ref(false)
const selectedMonth = ref("")
const selectedYear = ref("")
const pendingMonth = ref("")
const pendingYear = ref("")

const extractMonthYear = (dateText: string) => {
  const [_, month = "", year = ""] = dateText.trim().split(/\s+/)
  return { month, year }
}

const yearOptions = computed(() => {
  const years = new Set(candidateRows.value.map((row) => extractMonthYear(row.tanggalDaftar).year).filter(Boolean))
  return ["", ...Array.from(years).sort((a, b) => Number(b) - Number(a))]
})

const filteredRows = computed(() => {
  return candidateRows.value.filter((row) => {
    const { month, year } = extractMonthYear(row.tanggalDaftar)
    const matchMonth = !selectedMonth.value || selectedMonth.value === month
    const matchYear = !selectedYear.value || selectedYear.value === year
    return matchMonth && matchYear
  })
})

const sortedRows = computed(() => {
  return [...filteredRows.value].sort((a, b) => a.no - b.no)
})

const currentFilterLabel = computed(() => {
  const monthLabel = selectedMonth.value
    ? monthOptions.find((option) => option.value === selectedMonth.value)?.label
    : ""
  if (monthLabel && selectedYear.value) return `${monthLabel} ${selectedYear.value}`
  if (monthLabel) return monthLabel
  if (selectedYear.value) return selectedYear.value
  return "Filter"
})

const toggleFilterMenu = () => {
  if (isFilterMenuOpen.value) {
    isFilterMenuOpen.value = false
    return
  }
  pendingMonth.value = selectedMonth.value
  pendingYear.value = selectedYear.value
  isFilterMenuOpen.value = true
}

const applyFilter = () => {
  selectedMonth.value = pendingMonth.value
  selectedYear.value = pendingYear.value
  currentPage.value = 1
  isFilterMenuOpen.value = false
}

const resetFilter = () => {
  pendingMonth.value = ""
  pendingYear.value = ""
  selectedMonth.value = ""
  selectedYear.value = ""
  currentPage.value = 1
  isFilterMenuOpen.value = false
}

const closeFilterOnOutsideClick = (event: MouseEvent) => {
  if (!isFilterMenuOpen.value) return
  const target = event.target as Node | null
  if (filterMenuRef.value && target && !filterMenuRef.value.contains(target)) {
    isFilterMenuOpen.value = false
  }
}

const closeFilterOnEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    isFilterMenuOpen.value = false
  }
}

const rowsPerPage = 5
const currentPage = ref(1)

const totalRows = computed(() => sortedRows.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalRows.value / rowsPerPage)))
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage
  return sortedRows.value.slice(start, start + rowsPerPage)
})
const visibleRowsCount = computed(() => paginatedRows.value.length)
const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, idx) => idx + 1))

const goToPage = (page: number) => {
  currentPage.value = Math.min(totalPages.value, Math.max(1, page))
}

const showDetailModal = ref(false)
const showVerifikasiInstansiModal = ref(false)
const selectedCandidate = ref<CandidateRow | null>(null)
const invitationSearch = ref("")

type AddAdminForm = {
  nomorIdRequestInvitation: string
  nomorSurat: string
  tanggalSurat: string
  namaInstansi: string
  pejabatPenandatangan: string
  hasilReviewSurat: "Terverifikasi" | "Perlu klarifikasi" | "Tidak dapat di proses" | ""
  nikAkunTujuanInvitation: string
}

type AddAdminFormErrors = Partial<Record<keyof AddAdminForm, string>>
type InvitationStatus = "Terkirim" | "Pending" | "Gagal"

type SubmitFeedbackConfig = {
  heading: string
  message: string
  icon: "success" | "pending" | "failed"
  status: InvitationStatus
}

type RegionOption = {
  id: string
  name: string
}

type InstansiForm = {
  namaInstansi: string
  tanggalBerdiri: string
  alamatInstansi: string
  provinsi: string
  kabupatenKota: string
  kecamatan: string
  kelurahan: string
  kodePos: string
  nomorTeleponInstansi: string
  emailResmiInstansi: string
  situsWeb: string
  deskripsiSingkat: string
  lokasi: string
  namaAdminPengelola: string
  nomorTeleponAdminPengelola: string
  nomorTeleponAlternatif: string
  emailAdminPengelola: string
}

const getInitialAddAdminForm = (): AddAdminForm => ({
  nomorIdRequestInvitation: "",
  nomorSurat: "",
  tanggalSurat: "",
  namaInstansi: "",
  pejabatPenandatangan: "",
  hasilReviewSurat: "",
  nikAkunTujuanInvitation: "",
})

const showAddAdminModal = ref(false)
const addAdminForm = ref<AddAdminForm>(getInitialAddAdminForm())
const addAdminErrors = ref<AddAdminFormErrors>({})
const tanggalSuratPicker = ref("")
const invitationSequence = ref(1)
const showSubmitFeedbackModal = ref(false)
const showSubmitToast = ref(false)
const submitFeedback = ref<SubmitFeedbackConfig | null>(null)
const submitTimeoutId = ref<ReturnType<typeof setTimeout> | null>(null)
const reviewSuratOptions: Array<AddAdminForm["hasilReviewSurat"]> = [
  "Terverifikasi",
  "Perlu klarifikasi",
  "Tidak dapat di proses",
]

const generateInvitationRequestId = () => {
  const now = new Date()
  const year = String(now.getFullYear())
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  const sequence = String(invitationSequence.value).padStart(8, "0")
  invitationSequence.value += 1
  return `INV-K-${year}${month}${day}-${sequence}`
}

const formatTanggalSurat = (rawDate: string) => {
  if (!rawDate) return ""

  if (rawDate.includes("-")) {
    const [year, month, day] = rawDate.split("-")
    if (!year || !month || !day) return ""
    return `${day}/${month}/${year}`
  }

  if (rawDate.includes("/")) {
    const [first, second, year] = rawDate.split("/")
    if (!first || !second || !year) return ""
    const month = first.padStart(2, "0")
    const day = second.padStart(2, "0")
    return `${day}/${month}/${year}`
  }

  return ""
}

const formatDisplayDate = (date: Date) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const day = String(date.getDate()).padStart(2, "0")
  return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`
}

const clearAddAdminError = (field: keyof AddAdminForm) => {
  if (addAdminErrors.value[field]) {
    addAdminErrors.value[field] = ""
  }
}

const validateAddAdminForm = () => {
  const errors: AddAdminFormErrors = {}
  const form = addAdminForm.value

  if (!form.nomorIdRequestInvitation.trim()) {
    errors.nomorIdRequestInvitation = "Nomor ID Request Invitation wajib tersedia."
  }
  if (!form.nomorSurat.trim()) {
    errors.nomorSurat = "Nomor Surat wajib diisi."
  }
  if (!form.tanggalSurat.trim()) {
    errors.tanggalSurat = "Tanggal Surat wajib dipilih."
  } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(form.tanggalSurat)) {
    errors.tanggalSurat = "Format Tanggal Surat harus dd/mm/yyyy."
  }
  if (!form.namaInstansi.trim()) {
    errors.namaInstansi = "Nama Instansi wajib diisi."
  }
  if (!form.pejabatPenandatangan.trim()) {
    errors.pejabatPenandatangan = "Pejabat/Pihak Penandatangan wajib diisi."
  }
  if (!form.hasilReviewSurat) {
    errors.hasilReviewSurat = "Hasil Review Surat wajib dipilih."
  }
  if (!form.nikAkunTujuanInvitation.trim()) {
    errors.nikAkunTujuanInvitation = "NIK akun SIAPKerja Tujuan Invitation wajib diisi."
  } else if (!/^\d{16}$/.test(form.nikAkunTujuanInvitation)) {
    errors.nikAkunTujuanInvitation = "NIK harus terdiri dari 16 digit angka."
  }

  addAdminErrors.value = errors
  return Object.keys(errors).length === 0
}

const getSubmitFeedbackConfig = (reviewValue: AddAdminForm["hasilReviewSurat"]): SubmitFeedbackConfig => {
  if (reviewValue === "Terverifikasi") {
    return {
      heading: "Berhasil kirim undangan",
      message: "Undangan berhasil dikirim dan menunggu tindakan akun tujuan.",
      icon: "success",
      status: "Terkirim",
    }
  }

  if (reviewValue === "Perlu klarifikasi") {
    return {
      heading: "Undangan ditunda",
      message: "Undangan ditunda sampai proses klarifikasi selesai.",
      icon: "pending",
      status: "Pending",
    }
  }

  return {
    heading: "Undangan tidak dikirim",
    message: "Undangan tidak diproses karena hasil review surat tidak memenuhi syarat.",
    icon: "failed",
    status: "Gagal",
  }
}

const appendNewInvitationRow = (form: AddAdminForm, status: InvitationStatus) => {
  const highestNo = candidateRows.value.reduce((maxValue, row) => Math.max(maxValue, row.no), 0)
  const newDate = new Date()
  const newRow: CandidateRow = {
    no: highestNo + 1,
    tanggalDaftar: formatDisplayDate(newDate),
    nama: form.pejabatPenandatangan,
    jabatan: `No. Surat ${form.nomorSurat}`,
    email: `${form.nikAkunTujuanInvitation}@siapkerja.id`,
    kontak: "-",
    invitationRequestId: form.nomorIdRequestInvitation,
    nomorSurat: form.nomorSurat,
    tanggalSurat: form.tanggalSurat,
    namaInstansi: form.namaInstansi,
    pejabatPenandatanganan: form.pejabatPenandatangan,
    invitationStatus: status,
    nik: form.nikAkunTujuanInvitation,
    instansi: form.namaInstansi,
    status: "Aktif",
    invitationLogs: [
      {
        date: `${formatDisplayDate(newDate)} 09:00`,
        message: `Request ${form.nomorIdRequestInvitation} diproses dengan status ${status}.`,
        status: status === "Terkirim" ? "Terkirim" : "Dibaca",
      },
    ],
  }
  candidateRows.value = [newRow, ...candidateRows.value]
}

const getInvitationStatusLabel = (row: CandidateRow) => {
  return row.invitationStatus ?? "Terkirim"
}

const getRowInvitationId = (row: CandidateRow) => row.invitationRequestId ?? "-"
const getRowNomorSurat = (row: CandidateRow) => row.nomorSurat ?? "-"
const getRowTanggalSurat = (row: CandidateRow) => row.tanggalSurat ?? "-"
const getRowNamaInstansi = (row: CandidateRow) => row.namaInstansi ?? row.instansi ?? "-"
const getRowPejabatPenandatanganan = (row: CandidateRow) => row.pejabatPenandatanganan ?? row.nama ?? "-"
const getRowNik = (row: CandidateRow) => row.nik ?? "-"
const getReviewResultFromStatus = (status: InvitationStatus | "Terkirim") => {
  if (status === "Terkirim") return "Terverifikasi"
  if (status === "Pending") return "Perlu klarifikasi"
  return "Tidak dapat di proses"
}
const getHistoryStatusMeta = (status: InvitationStatus | "Terkirim") => {
  if (status === "Pending") {
    return { label: "Pending", tone: "pending" as const }
  }
  if (status === "Gagal") {
    return { label: "Kadaluarsa", tone: "gagal" as const }
  }
  return { label: "Terkirim", tone: "terkirim" as const }
}
const buildInvitationShareLink = (invitationId: string) => {
  if (typeof window === "undefined") return `/invitation/${invitationId}`
  return `${window.location.origin}/invitation/${invitationId}`
}
const addThreeDaysToDateText = (dateText: string) => {
  const match = dateText.match(/^(\d{1,2})\s([A-Za-z]{3})\s(\d{4})\s(\d{2}):(\d{2})(?:\s(WIB))?$/)
  if (!match) return dateText

  const [, dayText, monthText, yearText, hourText, minuteText, timezoneText] = match
  const monthByShortName: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  }
  const monthIndex = monthByShortName[monthText ?? ""]
  if (monthIndex === undefined) return dateText

  const date = new Date(Number(yearText), monthIndex, Number(dayText), Number(hourText), Number(minuteText))
  date.setDate(date.getDate() + 3)

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const formatted = `${String(date.getDate()).padStart(2, "0")} ${monthNames[date.getMonth()]} ${date.getFullYear()} ${String(
    date.getHours(),
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`

  return timezoneText ? `${formatted} ${timezoneText}` : formatted
}
const fallbackVerificationValue = "-"
const dummyVerificationData = {
  namaInstansi: "Kementerian Ketenagakerjaan",
  tanggalBerdiri: "17/08/1945",
  alamatInstansi: "Jl. Gatot Subroto Kav. 51, Jakarta Selatan",
  provinsi: "DKI Jakarta",
  kabupatenKota: "Jakarta Selatan",
  kecamatan: "Setiabudi",
  kelurahan: "Karet Semanggi",
  kodePos: "12930",
  nomorTeleponInstansi: "0215255733",
  emailResmiInstansi: "layanan@kemnaker.go.id",
  situsWeb: "https://kemnaker.go.id",
  deskripsiSingkat: "Instansi pemerintah yang menangani urusan ketenagakerjaan nasional.",
  logoInstansiUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Coat_of_arms_of_Indonesia_Garuda_Pancasila.svg/320px-Coat_of_arms_of_Indonesia_Garuda_Pancasila.svg.png",
  lokasi: "Jakarta Selatan",
  namaAdminPengelola: "Admin Instansi Pusat",
  nomorTeleponAdminPengelola: "081234567890",
  nomorTeleponAlternatif: "081298765432",
  emailAdminPengelola: "admin.siapkerja@kemnaker.go.id",
  dokumenPendukungUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  dokumenPendukungNama: "dokumen-pendukung-instansi.pdf",
}
const asVerificationValue = (value?: string) => {
  const normalized = value?.trim()
  return normalized ? normalized : fallbackVerificationValue
}
const formatVerificationDate = (rawDate?: string) => {
  if (!rawDate) return fallbackVerificationValue
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(rawDate)) return rawDate
  if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    const [year, month, day] = rawDate.split("-")
    return `${day}/${month}/${year}`
  }
  return rawDate
}

const copiedInvitationLink = ref(false)
const copiedLinkTimeoutId = ref<ReturnType<typeof setTimeout> | null>(null)
const getInitialInstansiForm = (): InstansiForm => ({
  namaInstansi: "",
  tanggalBerdiri: "",
  alamatInstansi: "",
  provinsi: "",
  kabupatenKota: "",
  kecamatan: "",
  kelurahan: "",
  kodePos: "",
  nomorTeleponInstansi: "",
  emailResmiInstansi: "",
  situsWeb: "",
  deskripsiSingkat: "",
  lokasi: "",
  namaAdminPengelola: "",
  nomorTeleponAdminPengelola: "",
  nomorTeleponAlternatif: "",
  emailAdminPengelola: "",
})
const getInitialVerificationChecklist = () => ({
  namaInstansi: false,
  tanggalBerdiri: false,
  alamatInstansi: false,
  provinsi: false,
  kabupatenKota: false,
  kecamatan: false,
  kelurahan: false,
  kodePos: false,
  nomorTeleponInstansi: false,
  emailResmiInstansi: false,
  situsWeb: false,
  deskripsiSingkat: false,
  logoInstansi: false,
  lokasi: false,
  namaAdminPengelola: false,
  nomorTeleponAdminPengelola: false,
  nomorTeleponAlternatif: false,
  emailAdminPengelola: false,
  dokumenPendukungTambahan: false,
})
const verificationChecklist = ref(getInitialVerificationChecklist())
const verificationActionError = ref("")
const hasCheckedVerificationField = computed(() => Object.values(verificationChecklist.value).some(Boolean))
const showVerificationReasonModal = ref(false)
const verificationReasonAction = ref<"revisi" | "tidak-valid" | null>(null)
const verificationReasonText = ref("")
const verificationReasonError = ref("")
const showInstansiFormModal = ref(false)
const instansiForm = ref<InstansiForm>(getInitialInstansiForm())
const instansiTanggalBerdiriPicker = ref("")
const instansiFormError = ref("")
const instansiWilayahError = ref("")
const instansiLogoError = ref("")
const instansiDokumenError = ref("")
const instansiLogoFile = ref<File | null>(null)
const instansiDokumenFile = ref<File | null>(null)
const instansiLogoPreviewUrl = ref("")
const instansiDokumenUrl = ref("")
const instansiDokumenName = ref("")
const isLoadingProvinsiOptions = ref(false)
const isLoadingKabupatenOptions = ref(false)
const isLoadingKecamatanOptions = ref(false)
const isLoadingKelurahanOptions = ref(false)
const instansiProvinsiOptions = ref<RegionOption[]>([])
const instansiKabupatenOptions = ref<RegionOption[]>([])
const instansiKecamatanOptions = ref<RegionOption[]>([])
const instansiKelurahanOptions = ref<RegionOption[]>([])
const wilayahApiBaseUrl = "https://www.emsifa.com/api-wilayah-indonesia/api"
const maxInstansiUploadSize = 2 * 1024 * 1024

const openAddAdminModal = () => {
  const initialForm = getInitialAddAdminForm()
  initialForm.nomorIdRequestInvitation = generateInvitationRequestId()
  addAdminForm.value = initialForm
  addAdminErrors.value = {}
  tanggalSuratPicker.value = ""
  showAddAdminModal.value = true
}

const closeAddAdminModal = () => {
  showAddAdminModal.value = false
  addAdminForm.value = getInitialAddAdminForm()
  addAdminErrors.value = {}
  tanggalSuratPicker.value = ""
}

const updateNikField = (event: Event) => {
  const input = event.target as HTMLInputElement
  addAdminForm.value.nikAkunTujuanInvitation = input.value.replace(/\D/g, "").slice(0, 16)
  clearAddAdminError("nikAkunTujuanInvitation")
}

const handleTanggalSuratChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  tanggalSuratPicker.value = input.value
  addAdminForm.value.tanggalSurat = formatTanggalSurat(input.value)
  clearAddAdminError("tanggalSurat")
}

const submitAddAdminForm = () => {
  if (!validateAddAdminForm()) return

  const formSnapshot = { ...addAdminForm.value }
  const feedbackConfig = getSubmitFeedbackConfig(formSnapshot.hasilReviewSurat)
  submitFeedback.value = feedbackConfig
  showSubmitFeedbackModal.value = true
  showSubmitToast.value = true
  showAddAdminModal.value = false

  if (submitTimeoutId.value) {
    clearTimeout(submitTimeoutId.value)
  }

  submitTimeoutId.value = setTimeout(() => {
    appendNewInvitationRow(formSnapshot, feedbackConfig.status)
    showSubmitFeedbackModal.value = false
    showSubmitToast.value = false
    submitFeedback.value = null
    closeAddAdminModal()
    currentPage.value = 1
  }, 7000)
}

const formatDateToDdMmYyyy = (rawDate: string) => {
  if (!rawDate) return ""
  const [year, month, day] = rawDate.split("-")
  if (!year || !month || !day) return ""
  return `${day}/${month}/${year}`
}

const convertDdMmYyyyToIso = (rawDate: string) => {
  const match = rawDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return ""
  const [, day, month, year] = match
  return `${year}-${month}-${day}`
}

const fetchWilayahOptions = async (endpoint: string) => {
  return await $fetch<RegionOption[]>(`${wilayahApiBaseUrl}/${endpoint}`)
}

const resetInstansiWilayah = (target: "kabupaten" | "kecamatan" | "kelurahan") => {
  if (target === "kabupaten") {
    instansiForm.value.kabupatenKota = ""
    instansiForm.value.kecamatan = ""
    instansiForm.value.kelurahan = ""
    instansiKabupatenOptions.value = []
    instansiKecamatanOptions.value = []
    instansiKelurahanOptions.value = []
    return
  }
  if (target === "kecamatan") {
    instansiForm.value.kecamatan = ""
    instansiForm.value.kelurahan = ""
    instansiKecamatanOptions.value = []
    instansiKelurahanOptions.value = []
    return
  }
  instansiForm.value.kelurahan = ""
  instansiKelurahanOptions.value = []
}

const loadInstansiProvinsiOptions = async () => {
  isLoadingProvinsiOptions.value = true
  instansiWilayahError.value = ""
  try {
    instansiProvinsiOptions.value = await fetchWilayahOptions("provinces.json")
  } catch {
    instansiWilayahError.value = "Gagal memuat data provinsi."
  } finally {
    isLoadingProvinsiOptions.value = false
  }
}

const loadInstansiKabupatenOptions = async (provinsiName: string) => {
  const selectedProvinsi = instansiProvinsiOptions.value.find((option) => option.name === provinsiName)
  if (!selectedProvinsi) {
    instansiKabupatenOptions.value = []
    return
  }
  isLoadingKabupatenOptions.value = true
  instansiWilayahError.value = ""
  try {
    instansiKabupatenOptions.value = await fetchWilayahOptions(`regencies/${selectedProvinsi.id}.json`)
  } catch {
    instansiWilayahError.value = "Gagal memuat data kabupaten/kota."
  } finally {
    isLoadingKabupatenOptions.value = false
  }
}

const loadInstansiKecamatanOptions = async (kabupatenName: string) => {
  const selectedKabupaten = instansiKabupatenOptions.value.find((option) => option.name === kabupatenName)
  if (!selectedKabupaten) {
    instansiKecamatanOptions.value = []
    return
  }
  isLoadingKecamatanOptions.value = true
  instansiWilayahError.value = ""
  try {
    instansiKecamatanOptions.value = await fetchWilayahOptions(`districts/${selectedKabupaten.id}.json`)
  } catch {
    instansiWilayahError.value = "Gagal memuat data kecamatan."
  } finally {
    isLoadingKecamatanOptions.value = false
  }
}

const loadInstansiKelurahanOptions = async (kecamatanName: string) => {
  const selectedKecamatan = instansiKecamatanOptions.value.find((option) => option.name === kecamatanName)
  if (!selectedKecamatan) {
    instansiKelurahanOptions.value = []
    return
  }
  isLoadingKelurahanOptions.value = true
  instansiWilayahError.value = ""
  try {
    instansiKelurahanOptions.value = await fetchWilayahOptions(`villages/${selectedKecamatan.id}.json`)
  } catch {
    instansiWilayahError.value = "Gagal memuat data kelurahan."
  } finally {
    isLoadingKelurahanOptions.value = false
  }
}

const handleInstansiProvinsiChange = async () => {
  resetInstansiWilayah("kabupaten")
  if (!instansiForm.value.provinsi) return
  await loadInstansiKabupatenOptions(instansiForm.value.provinsi)
}

const handleInstansiKabupatenChange = async () => {
  resetInstansiWilayah("kecamatan")
  if (!instansiForm.value.kabupatenKota) return
  await loadInstansiKecamatanOptions(instansiForm.value.kabupatenKota)
}

const handleInstansiKecamatanChange = async () => {
  resetInstansiWilayah("kelurahan")
  if (!instansiForm.value.kecamatan) return
  await loadInstansiKelurahanOptions(instansiForm.value.kecamatan)
}

const sanitizeInstansiNumericField = (
  field: "kodePos" | "nomorTeleponInstansi" | "nomorTeleponAdminPengelola" | "nomorTeleponAlternatif",
  event: Event,
) => {
  const input = event.target as HTMLInputElement
  instansiForm.value[field] = input.value.replace(/\D/g, "")
}

const handleInstansiTanggalBerdiriChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  instansiTanggalBerdiriPicker.value = input.value
  instansiForm.value.tanggalBerdiri = formatDateToDdMmYyyy(input.value)
}

const handleInstansiLogoChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const allowedExtensions = [".png", ".jpg", ".jpeg"]
  const lowerName = file.name.toLowerCase()
  const hasAllowedExtension = allowedExtensions.some((extension) => lowerName.endsWith(extension))
  if (!hasAllowedExtension) {
    instansiLogoError.value = "Logo instansi hanya menerima PNG/JPG."
    input.value = ""
    return
  }
  if (file.size > maxInstansiUploadSize) {
    instansiLogoError.value = "Ukuran logo maksimal 2MB."
    input.value = ""
    return
  }

  instansiLogoError.value = ""
  instansiLogoFile.value = file
  instansiLogoPreviewUrl.value = URL.createObjectURL(file)
}

const handleInstansiDokumenChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (file.size > maxInstansiUploadSize) {
    instansiDokumenError.value = "Ukuran dokumen maksimal 2MB."
    input.value = ""
    return
  }

  instansiDokumenError.value = ""
  instansiDokumenFile.value = file
  instansiDokumenName.value = file.name
  instansiDokumenUrl.value = URL.createObjectURL(file)
}

const closeInstansiFormModal = () => {
  showInstansiFormModal.value = false
  instansiForm.value = getInitialInstansiForm()
  instansiTanggalBerdiriPicker.value = ""
  instansiFormError.value = ""
  instansiWilayahError.value = ""
  instansiLogoError.value = ""
  instansiDokumenError.value = ""
  instansiLogoFile.value = null
  instansiDokumenFile.value = null
  instansiLogoPreviewUrl.value = ""
  instansiDokumenUrl.value = ""
  instansiDokumenName.value = ""
  instansiKabupatenOptions.value = []
  instansiKecamatanOptions.value = []
  instansiKelurahanOptions.value = []
}

const openInstansiFormModal = async () => {
  const row = selectedCandidate.value
  if (!row) return

  instansiForm.value = {
    namaInstansi: row.namaInstansi ?? row.instansi ?? dummyVerificationData.namaInstansi,
    tanggalBerdiri: row.tanggalBerdiri ?? dummyVerificationData.tanggalBerdiri,
    alamatInstansi: row.alamatInstansi ?? dummyVerificationData.alamatInstansi,
    provinsi: row.provinsi ?? dummyVerificationData.provinsi,
    kabupatenKota: row.kabupatenKota ?? dummyVerificationData.kabupatenKota,
    kecamatan: row.kecamatan ?? dummyVerificationData.kecamatan,
    kelurahan: row.kelurahan ?? dummyVerificationData.kelurahan,
    kodePos: row.kodePos ?? dummyVerificationData.kodePos,
    nomorTeleponInstansi: row.nomorTeleponInstansi ?? dummyVerificationData.nomorTeleponInstansi,
    emailResmiInstansi: row.emailResmiInstansi ?? dummyVerificationData.emailResmiInstansi,
    situsWeb: row.situsWeb ?? dummyVerificationData.situsWeb,
    deskripsiSingkat: row.deskripsiSingkat ?? dummyVerificationData.deskripsiSingkat,
    lokasi: row.lokasi ?? dummyVerificationData.lokasi,
    namaAdminPengelola: row.namaAdminPengelola ?? dummyVerificationData.namaAdminPengelola,
    nomorTeleponAdminPengelola: row.nomorTeleponAdminPengelola ?? dummyVerificationData.nomorTeleponAdminPengelola,
    nomorTeleponAlternatif: row.nomorTeleponAlternatif ?? dummyVerificationData.nomorTeleponAlternatif,
    emailAdminPengelola: row.emailAdminPengelola ?? dummyVerificationData.emailAdminPengelola,
  }
  instansiTanggalBerdiriPicker.value = convertDdMmYyyyToIso(instansiForm.value.tanggalBerdiri)
  instansiLogoPreviewUrl.value = row.logoInstansiUrl ?? dummyVerificationData.logoInstansiUrl
  instansiDokumenUrl.value = row.dokumenPendukungUrl ?? dummyVerificationData.dokumenPendukungUrl
  instansiDokumenName.value = row.dokumenPendukungNama ?? dummyVerificationData.dokumenPendukungNama
  instansiFormError.value = ""
  instansiWilayahError.value = ""
  instansiLogoError.value = ""
  instansiDokumenError.value = ""
  instansiLogoFile.value = null
  instansiDokumenFile.value = null

  showVerifikasiInstansiModal.value = false
  showInstansiFormModal.value = true
  await loadInstansiProvinsiOptions()
  if (instansiForm.value.provinsi) await loadInstansiKabupatenOptions(instansiForm.value.provinsi)
  if (instansiForm.value.kabupatenKota) await loadInstansiKecamatanOptions(instansiForm.value.kabupatenKota)
  if (instansiForm.value.kecamatan) await loadInstansiKelurahanOptions(instansiForm.value.kecamatan)
}

const submitInstansiForm = () => {
  if (!instansiForm.value.namaInstansi.trim()) {
    instansiFormError.value = "Nama Instansi wajib diisi."
    return
  }
  if (!instansiForm.value.tanggalBerdiri.trim()) {
    instansiFormError.value = "Tanggal Berdiri wajib diisi."
    return
  }
  if (!instansiLogoPreviewUrl.value) {
    instansiFormError.value = "Logo Instansi wajib diupload."
    return
  }
  if (!instansiDokumenUrl.value) {
    instansiFormError.value = "Dokumen Pendukung Tambahan wajib diupload."
    return
  }

  instansiFormError.value = ""
  const row = selectedCandidate.value
  if (!row) return

  row.namaInstansi = instansiForm.value.namaInstansi
  row.tanggalBerdiri = instansiForm.value.tanggalBerdiri
  row.alamatInstansi = instansiForm.value.alamatInstansi
  row.provinsi = instansiForm.value.provinsi
  row.kabupatenKota = instansiForm.value.kabupatenKota
  row.kecamatan = instansiForm.value.kecamatan
  row.kelurahan = instansiForm.value.kelurahan
  row.kodePos = instansiForm.value.kodePos
  row.nomorTeleponInstansi = instansiForm.value.nomorTeleponInstansi
  row.emailResmiInstansi = instansiForm.value.emailResmiInstansi
  row.situsWeb = instansiForm.value.situsWeb
  row.deskripsiSingkat = instansiForm.value.deskripsiSingkat
  row.logoInstansiUrl = instansiLogoPreviewUrl.value
  row.lokasi = instansiForm.value.lokasi
  row.namaAdminPengelola = instansiForm.value.namaAdminPengelola
  row.nomorTeleponAdminPengelola = instansiForm.value.nomorTeleponAdminPengelola
  row.nomorTeleponAlternatif = instansiForm.value.nomorTeleponAlternatif
  row.emailAdminPengelola = instansiForm.value.emailAdminPengelola
  row.dokumenPendukungUrl = instansiDokumenUrl.value
  row.dokumenPendukungNama = instansiDokumenName.value

  closeInstansiFormModal()
}

const getDefaultLogs = (name: string): InvitationLog[] => [
  { date: "30 Apr 2026 09:12", message: `Undangan akun untuk ${name} berhasil dikirim.`, status: "Terkirim" },
  { date: "30 Apr 2026 09:40", message: "Undangan sudah dibuka melalui email.", status: "Dibaca" },
]

const selectedCandidateDetail = computed(() => {
  const row = selectedCandidate.value
  if (!row) return null
  const invitationStatus = getInvitationStatusLabel(row)
  const statusMeta = getHistoryStatusMeta(invitationStatus)
  const invitationId = getRowInvitationId(row)
  const fallbackDateTime = `${row.tanggalDaftar} 09:12`
  const diajukanPada = row.invitationLogs?.[0]?.date ?? fallbackDateTime
  return {
    invitationStatus,
    statusBadgeLabel: statusMeta.label,
    statusBadgeTone: statusMeta.tone,
    nomorIdRequestInvitation: getRowInvitationId(row),
    nomorSurat: getRowNomorSurat(row),
    tanggalSurat: getRowTanggalSurat(row),
    namaInstansi: getRowNamaInstansi(row),
    pejabatPenandatanganan: getRowPejabatPenandatanganan(row),
    hasilReviewSurat: getReviewResultFromStatus(invitationStatus),
    nikAkunTujuanInvitation: getRowNik(row),
    recipientEmail: row.email ?? `${getRowNik(row)}@gmail.com`,
    diajukanOleh: getRowPejabatPenandatanganan(row),
    emailPengaju: row.email ?? "-",
    diajukanPada,
    kadaluarsaPada: addThreeDaysToDateText(diajukanPada),
    shareLink: buildInvitationShareLink(invitationId),
    invitationLogs: row.invitationLogs ?? getDefaultLogs(getRowPejabatPenandatanganan(row)),
  }
})

const selectedVerificationInstansiDetail = computed(() => {
  const row = selectedCandidate.value
  if (!row) return null
  return {
    namaInstansi: asVerificationValue(row.namaInstansi ?? row.instansi ?? dummyVerificationData.namaInstansi),
    tanggalBerdiri: formatVerificationDate(row.tanggalBerdiri || dummyVerificationData.tanggalBerdiri),
    alamatInstansi: asVerificationValue(row.alamatInstansi ?? dummyVerificationData.alamatInstansi),
    provinsi: asVerificationValue(row.provinsi ?? dummyVerificationData.provinsi),
    kabupatenKota: asVerificationValue(row.kabupatenKota ?? dummyVerificationData.kabupatenKota),
    kecamatan: asVerificationValue(row.kecamatan ?? dummyVerificationData.kecamatan),
    kelurahan: asVerificationValue(row.kelurahan ?? dummyVerificationData.kelurahan),
    kodePos: asVerificationValue(row.kodePos ?? dummyVerificationData.kodePos),
    nomorTeleponInstansi: asVerificationValue(row.nomorTeleponInstansi ?? dummyVerificationData.nomorTeleponInstansi),
    emailResmiInstansi: asVerificationValue(row.emailResmiInstansi ?? dummyVerificationData.emailResmiInstansi),
    situsWeb: row.situsWeb?.trim() ? row.situsWeb : dummyVerificationData.situsWeb,
    deskripsiSingkat: asVerificationValue(row.deskripsiSingkat ?? dummyVerificationData.deskripsiSingkat),
    logoInstansiUrl: row.logoInstansiUrl?.trim() ? row.logoInstansiUrl : dummyVerificationData.logoInstansiUrl,
    lokasi: asVerificationValue(row.lokasi ?? dummyVerificationData.lokasi),
    namaAdminPengelola: asVerificationValue(row.namaAdminPengelola ?? dummyVerificationData.namaAdminPengelola),
    nomorTeleponAdminPengelola: asVerificationValue(
      row.nomorTeleponAdminPengelola ?? dummyVerificationData.nomorTeleponAdminPengelola,
    ),
    nomorTeleponAlternatif: asVerificationValue(row.nomorTeleponAlternatif ?? dummyVerificationData.nomorTeleponAlternatif),
    emailAdminPengelola: asVerificationValue(row.emailAdminPengelola ?? dummyVerificationData.emailAdminPengelola),
    dokumenPendukungUrl: row.dokumenPendukungUrl?.trim() ? row.dokumenPendukungUrl : dummyVerificationData.dokumenPendukungUrl,
    dokumenPendukungNama: asVerificationValue(row.dokumenPendukungNama ?? dummyVerificationData.dokumenPendukungNama),
  }
})

const filteredInvitationLogs = computed(() => {
  const detail = selectedCandidateDetail.value
  if (!detail) return []
  const query = invitationSearch.value.trim().toLowerCase()
  if (!query) return detail.invitationLogs
  return detail.invitationLogs.filter(
    (log) => log.message.toLowerCase().includes(query) || log.status.toLowerCase().includes(query),
  )
})

const openDetailModal = (row: CandidateRow) => {
  selectedCandidate.value = row
  invitationSearch.value = ""
  showVerifikasiInstansiModal.value = false
  showDetailModal.value = true
}

const openVerifikasiInstansiModal = () => {
  if (!selectedCandidate.value) return
  verificationChecklist.value = getInitialVerificationChecklist()
  verificationActionError.value = ""
  verificationReasonAction.value = null
  verificationReasonText.value = ""
  verificationReasonError.value = ""
  showVerificationReasonModal.value = false
  showVerifikasiInstansiModal.value = true
}

const closeVerifikasiInstansiModal = () => {
  showVerifikasiInstansiModal.value = false
  verificationChecklist.value = getInitialVerificationChecklist()
  verificationActionError.value = ""
  verificationReasonAction.value = null
  verificationReasonText.value = ""
  verificationReasonError.value = ""
  showVerificationReasonModal.value = false
}

const openVerificationReasonModal = (action: "revisi" | "tidak-valid") => {
  verificationReasonAction.value = action
  verificationReasonText.value = ""
  verificationReasonError.value = ""
  showVerificationReasonModal.value = true
}

const closeVerificationReasonModal = () => {
  showVerificationReasonModal.value = false
  verificationReasonAction.value = null
  verificationReasonText.value = ""
  verificationReasonError.value = ""
}

const submitVerificationReason = () => {
  if (!verificationReasonText.value.trim()) {
    verificationReasonError.value = "Alasan wajib diisi."
    return
  }
  verificationReasonError.value = ""
  closeVerificationReasonModal()
  showVerifikasiInstansiModal.value = false
}

const handleVerificationAction = (action: "valid" | "revisi" | "tidak-valid") => {
  if (!hasCheckedVerificationField.value) {
    verificationActionError.value = "Pilih minimal satu checkbox sebelum melanjutkan."
    return
  }

  verificationActionError.value = ""
  if (action === "valid") {
    showVerifikasiInstansiModal.value = false
    return
  }

  if (action === "revisi" || action === "tidak-valid") {
    openVerificationReasonModal(action)
  }
}

watch(
  verificationChecklist,
  () => {
    if (hasCheckedVerificationField.value) {
      verificationActionError.value = ""
    }
  },
  { deep: true },
)

const closeDetailModal = () => {
  showDetailModal.value = false
  showVerifikasiInstansiModal.value = false
  closeVerificationReasonModal()
  closeInstansiFormModal()
  selectedCandidate.value = null
}

const copyInvitationLink = async () => {
  const detail = selectedCandidateDetail.value
  if (!detail || !navigator?.clipboard) return
  await navigator.clipboard.writeText(detail.shareLink)
  copiedInvitationLink.value = true
  if (copiedLinkTimeoutId.value) {
    clearTimeout(copiedLinkTimeoutId.value)
  }
  copiedLinkTimeoutId.value = setTimeout(() => {
    copiedInvitationLink.value = false
  }, 2000)
}

onMounted(() => {
  document.addEventListener("click", closeFilterOnOutsideClick)
  document.addEventListener("keydown", closeFilterOnEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener("click", closeFilterOnOutsideClick)
  document.removeEventListener("keydown", closeFilterOnEscape)
  if (submitTimeoutId.value) {
    clearTimeout(submitTimeoutId.value)
  }
  if (copiedLinkTimeoutId.value) {
    clearTimeout(copiedLinkTimeoutId.value)
  }
})

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
</script>

<template>
  <div v-if="showMainShell" class="screen">
    <NuxtRouteAnnouncer />

    <aside class="icon-rail">
      <div class="logo-box">
        <img
          v-if="!logoError"
          :src="logoUrl"
          alt="Karirhub Logo"
          class="logo-image"
          @error="logoError = true"
        />
        <i v-else class="fas fa-briefcase logo-fallback" aria-hidden="true" />
      </div>
      <!-- <button
        v-for="item in quickIcons"
        :key="item.key"
        class="rail-btn"
        :class="{ active: item.key === 'company' }"
      >
        <i :class="item.icon" aria-hidden="true" />
      </button> -->
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
        <img
          v-if="!profileError"
          :src="profileUrl"
          alt="User profile"
          class="profile-image"
          @error="profileError = true"
        />
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
      <template v-if="isShellNuxtPage">
        <NuxtPage />
      </template>
      <div v-else class="body-container">
        <header class="content-header">
          <div>
            <h1>Undang Kementerian</h1>
            <p>Berikut adalah daftar Instansi yang sudah diundang.</p>
          </div>
          <button class="filter-btn" type="button">Filter <span>▼</span></button>
        </header>

        <section class="stats-layout">
          <div class="summary-stack">
            <article v-for="card in summaryCards" :key="card.title" class="summary-card chart-card">
              <p class="summary-title">{{ card.title }}</p>
              <p class="summary-value">{{ card.value }}</p>
            </article>
          </div>
          <div class="chart-card">
            <div class="chart-head">
              <span>KEMENTERIAN/LEMBAGA BERDASARKAN STATUS</span>
              <span>({{ totalCompanies }} TOTAL)</span>
            </div>
            <div class="chart-body">
              <div class="donut-wrap" @mousemove="handleChartHover" @mouseleave="clearChartHover">
                <div class="donut" :style="{ background: donutBackground }">
                  <div class="donut-hole" />
                </div>
                <span class="donut-label verified">{{ verifiedSlice.percentage.toFixed(2) }}%</span>
                <span class="donut-label unverified">{{ unverifiedSlice.percentage.toFixed(2) }}%</span>
                <div
                  v-if="activeSlice"
                  class="chart-tooltip"
                  :style="{ left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px` }"
                >
                  <strong>{{ activeSlice.name }}</strong>
                  <span>{{ activeSlice.percentage.toFixed(2) }}%</span>
                </div>
              </div>
              <div class="legend">
                <div v-for="item in statusSlices" :key="item.name" class="legend-item">
                  <span class="legend-dot" :style="{ background: item.color }" />
                  <span>{{ item.name }} ({{ item.percentage.toFixed(2) }}%)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="bottom-tools">
          <div class="search-field">
            <input type="text" placeholder="Cari berdasarkan nama perusahaan" />
            <button>⌕</button>
          </div>
          <div class="tool-actions">
            <button class="add-admin-btn" type="button" @click="openAddAdminModal">Tambah Admin</button>
            <div ref="filterMenuRef" class="filter-menu">
              <button
                type="button"
                class="filter-btn"
                :aria-expanded="isFilterMenuOpen"
                aria-haspopup="true"
                @click.stop="toggleFilterMenu"
              >
                {{ currentFilterLabel }} <span>{{ isFilterMenuOpen ? "▲" : "▼" }}</span>
              </button>
              <div v-if="isFilterMenuOpen" class="filter-dropdown" @click.stop>
                <label class="filter-field">
                  <span>Bulan</span>
                  <select v-model="pendingMonth">
                    <option v-for="month in monthOptions" :key="month.value || 'all'" :value="month.value">
                      {{ month.label }}
                    </option>
                  </select>
                </label>
                <label class="filter-field">
                  <span>Tahun</span>
                  <select v-model="pendingYear">
                    <option value="">Semua Tahun</option>
                    <option v-for="year in yearOptions.slice(1)" :key="year" :value="year">
                      {{ year }}
                    </option>
                  </select>
                </label>
                <div class="filter-actions">
                  <button type="button" class="filter-action-btn secondary" @click="resetFilter">Reset</button>
                  <button type="button" class="filter-action-btn primary" @click="applyFilter">Terapkan</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="candidate-table-wrap">
          <table class="candidate-table">
            <thead>
              <tr>
                <th class="col-no">NO.</th>
                <th class="col-date">TGL. DAFTAR</th>
                <th class="col-id">ID</th>
                <th class="col-no-surat">NOMOR SURAT</th>
                <th class="col-tanggal-surat">TANGGAL SURAT</th>
                <th class="col-instansi">NAMA INSTANSI</th>
                <th class="col-pejabat">PENJABAT PENANDATANGANAN</th>
                <th class="col-nik">NIK</th>
                <th class="col-inv-status">STATUS</th>
                <th class="col-action">ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in paginatedRows" :key="`${row.no}-${getRowInvitationId(row)}`">
                <td class="col-no">{{ row.no }}.</td>
                <td class="col-date">{{ row.tanggalDaftar }}</td>
                <td class="col-id" :title="getRowInvitationId(row)">{{ getRowInvitationId(row) }}</td>
                <td class="col-no-surat" :title="getRowNomorSurat(row)">{{ getRowNomorSurat(row) }}</td>
                <td class="col-tanggal-surat">{{ getRowTanggalSurat(row) }}</td>
                <td class="col-instansi" :title="getRowNamaInstansi(row)">{{ getRowNamaInstansi(row) }}</td>
                <td class="col-pejabat" :title="getRowPejabatPenandatanganan(row)">
                  <span v-if="row.isSelected" class="row-check" aria-hidden="true">✓</span>
                  <span class="name-text">{{ getRowPejabatPenandatanganan(row) }}</span>
                </td>
                <td class="col-nik">{{ getRowNik(row) }}</td>
                <td class="col-inv-status">
                  <span class="status-undangan-badge" :class="`status-undangan-${getInvitationStatusLabel(row).toLowerCase()}`">
                    {{ getInvitationStatusLabel(row) }}
                  </span>
                </td>
                <td class="col-action">
                  <button class="action-btn" type="button" @click="openDetailModal(row)">Detail</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <section class="table-pagination">
          <p class="pagination-summary">Menampilkan {{ visibleRowsCount }} dari {{ totalRows }} data</p>
          <div class="pagination-controls">
            <button type="button" class="page-btn" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
              Sebelumnya
            </button>
            <button
              v-for="page in pageNumbers"
              :key="page"
              type="button"
              class="page-btn"
              :class="{ active: currentPage === page }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
            <button
              type="button"
              class="page-btn"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              Berikutnya
            </button>
          </div>
        </section>

        <div class="dots">
          <span class="active" />
          <span />
          <span />
        </div>
      </div>
    </main>

    <div v-if="showAddAdminModal" class="add-admin-overlay" @click.self="closeAddAdminModal">
      <section class="add-admin-modal">
        <button class="detail-close" type="button" @click="closeAddAdminModal" aria-label="Close tambah admin popup">
          ×
        </button>
        <h2 class="detail-title">Tambah Admin</h2>
        <p class="detail-subtitle">Isi data admin dan detil pemberi pemberi kerja di bawah ini.</p>
        <div class="detail-section-divider" />

        <form class="add-admin-form" @submit.prevent="submitAddAdminForm">
          <label class="form-field">
            <span>Nomor ID Request Invitation</span>
            <input v-model="addAdminForm.nomorIdRequestInvitation" type="text" readonly disabled />
            <small v-if="addAdminErrors.nomorIdRequestInvitation" class="form-error">
              {{ addAdminErrors.nomorIdRequestInvitation }}
            </small>
          </label>
          <label class="form-field">
            <span>Nomor Surat</span>
            <input v-model="addAdminForm.nomorSurat" type="text" required @input="clearAddAdminError('nomorSurat')" />
            <small v-if="addAdminErrors.nomorSurat" class="form-error">{{ addAdminErrors.nomorSurat }}</small>
          </label>
          <label class="form-field">
            <span>Tanggal Surat</span>
            <input :value="tanggalSuratPicker" type="date" required @change="handleTanggalSuratChange" />
            <small class="form-hint date-picker-preview">
              {{ addAdminForm.tanggalSurat ? `Format tersimpan: ${addAdminForm.tanggalSurat}` : "Format: dd/mm/yyyy" }}
            </small>
            <small v-if="addAdminErrors.tanggalSurat" class="form-error">{{ addAdminErrors.tanggalSurat }}</small>
          </label>
          <label class="form-field">
            <span>Nama Instansi</span>
            <input v-model="addAdminForm.namaInstansi" type="text" required @input="clearAddAdminError('namaInstansi')" />
            <small v-if="addAdminErrors.namaInstansi" class="form-error">{{ addAdminErrors.namaInstansi }}</small>
          </label>
          <label class="form-field">
            <span>Pejabat/Pihak Penandatangan</span>
            <input
              v-model="addAdminForm.pejabatPenandatangan"
              type="text"
              required
              @input="clearAddAdminError('pejabatPenandatangan')"
            />
            <small v-if="addAdminErrors.pejabatPenandatangan" class="form-error">
              {{ addAdminErrors.pejabatPenandatangan }}
            </small>
          </label>
          <label class="form-field">
            <span>NIK akun SIAPKerja Tujuan Invitation</span>
            <input
              v-model="addAdminForm.nikAkunTujuanInvitation"
              type="text"
              inputmode="numeric"
              maxlength="16"
              pattern="[0-9]*"
              required
              @input="updateNikField"
            />
            <small v-if="addAdminErrors.nikAkunTujuanInvitation" class="form-error">
              {{ addAdminErrors.nikAkunTujuanInvitation }}
            </small>
          </label>
          <label class="form-field form-field-full">
            <span>Hasil Review Surat</span>
            <div class="review-radio-group">
              <label v-for="option in reviewSuratOptions" :key="option" class="review-radio-option">
                <input
                  v-model="addAdminForm.hasilReviewSurat"
                  type="radio"
                  name="hasilReviewSurat"
                  :value="option"
                  required
                  @change="clearAddAdminError('hasilReviewSurat')"
                />
                <span>{{ option }}</span>
              </label>
            </div>
            <small v-if="addAdminErrors.hasilReviewSurat" class="form-error">{{ addAdminErrors.hasilReviewSurat }}</small>
          </label>

          <div class="add-admin-footer">
            <button type="button" class="footer-btn secondary" @click="closeAddAdminModal">Batal</button>
            <button type="submit" class="footer-btn primary">Simpan</button>
          </div>
        </form>
      </section>
    </div>

    <div v-if="showSubmitFeedbackModal && submitFeedback" class="invite-result-overlay">
      <section class="invite-result-modal" :class="`invite-result-${submitFeedback.icon}`">
        <div class="invite-result-icon" aria-hidden="true">
          <span v-if="submitFeedback.icon === 'success'">✓</span>
          <span v-else-if="submitFeedback.icon === 'pending'">!</span>
          <span v-else>✕</span>
        </div>
        <h3>{{ submitFeedback.heading }}</h3>
        <p>{{ submitFeedback.message }}</p>
      </section>
    </div>

    <div v-if="showSubmitToast && submitFeedback" class="invite-toast" :class="`invite-toast-${submitFeedback.icon}`">
      {{ submitFeedback.heading }}
    </div>

    <div v-if="showDetailModal && selectedCandidateDetail" class="detail-overlay" @click.self="closeDetailModal">
      <section class="detail-modal">
        <button class="detail-close" type="button" @click="closeDetailModal" aria-label="Close detail popup">×</button>
        <h2 class="detail-title">Admin Pemberi Kerja</h2>
        <p class="detail-subtitle">Berikut adalah rincian akun admin pemberi kerja</p>

        <div class="detail-section-divider" />

        <div class="detail-grid">
          <div class="detail-field">
            <p>Status</p>
            <span class="status-pill">Menunggu Verifikasi</span>
          </div>
          <div class="detail-field">
            <p>Nomor ID Request Invitation</p>
            <strong>{{ selectedCandidateDetail.nomorIdRequestInvitation }}</strong>
          </div>
          <div class="detail-field">
            <p>Nomor Surat</p>
            <strong>{{ selectedCandidateDetail.nomorSurat }}</strong>
          </div>
          <div class="detail-field">
            <p>Tanggal Surat</p>
            <strong>{{ selectedCandidateDetail.tanggalSurat }}</strong>
          </div>
          <div class="detail-field">
            <p>Nama Instansi</p>
            <strong>{{ selectedCandidateDetail.namaInstansi }}</strong>
          </div>
          <div class="detail-field">
            <p>Pejabat/Pihak Penandatangan</p>
            <strong>{{ selectedCandidateDetail.pejabatPenandatanganan }}</strong>
          </div>
          <div class="detail-field">
            <p>Hasil Review Surat</p>
            <strong>{{ selectedCandidateDetail.hasilReviewSurat }}</strong>
          </div>
          <div class="detail-field">
            <p>NIK akun SIAPKerja Tujuan Invitation</p>
            <strong>{{ selectedCandidateDetail.nikAkunTujuanInvitation }}</strong>
          </div>
        </div>

        <section class="history-section">
          <div class="history-heading">
            <div>
              <h3>Riwayat Undangan <span aria-hidden="true">↻</span></h3>
              <p>Daftar riwayat undangan pada akun ini</p>
            </div>
            <div class="history-search">
              <span aria-hidden="true">⌕</span>
              <input v-model="invitationSearch" type="text" placeholder="Cari riwayat undangan" />
            </div>
          </div>

          <article class="history-request-card">
            <div class="history-request-main">
              <p class="history-request-email">{{ selectedCandidateDetail.recipientEmail }}</p>
              <p class="history-request-line">Diajukan oleh: Admin</p>
              <p class="history-request-line">Email pengaju: {{ selectedCandidateDetail.emailPengaju }}</p>
              <div class="history-request-meta">
                <span class="history-time-chip">Diajukan: {{ selectedCandidateDetail.diajukanPada }}</span>
                <span class="history-time-chip">Kadaluarsa: {{ selectedCandidateDetail.kadaluarsaPada }}</span>
              </div>
            </div>
            <div class="history-request-actions">
              <span class="history-card-status" :class="`history-card-status-${selectedCandidateDetail.statusBadgeTone}`">
                {{ selectedCandidateDetail.statusBadgeLabel }}
              </span>
              <button type="button" class="history-copy-btn" @click="copyInvitationLink">Salin Link</button>
              <small v-if="copiedInvitationLink" class="history-copy-feedback">Link tersalin</small>
            </div>
          </article>

          <div class="history-list">
            <div v-for="(log, idx) in filteredInvitationLogs" :key="`${log.date}-${idx}`" class="history-item">
              <div>
                <p class="history-date">{{ log.date }}</p>
                <p class="history-message">{{ log.message }}</p>
              </div>
              <span class="history-badge">{{ log.status }}</span>
            </div>
            <p v-if="!filteredInvitationLogs.length" class="history-empty">Tidak ada riwayat undangan yang cocok.</p>
          </div>
        </section>

        <div class="detail-footer">
          <button type="button" class="footer-btn secondary" @click="openVerifikasiInstansiModal">Verifikasi Instansi</button>
          <button type="button" class="footer-btn secondary">Blokir Admin</button>
          <button type="button" class="footer-btn primary">Ubah Admin</button>
        </div>
      </section>
    </div>

    <div
      v-if="showVerifikasiInstansiModal && selectedVerificationInstansiDetail"
      class="detail-overlay"
      @click.self="closeVerifikasiInstansiModal"
    >
      <section class="detail-modal verification-modal">
        <button class="detail-close" type="button" @click="closeVerifikasiInstansiModal" aria-label="Close verifikasi instansi popup">
          ×
        </button>
        <h2 class="detail-title">Verifikasi Instansi</h2>
        <p class="detail-subtitle">Berikut data instansi berdasarkan input Admin pengelola.</p>

        <div class="detail-section-divider" />

        <div class="verification-grid">
          <div class="detail-field">
            <p class="verification-field-label">
              <label class="verification-check">
                <input v-model="verificationChecklist.namaInstansi" type="checkbox" />
                <span>Nama Instansi</span>
              </label>
            </p>
            <strong>{{ selectedVerificationInstansiDetail.namaInstansi }}</strong>
          </div>
          <div class="detail-field">
            <p class="verification-field-label">
              <label class="verification-check">
                <input v-model="verificationChecklist.tanggalBerdiri" type="checkbox" />
                <span>Tanggal Berdiri</span>
              </label>
            </p>
            <strong>{{ selectedVerificationInstansiDetail.tanggalBerdiri }}</strong>
          </div>
          <div class="detail-field">
            <p class="verification-field-label">
              <label class="verification-check">
                <input v-model="verificationChecklist.alamatInstansi" type="checkbox" />
                <span>Alamat Instansi</span>
              </label>
            </p>
            <strong>{{ selectedVerificationInstansiDetail.alamatInstansi }}</strong>
          </div>
          <div class="detail-field">
            <p class="verification-field-label">
              <label class="verification-check">
                <input v-model="verificationChecklist.provinsi" type="checkbox" />
                <span>Provinsi</span>
              </label>
            </p>
            <strong>{{ selectedVerificationInstansiDetail.provinsi }}</strong>
          </div>
          <div class="detail-field">
            <p class="verification-field-label">
              <label class="verification-check">
                <input v-model="verificationChecklist.kabupatenKota" type="checkbox" />
                <span>Kabupaten/Kota</span>
              </label>
            </p>
            <strong>{{ selectedVerificationInstansiDetail.kabupatenKota }}</strong>
          </div>
          <div class="detail-field">
            <p class="verification-field-label">
              <label class="verification-check">
                <input v-model="verificationChecklist.kecamatan" type="checkbox" />
                <span>Kecamatan</span>
              </label>
            </p>
            <strong>{{ selectedVerificationInstansiDetail.kecamatan }}</strong>
          </div>
          <div class="detail-field">
            <p class="verification-field-label">
              <label class="verification-check">
                <input v-model="verificationChecklist.kelurahan" type="checkbox" />
                <span>Kelurahan</span>
              </label>
            </p>
            <strong>{{ selectedVerificationInstansiDetail.kelurahan }}</strong>
          </div>
          <div class="detail-field">
            <p class="verification-field-label">
              <label class="verification-check">
                <input v-model="verificationChecklist.kodePos" type="checkbox" />
                <span>Kode Pos</span>
              </label>
            </p>
            <strong>{{ selectedVerificationInstansiDetail.kodePos }}</strong>
          </div>
          <div class="detail-field">
            <p class="verification-field-label">
              <label class="verification-check">
                <input v-model="verificationChecklist.nomorTeleponInstansi" type="checkbox" />
                <span>Nomor Telepon Instansi</span>
              </label>
            </p>
            <strong>{{ selectedVerificationInstansiDetail.nomorTeleponInstansi }}</strong>
          </div>
          <div class="detail-field">
            <p class="verification-field-label">
              <label class="verification-check">
                <input v-model="verificationChecklist.emailResmiInstansi" type="checkbox" />
                <span>Email Resmi Instansi</span>
              </label>
            </p>
            <strong>{{ selectedVerificationInstansiDetail.emailResmiInstansi }}</strong>
          </div>
          <div class="detail-field">
            <p class="verification-field-label">
              <label class="verification-check">
                <input v-model="verificationChecklist.situsWeb" type="checkbox" />
                <span>Situs Web</span>
              </label>
            </p>
            <strong v-if="selectedVerificationInstansiDetail.situsWeb">
              <a :href="selectedVerificationInstansiDetail.situsWeb" target="_blank" rel="noopener noreferrer">
                {{ selectedVerificationInstansiDetail.situsWeb }}
              </a>
            </strong>
            <strong v-else>-</strong>
          </div>
          <div class="detail-field">
            <p class="verification-field-label">
              <label class="verification-check">
                <input v-model="verificationChecklist.lokasi" type="checkbox" />
                <span>Lokasi</span>
              </label>
            </p>
            <strong>{{ selectedVerificationInstansiDetail.lokasi }}</strong>
          </div>
          <div class="detail-field detail-field-full">
            <p class="verification-field-label">
              <label class="verification-check">
                <input v-model="verificationChecklist.deskripsiSingkat" type="checkbox" />
                <span>Deskripsi Singkat</span>
              </label>
            </p>
            <strong>{{ selectedVerificationInstansiDetail.deskripsiSingkat }}</strong>
          </div>
          <div class="detail-field detail-field-full">
            <p class="verification-field-label">
              <label class="verification-check">
                <input v-model="verificationChecklist.logoInstansi" type="checkbox" />
                <span>Logo Instansi</span>
              </label>
            </p>
            <div v-if="selectedVerificationInstansiDetail.logoInstansiUrl" class="verification-logo-wrap">
              <img :src="selectedVerificationInstansiDetail.logoInstansiUrl" alt="Logo Instansi" class="verification-logo" />
            </div>
            <strong v-else>-</strong>
          </div>
          <div class="detail-field">
            <p class="verification-field-label">
              <label class="verification-check">
                <input v-model="verificationChecklist.namaAdminPengelola" type="checkbox" />
                <span>Nama Admin Pengelola</span>
              </label>
            </p>
            <strong>{{ selectedVerificationInstansiDetail.namaAdminPengelola }}</strong>
          </div>
          <div class="detail-field">
            <p class="verification-field-label">
              <label class="verification-check">
                <input v-model="verificationChecklist.nomorTeleponAdminPengelola" type="checkbox" />
                <span>Nomor Telepon Admin Pengelola (WhatsApp)</span>
              </label>
            </p>
            <strong>{{ selectedVerificationInstansiDetail.nomorTeleponAdminPengelola }}</strong>
          </div>
          <div class="detail-field">
            <p class="verification-field-label">
              <label class="verification-check">
                <input v-model="verificationChecklist.nomorTeleponAlternatif" type="checkbox" />
                <span>Nomor Telepon Alternatif</span>
              </label>
            </p>
            <strong>{{ selectedVerificationInstansiDetail.nomorTeleponAlternatif }}</strong>
          </div>
          <div class="detail-field">
            <p class="verification-field-label">
              <label class="verification-check">
                <input v-model="verificationChecklist.emailAdminPengelola" type="checkbox" />
                <span>Email Admin Pengelola (SiapKerja)</span>
              </label>
            </p>
            <strong>{{ selectedVerificationInstansiDetail.emailAdminPengelola }}</strong>
          </div>
          <div class="detail-field detail-field-full">
            <p class="verification-field-label">
              <label class="verification-check">
                <input v-model="verificationChecklist.dokumenPendukungTambahan" type="checkbox" />
                <span>Dokumen Pendukung Tambahan</span>
              </label>
            </p>
            <a
              v-if="selectedVerificationInstansiDetail.dokumenPendukungUrl"
              :href="selectedVerificationInstansiDetail.dokumenPendukungUrl"
              :download="selectedVerificationInstansiDetail.dokumenPendukungNama"
              class="verification-download-link"
            >
              Download {{ selectedVerificationInstansiDetail.dokumenPendukungNama }}
            </a>
            <strong v-else>-</strong>
          </div>
        </div>

        <div class="verification-actions">
          <button type="button" class="verification-action-btn valid" @click="handleVerificationAction('valid')">Valid</button>
          <button type="button" class="verification-action-btn revisi" @click="handleVerificationAction('revisi')">Revisi</button>
          <button type="button" class="verification-action-btn tidak-valid" @click="handleVerificationAction('tidak-valid')">
            Tidak Valid
          </button>
        </div>
        <p v-if="verificationActionError" class="verification-action-error">{{ verificationActionError }}</p>
      </section>
    </div>

    <div v-if="showVerificationReasonModal" class="detail-overlay" @click.self="closeVerificationReasonModal">
      <section class="detail-modal verification-reason-modal">
        <button class="detail-close" type="button" @click="closeVerificationReasonModal" aria-label="Close alasan verifikasi popup">
          ×
        </button>
        <h2 class="detail-title">{{ verificationReasonAction === "revisi" ? "Alasan Revisi" : "Alasan Tidak Valid" }}</h2>
        <p class="detail-subtitle">Masukkan alasan untuk melanjutkan proses verifikasi.</p>

        <div class="detail-section-divider" />

        <label class="verification-reason-field">
          <span>Alasan</span>
          <textarea
            v-model="verificationReasonText"
            rows="5"
            placeholder="Tulis alasan revisi / tidak valid..."
            @input="verificationReasonError = ''"
          />
        </label>
        <small v-if="verificationReasonError" class="form-error">{{ verificationReasonError }}</small>

        <div class="verification-reason-actions">
          <button type="button" class="footer-btn secondary" @click="closeVerificationReasonModal">Cancel</button>
          <button type="button" class="footer-btn primary" @click="submitVerificationReason">Submit</button>
        </div>
      </section>
    </div>

    <div v-if="showInstansiFormModal" class="detail-overlay" @click.self="closeInstansiFormModal">
      <section class="detail-modal instansi-form-modal">
        <button class="detail-close" type="button" @click="closeInstansiFormModal" aria-label="Close form instansi popup">×</button>
        <h2 class="detail-title">Form Data Instansi</h2>
        <p class="detail-subtitle">Lengkapi data instansi untuk proses verifikasi lanjutan.</p>

        <div class="detail-section-divider" />

        <form class="instansi-form" @submit.prevent="submitInstansiForm">
          <label class="form-field">
            <span>Nama Instansi</span>
            <input v-model="instansiForm.namaInstansi" type="text" readonly disabled />
          </label>
          <label class="form-field">
            <span>Tanggal Berdiri</span>
            <input :value="instansiTanggalBerdiriPicker" type="date" required @change="handleInstansiTanggalBerdiriChange" />
            <small class="form-hint">
              {{ instansiForm.tanggalBerdiri ? `Format tersimpan: ${instansiForm.tanggalBerdiri}` : "Format: dd/mm/yyyy" }}
            </small>
          </label>
          <label class="form-field">
            <span>Alamat Instansi</span>
            <input v-model="instansiForm.alamatInstansi" type="text" required />
          </label>
          <label class="form-field">
            <span>Provinsi</span>
            <select v-model="instansiForm.provinsi" required :disabled="isLoadingProvinsiOptions" @change="handleInstansiProvinsiChange">
              <option disabled value="">Pilih Provinsi</option>
              <option v-for="option in instansiProvinsiOptions" :key="option.id" :value="option.name">
                {{ option.name }}
              </option>
            </select>
          </label>
          <label class="form-field">
            <span>Kabupaten/Kota</span>
            <select
              v-model="instansiForm.kabupatenKota"
              required
              :disabled="isLoadingKabupatenOptions || !instansiKabupatenOptions.length"
              @change="handleInstansiKabupatenChange"
            >
              <option disabled value="">Pilih Kabupaten/Kota</option>
              <option v-for="option in instansiKabupatenOptions" :key="option.id" :value="option.name">
                {{ option.name }}
              </option>
            </select>
          </label>
          <label class="form-field">
            <span>Kecamatan</span>
            <select
              v-model="instansiForm.kecamatan"
              required
              :disabled="isLoadingKecamatanOptions || !instansiKecamatanOptions.length"
              @change="handleInstansiKecamatanChange"
            >
              <option disabled value="">Pilih Kecamatan</option>
              <option v-for="option in instansiKecamatanOptions" :key="option.id" :value="option.name">
                {{ option.name }}
              </option>
            </select>
          </label>
          <label class="form-field">
            <span>Kelurahan</span>
            <select v-model="instansiForm.kelurahan" required :disabled="isLoadingKelurahanOptions || !instansiKelurahanOptions.length">
              <option disabled value="">Pilih Kelurahan</option>
              <option v-for="option in instansiKelurahanOptions" :key="option.id" :value="option.name">
                {{ option.name }}
              </option>
            </select>
          </label>
          <label class="form-field">
            <span>Kode Pos</span>
            <input
              v-model="instansiForm.kodePos"
              type="text"
              required
              inputmode="numeric"
              pattern="[0-9]*"
              @input="sanitizeInstansiNumericField('kodePos', $event)"
            />
          </label>
          <label class="form-field">
            <span>Nomor Telepon Instansi</span>
            <input
              v-model="instansiForm.nomorTeleponInstansi"
              type="text"
              required
              inputmode="tel"
              @input="sanitizeInstansiNumericField('nomorTeleponInstansi', $event)"
            />
          </label>
          <label class="form-field">
            <span>Email Resmi Instansi</span>
            <input v-model="instansiForm.emailResmiInstansi" type="email" required />
          </label>
          <label class="form-field">
            <span>Situs Web</span>
            <input v-model="instansiForm.situsWeb" type="text" required />
          </label>
          <label class="form-field form-field-full">
            <span>Deskripsi Singkat</span>
            <textarea v-model="instansiForm.deskripsiSingkat" rows="4" required />
          </label>
          <label class="form-field form-field-full">
            <span>Logo Instansi (PNG/JPG max 2MB)</span>
            <input type="file" accept=".png,.jpg,.jpeg,image/png,image/jpeg" @change="handleInstansiLogoChange" />
            <small v-if="instansiLogoError" class="form-error">{{ instansiLogoError }}</small>
            <img v-if="instansiLogoPreviewUrl" :src="instansiLogoPreviewUrl" alt="Preview logo instansi" class="instansi-form-logo-preview" />
          </label>
          <label class="form-field">
            <span>Lokasi</span>
            <input v-model="instansiForm.lokasi" type="text" required />
          </label>
          <label class="form-field">
            <span>Nama Admin Pengelola</span>
            <input v-model="instansiForm.namaAdminPengelola" type="text" required />
          </label>
          <label class="form-field">
            <span>Nomor Telepon Admin Pengelola (WhatsApp)</span>
            <input
              v-model="instansiForm.nomorTeleponAdminPengelola"
              type="text"
              required
              inputmode="numeric"
              pattern="[0-9]*"
              @input="sanitizeInstansiNumericField('nomorTeleponAdminPengelola', $event)"
            />
          </label>
          <label class="form-field">
            <span>Nomor Telepon Alternatif</span>
            <input
              v-model="instansiForm.nomorTeleponAlternatif"
              type="text"
              required
              inputmode="numeric"
              pattern="[0-9]*"
              @input="sanitizeInstansiNumericField('nomorTeleponAlternatif', $event)"
            />
          </label>
          <label class="form-field">
            <span>Email Admin Pengelola (SiapKerja)</span>
            <input v-model="instansiForm.emailAdminPengelola" type="email" required />
          </label>
          <label class="form-field form-field-full">
            <span>Dokumen Pendukung Tambahan (max 2MB)</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              @change="handleInstansiDokumenChange"
            />
            <small v-if="instansiDokumenError" class="form-error">{{ instansiDokumenError }}</small>
            <a v-if="instansiDokumenUrl" :href="instansiDokumenUrl" :download="instansiDokumenName" class="verification-download-link">
              Download {{ instansiDokumenName }}
            </a>
          </label>

          <small v-if="instansiWilayahError" class="form-error form-field-full">{{ instansiWilayahError }}</small>
          <small v-if="instansiFormError" class="form-error form-field-full">{{ instansiFormError }}</small>

          <div class="instansi-form-actions">
            <button type="button" class="footer-btn secondary" @click="closeInstansiFormModal">Cancel</button>
            <button type="submit" class="footer-btn primary">Submit</button>
          </div>
        </form>
      </section>
    </div>
  </div>
  <NuxtPage v-else />
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
  font-family: "Inter", "Segoe UI", Arial, sans-serif;
  color: #1f2a37;
  background: #fff;
}

.screen {
  min-height: 100dvh;
  display: grid;
  grid-template-columns: 80px 273px 1fr;
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

.rail-btn {
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rail-btn i {
  color: rgba(255, 255, 255, 0.92);
  font-size: 14px;
}

.rail-btn:hover {
  background: rgba(255, 255, 255, 0.24);
}

.rail-btn.active {
  background: rgba(0, 0, 0, 0.28);
}

.rail-btn.active i {
  color: #fff;
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
  box-shadow: none;
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
  padding: 20px;
  overflow: auto;
  background: #fff;
}

.body-container {
  max-width: 900px;
  min-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.content-header {
  margin-top: 24px;
  display: flex;
  align-items: flex-start;
}

.content-header h1 {
  margin: 0;
  font-size: 22px;
  letter-spacing: -0.5px;
  color: #052346;
  font-weight: 600;
  line-height: 32px;
}

.content-header p {
  margin: 8px 0 0;
  font-size: 11px;
  color: #6c757d;
}

.content-header .filter-btn {
  margin-left: auto;
}

.filter-menu {
  margin-left: auto;
  position: relative;
}

.filter-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  width: 220px;
  background: #fff;
  border: 1px solid #dce4ec;
  border-radius: 6px;
  box-shadow: 0 12px 32px rgba(10, 26, 47, 0.16);
  padding: 10px;
  z-index: 30;
  display: grid;
  gap: 8px;
}

.filter-field {
  display: grid;
  gap: 4px;
}

.filter-field span {
  font-size: 11px;
  color: #30475e;
  font-weight: 600;
}

.filter-field select {
  border: 1px solid #d2dae2;
  border-radius: 4px;
  height: 30px;
  padding: 0 8px;
  font-size: 12px;
  color: #1f2a37;
  background: #fff;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 2px;
}

.filter-action-btn {
  border: 1px solid #d0d7de;
  border-radius: 4px;
  height: 28px;
  padding: 0 10px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.filter-action-btn.secondary {
  background: #fff;
  color: #1f2a37;
}

.filter-action-btn.primary {
  background: #0d6efd;
  border-color: #0d6efd;
  color: #fff;
}

.stats-layout {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 33.3333% 66.6667%;
  gap: 10px;
}

.chart-card {
  margin-top: 0;
  border: 0;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 1px 1px 0 rgba(23, 43, 77, 0.25), 0 0 1px 0 rgba(23, 43, 77, 0.24);
}

.summary-stack {
  display: grid;
  gap: 10px;
}

.summary-card {
  min-height: 116px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.summary-title {
  text-transform: uppercase;
  font-size: 11px;
  color: #052b5b;
  font-weight: 700;
  letter-spacing: 0.2px;
  margin: 0;
}

.summary-value {
  margin: 0;
  font-size: 27px;
  line-height: 1;
  color: #003a74;
  font-weight: 700;
}

.chart-head {
  padding: 12px 18px;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
  color: #002f63;
  text-transform: uppercase;
}

.filter-btn {
  border: 1px solid #eee;
  background: #eee;
  border-radius: 2px;
  padding: 3px 8px;
  font-size: 10px;
  color: #212529;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;
}

.filter-btn:hover {
  background: #dbdbdb;
  border-color: #d5d4d4;
}

.chart-body {
  display: grid;
  grid-template-columns: 1fr 190px;
  align-items: center;
  min-height: 260px;
  padding: 14px 22px 12px;
}

.donut-wrap {
  position: relative;
  width: 230px;
  height: 230px;
  margin: 0 auto;
  cursor: pointer;
}

.donut {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: grid;
  place-items: center;
  box-shadow: none;
}

.donut-hole {
  width: 34%;
  height: 34%;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: none;
}

.donut-label {
  position: absolute;
  font-size: 10px;
  color: #fff;
  font-weight: 500;
  text-shadow: none;
  pointer-events: none;
}

.donut-label.verified {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translate(16px, -91px);
}

.donut-label.unverified {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translate(2px, 89px);
}

.chart-tooltip {
  position: absolute;
  transform: translate(-50%, -100%);
  background: rgba(31, 42, 55, 0.92);
  color: #fff;
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 11px;
  line-height: 1.2;
  display: grid;
  gap: 2px;
  pointer-events: none;
  z-index: 2;
  white-space: nowrap;
}

.legend {
  font-size: 12px;
  color: #212529;
  padding-right: 8px;
  display: grid;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 20px;
  height: 4px;
  border-radius: 0;
  display: inline-block;
}

.bottom-tools {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.tool-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.add-admin-btn {
  border: 1px solid #00b4bc;
  background: #00c5cd;
  color: #fff;
  border-radius: 4px;
  padding: 5px 12px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.add-admin-btn:hover {
  background: #00b2ba;
  border-color: #00a8af;
}

.candidate-table-wrap {
  margin-top: 12px;
  border: 1px solid #eef1f4;
  border-radius: 6px;
  overflow-x: auto;
  overflow-y: hidden;
  background: #fff;
}

.candidate-table {
  width: 100%;
  min-width: 1520px;
  border-collapse: collapse;
  table-layout: fixed;
}

.candidate-table th,
.candidate-table td {
  padding: 14px 12px;
  text-align: left;
  border-bottom: 1px solid #eef1f4;
  font-size: 11px;
}

.candidate-table thead th {
  font-size: 11px;
  line-height: 1.15;
  color: #143d69;
  font-weight: 600;
  letter-spacing: 0;
}

.candidate-table tbody td {
  color: #0f2238;
  font-weight: 500;
}

.candidate-table tbody tr:last-child td {
  border-bottom: 0;
}

.candidate-table .col-no {
  width: 46px;
}

.candidate-table .col-date {
  width: 130px;
}

.candidate-table .col-id {
  width: 210px;
}

.candidate-table .col-no-surat {
  width: 150px;
}

.candidate-table .col-tanggal-surat {
  width: 130px;
}

.candidate-table .col-instansi {
  width: 220px;
}

.candidate-table .col-pejabat {
  width: 220px;
  color: #00366f;
  font-weight: 700;
}

.candidate-table .col-nik {
  width: 155px;
}

.candidate-table .col-inv-status {
  width: 120px;
}

.candidate-table .col-action {
  width: 98px;
}

.candidate-table .col-action,
.candidate-table .col-id,
.candidate-table .col-no-surat,
.candidate-table .col-instansi,
.candidate-table .col-pejabat,
.candidate-table .col-nik,
.candidate-table .col-inv-status {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-undangan-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 78px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
}

.status-undangan-terkirim {
  color: #1a6d35;
  background: #dcfce7;
  border: 1px solid #86efac;
}

.status-undangan-pending {
  color: #7a5600;
  background: #fef3c7;
  border: 1px solid #fcd34d;
}

.status-undangan-gagal {
  color: #991b1b;
  background: #fee2e2;
  border: 1px solid #fca5a5;
}

.table-pagination {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.pagination-summary {
  margin: 0;
  font-size: 11px;
  color: #5f6b7a;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-btn {
  border: 1px solid #d7dfea;
  background: #fff;
  border-radius: 5px;
  height: 28px;
  padding: 0 10px;
  font-size: 11px;
  color: #1f3558;
  cursor: pointer;
}

.page-btn.active {
  background: #15406a;
  border-color: #15406a;
  color: #fff;
}

.page-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.name-text {
  vertical-align: middle;
}

.row-check {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: #2e9bff;
  color: #fff;
  display: inline-grid;
  place-items: center;
  font-size: 9px;
  margin-right: 6px;
  vertical-align: middle;
}

.action-btn {
  border: 1px solid #c9d3df;
  background: #f8fbff;
  color: #15406a;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  cursor: pointer;
}

.action-btn:hover {
  background: #eef5ff;
}

.add-admin-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.48);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 85;
}

.add-admin-modal {
  width: min(760px, 100%);
  max-height: calc(100dvh - 32px);
  overflow: auto;
  background: #fff;
  border-radius: 18px;
  padding: 22px 30px 20px;
  box-shadow: 0 20px 42px rgba(9, 20, 38, 0.32);
  position: relative;
}

.add-admin-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
}

.form-field {
  display: grid;
  gap: 6px;
}

.form-field span {
  font-size: 11px;
  color: #1c2842;
  font-weight: 600;
}

.form-field input,
.form-field select {
  height: 38px;
  border: 1px solid #d6deea;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 12px;
  color: #10253f;
  background: #fff;
}

.form-field textarea {
  border: 1px solid #d6deea;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 12px;
  color: #10253f;
  background: #fff;
  resize: vertical;
  min-height: 82px;
}

.date-picker-preview {
  margin-top: -2px;
}

.review-radio-group {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 2px;
}

.review-radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #1c2842;
}

.review-radio-option input {
  width: 14px;
  height: 14px;
  margin: 0;
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus {
  outline: 0;
  border-color: #00b4bc;
  box-shadow: 0 0 0 2px rgba(0, 197, 205, 0.15);
}

.form-field select:disabled {
  background: #f2f6fb;
  color: #78849a;
  cursor: not-allowed;
}

.form-field input:disabled {
  background: #f2f6fb;
  color: #78849a;
  cursor: not-allowed;
}

.form-field input[type="file"] {
  height: auto;
  min-height: 38px;
  padding: 8px 12px;
}

.form-field-full {
  grid-column: 1 / -1;
}

.form-hint {
  color: #6d7a8f;
  font-size: 10px;
}

.form-note {
  color: #7b8799;
  font-size: 10px;
}

.form-file-name {
  color: #1b3d66;
  font-size: 10px;
}

.form-link-preview a {
  color: #0c61b0;
  font-size: 10px;
  text-decoration: underline;
  word-break: break-all;
}

.form-error {
  color: #db2b3e;
  font-size: 10px;
  font-weight: 600;
}

.invite-result-overlay {
  position: fixed;
  inset: 0;
  z-index: 95;
  background: rgba(5, 11, 23, 0.55);
  display: grid;
  place-items: center;
  padding: 20px;
}

.invite-result-modal {
  width: min(420px, 100%);
  background: #fff;
  border-radius: 20px;
  padding: 26px 22px 24px;
  text-align: center;
  animation: inviteResultPop 0.35s ease;
}

.invite-result-icon {
  width: 116px;
  height: 116px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  margin: 0 auto 14px;
  font-size: 58px;
  font-weight: 800;
  animation: inviteResultPulse 1.2s ease-in-out infinite;
}

.invite-result-success .invite-result-icon {
  color: #1b8f4f;
  background: #dcfce7;
}

.invite-result-pending .invite-result-icon {
  color: #946200;
  background: #fef3c7;
}

.invite-result-failed .invite-result-icon {
  color: #c61e25;
  background: #fee2e2;
}

.invite-result-modal h3 {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  color: #0b1527;
}

.invite-result-modal p {
  margin: 8px 0 0;
  font-size: 13px;
  color: #40506a;
}

.invite-toast {
  position: fixed;
  top: 24px;
  right: 22px;
  z-index: 96;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  box-shadow: 0 12px 28px rgba(12, 26, 46, 0.25);
}

.invite-toast-success {
  background: #1f9f59;
}

.invite-toast-pending {
  background: #d8a019;
}

.invite-toast-failed {
  background: #d94a4f;
}

@keyframes inviteResultPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}

@keyframes inviteResultPop {
  from {
    transform: translateY(10px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.add-admin-footer {
  grid-column: 1 / -1;
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.detail-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.48);
  display: grid;
  place-items: center;
  padding: 8px;
  z-index: 80;
}

.detail-modal {
  width: min(760px, 100%);
  max-height: calc(100dvh - 16px);
  overflow: auto;
  background: #fff;
  border-radius: 18px;
  padding: 22px 30px 20px;
  box-shadow: 0 20px 42px rgba(9, 20, 38, 0.32);
  position: relative;
  scrollbar-width: thin;
  scrollbar-color: #9da6b0 transparent;
}

.detail-close {
  position: absolute;
  top: 24px;
  right: 28px;
  border: 0;
  background: transparent;
  color: #1f3558;
  font-size: 32px;
  line-height: 1;
  cursor: pointer;
  font-weight: 300;
}

.detail-title {
  margin: 0;
  font-size: 24px;
  line-height: 1.08;
  color: #050b17;
  font-weight: 800;
}

.detail-subtitle {
  margin: 6px 0 12px;
  color: #2f3b59;
  font-size: 12px;
  font-weight: 500;
}

.detail-section-divider {
  height: 1px;
  background: #e8edf4;
  margin-bottom: 14px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 12px;
  border-radius: 999px;
  border: 2px solid #fcd34d;
  color: #7a5600;
  background: #fef3c7;
  font-size: 11px;
  font-weight: 600;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9edf2;
}

.detail-field p {
  margin: 0 0 4px;
  font-size: 11px;
  color: #1c2842;
  font-weight: 500;
}

.detail-field strong {
  color: #050b17;
  font-size: 16px;
  line-height: 1.22;
  font-weight: 700;
}

.detail-field-full {
  grid-column: 1 / -1;
}

.verification-modal {
  width: min(980px, 100%);
  border: 1px solid #e7eef6;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
}

.verification-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 18px;
}

.verification-modal .detail-title {
  color: #0b1f44;
  letter-spacing: 0.2px;
}

.verification-modal .detail-subtitle {
  color: #5f6f86;
}

.verification-modal .detail-field {
  border: 1px solid #e3ebf5;
  border-radius: 12px;
  padding: 11px 12px 12px;
  background: #fff;
  box-shadow: 0 3px 10px rgba(16, 37, 63, 0.04);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.verification-modal .detail-field:hover {
  border-color: #cddbef;
  box-shadow: 0 8px 18px rgba(16, 37, 63, 0.08);
  transform: translateY(-1px);
}

.verification-modal .detail-field strong {
  font-size: 14px;
  line-height: 1.35;
  font-weight: 700;
  color: #0d223f;
  word-break: break-word;
}

.verification-logo-wrap {
  margin-top: 8px;
}

.verification-logo {
  width: 100%;
  max-width: 220px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  object-fit: contain;
  background: #f8fbff;
  padding: 8px;
}

.verification-download-link {
  display: inline-block;
  margin-top: 8px;
  color: #0f5da3;
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #cae0f7;
  background: #f2f8ff;
  border-radius: 8px;
  padding: 7px 11px;
}

.verification-download-link:hover {
  background: #e9f3ff;
  border-color: #b8d5f3;
}

.verification-field-label {
  margin: 0 0 7px;
}

.verification-check {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: fit-content;
  border-radius: 999px;
  padding: 2px 6px 2px 2px;
  transition: background-color 0.2s ease;
}

.verification-check:hover {
  background: #f1f7ff;
}

.verification-check input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: #00b4bc;
}

.verification-check span {
  font-size: 11px;
  color: #1c2842;
  font-weight: 600;
}

.verification-actions {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 14px;
  border-top: 1px solid #e6edf6;
}

.verification-action-btn {
  border: 0;
  border-radius: 10px;
  min-width: 126px;
  height: 40px;
  padding: 0 16px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.2px;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 7px 18px rgba(15, 23, 42, 0.16);
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}

.verification-action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.22);
  filter: brightness(1.03);
}

.verification-action-btn.valid {
  background: #16a34a;
}

.verification-action-btn.revisi {
  background: #d9a300;
}

.verification-action-btn.tidak-valid {
  background: #dc2626;
}

.verification-action-error {
  margin: 8px 0 0;
  text-align: right;
  color: #dc2626;
  font-size: 12px;
  font-weight: 600;
}

.verification-reason-modal {
  width: min(560px, 100%);
}

.verification-reason-field {
  display: grid;
  gap: 6px;
}

.verification-reason-field span {
  font-size: 12px;
  color: #1c2842;
  font-weight: 600;
}

.verification-reason-field textarea {
  border: 1px solid #d6deea;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 12px;
  color: #10253f;
  background: #fff;
  resize: vertical;
  min-height: 120px;
}

.verification-reason-field textarea:focus {
  outline: 0;
  border-color: #00b4bc;
  box-shadow: 0 0 0 2px rgba(0, 197, 205, 0.15);
}

.verification-reason-actions {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.instansi-form-modal {
  width: min(980px, 100%);
}

.instansi-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
}

.instansi-form-logo-preview {
  width: 100%;
  max-width: 220px;
  margin-top: 8px;
  border-radius: 8px;
  border: 1px solid #d6deea;
  padding: 6px;
  background: #fff;
}

.instansi-form-actions {
  grid-column: 1 / -1;
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.history-section {
  margin-top: 14px;
  border-bottom: 1px solid #e9edf2;
  padding-bottom: 12px;
}

.history-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.history-heading h3 {
  margin: 0;
  color: #050b17;
  font-size: 24px;
  line-height: 1.08;
  font-weight: 800;
}

.history-heading p {
  margin: 4px 0 0;
  color: #6b768d;
  font-size: 12px;
  font-weight: 600;
}

.history-search {
  width: 320px;
  min-width: 260px;
  height: 42px;
  border: 1px solid #d5deea;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
  color: #7f8ca7;
}

.history-search input {
  border: 0;
  outline: 0;
  width: 100%;
  font-size: 12px;
  color: #3a4966;
  font-weight: 500;
}

.history-search span {
  font-size: 15px;
}

.history-request-card {
  margin-top: 12px;
  border: 1px solid #dce4ef;
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
}

.history-request-main {
  min-width: 0;
}

.history-request-email {
  margin: 0;
  color: #0a1b34;
  font-size: 20px;
  font-weight: 800;
  line-height: 1.1;
}

.history-request-line {
  margin: 4px 0 0;
  color: #394a65;
  font-size: 12px;
}

.history-request-meta {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.history-time-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  border: 1px solid #9eb4cc;
  background: #eef4fa;
  color: #0d2645;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  padding: 5px 10px;
}

.history-request-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
}

.history-card-status {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  padding: 8px 14px;
}

.history-card-status-terkirim {
  color: #1f7d3e;
  background: #dcfce7;
}

.history-card-status-pending {
  color: #865a02;
  background: #fef3c7;
}

.history-card-status-gagal {
  color: #c41e2f;
  background: #fee2e2;
}

.history-copy-btn {
  border: 1px solid #dae2ed;
  background: #fff;
  color: #5f6678;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  padding: 8px 14px;
  cursor: pointer;
}

.history-copy-feedback {
  width: 100%;
  text-align: right;
  color: #2a7b47;
  font-size: 12px;
  font-weight: 600;
}

.history-list {
  margin-top: 10px;
  display: grid;
  gap: 8px;
  max-height: 150px;
  overflow: auto;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: #9da6b0 transparent;
}

.history-item {
  border: 1px solid #e6ebf1;
  border-radius: 8px;
  padding: 9px 11px;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
}

.history-date {
  margin: 0;
  color: #6f7d93;
  font-size: 10px;
}

.history-message {
  margin: 4px 0 0;
  color: #10253f;
  font-size: 11px;
}

.history-badge {
  border: 1px solid #c7d3e0;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 10px;
  font-weight: 600;
  color: #36506e;
  background: #f7faff;
  white-space: nowrap;
}

.history-empty {
  margin: 0;
  color: #7b8799;
  font-size: 11px;
  padding: 8px 0;
}

.detail-footer {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 14px;
}

.footer-btn {
  height: 38px;
  min-width: 124px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  border: 2px solid transparent;
  padding: 0 14px;
}

.footer-btn.secondary {
  background: #fff;
  color: #0a1323;
  border-color: #d2dbe8;
}

.footer-btn.primary {
  background: #00c5cd;
  color: #fff;
}

.search-field {
  width: 360px;
  height: 26px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  display: flex;
  align-items: center;
  background: #fff;
  overflow: hidden;
  box-shadow: none;
}

.search-field input {
  border: 0;
  outline: 0;
  width: 100%;
  padding: 0 12px;
  font-size: 11px;
  color: #495057;
}

.search-field button {
  width: 30px;
  height: 100%;
  border: 0;
  border-left: 1px solid #ced4da;
  background: #e5e5e5;
  font-size: 11px;
  color: #212529;
  cursor: pointer;
}

.dots {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 6px;
}

.dots span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #ececec;
}

.dots span.active {
  background: #15406a;
}

@media (max-width: 1200px) {
  .screen {
    grid-template-columns: 64px 220px 1fr;
  }

  .content-header h1 {
    font-size: 30px;
  }

  .stats-layout {
    grid-template-columns: 1fr;
  }

  .chart-body {
    grid-template-columns: 1fr;
  }

  .donut-wrap {
    width: 220px;
    height: 220px;
  }

  .body-container {
    min-width: auto;
    max-width: 100%;
    padding: 0;
  }

  .search-field {
    width: min(100%, 360px);
    margin-right: 10px;
  }

  .bottom-tools {
    flex-direction: column;
    align-items: stretch;
  }

  .add-admin-btn,
  .bottom-tools .filter-btn,
  .search-field,
  .tool-actions {
    width: 100%;
  }

  .add-admin-modal {
    padding: 18px 16px;
  }

  .add-admin-form {
    grid-template-columns: 1fr;
  }

  .form-field-full,
  .add-admin-footer {
    grid-column: auto;
  }

  .detail-modal {
    padding: 18px 16px 18px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .verification-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .verification-actions {
    justify-content: stretch;
    flex-direction: column;
  }

  .verification-action-btn {
    width: 100%;
  }

  .verification-action-error {
    text-align: left;
  }

  .verification-reason-actions {
    flex-direction: column;
  }

  .verification-reason-actions .footer-btn {
    width: 100%;
  }

  .instansi-form {
    grid-template-columns: 1fr;
  }

  .instansi-form-actions {
    flex-direction: column;
  }

  .instansi-form-actions .footer-btn {
    width: 100%;
  }

  .history-heading {
    flex-direction: column;
    align-items: stretch;
  }

  .history-search {
    width: 100%;
  }

  .history-request-card {
    flex-direction: column;
  }

  .history-request-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .history-copy-feedback {
    text-align: left;
  }
}
</style>
