<script setup lang="ts">
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

const route = useRoute()
const maxUploadSize = 2 * 1024 * 1024
const wilayahApiBaseUrl = "https://www.emsifa.com/api-wilayah-indonesia/api"

const fixedNamaInstansi = "Kementerian Ketenagakerjaan"

const form = ref<InstansiForm>({
  namaInstansi: fixedNamaInstansi,
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

const tanggalBerdiriPicker = ref("")
const submitError = ref("")
const submitSuccess = ref("")
const showSubmitConfirmation = ref(false)
const wilayahError = ref("")
const logoError = ref("")
const dokumenError = ref("")

const logoFile = ref<File | null>(null)
const dokumenFile = ref<File | null>(null)
const logoPreviewUrl = ref("")
const dokumenUrl = ref("")

const isLoadingProvinsi = ref(false)
const isLoadingKabupaten = ref(false)
const isLoadingKecamatan = ref(false)
const isLoadingKelurahan = ref(false)

const provinsiOptions = ref<RegionOption[]>([])
const kabupatenOptions = ref<RegionOption[]>([])
const kecamatanOptions = ref<RegionOption[]>([])
const kelurahanOptions = ref<RegionOption[]>([])

const formatDateToDdMmYyyy = (rawDate: string) => {
  if (!rawDate) return ""
  const [year, month, day] = rawDate.split("-")
  if (!year || !month || !day) return ""
  return `${day}/${month}/${year}`
}

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

const resetKabupatenDownstream = () => {
  form.value.kabupatenKota = ""
  form.value.kecamatan = ""
  form.value.kelurahan = ""
  kabupatenOptions.value = []
  kecamatanOptions.value = []
  kelurahanOptions.value = []
}

const resetKecamatanDownstream = () => {
  form.value.kecamatan = ""
  form.value.kelurahan = ""
  kecamatanOptions.value = []
  kelurahanOptions.value = []
}

const resetKelurahanDownstream = () => {
  form.value.kelurahan = ""
  kelurahanOptions.value = []
}

const handleProvinsiChange = async () => {
  resetKabupatenDownstream()
  if (!form.value.provinsi) return
  const selectedProvinsi = provinsiOptions.value.find((option) => option.name === form.value.provinsi)
  if (!selectedProvinsi) return

  isLoadingKabupaten.value = true
  wilayahError.value = ""
  try {
    kabupatenOptions.value = await fetchWilayah(`regencies/${selectedProvinsi.id}.json`)
  } catch {
    wilayahError.value = "Gagal memuat data kabupaten/kota."
  } finally {
    isLoadingKabupaten.value = false
  }
}

const handleKabupatenChange = async () => {
  resetKecamatanDownstream()
  if (!form.value.kabupatenKota) return
  const selectedKabupaten = kabupatenOptions.value.find((option) => option.name === form.value.kabupatenKota)
  if (!selectedKabupaten) return

  isLoadingKecamatan.value = true
  wilayahError.value = ""
  try {
    kecamatanOptions.value = await fetchWilayah(`districts/${selectedKabupaten.id}.json`)
  } catch {
    wilayahError.value = "Gagal memuat data kecamatan."
  } finally {
    isLoadingKecamatan.value = false
  }
}

const handleKecamatanChange = async () => {
  resetKelurahanDownstream()
  if (!form.value.kecamatan) return
  const selectedKecamatan = kecamatanOptions.value.find((option) => option.name === form.value.kecamatan)
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

const sanitizeNumericField = (
  field: "kodePos" | "nomorTeleponInstansi" | "nomorTeleponAdminPengelola" | "nomorTeleponAlternatif",
  event: Event,
) => {
  const input = event.target as HTMLInputElement
  form.value[field] = input.value.replace(/\D/g, "")
}

const handleTanggalBerdiriChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  tanggalBerdiriPicker.value = input.value
  form.value.tanggalBerdiri = formatDateToDdMmYyyy(input.value)
}

const handleLogoChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const lowerName = file.name.toLowerCase()
  const isAllowed = lowerName.endsWith(".png") || lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")
  if (!isAllowed) {
    logoError.value = "Logo hanya boleh PNG/JPG."
    input.value = ""
    return
  }
  if (file.size > maxUploadSize) {
    logoError.value = "Ukuran logo maksimal 2MB."
    input.value = ""
    return
  }

  logoError.value = ""
  logoFile.value = file
  logoPreviewUrl.value = URL.createObjectURL(file)
}

const handleDokumenChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (file.size > maxUploadSize) {
    dokumenError.value = "Ukuran dokumen maksimal 2MB."
    input.value = ""
    return
  }

  dokumenError.value = ""
  dokumenFile.value = file
  dokumenUrl.value = URL.createObjectURL(file)
}

