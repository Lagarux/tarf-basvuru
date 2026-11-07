/**
 * TaRF Düşünce ve Teknoloji Topluluğu – Başvuru formu arka ucu
 *
 * Bu kodu başvuruların tutulacağı Google E-Tablo'nun içinden açılan
 * Apps Script düzenleyicisine yapıştırın (Uzantılar → Apps Script).
 * Ardından "Dağıt → Yeni dağıtım → Web uygulaması" ile yayınlayın:
 *   - Şu kullanıcı olarak çalıştır: Ben
 *   - Erişimi olanlar: Herkes
 * Çıkan /exec ile biten adresi index.html içindeki SCRIPT_URL alanına yazın.
 */

const SHEET_NAME = 'Başvurular';

const HEADERS = [
  'Başvuru zamanı',
  'Ad Soyad',
  'Bölüm',
  'Sınıf',
  'Telefon (WhatsApp)',
  'E-posta',
  'İlgilendiği ekipler',
  'Neden katılmak istiyor?',
  'Deneyim / Portfolyo',
  'KVKK onayı'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents || '{}');

    // Spam botlarına karşı gizli alan: insanlar bunu doldurmaz.
    if (d.website) return json_({ ok: true });

    if (!d.adSoyad || !d.bolum || !d.sinif || !d.telefon || !d.neden || !d.kvkk ||
        !Array.isArray(d.ekipler) || d.ekipler.length === 0) {
      return json_({ ok: false, error: 'Zorunlu alanlar eksik.' });
    }

    const sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      clean_(d.adSoyad),
      clean_(d.bolum),
      clean_(d.sinif),
      clean_(d.telefon),
      clean_(d.eposta),
      clean_(d.ekipler.join(', ')),
      clean_(d.neden),
      clean_(d.deneyim),
      'Evet'
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Adresi tarayıcıda açınca servisin çalıştığını görmek için.
function doGet() {
  return json_({ ok: true, service: 'TaRF başvuru formu' });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#0A3596')
      .setFontColor('#FFFFFF');
    sheet.getRange('A:A').setNumberFormat('dd.mm.yyyy HH:mm');
  }
  return sheet;
}

// Metni kısaltır ve tabloda formül olarak çalışmasını engeller.
function clean_(v) {
  const s = String(v == null ? '' : v).trim().slice(0, 2000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
