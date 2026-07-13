<script setup lang="ts">
const form = reactive({
  nib: "",
  npwp: "",
  namaPerusahaan: "",
  tanggalBerdiri: "",
  namaPemilik: "",
  teleponPemilik: "",
  alamatPemilik: "",
  namaPengurus: "",
  teleponPengurus: "",
  alamatPengurus: "",
  jumlahCabangIndonesia: "",
  jumlahCabangLuarNegeri: "",
  kbliSesuaiNib: "",
  kbliUtama: "",
  provinsi: "",
  kota: "",
  kecamatan: "",
  kelurahan: "",
  kodePos: "",
  alamatPerusahaan: "",
  teleponPerusahaan: "",
  emailPerusahaan: "",
  lokasi: "",
  statusKepemilikan: "",
  statusPemodalan: "",
  negara: "Indonesia",
})

const statusKepemilikanOptions = [
  "Swasta",
  "Persero",
  "Perum",
  "Perusahaan Daerah",
  "Yayasan",
  "Koperasi",
  "Perseorangan",
  "Patungan",
]

const statusPemodalanOptions = ["PMDN", "PMA", "Joint Venture"]
const negaraOptions = ["Indonesia"]
const defaultLokasi = "Kementerian Ketenagakerjaan Jakarta"
const savedLokasiQuery = ref(defaultLokasi)

const buildLokasiQuery = () =>
  [form.lokasi, form.alamatPerusahaan, form.kelurahan, form.kecamatan, form.kota, form.provinsi]
    .filter(Boolean)
    .join(", ")
    .trim()

const saveLokasi = () => {
  savedLokasiQuery.value = buildLokasiQuery() || defaultLokasi
}

const updateNib = (event: Event) => {
  const input = event.target as HTMLInputElement
  form.nib = input.value.replace(/\D/g, "")
}

const lokasiMapSrc = computed(() => {
  const encodedQuery = encodeURIComponent(savedLokasiQuery.value)
  return `https://www.google.com/maps?q=${encodedQuery}&output=embed`
})

const resetForm = () => {
  form.nib = ""
  form.npwp = ""
  form.namaPerusahaan = ""
  form.tanggalBerdiri = ""
  form.namaPemilik = ""
  form.teleponPemilik = ""
  form.alamatPemilik = ""
  form.namaPengurus = ""
  form.teleponPengurus = ""
  form.alamatPengurus = ""
  form.jumlahCabangIndonesia = ""
  form.jumlahCabangLuarNegeri = ""
  form.kbliSesuaiNib = ""
  form.kbliUtama = ""
  form.provinsi = ""
  form.kota = ""
  form.kecamatan = ""
  form.kelurahan = ""
  form.kodePos = ""
  form.alamatPerusahaan = ""
  form.teleponPerusahaan = ""
  form.emailPerusahaan = ""
  form.lokasi = ""
  form.statusKepemilikan = ""
  form.statusPemodalan = ""
  form.negara = "Indonesia"
  savedLokasiQuery.value = defaultLokasi
}
</script>