const submitForm = () => {
  submitError.value = ""
  submitSuccess.value = ""

  if (!form.value.namaInstansi.trim()) {
    submitError.value = "Nama Instansi wajib tersedia."
    return
  }
  if (!form.value.tanggalBerdiri.trim()) {
    submitError.value = "Tanggal Berdiri wajib diisi."
    return
  }
  if (!logoFile.value && !logoPreviewUrl.value) {
    submitError.value = "Logo Instansi wajib diupload."
    return
  }
  if (!dokumenFile.value && !dokumenUrl.value) {
    submitError.value = "Dokumen Pendukung Tambahan wajib diupload."
    return
  }

  showSubmitConfirmation.value = true
}

const confirmSubmitForm = () => {
  submitError.value = ""
  submitSuccess.value = "Data instansi berhasil disimpan."
  showSubmitConfirmation.value = false
}

const cancelSubmitConfirmation = () => {
  showSubmitConfirmation.value = false
}

onMounted(() => {
  void loadProvinsiOptions()
})
</script>

<template>
  <div class="instansi-page">
    <main class="page-shell">
      <section class="page-header">
        <h1>Form Pengisian Data Instansi</h1>
        <p>Lengkapi data instansi secara lengkap untuk mendapatkan akses sebagai pemberi kerja.</p>
      </section>

      <form class="panel" @submit.prevent="submitForm">
        <div class="field-grid">
          <label class="field required">
            <span>Nama Instansi</span>
            <input v-model="form.namaInstansi" type="text" readonly disabled required />
          </label>
          <label class="field required">
            <span>Tanggal Berdiri</span>
            <input :value="tanggalBerdiriPicker" type="date" required @change="handleTanggalBerdiriChange" />
            <small class="hint">
              {{ form.tanggalBerdiri ? `Format tersimpan: ${form.tanggalBerdiri}` : "Format: dd/mm/yyyy" }}
            </small>
          </label>

          <label class="field required">
            <span>Alamat Instansi</span>
            <input v-model="form.alamatInstansi" type="text" required />
          </label>
          <label class="field required">
            <span>Provinsi</span>
            <select v-model="form.provinsi" :disabled="isLoadingProvinsi" required @change="handleProvinsiChange">
              <option disabled value="">Pilih Provinsi</option>
              <option v-for="option in provinsiOptions" :key="option.id" :value="option.name">
                {{ option.name }}
              </option>
            </select>
          </label>

          <label class="field required">
            <span>Kabupaten/Kota</span>
            <select v-model="form.kabupatenKota" :disabled="isLoadingKabupaten || !kabupatenOptions.length" required @change="handleKabupatenChange">
              <option disabled value="">Pilih Kabupaten/Kota</option>
              <option v-for="option in kabupatenOptions" :key="option.id" :value="option.name">
                {{ option.name }}
              </option>
            </select>
          </label>
          <label class="field required">
            <span>Kecamatan</span>
            <select v-model="form.kecamatan" :disabled="isLoadingKecamatan || !kecamatanOptions.length" required @change="handleKecamatanChange">
              <option disabled value="">Pilih Kecamatan</option>
              <option v-for="option in kecamatanOptions" :key="option.id" :value="option.name">
                {{ option.name }}
              </option>
            </select>
          </label>

          <label class="field required">
            <span>Kelurahan</span>
            <select v-model="form.kelurahan" :disabled="isLoadingKelurahan || !kelurahanOptions.length" required>
              <option disabled value="">Pilih Kelurahan</option>
              <option v-for="option in kelurahanOptions" :key="option.id" :value="option.name">
                {{ option.name }}
              </option>
            </select>
          </label>
          <label class="field required">
            <span>Kode Pos</span>
            <input v-model="form.kodePos" type="text" inputmode="numeric" pattern="[0-9]*" required @input="sanitizeNumericField('kodePos', $event)" />
          </label>

          <label class="field required">
            <span>Nomor Telepon Instansi</span>
            <input
              v-model="form.nomorTeleponInstansi"
              type="text"
              inputmode="tel"
              required
              @input="sanitizeNumericField('nomorTeleponInstansi', $event)"
            />
          </label>
          <label class="field required">
            <span>Email Resmi Instansi</span>
            <input v-model="form.emailResmiInstansi" type="email" required />
          </label>

          <label class="field required">
            <span>Situs Web</span>
            <input v-model="form.situsWeb" type="text" required />
          </label>
          <label class="field required">
            <span>Lokasi</span>
            <input v-model="form.lokasi" type="text" required />
          </label>

          <label class="field required full">
            <span>Deskripsi Singkat</span>
            <textarea v-model="form.deskripsiSingkat" rows="3" required />
          </label>

          <label class="field required full">
            <span>Logo Instansi (PNG/JPG max 2MB)</span>
            <input type="file" accept=".png,.jpg,.jpeg,image/png,image/jpeg" @change="handleLogoChange" />
            <small v-if="logoError" class="error">{{ logoError }}</small>
            <img v-if="logoPreviewUrl" :src="logoPreviewUrl" alt="Preview logo" class="logo-preview" />
          </label>

          <label class="field required">
            <span>Nama Admin Pengelola</span>
            <input v-model="form.namaAdminPengelola" type="text" required />
          </label>
          <label class="field required">
            <span>Nomor Telepon Admin Pengelola (WhatsApp)</span>
            <input
              v-model="form.nomorTeleponAdminPengelola"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              required
              @input="sanitizeNumericField('nomorTeleponAdminPengelola', $event)"
            />
          </label>

          <label class="field required">
            <span>Nomor Telepon Alternatif</span>
            <input
              v-model="form.nomorTeleponAlternatif"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              required
              @input="sanitizeNumericField('nomorTeleponAlternatif', $event)"
            />
          </label>
          <label class="field required">
            <span>Email Admin Pengelola (SiapKerja)</span>
            <input v-model="form.emailAdminPengelola" type="email" required />
          </label>

          <label class="field required full">
            <span>Dokumen Pendukung Tambahan (max 2MB)</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              @change="handleDokumenChange"
            />
            <small v-if="dokumenError" class="error">{{ dokumenError }}</small>
            <a v-if="dokumenUrl" :href="dokumenUrl" :download="dokumenFile?.name || 'dokumen-pendukung'" class="doc-link">
              Download {{ dokumenFile?.name || "dokumen" }}
            </a>
          </label>
        </div>

        <p v-if="wilayahError" class="error global-error">{{ wilayahError }}</p>
        <p v-if="submitError" class="error global-error">{{ submitError }}</p>
        <p v-if="submitSuccess" class="success global-success">{{ submitSuccess }}</p>

        <div class="actions">
          <button type="button" class="btn secondary" @click="navigateTo('/')">Cancel</button>
          <button type="submit" class="btn primary">Submit</button>
        </div>
      </form>

      <div v-if="showSubmitConfirmation" class="confirm-overlay" @click.self="cancelSubmitConfirmation">
        <section class="confirm-modal">
          <h3>Konfirmasi Data</h3>
          <p>Apakah Anda yakin semua data yang diinput sudah benar dan siap disubmit?</p>
          <div class="confirm-actions">
            <button type="button" class="btn secondary" @click="cancelSubmitConfirmation">Periksa Lagi</button>
            <button type="button" class="btn primary" @click="confirmSubmitForm">Ya, Submit</button>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
