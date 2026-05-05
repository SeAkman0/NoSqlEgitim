// =====================================================================
// 1. FIREBASE KURULUMU VE BAĞLANTISI 
// =====================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// BURAYA KENDİ FİREBASE CONFIG BİLGİLERİNİ YAPIŞTIR
const firebaseConfig = {
 
  apiKey: "AIzaSyCENZ3wRTRNLW-sMsZmhAMMZPwC0P-QIeg",
  authDomain: "nosqlegitim2.firebaseapp.com",
  projectId: "nosqlegitim2",
  storageBucket: "nosqlegitim2.firebasestorage.app",
  messagingSenderId: "961062761111",
  appId: "1:961062761111:web:cd205b7314178e75606fd2"
};

const app = initializeApp(firebaseConfig);
// Firestore veritabanı bağlantısı
const db = getFirestore(app);
// "mesajlar" koleksiyonuna referans
const mesajlarRef = collection(db, "mesajlar");

// Arayüz elementleri
const isimInput = document.getElementById("isimInput");
const mesajInput = document.getElementById("mesajInput");
const gonderBtn = document.getElementById("gonderBtn");
const mesajlarAlani = document.getElementById("mesajlar-alani");

function guvenliMetin(metin) {
  // HTML içine basılacak metni güvenli hale getirir
  return String(metin)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// =====================================================================
// 2. VERİ GÖNDERME (CREATE) - Sahnede burayı anlatacaksın
// =====================================================================
gonderBtn.addEventListener("click", async () => {
  // Input'lardan güncel değerleri al
  const isim = isimInput.value.trim();
  const mesaj = mesajInput.value.trim();

  if (isim === "" || mesaj === "") {
    // Boş veri gönderimini engelle
    return alert("Lütfen boş bırakmayın!");
  }

  // Firestore'a yeni mesaj belgesi ekle
  await addDoc(mesajlarRef, {
    isim: isim,
    mesaj: mesaj,
    // Sunucu zamanı ile sıralama tutarlılığı sağlanır
    tarih: serverTimestamp(),
  });

  // Formu temizle
  isimInput.value = "";
  mesajInput.value = "";
});


// =====================================================================
// 3. GERÇEK ZAMANLI VERİ ÇEKME (READ & REALTIME DYNAMIC UI)
// =====================================================================
// Mesajları en yeni üstte olacak şekilde sorgula
const q = query(mesajlarRef, orderBy("tarih", "desc"));

onSnapshot(q, (snapshot) => {
  // Her güncellemede alanı sıfırdan çiz
  mesajlarAlani.innerHTML = "";

  if (snapshot.empty) {
    // Veri yoksa bilgilendirme göster
    mesajlarAlani.innerHTML =
      '<p class="bos-durum">Henüz mesaj yok. İlk mesajı sen gönder.</p>';
    return;
  }

  snapshot.forEach((docSnap) => {
    // Tek bir Firestore belgesinin verisi
    const veri = docSnap.data();
    // Kart içine yazılacak HTML metni
    let kartIcerigi = "";

    // Sık kullanılan alanları üstte sabit göster
    if (veri.isim) {
      kartIcerigi += `<p><strong>İSİM:</strong> ${guvenliMetin(veri.isim)}</p>`;
    }
    if (veri.mesaj) {
      kartIcerigi += `<p><strong>MESAJ:</strong> ${guvenliMetin(veri.mesaj)}</p>`;
    }

    for (const [anahtar, deger] of Object.entries(veri)) {
      // Sabit gösterdiklerimizi tekrar etme
      if (anahtar !== "tarih" && anahtar !== "isim" && anahtar !== "mesaj") {
        // Yeni eklenen alanlar otomatik görünür
        const etiket = guvenliMetin(anahtar.toLocaleUpperCase("tr-TR"));
        kartIcerigi += `<p><strong>${etiket}:</strong> ${guvenliMetin(deger)}</p>`;
      }
    }

    // Kartı mesaj listesine ekle
    mesajlarAlani.innerHTML += `
            <div class="mesaj-kutu">
                ${kartIcerigi}
            </div>
        `;
  });
});