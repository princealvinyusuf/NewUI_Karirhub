<script setup lang="ts">
const router = useRouter()

type RegionOption = {
  id: string
  name: string
}

type KondisiFisikType = "Disabilitas" | "Non Disabilitas"
type JenisKelaminType = "Laki-laki" | "Perempuan"
type JenisPekerjaanType = "Full time" | "Part time" | "Contact" | "Intership"
type StatusPernikahanType = "Single / Belum Menikah" | "Sudah Menikah"

type JobVacancyForm = {
  judulPekerjaan: string
  urlLowongan: string
  deskripsiPekerjaan: string
  jabatanKbji: string
  provinsi: string
  kota: string
  kecamatan: string
  kelurahan: string
  jenisPekerjaan: JenisPekerjaanType | ""
  bidangPekerjaan: string
  industriSektor: string
  kondisiFisik: KondisiFisikType[]
  disabilitasTidakDiizinkan: string[]
  jenisKelamin: JenisKelaminType[]
  gajiMin: string
  gajiMax: string
  tampilGaji: boolean
  bolehRemote: boolean
  dapatSahamEkuitas: boolean
  terbatas: boolean
  tanggalTayangLoker: string
  lamaExpiredLoker: string
  jumlahLowongan: string
}

type RequirementForm = {
  minimalPendidikan: string
  pengalamanDibutuhkan: string
  statusPernikahan: StatusPernikahanType[]
  usiaMin: string
  usiaMax: string
  kualifikasi: string
}

type CompanyInfoForm = {
  namaPerusahaan: string
  sektor: string
  kontakPerusahaan: string
  emailPerusahaan: string
  websitePerusahaan: string
  lokasiPerusahaan: string
  deskripsiPerusahaan: string
}

type PendingVacancyRecord = {
  id: number
  title: string
  location: string
  status: "Menunggu Verifikasi"
  createdAt: string
}

const pendingVacancyStorageKey = "karirhub_pending_vacancies_sidebar"
const wilayahApiBaseUrl = "https://www.emsifa.com/api-wilayah-indonesia/api"

const jabatanKbjiOptions = [
  "Software Developer",
  "UI/UX Designer",
  "Data Analyst",
  "Accountant",
  "Sales Executive",
  "Customer Service Officer",
  "Marketing Specialist",
  "HR Staff",
  "Project Manager",
  "Quality Assurance",
]
const jenisPekerjaanOptions: JenisPekerjaanType[] = ["Full time", "Part time", "Contact", "Intership"]
const bidangPekerjaanOptions = [
  "Teknologi Informasi",
  "Keuangan",
  "Pemasaran",
  "Sumber Daya Manusia",
  "Operasional",
  "Manufaktur",
  "Pendidikan",
  "Kesehatan",
  "Logistik",
  "Konstruksi",
]
const industriSektorOptions = [
  "Teknologi",
  "Perbankan",
  "Asuransi",
  "Telekomunikasi",
  "Kesehatan",
  "Pendidikan",
  "Manufaktur",
  "Ritel",
  "Logistik",
  "Pertanian",
]
const disabilitasTypeOptions = ["Tunanetra", "Tunarungu", "Tunadaksa", "Tunagrahita", "Disabilitas Mental"]
const expiredOptions = ["1 Bulan", "2 Bulan", "3 Bulan", "Lainnya"]
const minimalPendidikanOptions = [
  "Tidak Tamat SD/Tidak Sekolah",
  "SD atau Sederajat",
  "SMP atau Sederajat",
  "SMA atau Sederajat",
  "SMK",
  "Diploma",
  "Profesi",
  "Sarjana",
  "Magister",
  "Doktoral",
]
const pengalamanOptions = [
  "Fresh Graduate",
  "Kurang dari 1 Tahun",
  "1 Sampai 4 Tahun",
  "4 Sampai 7 Tahun",
  "7 Sampai 10 Tahun",
  "Lebih dari 10 Tahun",
]
const postingSteps = [
  "Informasi Lowongan",
  "Persyaratan Umum & Khusus",
  "Keterampilan",
  "Informasi Perusahaan",
  "Syarat & Ketentuan",
]
const skillOptions = [
  "Komunikasi",
  "Kerja Tim",
  "Manajemen Waktu",
  "Problem Solving",
  "Microsoft Excel",
  "Data Analysis",
  "UI Design",
  "Project Management",
  "Public Speaking",
  "Bahasa Inggris",
]

const currentStep = ref<1 | 2 | 3 | 4 | 5>(1)
const showStep1ConfirmModal = ref(false)
const submitMessage = ref("")
const submitError = ref("")
const wilayahError = ref("")
const selectedSkill = ref("")
const addedSkills = ref<string[]>([])
const isAgreedTerms = ref(false)

const form = reactive<JobVacancyForm>({
  judulPekerjaan: "",
  urlLowongan: "",
  deskripsiPekerjaan: "",
  jabatanKbji: "",
  provinsi: "",
  kota: "",
  kecamatan: "",
  kelurahan: "",
  jenisPekerjaan: "",
  bidangPekerjaan: "",
  industriSektor: "",
  kondisiFisik: [],
  disabilitasTidakDiizinkan: [],
  jenisKelamin: [],
  gajiMin: "",
  gajiMax: "",
  tampilGaji: false,
  bolehRemote: false,
  dapatSahamEkuitas: false,
  terbatas: false,
  tanggalTayangLoker: "",
  lamaExpiredLoker: "",
  jumlahLowongan: "",
})

