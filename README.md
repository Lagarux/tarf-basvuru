# TaRF Ekip Başvuru Formu

Basit, tek sayfalık başvuru formu. Gönderilen her başvuru, Google Apps Script üzerinden bir Google E-Tablo'ya anında yeni satır olarak eklenir.

```
tarf-basvuru/
├── index.html          → Form sitesi (tek dosya, logo içinde gömülü)
├── apps-script/Code.gs → Google E-Tablo'ya yazan arka uç
└── README.md
```

## 1. Google E-Tablo ve Apps Script

1. Google Drive'da yeni bir E-Tablo oluştur (ör. "TaRF Ekip Başvuruları").
2. Menüden **Uzantılar → Apps Script**'i aç.
3. Açılan `Code.gs` dosyasının içeriğini sil ve `apps-script/Code.gs` dosyasının tamamını yapıştır. Kaydet.
4. Sağ üstten **Dağıt → Yeni dağıtım**'a tıkla.
   - Tür: **Web uygulaması**
   - Şu kullanıcı olarak çalıştır: **Ben**
   - Erişimi olanlar: **Herkes**
5. **Dağıt**'a bas, Google hesabınla izin ver ("Gelişmiş → güvenli olmayan sayfaya git" adımı kendi scriptin olduğu için normaldir).
6. Verilen `https://script.google.com/macros/s/.../exec` adresini kopyala.

İlk başvuru geldiğinde tabloda **Başvurular** sayfası ve başlık satırı otomatik oluşur.

> Kodda değişiklik yaparsan **Dağıt → Dağıtımları yönet → Düzenle → Yeni sürüm** ile güncelle; adres aynı kalır.

## 2. Formu bağla

`index.html` dosyasında şu satırı bul ve kopyaladığın adresi yapıştır:

```js
const SCRIPT_URL = "BURAYA_APPS_SCRIPT_WEB_UYGULAMASI_ADRESI";
```

## 3. Yayınla (birini seç)

### A) GitHub Pages

1. GitHub'da yeni bir **public** repo aç (ör. `tarf-basvuru`).
2. `index.html` ve diğer dosyaları repoya yükle.
3. **Settings → Pages → Source: Deploy from a branch → main / (root)** → Save.
4. Bir dakika sonra site şu adreste açılır:
   `https://KULLANICI_ADIN.github.io/tarf-basvuru/`

### B) Cloudflare Pages (Wrangler)

Bilgisayarında Node.js kuruluysa, klasörün içinde:

```bash
npx wrangler login
npx wrangler pages deploy . --project-name tarf-basvuru
```

Site `https://tarf-basvuru.pages.dev` adresinde yayına girer (isim alınmışsa farklı bir proje adı seç).

## 4. Test et

Formu bir kez doldurup gönder; E-Tablo'da yeni satırı gördüysen her şey hazır. Test satırını silebilirsin.

## Notlar

- Formda spam botlarına karşı gizli bir alan var; bot doldurursa kayıt yazılmaz.
- Tabloya `=`, `+`, `-`, `@` ile başlayan metinler formül olarak çalışmasın diye başına `'` eklenir.
- E-Tablo'yu yalnızca topluluk yönetimiyle paylaş; başvurularda telefon numarası gibi kişisel veriler var.
