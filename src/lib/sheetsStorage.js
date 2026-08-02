// Lapisan penyimpanan yang menggantikan window.storage (khusus artifact Claude)
// dengan panggilan ke Google Apps Script Web App, yang membaca/menulis ke Google Sheet.
//
// Cara kerja: satu baris di Sheet "Data" = satu key-value pair (mirip window.storage).
// Lihat google-apps-script/Code.gs untuk kode backend-nya, dan README.md untuk cara deploy.

const BASE_URL = import.meta.env.VITE_SHEETS_API_URL;

function assertConfigured() {
  if (!BASE_URL) {
    throw new Error(
      "VITE_SHEETS_API_URL belum diatur. Salin .env.example menjadi .env dan isi URL Web App Apps Script Anda."
    );
  }
}

async function get(key) {
  assertConfigured();
  const res = await fetch(`${BASE_URL}?key=${encodeURIComponent(key)}`);
  if (!res.ok) throw new Error(`Gagal mengambil data (status ${res.status})`);
  const data = await res.json();
  if (data.value === null || data.value === undefined) {
    throw new Error(`Key '${key}' tidak ditemukan`);
  }
  return data; // { key, value }
}

async function set(key, value) {
  assertConfigured();
  const res = await fetch(BASE_URL, {
    method: "POST",
    // Content-Type text/plain dipakai supaya browser tidak mengirim CORS preflight
    // (Apps Script Web App tidak menangani preflight OPTIONS dengan baik).
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "set", key, value }),
  });
  if (!res.ok) throw new Error(`Gagal menyimpan data (status ${res.status})`);
  return res.json();
}

async function del(key) {
  assertConfigured();
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "delete", key }),
  });
  if (!res.ok) throw new Error(`Gagal menghapus data (status ${res.status})`);
  return res.json();
}

async function listWithValues(prefix) {
  assertConfigured();
  const res = await fetch(`${BASE_URL}?prefix=${encodeURIComponent(prefix)}`);
  if (!res.ok) throw new Error(`Gagal mengambil daftar data (status ${res.status})`);
  const data = await res.json();
  return data.items || [];
}

export const sheetsStorage = { get, set, delete: del, listWithValues };