const requirementForm = reactive<RequirementForm>({
  minimalPendidikan: "",
  pengalamanDibutuhkan: "",
  statusPernikahan: [],
  usiaMin: "",
  usiaMax: "",
  kualifikasi: "",
})
const companyInfoForm = reactive<CompanyInfoForm>({
  namaPerusahaan: "",
  sektor: "",
  kontakPerusahaan: "",
  emailPerusahaan: "",
  websitePerusahaan: "",
  lokasiPerusahaan: "",
  deskripsiPerusahaan: "",
})

const isLoadingProvinsi = ref(false)
const isLoadingKota = ref(false)
const isLoadingKecamatan = ref(false)
const isLoadingKelurahan = ref(false)
const provinsiOptions = ref<RegionOption[]>([])
const kotaOptions = ref<RegionOption[]>([])
const kecamatanOptions = ref<RegionOption[]>([])
const kelurahanOptions = ref<RegionOption[]>([])

const deskripsiWordCount = computed(() => form.deskripsiPekerjaan.trim().split(/\s+/).filter(Boolean).length)
const isDisabilitasChecked = computed(() => form.kondisiFisik.includes("Disabilitas"))
const formattedTanggalTayang = computed(() => {
  if (!form.tanggalTayangLoker) return "-"
  const [year, month, day] = form.tanggalTayangLoker.split("-")
  if (!day || !month || !year) return form.tanggalTayangLoker
  return `${day}/${month}/${year}`
})
const isStep2MandatoryValid = computed(() => {
  if (!requirementForm.minimalPendidikan) return false
  if (!requirementForm.pengalamanDibutuhkan) return false
  if (!requirementForm.statusPernikahan.length) return false
  if (!requirementForm.usiaMin || !requirementForm.usiaMax) return false
  if (Number(requirementForm.usiaMin) > Number(requirementForm.usiaMax)) return false
  return requirementForm.kualifikasi.trim().length > 0
})
const isStep4MandatoryValid = computed(() => {
  if (!companyInfoForm.namaPerusahaan.trim()) return false
  if (!companyInfoForm.sektor.trim()) return false
  if (!companyInfoForm.kontakPerusahaan.trim()) return false
  if (!companyInfoForm.emailPerusahaan.trim()) return false
  if (!companyInfoForm.websitePerusahaan.trim()) return false
  if (!companyInfoForm.lokasiPerusahaan.trim()) return false
  return companyInfoForm.deskripsiPerusahaan.trim().length > 0
})
const lokasiPerusahaanMapSrc = computed(() => {
  const query = companyInfoForm.lokasiPerusahaan.trim() || "Indonesia"
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
})

const fetchWilayah = async (endpoint: string) => {
  return await $fetch<RegionOption[]>(`${wilayahApiBaseUrl}/${endpoint}`)
}

const loadProvinsiOptions = async () => {
  isLoadingProvinsi.value = true
  wilayahError.value = ""
  try {
    provinsiOptions.value = await fetchWilayah("provinces.json")
  } catch {
    wilayahError.value = "Gagal memuat data provinsi."
  } finally {
    isLoadingProvinsi.value = false
  }
}

const resetKotaDownstream = () => {
  form.kota = ""
  form.kecamatan = ""
  form.kelurahan = ""
  kotaOptions.value = []
  kecamatanOptions.value = []
  kelurahanOptions.value = []
}

const resetKecamatanDownstream = () => {
  form.kecamatan = ""
  form.kelurahan = ""
  kecamatanOptions.value = []
  kelurahanOptions.value = []
}

const resetKelurahanDownstream = () => {
  form.kelurahan = ""
  kelurahanOptions.value = []
}

const handleProvinsiChange = async () => {
  resetKotaDownstream()
  if (!form.provinsi) return
  const selectedProvinsi = provinsiOptions.value.find((option) => option.name === form.provinsi)
  if (!selectedProvinsi) return
  isLoadingKota.value = true
  wilayahError.value = ""
  try {
    kotaOptions.value = await fetchWilayah(`regencies/${selectedProvinsi.id}.json`)
  } catch {
    wilayahError.value = "Gagal memuat data kota."
  } finally {
    isLoadingKota.value = false
  }
}

const handleKotaChange = async () => {
  resetKecamatanDownstream()
  if (!form.kota) return
  const selectedKota = kotaOptions.value.find((option) => option.name === form.kota)
  if (!selectedKota) return
  isLoadingKecamatan.value = true
  wilayahError.value = ""
  try {
    kecamatanOptions.value = await fetchWilayah(`districts/${selectedKota.id}.json`)
  } catch {
    wilayahError.value = "Gagal memuat data kecamatan."
  } finally {
    isLoadingKecamatan.value = false
  }
}

const handleKecamatanChange = async () => {
  resetKelurahanDownstream()
  if (!form.kecamatan) return
  const selectedKecamatan = kecamatanOptions.value.find((option) => option.name === form.kecamatan)
  if (!selectedKecamatan) return
  isLoadingKelurahan.value = true
  wilayahError.value = ""
  try {
    kelurahanOptions.value = await fetchWilayah(`villages/${selectedKecamatan.id}.json`)
  } catch {
    wilayahError.value = "Gagal memuat data kelurahan."
  } finally {
    isLoadingKelurahan.value = false
  }
}

const toggleKondisiFisik = (value: KondisiFisikType) => {
  if (form.kondisiFisik.includes(value)) {
    form.kondisiFisik = form.kondisiFisik.filter((item) => item !== value)
  } else {
    form.kondisiFisik = [...form.kondisiFisik, value]
  }
  if (!form.kondisiFisik.includes("Disabilitas")) {
    form.disabilitasTidakDiizinkan = []
  }
}

