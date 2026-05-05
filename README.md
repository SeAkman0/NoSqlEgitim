# Firebase kurulum nasıl yapılır?

Bu README sadece Firebase kurulumu ve projede hangi dosyada neyi değiştireceğini anlatır.

## 1) Projeyi Çalıştır

```bash
git clone https://github.com/SeAkman0/NoSqlEgitim
cd proje-adi
npx serve .
```

Tarayıcıda çıkan adrese gir.

## 2) Firebase Projesi Oluştur

1. [Firebase Console](https://console.firebase.google.com/) aç.
2. `Proje ekle` ile yeni proje oluştur.
3. Sol menüden `Build > Firestore Database` seç.
4. `Create database` ile veritabanını başlat (test modunda başlayabilirsin).

## 3) Web App Kaydı ve Config Alma

1. `Project settings` (dişli simgesi) aç.
2. `Your apps` bölümünden `</>` (Web) seç.
3. Uygulamaya isim verip kaydet.
4. Verilen `firebaseConfig` nesnesini kopyala.

## 4) Projede Değiştirilecek Yer

Sadece `app.js` içindeki `firebaseConfig` bloğunu kendi değerlerinle değiştir:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

## 5) Firestore Koleksiyonunu Hazırla

Bu proje `mesajlar` koleksiyonunu kullanır.

- Kullanıcı mesaj gönderince `addDoc(...)` ile `mesajlar` koleksiyonuna belge eklenir.
- `onSnapshot(...)` ile aynı koleksiyon gerçek zamanlı dinlenir.

Ekstra kod yazmana gerek yok; koleksiyon ilk mesajla otomatik oluşur.

## 6) Firestore Rules (Eğitim İçin Basit)

Eğitim demosu için temel bir kural:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /mesajlar/{docId} {
      allow read, write: if true;
    }
  }
}
```

> Bu kural sadece demo içindir. Canlı kullanımda mutlaka kısıtla.

## 7) Hızlı Kontrol

1. Sayfadan bir mesaj gönder.
2. Firestore'da `mesajlar` koleksiyonunda belge oluştuğunu gör.
3. İkinci cihazdan açınca mesajların gerçek zamanlı geldiğini kontrol et.
