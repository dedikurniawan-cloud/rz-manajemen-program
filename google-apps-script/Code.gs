/**
 * Backend Google Apps Script untuk aplikasi Manajemen Program RZ.
 *
 * Cara pakai:
 * 1. Buat Google Sheet baru (kosong saja, sheet-nya akan dibuat otomatis).
 * 2. Buka menu Extensions > Apps Script.
 * 3. Hapus isi Code.gs bawaan, ganti dengan seluruh isi file ini.
 * 4. Klik Deploy > New deployment > pilih tipe "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Deploy, lalu salin URL Web App yang diberikan (diakhiri "/exec").
 * 6. Tempel URL itu ke file .env aplikasi React sebagai VITE_SHEETS_API_URL.
 *
 * Data disimpan sebagai baris key-value di sheet bernama "Data":
 * | key            | value (JSON string) | updated_at          |
 */

var SHEET_NAME = "Data";

function doGet(e) {
  var sheet = getSheet_();
  var key = e.parameter.key;
  if (!key) {
    return jsonResponse_({ error: "Parameter 'key' wajib diisi" });
  }
  var row = findRow_(sheet, key);
  if (!row) {
    return jsonResponse_({ key: key, value: null });
  }
  return jsonResponse_({ key: key, value: row.value });
}

function doPost(e) {
  var sheet = getSheet_();
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse_({ error: "Body harus berupa JSON valid" });
  }

  var action = body.action || "set";

  if (action === "set") {
    if (!body.key) return jsonResponse_({ error: "'key' wajib diisi" });
    setRow_(sheet, body.key, body.value);
    return jsonResponse_({ key: body.key, value: body.value, ok: true });
  }

  if (action === "delete") {
    if (!body.key) return jsonResponse_({ error: "'key' wajib diisi" });
    deleteRow_(sheet, body.key);
    return jsonResponse_({ key: body.key, deleted: true });
  }

  return jsonResponse_({ error: "Aksi tidak dikenal: " + action });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["key", "value", "updated_at"]);
  }
  return sheet;
}

function findRow_(sheet, key) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      return { rowIndex: i + 1, value: data[i][1] };
    }
  }
  return null;
}

function setRow_(sheet, key, value) {
  var existing = findRow_(sheet, key);
  var now = new Date().toISOString();
  if (existing) {
    sheet.getRange(existing.rowIndex, 2, 1, 2).setValues([[value, now]]);
  } else {
    sheet.appendRow([key, value, now]);
  }
}

function deleteRow_(sheet, key) {
  var existing = findRow_(sheet, key);
  if (existing) sheet.deleteRow(existing.rowIndex);
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