const toggleJenisKelamin = (value: JenisKelaminType) => {
  if (form.jenisKelamin.includes(value)) {
    form.jenisKelamin = form.jenisKelamin.filter((item) => item !== value)
  } else {
    form.jenisKelamin = [...form.jenisKelamin, value]
  }
}

const toggleDisabilitasTidakDiizinkan = (value: string) => {
  if (form.disabilitasTidakDiizinkan.includes(value)) {
    form.disabilitasTidakDiizinkan = form.disabilitasTidakDiizinkan.filter((item) => item !== value)
  } else {
    form.disabilitasTidakDiizinkan = [...form.disabilitasTidakDiizinkan, value]
  }
}

const toggleStatusPernikahan = (value: StatusPernikahanType) => {
  if (requirementForm.statusPernikahan.includes(value)) {
    requirementForm.statusPernikahan = requirementForm.statusPernikahan.filter((item) => item !== value)
  } else {
    requirementForm.statusPernikahan = [...requirementForm.statusPernikahan, value]
  }
}

const sanitizeNumberField = (field: "gajiMin" | "gajiMax" | "jumlahLowongan" | "usiaMin" | "usiaMax", event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/\D/g, "")
  if (field === "usiaMin" || field === "usiaMax") {
    requirementForm[field] = value
    return
  }
  form[field] = value
}

const validateStep1 = () => {
  if (!form.judulPekerjaan.trim()) return "Judul Pekerjaan wajib diisi."
  if (!form.urlLowongan.trim()) return "URL Lowongan wajib diisi."
  if (!form.deskripsiPekerjaan.trim()) return "Deskripsi Pekerjaan wajib diisi."
  if (deskripsiWordCount.value < 100) return "Deskripsi Pekerjaan minimal 100 kata."
  if (!form.jabatanKbji) return "Jabatan sesuai KBJI wajib dipilih."
  if (!form.provinsi || !form.kota || !form.kecamatan || !form.kelurahan) return "Provinsi, Kota, Kecamatan, dan Kelurahan wajib dipilih."
  if (!form.jenisPekerjaan) return "Jenis Pekerjaan wajib dipilih."
  if (!form.bidangPekerjaan) return "Bidang Pekerjaan wajib dipilih."
  if (!form.industriSektor) return "Industri/Sektor wajib dipilih."
  if (!form.kondisiFisik.length) return "Kondisi Fisik wajib dipilih."
  if (!form.jenisKelamin.length) return "Jenis Kelamin wajib dipilih."
  if (!form.gajiMin || !form.gajiMax) return "Rentang Gaji wajib diisi."
  if (Number(form.gajiMin) > Number(form.gajiMax)) return "Gaji minimum tidak boleh lebih besar dari gaji maksimum."
  if (!form.tanggalTayangLoker) return "Tanggal Tayang Loker wajib diisi."
  if (!form.lamaExpiredLoker) return "Lama Expired Loker wajib dipilih."
  return ""
}

const validateStep2 = () => {
  if (!requirementForm.minimalPendidikan) return "Minimal Pendidikan wajib dipilih."
  if (!requirementForm.pengalamanDibutuhkan) return "Pengalaman Dibutuhkan wajib dipilih."
  if (!requirementForm.statusPernikahan.length) return "Status Pernikahan wajib dipilih."
  if (!requirementForm.usiaMin || !requirementForm.usiaMax) return "Rentang Usia wajib diisi."
  if (Number(requirementForm.usiaMin) > Number(requirementForm.usiaMax)) return "Usia maksimum tidak boleh lebih kecil dari usia minimum."
  if (!requirementForm.kualifikasi.trim()) return "Kualifikasi / Requirements wajib diisi."
  return ""
}

const goToPreviousStep = () => {
  if (currentStep.value === 5) {
    currentStep.value = 4
  } else if (currentStep.value === 4) {
    currentStep.value = 3
  } else if (currentStep.value === 3) {
    currentStep.value = 2
  } else {
    currentStep.value = 1
  }
  submitError.value = ""
  submitMessage.value = ""
}

const handleStep1Next = () => {
  submitError.value = ""
  submitMessage.value = ""
  const error = validateStep1()
  if (error) {
    submitError.value = error
    return
  }
  showStep1ConfirmModal.value = true
}

const cancelStep1Confirm = () => {
  showStep1ConfirmModal.value = false
}

const confirmStep1Continue = () => {
  showStep1ConfirmModal.value = false
  currentStep.value = 2
  submitError.value = ""
  submitMessage.value = ""
}

const handleStep2Next = () => {
  submitError.value = ""
  submitMessage.value = ""
  const error = validateStep2()
  if (error) {
    submitError.value = error
    return
  }
  currentStep.value = 3
}

const addSelectedSkill = () => {
  const skill = selectedSkill.value.trim()
  if (!skill) return
  if (!addedSkills.value.includes(skill)) {
    addedSkills.value = [...addedSkills.value, skill]
  }
  selectedSkill.value = ""
}

const removeSkill = (skill: string) => {
  addedSkills.value = addedSkills.value.filter((item) => item !== skill)
}

const handleStep3Next = () => {
  submitError.value = ""
  submitMessage.value = ""
  if (!addedSkills.value.length) {
    submitError.value = "Pilih minimal satu keahlian terlebih dahulu."
    return
  }
  currentStep.value = 4
}

