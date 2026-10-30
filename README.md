# Mangala

Oyun adı **Mangala**. Kullanıcının seçtiği depo adı **mandala** olarak korunur.

Bu depo ikinci oyunun hazırlık notlarını içerir; henüz oynanabilir Mangala uygulaması değildir. Önce tamamlanan kelime oyunu: https://github.com/Gokhanagingil/kek

## Temel oyun kuralları

Türk Mangala'sının altı kuyulu, 48 taşlı biçimi esas alınır. Her oyuncunun altı kuyusu ve bir hazinesi vardır; başlangıçta her kuyuda dört taş bulunur.

1. Kendi tarafındaki boş olmayan bir kuyu seçilir. Taşların biri başlangıç kuyusuna bırakılır; kalanlar saat yönünün tersine birer birer dağıtılır. Seçilen kuyuda tek taş varsa doğrudan sonraki kuyudan başlanır.
2. Kendi hazineye taş bırakılır; rakibin hazinesi atlanır. Gerekirse tahta çevresinde dağıtım sürer.
3. Son taş kendi hazineye düşerse ek hamle kazanılır.
4. Son taş rakibin kuyusundaki taş sayısını çift yaparsa o kuyudaki taşlar kendi hazineye alınır.
5. Son taş kendi boş kuyusuna düşer ve karşı kuyuda taş varsa, kendi son taşı ile karşı kuyudaki taşlar kazanılır. Karşı kuyu boşsa bu yakalama yapılmaz.
6. Bir tarafın kuyuları boşalınca el sona erer. Kuyuları ilk boşalan oyuncu rakibin tarafında kalan taşları da alır. En çok taşı toplayan kazanır; 24–24 beraberliktir.

Oyun sonu kontrolü ek hamleden önce yapılmalıdır. Her tamamlanmış hamlede tahtadaki ve hazinelerdeki taşların toplamı 48 kalmalıdır. Kalah gibi diğer mancala çeşitlerinin farklı bitiş kuralları bu oyuna taşınmamalıdır.

## Önerilen deneyim

- **Tek kişi:** Kolay, orta ve zor bilgisayar rakibi. Rakip, cihaz üzerinde çalışan oyun ağacı aramasıyla oynar; bir LLM veya ücretli API gerektirmez. Arama ek hamleleri doğru ele almalı ve arayüzü bloklamamak için Worker içinde çalışmalıdır.
- **İki kişi:** İlk sürümde aynı cihazda karşılıklı oyun. Aktif taraf ve sıra açıkça görünür. Kısa maçlarda ilk başlayan oyuncu dönüşümlü seçilir.
- **Öğreten ilk oyun:** Önce taş dağıtma, sonra ek hamle, sonra yakalama kuralları küçük uygulamalı bölümlerle gösterilir.
- **Hamleyi gör:** Öğrenme modunda seçilen kuyunun taşlarının izleyeceği yol ve son taş önizlenir. Rekabet modunda bu yardım kapalı tutulabilir.
- **Taşların keyfi:** Ahşap dokulu sade tahta, okunaklı taş sayıları, yumuşak dağıtma animasyonu, isteğe bağlı ses ve hız ayarı. Sayılar her zaman görünür; yalnız taş çizimlerini saymaya gerek kalmaz.
- **Kısa bulmacalar:** “Bu hamlede ek sıra kazan”, “Tek hamlede 8 taş topla” gibi önceden doğrulanmış görevler.
- **Oyun sonu:** Skorun yanında belirleyici bir hamleyi gösteren kısa tekrar; rastgele güçlendirmeler temel kuralları değiştirmez.

Sakin oyun varsayılan süresiz olabilir. Süreli turnuva, ayrı ve açıkça etiketlenmiş seçenek olmalıdır. Resmî müsabaka süre/başlama prosedürleri ile uygulamanın rahat oyun tercihleri karıştırılmamalıdır.

## Kaynaklar

- GSB / Türkiye Geleneksel Spor Dalları Federasyonu, Mangala Oyunu Müsabaka Talimatı: https://shgm.gsb.gov.tr/Public/images/SGM/Federasyon/22116mangala.pdf
- MEB Çarşamba, Mangala kuralları: https://carsamba.meb.gov.tr/meb_iys_dosyalar/2022_01/06134804_MANGALA.pdf
- Federasyon spor sayfası: https://gsdf.gov.tr/tr/spor/mangala-oyunu/

Araştırma: 30 Ekim 2026. Bu notlar uygulama öncesi tasarım önerileridir; bilgisayar rakibi veya Mangala arayüzü henüz geliştirilmedi.