:global(body) {
  margin: 0;
  font-family: "Inter", "Segoe UI", Arial, sans-serif;
  background: #f4f6f9;
}

.instansi-page {
  min-height: 100dvh;
  background: linear-gradient(180deg, #0a3866 0 165px, #f4f6f9 165px 100%);
}

.page-shell {
  max-width: 1120px;
  margin: 0 auto;
  padding: 22px 18px 34px;
}

.page-header {
  margin-bottom: 14px;
}

.page-header h1 {
  margin: 0;
  font-size: 36px;
  color: #ffffff;
  font-weight: 800;
  letter-spacing: -0.3px;
}

.page-header p {
  margin: 8px 0 0;
  color: #ffffff;
  font-size: 13px;
}

.panel {
  background: #fff;
  border: 1px solid #dce6f2;
  border-radius: 8px;
  box-shadow: 0 3px 12px rgba(19, 48, 74, 0.08);
  padding: 18px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 14px;
}

.field {
  display: grid;
  gap: 5px;
}

.field span {
  font-size: 11px;
  color: #264664;
  font-weight: 600;
}

.field.required > span::after {
  content: " *";
  color: #db2b3e;
  font-weight: 700;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  border: 1px solid #cfd9e6;
  border-radius: 6px;
  padding: 9px 11px;
  font-size: 12px;
  color: #22384f;
  background: #fff;
  min-height: 37px;
}

.field input:disabled {
  background: #f6f9fc;
  color: #78849a;
}

.field textarea {
  min-height: 82px;
  resize: vertical;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: #2e88b6;
  box-shadow: 0 0 0 3px rgba(46, 136, 182, 0.14);
}

.full {
  grid-column: 1 / -1;
}

.hint {
  color: #6b7a90;
  font-size: 10px;
}

.logo-preview {
  width: 100%;
  max-width: 210px;
  border: 1px solid #d7e1ec;
  border-radius: 8px;
  padding: 6px;
  background: #fff;
}

.doc-link {
  font-size: 12px;
  color: #155f9d;
  text-decoration: underline;
}

.error {
  color: #dc2626;
  font-size: 12px;
  font-weight: 600;
}

.success {
  color: #15803d;
  font-size: 12px;
  font-weight: 600;
}

.global-error,
.global-success {
  margin: 12px 0 0;
}

.actions {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #e6edf4;
  padding-top: 12px;
}

.btn {
  border: 0;
  border-radius: 8px;
  height: 40px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.btn.secondary {
  border: 1px solid #c7d5e3;
  color: #264868;
  background: #fff;
}

.btn.primary {
  background: #1bb3ac;
  border: 1px solid #18aaa3;
  color: #fff;
}

.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(8, 20, 36, 0.48);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 200;
}

.confirm-modal {
  width: min(480px, 100%);
  background: #fff;
  border-radius: 12px;
  border: 1px solid #d8e4f2;
  box-shadow: 0 16px 34px rgba(13, 41, 67, 0.2);
  padding: 20px;
}

.confirm-modal h3 {
  margin: 0;
  font-size: 20px;
  color: #12395f;
}

.confirm-modal p {
  margin: 10px 0 0;
  font-size: 13px;
  color: #4d6784;
  line-height: 1.5;
}

.confirm-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 900px) {
  .field-grid {
    grid-template-columns: 1fr;
  }

  .page-shell {
    padding: 16px 12px 24px;
  }

  .actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .confirm-actions {
    flex-direction: column;
  }
}
</style>