const handleStep4Next = () => {
  submitError.value = ""
  submitMessage.value = ""
  if (!companyInfoForm.namaPerusahaan.trim()) {
    submitError.value = "Nama perusahaan wajib diisi."
    return
  }
  if (!companyInfoForm.sektor.trim()) {
    submitError.value = "Sektor wajib dipilih."
    return
  }
  if (!companyInfoForm.kontakPerusahaan.trim()) {
    submitError.value = "Kontak perusahaan wajib diisi."
    return
  }
  if (!companyInfoForm.emailPerusahaan.trim()) {
    submitError.value = "Email perusahaan wajib diisi."
    return
  }
  if (!companyInfoForm.websitePerusahaan.trim()) {
    submitError.value = "Website perusahaan wajib diisi."
    return
  }
  if (!companyInfoForm.lokasiPerusahaan.trim()) {
    submitError.value = "Lokasi perusahaan wajib diisi."
    return
  }
  if (!companyInfoForm.deskripsiPerusahaan.trim()) {
    submitError.value = "Deskripsi perusahaan wajib diisi."
    return
  }
  currentStep.value = 5
}

const handleStep5Submit = () => {
  submitError.value = ""
  submitMessage.value = ""
  if (!isAgreedTerms.value) {
    submitError.value = "Anda harus menyetujui syarat dan ketentuan terlebih dahulu."
    return
  }
  if (import.meta.client) {
    const locationText = [form.kelurahan, form.kecamatan, form.kota, form.provinsi].filter(Boolean).join(", ")
    const pendingVacancy: PendingVacancyRecord = {
      id: Date.now(),
      title: form.judulPekerjaan.trim(),
      location: locationText || "Lokasi belum tersedia",
      status: "Menunggu Verifikasi",
      createdAt: new Date().toISOString(),
    }
    try {
      const existingRaw = localStorage.getItem(pendingVacancyStorageKey)
      const existingRecords = existingRaw ? (JSON.parse(existingRaw) as PendingVacancyRecord[]) : []
      const updatedRecords = [pendingVacancy, ...existingRecords]
      localStorage.setItem(pendingVacancyStorageKey, JSON.stringify(updatedRecords))
    } catch {
      // Silent fail to keep submit flow intact.
    }
  }
  submitMessage.value = "Lowongan berhasil dibuat."
  void router.push("/dasbor_pemberi_kerja_sidebar")
}

const resetStep1Form = () => {
  form.judulPekerjaan = ""
  form.urlLowongan = ""
  form.deskripsiPekerjaan = ""
  form.jabatanKbji = ""
  form.provinsi = ""
  form.kota = ""
  form.kecamatan = ""
  form.kelurahan = ""
  form.jenisPekerjaan = ""
  form.bidangPekerjaan = ""
  form.industriSektor = ""
  form.kondisiFisik = []
  form.disabilitasTidakDiizinkan = []
  form.jenisKelamin = []
  form.gajiMin = ""
  form.gajiMax = ""
  form.tampilGaji = false
  form.bolehRemote = false
  form.dapatSahamEkuitas = false
  form.terbatas = false
  form.tanggalTayangLoker = ""
  form.lamaExpiredLoker = ""
  form.jumlahLowongan = ""
  submitError.value = ""
  submitMessage.value = ""
  wilayahError.value = ""
  showStep1ConfirmModal.value = false
  selectedSkill.value = ""
  addedSkills.value = []
  isAgreedTerms.value = false
  resetKotaDownstream()
}

onMounted(() => {
  void loadProvinsiOptions()
})
</script>

