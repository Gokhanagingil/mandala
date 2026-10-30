# Mangala 1.1 doğrulaması

Tarih: 30 Ekim 2026

## Otomatik doğrulama

`npm run build` ve `npm test`: **30 / 30 başarılı**.

- Başlangıç, tek taş, kaynak kuyuda bir taş bırakma, çok turlu dağıtım, rakip hazineyi atlama.
- Çift ve tek rakip sayıları, dolu/boş karşı kuyu, ek hamle.
- Kuyusu biten oyuncunun kalan taşları alması; bitişin ek hamleden önce gelmesi; beraberlik.
- Yasak kuyular, taş korunumu, taraf dönüşüm simetrisi.
- 400 tam rastgele oyun, farklı bir halka temsili kullanan bağımsız referans uygulamayla karşılaştırıldı. 10.000'den fazla hamle karşılaştırması.
- 18 bulmacanın her biri başlangıç tahtasından hamle iziyle tekrar oluşturuldu; hedefi karşılayan tam bir çözümü olduğu doğrulandı.
- Üç zorlukta geçerli bilgisayar hamlesi, hemen kazandıran bitişler, bitmiş oyunda hamle üretilmemesi.
- Kaydetme/geri açma, ek hamle ve bekleyen bilgisayar sırasının korunması; bozuk veya ayrışmış geçmişin reddi.
- Sonucun yalnız bir kez puanlanması, turnuva boyunca dönüşümlü başlama, beraberlik ve rövanş.
- Tek tek dağıtım sırası ve eldeki taş sayısı; bütün bulmaca çözümlerinde yakalama/toplama animasyonlarının motor sonucuna eşitliği; uçuş sırasında ve sonrasında taş korunumu.
- 0, 1, 8, 24 ve 48 taşlı hazinelerde gerçek adetle eşleşen görseller ve iki yönlü yerleşim sınırları.

## 1.1 tarayıcı kontrolleri

- Masaüstünde 3. bulmacanın dağıtım ve altı taş yakalama akışı: hazineler 1 ve 8; görünen taş adetleri de 1 ve 8.
- 390×844 ve 360×800 iframe telefon benzetimlerinde üst/alt hazine taşları, ayrı sayı rozetleri ve Sakin varsayılanı görsel olarak incelendi. Dar görünümde içerik ve görünüm genişliği 345 px; yatay taşma yok.
- Hamle sırasında gerçek uçan taş DOM'da gözlendi; hedef henüz 1 taş gösterirken uçan taş ve “Elde 3 taş” durumu birlikte vardı. Hamle bitince sonuç ve sıra değişti.
- İki kişilik oyunda uçan taş görünürken ana sayfaya çıkılıp kayıtlı oyuna dönüldü: hamle yalnız bir kez kaydedildi, 1 taşlık hazine ve ek sıra korundu; eski uçuş öğeleri kalmadı.

## 1.0 sürümünde tarayıcıda denenen akışlar

Cloud Chrome önizlemesi üzerinden gerçek DOM etkileşimleriyle:

- Masaüstü ana ekran ve tahta görsel incelemesi.
- Öğreticinin beş görevinde doğru hamle, animasyon ve açıklama.
- Bilgisayara karşı açılış: rakibin ek hamle kazanması, tekrar oynaması, altı taş yakalaması ve sıranın insana dönmesi.
- Sayfa yenilendikten sonra “Yarım kalan oyuna dön”: 3 hamlelik aynı tahta ve 8–0 skor korundu.
- İki oyuncuya ad verme, mini turnuva seçme, yeni oyun onayı, ilk hamleden sonra sıranın ikinci oyuncuya geçmesi.
- Bulmacada yanlış hamlenin başlangıç konumuna dönmesi, açıklamalı geri bildirim, ipucu, doğru çözüm ve 1/18 ilerleme.
- 390×844 ve 360×800 boyutlu iframe telefon benzetimlerinde tahta, kuyu seçimi, yol önizlemesi ve sabit hamle düğmesi. 360 genişlikli testte kaydırma çubuğu sonrası 345 CSS piksel içerikte yatay taşma yok.

## Sınırlar

- Gerçek Android/iOS cihazı ve Safari üzerinde fiziksel test yapılmadı; küçük ekran kontrolü Chrome iframe boyutlandırmasıdır.
- Tam bir mini turnuva tarayıcıda baştan sona oynanmadı; tur sonu, puanlama, dönüşümlü başlama ve rövanş otomatik testlerde doğrulandı.
- Ses üreteci ve hız ayarları mevcut; fiziksel hoparlör/dokunma hissi değerlendirilmedi.
- Bilgisayar rakibi sınırlı arama kullanır, kusursuz oyun iddiası yoktur. Tarzlar değerlendirme ağırlıklarıdır; her konumda farklı hamle seçmeleri beklenmez.
- Çevrim içi çok oyunculu, hesaplar, bulut senkronizasyonu, APK ve çevrim dışı ilk açılış bu sürümün kapsamı değildir.
