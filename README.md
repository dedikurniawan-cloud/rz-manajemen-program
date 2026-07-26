# Manajemen Program — RZ Sumatera Selatan

Aplikasi web untuk mengelola program (Perencanaan → Persiapan → Eksekusi → Laporan),
tugas tim, approval, dan database relawan. Data disimpan di Google Sheets lewat
Google Apps Script sebagai backend, dan aplikasinya di-deploy otomatis lewat GitHub Pages.

## Struktur Proyek

```
rz-program-app/
├── src/
│   ├── App.jsx              # Seluruh aplikasi (UI + logika)
│   ├── main.jsx              # Entry point React
│   └── lib/sheetsStorage.js  # Lapisan komunikasi ke Google Sheets
├── google-apps-script/
│   └── Code.gs                # Backend yang di-deploy ke Google Apps Script
├── .github/workflows/deploy.yml  # Auto-deploy ke GitHub Pages
├── .env.example
└── package.json
```

## 1. Menghubungkan ke Google Sheets

1. Buka [sheets.google.com](https://sheets.google.com), buat spreadsheet baru
   (boleh kosong, nama bebas — misal "RZ Manajemen Program - Database").
2. Di menu, klik **Extensions > Apps Script**.
3. Hapus semua isi `Code.gs` bawaan, lalu salin-tempel seluruh isi file
   `google-apps-script/Code.gs` dari folder ini.
4. Klik **Deploy > New deployment**.
   - Klik ikon gear di samping "Select type", pilih **Web app**.
   - **Execute as**: Me (akun Google Anda)
   - **Who has access**: Anyone
   - Klik **Deploy**. Google akan minta izin akses — setujui.
5. Salin **Web app URL** yang muncul (diakhiri `/exec`). Ini adalah "API" Anda.
6. Sheet bernama `Data` akan dibuat otomatis saat pertama kali aplikasi menyimpan data.

> Catatan: setiap kali Anda mengubah isi `Code.gs`, Anda perlu **Deploy > Manage deployments
> > Edit (ikon pensil) > New version** agar perubahan aktif di URL yang sama.

## 2. Menjalankan di komputer lokal

```bash
npm install
cp .env.example .env
# lalu edit .env, isi VITE_SHEETS_API_URL dengan URL dari langkah 1.5
npm run dev
```

Buka `http://localhost:5173` di browser.

## 3. Menaruh ke GitHub

```bash
git init
git add .
git commit -m "Setup awal aplikasi manajemen program RZ"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```

`.env` **tidak akan ikut ter-push** (sudah masuk `.gitignore`) — ini disengaja, supaya URL
Apps Script Anda tidak terekspos publik di kode sumber.

## 4. Deploy otomatis ke GitHub Pages

1. Di repo GitHub, buka **Settings > Secrets and variables > Actions**.
2. Klik **New repository secret**:
   - Name: `VITE_SHEETS_API_URL`
   - Value: URL Apps Script dari langkah 1.5
3. Buka **Settings > Pages**, di bagian **Build and deployment > Source**, pilih
   **GitHub Actions**.
4. Push apa pun ke branch `main` (atau re-run workflow di tab **Actions**) — aplikasi akan
   otomatis ter-build dan ter-deploy. URL-nya akan muncul di tab **Actions** setelah selesai,
   biasanya berbentuk `https://USERNAME.github.io/NAMA-REPO/`.
5. Jika URL Pages Anda berbentuk `.../NAMA-REPO/` (bukan domain sendiri), buka
   `vite.config.js` dan ubah `base: "/"` menjadi `base: "/NAMA-REPO/"`, lalu commit & push lagi.

## Catatan Penting

- **Kode akses Manajer** ("RZPalembang") masih tersimpan sebagai teks biasa di kode
  aplikasi (`src/App.jsx`, konstanta `MANAGER_CODE`). Ini soft-lock, bukan autentikasi
  sungguhan — siapa pun yang membuka DevTools browser bisa melihatnya. Cukup untuk mencegah
  klik tidak sengaja, tapi ganti pendekatan (login per-akun) jika Anda perlu proteksi yang
  lebih serius.
- **Google Apps Script Web App** yang diatur "Anyone" berarti siapa pun yang tahu URL-nya
  bisa membaca/menulis data lewat API tersebut (walau tidak lewat aplikasi Anda). Untuk tim
  internal kecil ini biasanya cukup, karena URL-nya tidak dipublikasikan. Jangan bagikan URL
  Apps Script itu di tempat umum.
- Google Apps Script punya batas kuota (jumlah request per hari untuk akun gratis). Untuk
  tim kecil dengan pemakaian normal, ini biasanya jauh dari batas.
- Semua data program & relawan tersimpan sebagai satu baris JSON di sheet `Data`
  (kolom `key`, `value`, `updated_at`). Anda bisa membuka sheet-nya langsung untuk
  cadangan/backup manual kapan saja.

## Skrip yang tersedia

- `npm run dev` — jalankan mode pengembangan
- `npm run build` — build untuk produksi (hasil di folder `dist/`)
- `npm run preview` — coba hasil build secara lokal