<template>
  <div class="job-page">
    <section class="step-banner">
      <p>Ikuti langkah - langkah berikut untuk mempublish lowongan.</p>
      <div class="step-row">
        <div v-for="(step, index) in postingSteps" :key="step" class="step-item" :class="{ active: currentStep === index + 1 }">
          <span class="step-number">{{ index + 1 }}</span>
          <span class="step-text">{{ step }}</span>
        </div>
      </div>
    </section>


    <form
      class="job-panel"
      @submit.prevent="
        currentStep === 1
          ? handleStep1Next()
          : currentStep === 2
            ? handleStep2Next()
            : currentStep === 3
              ? handleStep3Next()
              : currentStep === 4
                ? handleStep4Next()
                : handleStep5Submit()
      "
    >
      <template v-if="currentStep === 1">
        <div class="field-grid">
          <label class="field full required">
            <span>Judul Pekerjaan</span>
            <input v-model="form.judulPekerjaan" type="text" required />
          </label>

          <label class="field full required">
            <span>Deskripsi Pekerjaan</span>
            <textarea v-model="form.deskripsiPekerjaan" rows="5" required />
            <small class="hint">Minimal 100 kata. Saat ini: {{ deskripsiWordCount }} kata.</small>
          </label>

          <label class="field full required">
            <span>Jabatan sesuai KBJI</span>
            <select v-model="form.jabatanKbji" required>
              <option disabled value="">Pilih jabatan sesuai KBJI</option>
              <option v-for="item in jabatanKbjiOptions" :key="item" :value="item">{{ item }}</option>
            </select>
          </label>

          <label class="field required">
            <span>Provinsi</span>
            <select v-model="form.provinsi" :disabled="isLoadingProvinsi" required @change="handleProvinsiChange">
              <option disabled value="">Pilih provinsi</option>
              <option v-for="item in provinsiOptions" :key="item.id" :value="item.name">{{ item.name }}</option>
            </select>
          </label>

          <label class="field required">
            <span>Kota</span>
            <select v-model="form.kota" :disabled="isLoadingKota || !kotaOptions.length" required @change="handleKotaChange">
              <option disabled value="">Pilih kota</option>
              <option v-for="item in kotaOptions" :key="item.id" :value="item.name">{{ item.name }}</option>
            </select>
          </label>

          <label class="field required">
            <span>Kecamatan</span>
            <select v-model="form.kecamatan" :disabled="isLoadingKecamatan || !kecamatanOptions.length" required @change="handleKecamatanChange">
              <option disabled value="">Pilih kecamatan</option>
              <option v-for="item in kecamatanOptions" :key="item.id" :value="item.name">{{ item.name }}</option>
            </select>
          </label>

          <label class="field required">
            <span>Kelurahan</span>
            <select v-model="form.kelurahan" :disabled="isLoadingKelurahan || !kelurahanOptions.length" required>
              <option disabled value="">Pilih kelurahan</option>
              <option v-for="item in kelurahanOptions" :key="item.id" :value="item.name">{{ item.name }}</option>
            </select>
          </label>

          <label class="field required">
            <span>Jenis Pekerjaan</span>
            <select v-model="form.jenisPekerjaan" required>
              <option disabled value="">Pilih jenis pekerjaan</option>
              <option v-for="item in jenisPekerjaanOptions" :key="item" :value="item">{{ item }}</option>
            </select>
          </label>

          <label class="field required">
            <span>Bidang Pekerjaan</span>
            <select v-model="form.bidangPekerjaan" required>
              <option disabled value="">Pilih bidang pekerjaan</option>
              <option v-for="item in bidangPekerjaanOptions" :key="item" :value="item">{{ item }}</option>
            </select>
          </label>

          <label class="field required">
            <span>Industri / Sektor</span>
            <select v-model="form.industriSektor" required>
              <option disabled value="">Pilih industri/sektor</option>
              <option v-for="item in industriSektorOptions" :key="item" :value="item">{{ item }}</option>
            </select>
          </label>

          <label class="field required">
            <span>URL Lowongan</span>
            <input v-model="form.urlLowongan" type="url" placeholder="https://contoh-lowongan.com" required />
          </label>

          <div class="field required">
            <span>Kondisi Fisik</span>
            <div class="checkbox-wrap">
              <label class="check-item">
                <input type="checkbox" :checked="form.kondisiFisik.includes('Disabilitas')" @change="toggleKondisiFisik('Disabilitas')" />
                <span>Disabilitas</span>
              </label>
              <label class="check-item">
                <input
                  type="checkbox"
                  :checked="form.kondisiFisik.includes('Non Disabilitas')"
                  @change="toggleKondisiFisik('Non Disabilitas')"
                />
                <span>Non Disabilitas</span>
              </label>
            </div>
          </div>

          <div class="field required">
            <span>Jenis Kelamin</span>
            <div class="checkbox-wrap">
              <label class="check-item">
                <input type="checkbox" :checked="form.jenisKelamin.includes('Laki-laki')" @change="toggleJenisKelamin('Laki-laki')" />
                <span>Laki-laki</span>
              </label>
              <label class="check-item">
                <input type="checkbox" :checked="form.jenisKelamin.includes('Perempuan')" @change="toggleJenisKelamin('Perempuan')" />
                <span>Perempuan</span>
              </label>
            </div>
          </div>

          <div v-if="isDisabilitasChecked" class="field full">
            <span>Pilih jenis disabilitas yang tidak diperbolehkan untuk melamar:</span>
            <div class="checkbox-wrap">
              <label v-for="item in disabilitasTypeOptions" :key="item" class="check-item">
                <input
                  type="checkbox"
                  :checked="form.disabilitasTidakDiizinkan.includes(item)"
                  @change="toggleDisabilitasTidakDiizinkan(item)"
                />
                <span>{{ item }}</span>
              </label>
            </div>
          </div>

          <div class="field full required">
            <span>Rentang Gaji</span>
            <div class="salary-range">
              <input
                v-model="form.gajiMin"
                type="text"
                inputmode="numeric"
                placeholder="Gaji minimum"
                required
                @input="sanitizeNumberField('gajiMin', $event)"
              />
              <span class="range-separator">s/d</span>
              <input
                v-model="form.gajiMax"
                type="text"
                inputmode="numeric"
                placeholder="Gaji maksimum"
                required
                @input="sanitizeNumberField('gajiMax', $event)"
              />
            </div>
          </div>

          <div class="field full">
            <label class="single-check">
              <input v-model="form.tampilGaji" type="checkbox" />
              <span>Tampilkan Gaji</span>
            </label>
            <small class="hint">Jika tercentang maka rentang gaji akan ditampilkan ke pelamar.</small>
          </div>

          <div class="field full">
            <label class="single-check">
              <input v-model="form.bolehRemote" type="checkbox" />
              <span>Boleh Remote</span>
            </label>
            <small class="hint">Aktif jika lowongan dapat dikerjakan jarak jauh.</small>
          </div>

          <div class="field full">
            <label class="single-check">
              <input v-model="form.dapatSahamEkuitas" type="checkbox" />
              <span>Dapat Saham / Ekuitas</span>
            </label>
            <small class="hint">Aktif jika ada opsi kompensasi berupa saham/ekuitas.</small>
          </div>

          <div class="field full">
            <label class="single-check">
              <input v-model="form.terbatas" type="checkbox" />
              <span>Terbatas</span>
            </label>
            <small class="hint">Aktif jika kuota atau akses loker dibatasi.</small>
          </div>

          <div class="field full">
            <div class="field-grid-three">
              <label class="field required">
                <span>Tanggal Tayang Loker</span>
                <input v-model="form.tanggalTayangLoker" type="date" required />
              </label>
              <label class="field required">
                <span>Lama Expired Loker</span>
                <select v-model="form.lamaExpiredLoker" required>
                  <option disabled value="">Pilih lama expired</option>
                  <option v-for="item in expiredOptions" :key="item" :value="item">{{ item }}</option>
                </select>
              </label>
              <label class="field">
                <span>Jumlah Lowongan</span>
                <input
                  v-model="form.jumlahLowongan"
                  type="text"
                  inputmode="numeric"
                  placeholder="Contoh: 5"
                  @input="sanitizeNumberField('jumlahLowongan', $event)"
                />
              </label>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="currentStep === 2">
        <section class="requirement-section">
          <h3>Persyaratan Umum</h3>
          <p>Masukkan persyaratan umum untuk dasar penyaringan lamaran.</p>

          <div class="field-grid">
            <label class="field required">
              <span>Minimal Pendidikan</span>
              <select v-model="requirementForm.minimalPendidikan" required>
                <option disabled value="">Pilih minimal pendidikan</option>
                <option v-for="item in minimalPendidikanOptions" :key="item" :value="item">{{ item }}</option>
              </select>
            </label>

            <label class="field required">
              <span>Pengalaman Dibutuhkan</span>
              <select v-model="requirementForm.pengalamanDibutuhkan" required>
                <option disabled value="">Pilih pengalaman dibutuhkan</option>
                <option v-for="item in pengalamanOptions" :key="item" :value="item">{{ item }}</option>
              </select>
            </label>

            <div class="field required">
              <span>Status Pernikahan</span>
              <div class="checkbox-wrap">
                <label class="check-item">
                  <input
                    type="checkbox"
                    :checked="requirementForm.statusPernikahan.includes('Single / Belum Menikah')"
                    @change="toggleStatusPernikahan('Single / Belum Menikah')"
                  />
                  <span>Single / Belum Menikah</span>
                </label>
                <label class="check-item">
                  <input
                    type="checkbox"
                    :checked="requirementForm.statusPernikahan.includes('Sudah Menikah')"
                    @change="toggleStatusPernikahan('Sudah Menikah')"
                  />
                  <span>Sudah Menikah</span>
                </label>
              </div>
            </div>

            <div class="field full required">
              <span>Rentang Usia</span>
              <div class="salary-range">
                <input
                  v-model="requirementForm.usiaMin"
                  type="text"
                  inputmode="numeric"
                  placeholder="Usia minimum"
                  @input="sanitizeNumberField('usiaMin', $event)"
                />
                <span class="range-separator">s/d</span>
                <input
                  v-model="requirementForm.usiaMax"
                  type="text"
                  inputmode="numeric"
                  placeholder="Usia maksimum"
                  @input="sanitizeNumberField('usiaMax', $event)"
                />
              </div>
              <small class="hint">Usia maksimum tidak boleh lebih kecil dari usia minimum.</small>
            </div>
          </div>
        </section>

        <section class="requirement-section">
          <h3>Persyaratan Khusus</h3>
          <p>Masukkan persyaratan khusus dan requirment yang kamu butuhkan, seperti keahlian bahasa tertentu.</p>

          <label class="field full required">
            <span>Kualifikasi / Requirments</span>
            <textarea v-model="requirementForm.kualifikasi" rows="6" required />
          </label>
        </section>
      </template>

      <template v-else-if="currentStep === 3">
        <section class="requirement-section">
          <h3>Keahlian</h3>
          <p>Pilih beberapa keahlian yang dibutuhkan untuk lowongan pekerjaan ini.</p>

          <label class="field full">
            <span>Cari Keahlian</span>
            <select v-model="selectedSkill" @change="addSelectedSkill">
              <option value="">Pilih keahlian</option>
              <option v-for="item in skillOptions" :key="item" :value="item">{{ item }}</option>
            </select>
          </label>

          <label class="field full">
            <span>Keahlian Ditambahkan</span>
            <div class="skill-box">
              <div v-if="addedSkills.length" class="skill-chips">
                <span v-for="skill in addedSkills" :key="skill" class="skill-chip">
                  {{ skill }}
                  <button type="button" class="chip-remove" @click="removeSkill(skill)">×</button>
                </span>
              </div>
              <p v-else class="skill-placeholder">Keahlian yang dipilih akan tampil di sini.</p>
            </div>
          </label>
        </section>
      </template>

      <template v-else-if="currentStep === 4">
        <section class="requirement-section">
          <h3>Informasi Perusahaan</h3>
          <p>Lengkapi informasi perusahaan sebagai kontak dan profil rekrutmen lowongan.</p>

          <div class="field-grid">
            <label class="field required">
              <span>Nama Perusahaan</span>
              <input v-model="companyInfoForm.namaPerusahaan" type="text" required />
            </label>

            <label class="field required">
              <span>Sektor</span>
              <select v-model="companyInfoForm.sektor" required>
                <option disabled value="">Pilih sektor</option>
                <option v-for="item in industriSektorOptions" :key="item" :value="item">{{ item }}</option>
              </select>
            </label>

            <label class="field required">
              <span>Kontak Perusahaan</span>
              <input
                v-model="companyInfoForm.kontakPerusahaan"
                type="text"
                inputmode="numeric"
                required
                @input="companyInfoForm.kontakPerusahaan = companyInfoForm.kontakPerusahaan.replace(/\D/g, '')"
              />
            </label>

            <label class="field required">
              <span>Email Perusahaan</span>
              <input v-model="companyInfoForm.emailPerusahaan" type="email" required />
            </label>

            <label class="field full required">
              <span>Website Perusahaan</span>
              <input v-model="companyInfoForm.websitePerusahaan" type="text" placeholder="https://contoh-perusahaan.com" />
            </label>

            <label class="field full required">
              <span>Lokasi Perusahaan</span>
              <input v-model="companyInfoForm.lokasiPerusahaan" type="text" placeholder="Masukkan lokasi perusahaan" required />
            </label>

            <div class="field full">
              <span>Google Location</span>
              <div class="map-box">
                <iframe :src="lokasiPerusahaanMapSrc" loading="lazy" referrerpolicy="no-referrer-when-downgrade" />
              </div>
            </div>

            <label class="field full required">
              <span>Deskripsi Perusahaan</span>
              <textarea v-model="companyInfoForm.deskripsiPerusahaan" rows="5" required />
            </label>
          </div>
        </section>
      </template>

      <template v-else>
        <section class="requirement-section">
          <h3>Syarat dan Ketentuan</h3>
          <div class="terms-box">
            <ol class="terms-list">
              <li>
                <p>
                  Ketika membuka lowongan kerja di
                  <a href="https://karirhub.kemnaker.go.id" target="_blank" rel="noopener noreferrer">https://karirhub.kemnaker.go.id</a>
                </p>
                <ol class="terms-sublist">
                  <li>
                    Pemberi kerja adalah perusahaan atau perseorangan yang menyediakan lowongan pekerjaan yang akan
                    ditayangkan di
                    <a href="https://karirhub.kemnaker.go.id" target="_blank" rel="noopener noreferrer">
                      https://karirhub.kemnaker.go.id
                    </a>
                  </li>
                  <li>
                    Pemberi kerja perusahaan atau perseorangan wajib memiliki akun SIAPkerja
                    (<a href="https://account.kemnaker.go.id" target="_blank" rel="noopener noreferrer">
                      https://account.kemnaker.go.id
                    </a>)
                    dan wajib melengkapi data yang dipersyaratkan
                  </li>
                  <li>
                    Pemberi kerja secara sadar memahami data pemberi kerja dan lowongan pekerjaan yang akan ditampilkan
                  </li>
                </ol>
              </li>
              <li>
                Anda wajib melindungi dan menjaga seluruh data individu yang ada pada akun anda, termasuk data anda,
                perusahaan, dan pencari kerja sesuai perundangan yang berlaku.
              </li>
              <li>Konten dan materi lowongan kerja yang dipublikasikan menjadi tanggungjawab pemberi kerja.</li>
              <li>
                Kementerian Ketenagakerjaan berhak Mengelola dan mengolah data yang sudah diberikan pemberi kerja
                untuk kepentingan pelaporan.
              </li>
              <li>
                Kementerian Ketenagakerjaan berhak menghapus dan memblokir akun dan lowongan Kerja yang pemberi
                Kerja posting apabila terindikasi loker hoax.
              </li>
              <li>
                Kementerian Ketenagakerjaan berhak memverifikasi dan menyatakan status lainnya terkait data yang
                diberikan pemberi kerja bilamana ditemukan kesesuaian atau ketidaksesuaian.
              </li>
              <li>
                Apabila ada pergantian pengelola akun, pemberi Kerja wajib melaporkan kepada Kementerian
                Ketenagakerjaan melalui hotline 0811-8712-018
              </li>
            </ol>
          </div>

          <label class="single-check terms-agreement">
            <input v-model="isAgreedTerms" type="checkbox" />
            <span>Saya setuju dengan syarat dan ketentuan diatas.</span>
          </label>
        </section>
      </template>

      <p v-if="wilayahError" class="error-message">{{ wilayahError }}</p>
      <p v-if="submitError" class="error-message">{{ submitError }}</p>
      <p v-if="submitMessage" class="success-message">{{ submitMessage }}</p>

      <div class="actions">
        <template v-if="currentStep === 1">
          <button type="button" class="btn secondary" @click="resetStep1Form">Reset</button>
          <button type="submit" class="btn primary">Selanjutnya</button>
        </template>
        <template v-else-if="currentStep === 2">
          <button type="button" class="btn secondary" @click="goToPreviousStep">Sebelumnya</button>
          <button type="submit" class="btn primary" :disabled="!isStep2MandatoryValid">Selanjutnya</button>
        </template>
        <template v-else-if="currentStep === 3">
          <button type="button" class="btn secondary" @click="goToPreviousStep">Sebelumnya</button>
          <button type="submit" class="btn primary">Selanjutnya</button>
        </template>
        <template v-else-if="currentStep === 4">
          <button type="button" class="btn secondary" @click="goToPreviousStep">Sebelumnya</button>
          <button type="submit" class="btn primary" :disabled="!isStep4MandatoryValid">Selanjutnya</button>
        </template>
        <template v-else>
          <button type="button" class="btn secondary" @click="goToPreviousStep">Sebelumnya</button>
          <button type="submit" class="btn primary" :disabled="!isAgreedTerms">Buat Lowongan</button>
        </template>
      </div>
    </form>

    <Teleport to="body">
      <div v-if="showStep1ConfirmModal" class="confirm-overlay" @click.self="cancelStep1Confirm">
        <section class="confirm-modal">
          <h3>Konfirmasi</h3>
          <p>
            Pastikan informasi lowongan sudah benar! Sebagai catatan lowongan akan ditayangkan pada tanggal:
            {{ formattedTanggalTayang }}. Apakah Anda yakin untuk melanjutkan ke tahapan selanjutnya?
          </p>
          <div class="confirm-actions">
            <button type="button" class="btn primary" @click="confirmStep1Continue">Lanjutkan</button>
            <button type="button" class="btn secondary" @click="cancelStep1Confirm">Batal</button>
          </div>
        </section>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.job-page {
  padding: 10px 0 2px;
}