<template>
  <div class="company-page">
    <div class="page-shell">
      <header class="page-header">
        <h1>Profil Perusahaan</h1>
        <p>Lengkapi data profil dan status perusahaan dengan benar.</p>
      </header>

      <form class="form-layout" @submit.prevent>
        <section class="panel">
          <div class="panel-head">
            <h2>Legalitas Perusahaan</h2>
          </div>

          <div class="field-grid">
            <label class="field">
              <span>NIB <small>(Opsional)</small></span>
              <input
                v-model="form.nib"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                placeholder="Masukkan NIB"
                @input="updateNib"
              />
            </label>

            <label class="field">
              <span>NPWP <small>(Opsional)</small></span>
              <input v-model="form.npwp" type="text" placeholder="Masukkan NPWP" />
            </label>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Profil Perusahaan</h2>
          </div>

          <div class="field-grid">
            <label class="field required">
              <span>Nama Perusahaan</span>
              <input v-model="form.namaPerusahaan" type="text" required />
            </label>
            <label class="field required">
              <span>Tanggal Berdiri</span>
              <input v-model="form.tanggalBerdiri" type="date" required />
            </label>

            <label class="field required">
              <span>Nama Pemilik</span>
              <input v-model="form.namaPemilik" type="text" required />
            </label>
            <label class="field required">
              <span>No Telepon Pemilik</span>
              <input v-model="form.teleponPemilik" type="tel" required />
            </label>

            <label class="field field-full required">
              <span>Alamat Pemilik</span>
              <textarea v-model="form.alamatPemilik" rows="2" required />
            </label>

            <label class="field required">
              <span>Nama Pengurus</span>
              <input v-model="form.namaPengurus" type="text" required />
            </label>
            <label class="field required">
              <span>No Telepon Pengurus</span>
              <input v-model="form.teleponPengurus" type="tel" required />
            </label>

            <label class="field field-full required">
              <span>Alamat Pengurus</span>
              <textarea v-model="form.alamatPengurus" rows="2" required />
            </label>

            <label class="field required">
              <span>Jumlah Cabang di Indonesia</span>
              <input v-model="form.jumlahCabangIndonesia" type="number" min="0" required />
            </label>
            <label class="field required">
              <span>Jumlah Cabang di Luar Negeri</span>
              <input v-model="form.jumlahCabangLuarNegeri" type="number" min="0" required />
            </label>

            <label class="field required">
              <span>KBLI Sesuai NIB</span>
              <input v-model="form.kbliSesuaiNib" type="text" required />
            </label>
            <label class="field required">
              <span>KBLI Utama</span>
              <input v-model="form.kbliUtama" type="text" required />
            </label>

            <label class="field required">
              <span>Provinsi</span>
              <input v-model="form.provinsi" type="text" required />
            </label>
            <label class="field required">
              <span>Kota</span>
              <input v-model="form.kota" type="text" required />
            </label>

            <label class="field required">
              <span>Kecamatan</span>
              <input v-model="form.kecamatan" type="text" required />
            </label>
            <label class="field required">
              <span>Kelurahan</span>
              <input v-model="form.kelurahan" type="text" required />
            </label>

            <label class="field required">
              <span>Kode Pos</span>
              <input v-model="form.kodePos" type="text" required />
            </label>
            <label class="field required">
              <span>Telepon Perusahaan</span>
              <input v-model="form.teleponPerusahaan" type="tel" required />
            </label>

            <label class="field field-full required">
              <span>Alamat Perusahaan</span>
              <textarea v-model="form.alamatPerusahaan" rows="2" required />
            </label>

            <label class="field required">
              <span>Email Perusahaan</span>
              <input v-model="form.emailPerusahaan" type="email" required />
            </label>
            <label class="field required">
              <span>Lokasi</span>
              <div class="lokasi-input-row">
                <input v-model="form.lokasi" type="text" placeholder="Contoh: Jalan Gatot Subroto No. 1" required />
                <button type="button" class="btn save-lokasi-btn" @click="saveLokasi">Simpan Lokasi</button>
              </div>
            </label>

            <div class="field field-full">
              <span>Google Maps</span>
              <div class="map-wrap">
                <iframe :src="lokasiMapSrc" loading="lazy" referrerpolicy="no-referrer-when-downgrade" />
              </div>
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Status Perusahaan</h2>
          </div>

          <div class="field-grid status-grid">
            <label class="field required">
              <span>Status Kepemilikan</span>
              <select v-model="form.statusKepemilikan" required>
                <option disabled value="">Pilih status kepemilikan</option>
                <option v-for="item in statusKepemilikanOptions" :key="item" :value="item">
                  {{ item }}
                </option>
              </select>
            </label>

            <label class="field required">
              <span>Status Pemodalan</span>
              <select v-model="form.statusPemodalan" required>
                <option disabled value="">Pilih status pemodalan</option>
                <option v-for="item in statusPemodalanOptions" :key="item" :value="item">
                  {{ item }}
                </option>
              </select>
            </label>

            <label class="field required">
              <span>Negara</span>
              <select v-model="form.negara" required>
                <option v-for="item in negaraOptions" :key="item" :value="item">
                  {{ item }}
                </option>
              </select>
            </label>
          </div>
        </section>

        <div class="actions">
          <button type="button" class="btn secondary" @click="resetForm">Reset</button>
          <button type="submit" class="btn primary">Simpan Profil Perusahaan</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
:global(body) {
  margin: 0;
  font-family: "Inter", "Segoe UI", Arial, sans-serif;
  background: #f4f8fb;
}

.company-page {
  min-height: 100dvh;
  background: linear-gradient(180deg, #0d8d85 0 220px, #f4f8fb 220px 100%);
  padding: 24px;
}

.page-shell {
  max-width: 1120px;
  margin: 0 auto;
}

.page-header {
  color: #fff;
  margin-bottom: 16px;
}

.page-header h1 {
  margin: 0;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.4px;
}

.page-header p {
  margin: 6px 0 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.92);
}

.form-layout {
  display: grid;
  gap: 16px;
}

.panel {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #dbe6f1;
  box-shadow: 0 8px 24px rgba(16, 42, 67, 0.08);
  overflow: hidden;
}

.panel-head {
  padding: 14px 18px;
  border-bottom: 1px solid #e7edf4;
  background: #f9fcff;
}

.panel-head h2 {
  margin: 0;
  color: #083460;
  font-size: 18px;
  font-weight: 700;
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 18px;
  padding: 18px;
}

.status-grid {
  grid-template-columns: repeat(3, 1fr);
}

.field {
  display: grid;
  gap: 6px;
}

.field span {
  font-size: 12px;
  color: #16375a;
  font-weight: 600;
}

.field span small {
  font-size: 11px;
  font-weight: 500;
  color: #70849a;
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
  border: 1px solid #ccd9e5;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  color: #22384f;
  background: #fff;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: #00b7c0;
  box-shadow: 0 0 0 3px rgba(0, 183, 192, 0.14);
}

.field textarea {
  resize: vertical;
  min-height: 68px;
}

.lokasi-input-row {
  display: flex;
  gap: 8px;
}

.save-lokasi-btn {
  flex-shrink: 0;
  background: #00aeb6;
  color: #fff;
  height: 42px;
}

.field-full {
  grid-column: 1 / -1;
}

.map-wrap {
  border: 1px solid #d5e1ec;
  border-radius: 10px;
  overflow: hidden;
  min-height: 280px;
}

.map-wrap iframe {
  width: 100%;
  height: 280px;
  border: 0;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
  color: #1e3b59;
  background: #fff;
}

.btn.primary {
  background: #00c5cd;
  color: #fff;
}

@media (max-width: 1024px) {
  .status-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .company-page {
    padding: 14px;
  }

  .field-grid {
    grid-template-columns: 1fr;
  }

  .lokasi-input-row {
    flex-direction: column;
  }

  .actions {
    justify-content: stretch;
  }

  .btn {
    flex: 1;
  }
}
</style>
