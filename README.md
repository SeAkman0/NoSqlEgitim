# Firebase Kurulum Nasıl Yapılır?

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

Bu proje `gorusler` koleksiyonunu kullanır.

- Kullanıcı geri bildirim gönderince `addDoc(...)` ile `gorusler` koleksiyonuna belge eklenir.
- `onSnapshot(...)` ile aynı koleksiyon gerçek zamanlı dinlenir.

Ekstra kod yazmana gerek yok; koleksiyon ilk geri bildirimle otomatik oluşur.

## 6) Authentication'da Admin Hesabı Oluştur

Silme yetkisi için önce admin hesabı aç:

1. Firebase Console'da `Build > Authentication` aç.
2. `Get started` de ve `Sign-in method` içinde `Email/Password` sağlayıcısını aç.
3. `Users` sekmesinden `Add user` ile bir admin hesabı oluştur (örnek: `admin@egitim.com`).
4. Eklenen admin kullanıcısının satırına girip `UID` bilgisini kopyala.

## 7) Firestore Rules (Eğitim İçin Basit)

`Build > Firestore Database > Rules` bölümüne aşağıdaki kuralları yapıştır:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /gorusler/{docId} {
      allow read: if true;          // herkes görsün
      allow create: if true;       // katılımcı eklesin
      allow update, delete: if request.auth != null
        && request.auth.uid == "Qqq2oFOLJph7bAQL7TK8szlm0a62";
    }
  }
}
```

Sonra:

1. `Publish` butonuna basarak kuralları aktif et.

## 8) Hızlı Kontrol

1. Sayfadan bir görüş gönder.
2. Firestore'da `gorusler` koleksiyonunda belge oluştuğunu gör.
3. Giriş yapmadan silmeyi dene: izin verilmemeli.
4. Admin hesabıyla giriş yapıp silmeyi dene: silme başarılı olmalı.
5. İkinci cihazdan açınca görüşlerin gerçek zamanlı geldiğini kontrol et.