.step-banner {
  margin: -10px -18px 14px;
  padding: 18px 18px 14px;
  background: linear-gradient(180deg, #0f426f 0%, #0d3a62 100%);
  border-radius: 0 0 10px 10px;
}

.step-banner p {
  margin: 0;
  color: #f0f7ff;
  font-size: 14px;
  font-weight: 600;
}

.step-row {
  margin-top: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.step-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(186, 212, 236, 0.55);
  font-size: 14px;
  font-weight: 700;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(124, 162, 194, 0.4);
}

.step-item.active {
  color: #ffffff;
}

.step-item.active .step-number {
  background: #ffffff;
  border-color: #ffffff;
  color: #0f426f;
}

.job-header h1 {
  margin: 0;
  color: #12395d;
  font-size: 26px;
  letter-spacing: 0.2px;
}

.job-header p {
  margin: 6px 0 0;
  color: #64778d;
  font-size: 12px;
}

.job-panel {
  margin-top: 14px;
  border: 1px solid #dfe8f3;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 14px 28px rgba(20, 54, 92, 0.08);
  padding: 16px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 14px;
}

.field {
  display: grid;
  gap: 6px;
}

.field span {
  font-size: 12px;
  color: #294766;
  font-weight: 700;
}

.field.required > span::after {
  content: " *";
  color: #dc2626;
}

.field input:not([type="checkbox"]),
.field select,
.field textarea {
  width: 100%;
  border: 1px solid #c9d7e5;
  border-radius: 10px;
  padding: 9px 12px;
  font-size: 12px;
  color: #12395d;
  background: #fff;
}

.field input:not([type="checkbox"]):focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: #3e8bff;
  box-shadow: 0 0 0 3px rgba(62, 139, 255, 0.18);
}

