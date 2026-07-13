<script setup lang="ts">
const summaryCards = [
  { title: "Pencari Kerja Fresh Graduate", value: "250.731", subtitle: "Pencari Kerja Terdaftar" },
  { title: "Pencari Kerja Masih Bekerja", value: "53.828", subtitle: "Pencari Kerja Terdaftar" },
  { title: "Pencari Kerja Ter-PHK", value: "231.655", subtitle: "Pencari Kerja Terdaftar" },
]

const stats = [
  { title: "Pencari Kerja Terdaftar", value: "534.026" },
  { title: "Pencari Kerja Terdaftar Bulan Ini", value: "99.811" },
  { title: "Pencari Kerja Terdaftar Tahun Ini", value: "328.786" },
]

const rows = [
  { no: 1, tgl: "28 Mei 2026", nik: "354094511980003", nama: "Binti Humaidah", pendidikan: "SMA atau Sederajat", alamat: "DSN. SUMULOR. RT 1 RW 0" },
  { no: 2, tgl: "28 Mei 2026", nik: "3671037090980003", nama: "Louis Benjamin Martin Luther", pendidikan: "SMK", alamat: "Jalan Terusan Jakarta No. 249" },
]
</script>

<template>
  <div class="pk-page">
    <header class="pk-head">
      <div>
        <h1>Pencari Kerja</h1>
        <p>Berikut adalah daftar pencari kerja yang tersedia.</p>
      </div>
      <div class="pk-actions">
        <button class="btn primary">Daftarkan Pencari Kerja</button>
        <button class="btn secondary">Filter</button>
      </div>
    </header>

    <section class="card-grid">
      <article v-for="item in summaryCards" :key="item.title" class="metric-card">
        <p class="metric-title">{{ item.title }}</p>
        <strong>{{ item.value }}</strong>
        <span>{{ item.subtitle }}</span>
      </article>
    </section>

    <section class="middle-grid">
      <div class="stats-panel">
        <article v-for="item in stats" :key="item.title" class="stat-row">
          <p>{{ item.title }}</p>
          <strong>{{ item.value }}</strong>
        </article>
      </div>
      <div class="chart-panel">
        <div class="chart-placeholder">
          <div class="donut" />
        </div>
        <div class="legend">
          <p><span class="dot green" /> Terverifikasi (20.00%)</p>
          <p><span class="dot red" /> Belum Terverifikasi (80.00%)</p>
        </div>
      </div>
    </section>

    <section class="table-wrap">
      <div class="table-tools">
        <input type="text" placeholder="Cari berdasarkan NIK dan nama" />
      </div>
      <table>
        <thead>
          <tr>
            <th>NO.</th>
            <th>TGL. DAFTAR</th>
            <th>NO. NIK</th>
            <th>NAMA</th>
            <th>PENDIDIKAN</th>
            <th>ALAMAT</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.no">
            <td>{{ row.no }}</td>
            <td>{{ row.tgl }}</td>
            <td>{{ row.nik }}</td>
            <td>{{ row.nama }}</td>
            <td>{{ row.pendidikan }}</td>
            <td>{{ row.alamat }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.pk-page { padding: 20px; max-width: 1200px; margin: 0 auto; background: #fff; min-height: 100dvh; }
.pk-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.pk-head h1 { margin: 0; color: #14395b; }
.pk-head p { margin: 4px 0 0; color: #6f7e91; font-size: 12px; }
.pk-actions { display: flex; gap: 8px; }
.btn { height: 32px; border-radius: 4px; border: 1px solid #d5dce6; padding: 0 10px; font-size: 11px; font-weight: 700; cursor: pointer; }
.btn.primary { background: #0b3d67; color: #fff; border-color: #0b3d67; }
.btn.secondary { background: #fff; color: #243f61; }
.card-grid { margin-top: 12px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.metric-card { border: 1px solid #e4ebf3; border-radius: 6px; padding: 10px; }
.metric-title { margin: 0; font-size: 11px; text-transform: uppercase; color: #304f70; }
.metric-card strong { display: block; margin-top: 8px; font-size: 34px; color: #0e395f; line-height: 1; }
.metric-card span { font-size: 11px; color: #6f7e91; }
.middle-grid { margin-top: 10px; display: grid; grid-template-columns: 300px 1fr; gap: 10px; }
.stats-panel,.chart-panel { border: 1px solid #e4ebf3; border-radius: 6px; padding: 10px; }
.stat-row { border-bottom: 1px solid #edf2f7; padding: 8px 0; }
.stat-row:last-child { border-bottom: 0; }
.stat-row p { margin: 0; font-size: 11px; color: #304f70; text-transform: uppercase; }
.stat-row strong { display: block; margin-top: 4px; color: #0e395f; font-size: 30px; }
.chart-placeholder { display: grid; place-items: center; padding: 6px 0; }
.donut { width: 220px; height: 220px; border-radius: 50%; background: conic-gradient(#2aa54f 0 20%, #d83049 20% 100%); position: relative; }
.donut::after { content: ""; position: absolute; inset: 62px; background: #fff; border-radius: 50%; }
.legend p { margin: 6px 0 0; font-size: 11px; color: #4e6078; }
.dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 6px; }
.dot.green { background: #2aa54f; } .dot.red { background: #d83049; }
.table-wrap { margin-top: 10px; border: 1px solid #e4ebf3; border-radius: 6px; overflow: hidden; }
.table-tools { padding: 8px; border-bottom: 1px solid #e7edf4; }
.table-tools input { width: 320px; max-width: 100%; height: 30px; border: 1px solid #ced8e4; border-radius: 4px; padding: 0 8px; font-size: 11px; }
table { width: 100%; border-collapse: collapse; min-width: 900px; }
th, td { text-align: left; font-size: 11px; padding: 10px 8px; border-bottom: 1px solid #edf2f7; }
th { color: #1d3f64; font-weight: 700; }
td { color: #203952; }
</style>
