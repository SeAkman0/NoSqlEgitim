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
  apiKey: "AIzaSyCXrMFToEe6Ce0Wcm0pJtgqvZIqSF5bg3M",
  authDomain: "nosqlegitim.firebaseapp.com",
  projectId: "nosqlegitim",
  storageBucket: "nosqlegitim.firebasestorage.app",
  messagingSenderId: "551075195597",
  appId: "1:551075195597:web:7a11472a194bcbbc0b9784",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const mesajlarRef = collection(db, "mesajlar");

// Arayüz elementleri
const isimInput = document.getElementById("isimInput");
const mesajInput = document.getElementById("mesajInput");
const gonderBtn = document.getElementById("gonderBtn");
const mesajlarAlani = document.getElementById("mesajlar-alani");

function guvenliMetin(metin) {
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
  const isim = isimInput.value.trim();
  const mesaj = mesajInput.value.trim();

  if (isim === "" || mesaj === "") {
    return alert("Lütfen boş bırakmayın!");
  }

  await addDoc(mesajlarRef, {
    isim: isim,
    mesaj: mesaj,
    tarih: serverTimestamp(),
  });

  isimInput.value = "";
  mesajInput.value = "";
});


// =====================================================================
// 3. GERÇEK ZAMANLI VERİ ÇEKME (READ & REALTIME DYNAMIC UI) - Şov Kısmı
// =====================================================================
const q = query(mesajlarRef, orderBy("tarih", "desc"));

onSnapshot(q, (snapshot) => {
  mesajlarAlani.innerHTML = "";

  if (snapshot.empty) {
    mesajlarAlani.innerHTML =
      '<p class="bos-durum">Henüz mesaj yok. İlk mesajı sen gönder.</p>';
    return;
  }

  snapshot.forEach((docSnap) => {
    const veri = docSnap.data();
    let kartIcerigi = "";

    if (veri.isim) {
      kartIcerigi += `<p><strong>İSİM:</strong> ${guvenliMetin(veri.isim)}</p>`;
    }
    if (veri.mesaj) {
      kartIcerigi += `<p><strong>MESAJ:</strong> ${guvenliMetin(veri.mesaj)}</p>`;
    }

    for (const [anahtar, deger] of Object.entries(veri)) {
      if (anahtar !== "tarih" && anahtar !== "isim" && anahtar !== "mesaj") {
        const etiket = guvenliMetin(anahtar.toLocaleUpperCase("tr-TR"));
        kartIcerigi += `<p><strong>${etiket}:</strong> ${guvenliMetin(deger)}</p>`;
      }
    }

    mesajlarAlani.innerHTML += `
            <div class="mesaj-kutu">
                ${kartIcerigi}
            </div>
        `;
  });
});