.field textarea {
  resize: vertical;
}

.hint {
  font-size: 11px;
  color: #5b6f86;
}

.full {
  grid-column: 1 / -1;
}

.checkbox-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
}

.check-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #d7e2ef;
  border-radius: 8px;
  padding: 6px 10px;
  background: #f8fbff;
  font-size: 12px;
  color: #1f3650;
}

.salary-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.single-check {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #173754;
}

.single-check input,
.check-item input {
  width: 14px;
  height: 14px;
  margin: 0;
  accent-color: #0d6efd;
  flex: 0 0 auto;
}

.field-grid-three {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.range-separator {
  color: #5e7087;
  font-size: 12px;
  font-weight: 600;
}

.requirement-section + .requirement-section {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid #e6eef7;
}

.requirement-section h3 {
  margin: 0;
  color: #12395d;
  font-size: 20px;
}

.requirement-section p {
  margin: 6px 0 12px;
  color: #5d7187;
  font-size: 12px;
}

.terms-box {
  border: 1px solid #d0d6de;
  border-radius: 10px;
  background: #e5e7eb;
  padding: 14px 16px;
  max-height: 460px;
  overflow-y: auto;
}

.terms-list {
  margin: 0;
  padding-left: 28px;
  display: grid;
  gap: 18px;
  color: #3f4954;
  font-size: 14px;
  line-height: 1.55;
  font-weight: 700;
}

.terms-list p {
  margin: 0 0 8px;
}

.terms-list a {
  color: #163f72;
  text-decoration: none;
}

.terms-sublist {
  list-style: lower-alpha;
  margin: 8px 0 0;
  padding-left: 28px;
  display: grid;
  gap: 6px;
}

.terms-sublist li {
  font-weight: 600;
}

.terms-agreement {
  margin-top: 14px;
}

.skill-box {
  border: 1px solid #c9d7e5;
  border-radius: 10px;
  min-height: 84px;
  padding: 10px;
  background: #fff;
}

.skill-placeholder {
  margin: 0;
  color: #8a9db1;
  font-size: 12px;
}

.skill-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #e8f2ff;
  color: #164b86;
  border: 1px solid #c7ddfb;
  border-radius: 999px;
  padding: 4px 9px;
  font-size: 11px;
  font-weight: 700;
}

