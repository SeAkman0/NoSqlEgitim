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
// 3. GERÇEK ZAMANLI VERİ ÇEKME (READ & REALTIME DYNAMIC UI)
// =====================================================================
let tumMesajlarHtml = "";

snapshot.forEach((docSnap) => {
  // 1. Destructuring: isim, mesaj ve tarih dışındaki verileri 'digerleri' objesinde topluyoruz
  const { isim, mesaj, tarih, ...digerleri } = docSnap.data();
  let kartIcerigi = "";

  if (isim) kartIcerigi += `<p><strong>İSİM:</strong> ${guvenliMetin(isim)}</p>`;
  if (mesaj) kartIcerigi += `<p><strong>MESAJ:</strong> ${guvenliMetin(mesaj)}</p>`;

  // 2. Kalan veriler için uzun "if" kontrollerine gerek kalmadan doğrudan döngü kuruyoruz
  for (const [anahtar, deger] of Object.entries(digerleri)) {
    const etiket = guvenliMetin(anahtar.toLocaleUpperCase("tr-TR"));
    kartIcerigi += `<p><strong>${etiket}:</strong> ${guvenliMetin(deger)}</p>`;
  }

  tumMesajlarHtml += `
    <div class="mesaj-kutu">
        ${kartIcerigi}
    </div>
  `;
});