// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    baseURL: '/NewUI_Karirhub/',
  },
  css: ['@fortawesome/fontawesome-free/css/all.min.css'],
  routeRules: {
    '/app.vue': { redirect: '/' },
  },
  nitro: {
    prerender: {
      routes: [
        '/NewUI_Karirhub/',
        '/NewUI_Karirhub/pencari-kerja',
        '/NewUI_Karirhub/otp-pencari-kerja',
        '/NewUI_Karirhub/posting-lowongan',
        '/NewUI_Karirhub/notifikasi',
        '/NewUI_Karirhub/notifikasi-detail',
        '/NewUI_Karirhub/semua-notifikasi',
        '/NewUI_Karirhub/dasbor_pemberi_kerja',
        '/NewUI_Karirhub/form-instansi',
        '/NewUI_Karirhub/profil-perusahaan',
        '/NewUI_Karirhub/karirhub-clone',
        '/NewUI_Karirhub/link-expired',
        '/NewUI_Karirhub/link-invalid-revoked',
      ],
    },
  },
})
