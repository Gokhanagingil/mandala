# Mangala 1.0 doğrulaması

Tarih: 30 Ekim 2026

## Otomatik doğrulama

`npm run build` ve `npm test`: **27 / 27 başarılı**.

- Başlangıç, tek taş, kaynak kuyuda bir taş bırakma, çok turlu dağıtım, rakip hazineyi atlama.
- Çift ve tek rakip sayıları, dolu/boş karşı kuyu, ek hamle.
- Kuyusu biten oyuncunun kalan taşları alması; bitişin ek hamleden önce gelmesi; beraberlik.
- Yasak kuyular, taş korunumu, taraf dönüşüm simetrisi.
- 400 tam rastgele oyun, farklı bir halka temsili kullanan bağımsız referans uygulamayla karşılaştırıldı. 10.000'den fazla hamle karşılaştırması.
- 18 bulmacanın her biri başlangıç tahtasından hamle iziyle tekrar oluşturuldu; hedefi karşılayan tam bir çözümü olduğu doğrulandı.
- Üç zorlukta geçerli bilgisayar hamlesi, hemen kazandıran bitişler, bitmiş oyunda hamle üretilmemesi.
- Kaydetme/geri açma, ek hamle ve bekleyen bilgisayar sırasının korunması; bozuk veya ayrışmış geçmişin reddi.
- Sonucun yalnız bir kez puanlanması, turnuva boyunca dönüşümlü başlama, beraberlik ve rövanş.

## Tarayıcıda denenen akışlar

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