.chip-remove {
  border: 0;
  background: transparent;
  color: #164b86;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 0;
}

.map-box {
  border: 1px solid #d8e4f0;
  border-radius: 10px;
  overflow: hidden;
  min-height: 210px;
}

.map-box iframe {
  width: 100%;
  height: 210px;
  border: 0;
}

.success-message {
  margin: 14px 0 0;
  color: #0f766e;
  font-size: 12px;
  font-weight: 700;
}

.error-message {
  margin: 12px 0 0;
  color: #dc2626;
  font-size: 12px;
  font-weight: 700;
}

.actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn {
  height: 38px;
  border-radius: 9px;
  padding: 0 14px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.btn.secondary {
  border: 1px solid #c9d7e5;
  background: #fff;
  color: #1e3b59;
}

.btn.primary {
  border: 1px solid #0d6efd;
  background: linear-gradient(180deg, #2e8cff 0%, #0d6efd 100%);
  color: #fff;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(7, 22, 40, 0.5);
  display: grid;
  place-items: center;
  z-index: 9999;
  padding: 16px;
}

.confirm-modal {
  width: min(560px, 100%);
  background: #fff;
  border-radius: 12px;
  border: 1px solid #d7e3f0;
  box-shadow: 0 20px 36px rgba(16, 45, 75, 0.26);
  padding: 18px;
}

.confirm-modal h3 {
  margin: 0;
  color: #13395f;
  font-size: 24px;
}

.confirm-modal p {
  margin: 10px 0 0;
  color: #4f6783;
  font-size: 14px;
  line-height: 1.5;
}

.confirm-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

@media (max-width: 900px) {
  .step-banner {
    margin-left: -12px;
    margin-right: -12px;
  }

  .field-grid {
    grid-template-columns: 1fr;
  }

  .salary-range {
    flex-direction: column;
    align-items: stretch;
  }

  .field-grid-three {
    grid-template-columns: 1fr;
  }

  .actions,
  .confirm-actions {
    flex-direction: column;
  }
}
</style>
