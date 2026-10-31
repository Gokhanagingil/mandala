# Mangala — Bir avuç taş, bin hamle

Türk Mangala’sının tarayıcıda oynanan, Türkçe ve mobil uyumlu sürümü. Oyun adı **Mangala**; kullanıcının seçtiği GitHub deposu **mandala** olarak korunur.

Oyun: https://mangala.gokhan-agingil.chatgpt.site

## Sürüm 1.4

- Bilgisayara karşı altı karakter: **Deniz → Ece → Can → Ada → Bora → Lale**. İlk açılışta çok kolay Deniz seçilidir; bir maç kazanmak sıradaki rakibi açar.
- Açılan rakipler her zaman seçilebilir. Daha kolay rakibe dönmek, kaybetmek veya berabere kalmak ilerlemeyi geri almaz. Eski bir rakibi tekrar yenmek basamak atlatmaz.
- Yeni rakibe geçiş oyuncunun seçimidir: sonuç ekranında sonraki rakip, rövanş ve rakip seçimi birlikte sunulur. Oyun içinden rakip değiştirirken mevcut maçın yerine yeni maç başlatılacağı açıklanır.
- Mini turnuvada tek el kazanmak yeterli değildir; iki galibiyetle seriyi tamamlamak gerekir. Yarım kalan seriler, el aralarında da devam ettirilebilir.
- İlk iki rakip fırsatları sık kaçırır; sonraki rakiplerde hamle arama derinliği artar. Aynı referansa karşı 144 tohumlu maçta güç sırası kontrol edildi; ayrıntılar `docs/QA.md` içinde.
- Seçim ve ilerleme tarayıcıda kalıcıdır. Eski sürümdeki kayıtlı maçlar korunur; eski isimsiz rakiplerle oynanan maçlar yeni karakter yolunda basamak açmaz.

### Önceki tahta iyileştirmeleri

- Hazineler her ekran yönünde tahtanın iki yanında: alt oyuncunun hazinesi sağda, üst oyuncununki solda. Oyuncu adı, simge, sıra rengi ve yön açıklaması birlikte aidiyeti gösterir; sıra değişince renkler değişmez.
- Telefon yatay çevrildiğinde tahta genişler; başlıklar ve hamle çubuğu ekran yüksekliğine uyarlanır. Dikey kullanım da açık kalır ve kısa bir yatay kullanım önerisi gösterilir; ekran yönü zorlanmaz.
- Öğretici, bulmacalar ve normal oyun aynı yerleşimi kullanır. Taşların iniş noktaları yan hazinelere göre hesaplanır; kuyu taşlarının en-boy oranı dar ve geniş ekranlarda korunur.

### Korunan taş animasyonları

- Seçilen kuyuda bir taş kalır; kalan gerçek taş görsellerinin tamamı birlikte havaya kalkar. Tek taşlı kuyunun tek taşı alınır.
- Taşlar yükselirken %25 büyür, aynı grup sıradaki kuyuya ilerler ve bir taş gruptan ayrılıp küçülerek yerine iner. Gruptaki diğer taşlar görünür kalır.
- Sayı rozetleri yalnızca taş kaldırılınca veya yerine inince değişir; taşların rengi ve yerleşimi hamle bitince yeniden karıştırılmaz. Kalabalık kuyularda da her taşın bir görseli vardır.
- Öğretici, bulmacalar, tek kişilik oyun, bilgisayar hamleleri, iki kişilik oyun ve hamle tekrarları aynı animasyonu kullanır.
- Hazinelerde sayı kadar taş görünür; yakalama ve el sonu toplama da tek tek canlandırılır.
- Sakin / Normal / Hızlı seçenekleri ve hareket azaltma desteği korunur. Sıra ve sonuç ekranı dağıtım bitince değişir. Animasyon sırasında çıkış, tamamlanmış hamleyi güvenle kaydeder.

## Oyun özellikleri

- Tek kişi: portreli ve farklı güçte altı bilgisayar rakibi; kazanarak açılan, yeniden seçilebilen masalar. Cihaz üzerinde çalışan, Web Worker içindeki sınırlı arama; ücretli API veya LLM yok.
- Aynı cihazda iki kişi: oyuncu adları, açık sıra göstergesi, iki oyuncuya ortak önizleme tercihi.
- Tek el veya ilk iki galibiyete ulaşanın kazandığı mini turnuva. Her elde başlayan oyuncu değişir; beraberlik galibiyet sayılmaz.
- Beş uygulamalı ders, gerçek oyunlardan türetilmiş ve tek çözümlü 18 bulmaca. Günün seçkisi bu 18 bulmacayı sırayla öne çıkarır; her gün yeni içerik üretildiği iddia edilmez.
- Hamle yolu önizlemesi, ayrı onay, taş dağıtma animasyonları, isteğe bağlı ses, üç animasyon hızı, hareket azaltma desteği.
- Son hamleler, maç sonu en yüksek taş kazancının tekrarı, tarayıcıda otomatik maç kaydı ve bulmaca ilerlemesi.
- Küçük telefon ekranlarında sabit hamle onayı. Kuyu sayıları her zaman görünür; taş renkleri dekoratiftir.

