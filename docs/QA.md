# Mangala 1.3 doğrulaması

Tarih: 30 Ekim 2026

## Otomatik doğrulama

`npm run build` ve `npm test`: **32 / 32 başarılı**.

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

## 1.3 tarayıcı kontrolleri

- 360×800 dikey ve 844×390 yatay Chrome iframe görünümleri karşılaştırıldı. Kaydırma çubuğu sonrası 345 ve 829 CSS piksel genişliklerde yatay taşma yok; hazineler her iki görünümde solda/sağda kalır.
- Tek kişilik dikey oyunda insanın sağ hazineye taş bırakması, bilgisayarın ek hamleleri ve yakalaması oynandı. Son durumda solda 14, sağda 2 taş; hazinelerin gerçek taş görselleri ile sayaçları eşleşti ve toplam 48 taş korundu.
- Yatay iki kişilik oyunda Ece (alt/sağ) ve Can (üst/sol) adlarıyla açılış oynandı. İki oyuncunun da kendi hazinesine bir taş bırakması ve ek sıra kazanması doğrulandı; iki hazinede de birer gerçek taş vardı.
- Üst sıra kahverengi, alt sıra yeşil; sahiplik rengi aktif oyuncu değiştiğinde korunur. Oyuncu adları ve ayrı simgeler renk ayrımını destekler.
- Yatay görünümde başlık, tahta, alt oyuncu bilgisi ve sabit hamle düğmesi incelendi. Tahta gölgesinin oyuncu adına yaklaşması ve etkin üst kuyuların yeşil rozet alması giderildi.
- Ekran yönü kilitlenmez. Dar dikey görünüm oynanabilir kalır; daha geniş kuyular için yatay kullanım önerilir. Cihaz çentiği ve alt güvenli alanı CSS ile hesaba katılır; fiziksel cihaz testi yapılmadı.

## 1.2 tarayıcı kontrolleri

- Önce 1.1 öğreticisi oynandı: dört taşlı kuyudan üçü alındığında yalnız bir uçan taş vardı; görünür toplam 46'ya düşüyordu. 1.2'de aynı anda bir taş kuyuda, üç taş havada ve toplam 48 taş doğrulandı.
- 390×844 telefon ve 880×844 masaüstü iframe boyutlarında gerçek arayüz üzerinden oynandı. `tests/browser-audit.html` gözlenen animasyon karelerinde toplam taş sayısını, her kuyunun sayısı ile gerçek görsel adedinin eşleşmesini ve havadaki taşların büyümesini kaydeder; uygulamayı veya animasyon zamanını değiştirmez.
- Telefon öğretici ilk iki adım: 12 ve 17 gözlenen karede toplam 48, sayaç uyuşmazlığı 0. Birlikte kaldırma, 3→2→1 elde kalan taş, hazineye son taş ve ek sıra doğrulandı.
- Normal iki kişilik oyunda üst oyuncunun beş taşlı kuyusu: dört taş birlikte kaldırıldı; dağıtım ve altı taş yakalama sonrasında doğru 8 taşlık hazine.
- Normal tek kişilik oyunda insan açılışı, bilgisayarın ek sırası, ikinci hamlesi ve altı taş yakalaması oynandı. Gözlenen tüm karelerde toplam 48 ve sayaç uyuşmazlığı 0; sonunda sıra insana döndü.
- Beş taş havadayken ana sayfaya çıkıp maça dönme: havada taş kalmadı, 48 taş geri yüklendi, hamle bir kez kaydedildi ve ek sıra korundu.
- Yükselen üç taşın %25 büyüdüğü ve kaynak kuyuda aynı ilk taşın kaldığı ekran görüntüsüyle incelendi. İnişte hedef kuyu/hazine boyutuna küçülme kullanılır.
- Kuyularda 1–48 taşın tamamının çizimi, havadaki her taşa ayrı konum ayrılması, tek taş ve çok turlu dağıtımın bütünlüğü otomatik testlere eklendi.

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