Bu sürüm yerel iki kişilik oyundur; uzaktaki oyuncuyla çevrim içi eşleşme içermez. İlk sayfa açılışı için bağlantı gerekir. Oyun hesaplamaları cihazda yapılır; tarayıcı verileri silinirse yerel kayıtlar silinir. Android APK henüz hazırlanmadı.

## Kurallar

Alt oyuncu kuyuları `0..5`, hazinesi `6`; üst oyuncu kuyuları `7..12`, hazinesi `13`. Taşlar artan indeksle döner; rakibin hazinesi atlanır. Her oyuncunun altı kuyusu, başlangıçta her kuyuda dört taş vardır.

1. Seçilen kuyuda bir taş bırakılır, kalanlar sırayla dağıtılır. Kuyuda yalnız bir taş varsa doğrudan sonraki yere gider.
2. Son taş kendi hazineye düşerse ek hamle kazanılır.
3. Son taş rakip kuyusundaki sayıyı çift yaparsa o kuyu alınır.
4. Son taş kendi boş kuyusuna düşer ve karşı kuyuda taş varsa, kendi son taşı ile karşı kuyu birlikte alınır. Karşı kuyu boşsa yakalama olmaz.
5. Bir taraf boşalınca el biter. **Kuyularını ilk boşaltan oyuncu rakibin kalan taşlarını da alır.** Bitiş, ek hamleden önce değerlendirilir. 24–24 beraberliktir.

Kaynak: [Türkiye Geleneksel Spor Dalları Federasyonu, Mangala Oyunu Müsabaka Talimatı](https://shgm.gsb.gov.tr/Public/images/SGM/Federasyon/22116mangala.pdf), Madde 22, PDF sayfa 8–9. 30 Ekim 2026 tarihinde belge indirilip okundu. Belgenin oluşturma tarihi Aralık 2025. Uygulamanın süresiz oyun ve hamleyi onaylamadan önce seçim değiştirme seçenekleri rahat oyun tercihleridir; resmî süre/dokunma prosedürlerini taklit etmez.

## Geliştirme

Node 22+ önerilir. Üretim dosyaları doğrudan `dist/` içinde, bağımlılık kurulumu gerekmez.

```sh
npm run build
npm test
# Rakiplerin göreli gücünü aynı referansa karşı karşılaştırmak için:
node scripts/calibrate-rivals.mjs
# Bulmacaları aynı tohumla yeniden üretmek için:
npm run puzzles
# Yerel sunucu:
python3 -m http.server 8000 --directory dist
```

`file://` yerine HTTP sunucusu kullanın; ES modülleri ve Worker bunu gerektirir.

## Dosyalar

- `dist/engine.js`: saf kural motoru ve animasyon olayları
- `dist/animation.js`: aynı taşları kaldırma/taşıma/bırakma, hazine yerleşimi ve görsel olay sırası
- `dist/ai.js`, `dist/ai-worker.js`: seviyeli bilgisayar rakibi
- `dist/opponents.js`: karakterler, kalıcı ilerleme ve maç galibiyetiyle açılma kuralları
- `dist/rivals-ui.js`: portreler, rakip kartları ve maç sonu ilerleme sunumu
- `dist/session.js`: kayıt doğrulama, tur puanlama, rövanş
- `dist/app.js`: ekranlar, yerel kayıt, ses, etkileşimler
- `dist/style.css`: duyarlı tahta ve arayüz
- `dist/puzzles.js`: ulaşılabilir konumlar, çözüm ve başlangıçtan gelen hamle izi
- `scripts/make-puzzles.mjs`: tekrarlanabilir bulmaca üretimi
- `tests/`: bağımsız referans motoru, 400 rastgele oyun, bulmacalar, rakip ve kayıt testleri
- `docs/QA.md`: yapılan kontroller ve sınırlar

Hosting kimliği `.openai/hosting.json` içindedir. Bu kimlik yeni yayınlarda korunmalıdır. GitHub kod deposu ve Sites yayın deposu ayrı Git geçmişleri kullanır; kaynak içerikleri eşlenir.

## Android · kalıcı imzalı 1.4.1

Kalıcı Android uygulaması **Mangala** adı ve `com.gokhanagingil.mangala`
kimliğiyle hazırlanır. İmza sertifikası sabittir; özel anahtar yalnızca sahibinin
özel yedeğinde tutulur. Gelecek APK güncellemelerinde aynı anahtar ve daha yüksek
versionCode kullanılmalıdır. Önceki `.preview` uygulaması ayrı kalır.

Yayın derlemesinde 41 oyun testi ve 6 Android kontrolü geçti; uygulamanın üzerine
yeni sürüm kurulurken oyun, rakip, bulmaca ve ayar kayıtları korundu.
[Derleme ve imzalama](android/README.md) ·
[1.4.1 doğrulama kaydı](docs/ANDROID-RELEASE-1.4.1.json).
