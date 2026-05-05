// =====================================================================
// 1. FIREBASE KURULUMU VE BAĞLANTISI 
// =====================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
// Firestore veritabanı bağlantısı
const db = getFirestore(app);
// Authentication (giriş durumu) kontrolü
const auth = getAuth(app);
const ADMIN_UID = "Qqq2oFOLJph7bAQL7TK8szlm0a62";
// "gorusler" koleksiyonuna referans
const goruslerRef = collection(db, "gorusler");

// Arayüz elementleri
const isimInput = document.getElementById("isimInput");
const gorusInput = document.getElementById("gorusInput");
const gonderBtn = document.getElementById("gonderBtn");
const goruslerAlani = document.getElementById("gorusler-alani");
const authUyari = document.getElementById("auth-uyari");
const authDurum = document.getElementById("auth-durum");

// Giriş yapıldı mı kontrolü (Sil butonunu pasif etmek yerine yalnızca UI mesajını gösteriyoruz)
onAuthStateChanged(auth, (user) => {
  if (authUyari && user) {
    // Giriş sonrası uyarıyı gizle
    authUyari.classList.add("gizli");
  }

  if (!authDurum) return;
  authDurum.classList.remove("admin", "katilimci");

  if (!user) {
    authDurum.textContent = "Giriş yapılmadı";
    return;
  }

  if (user.uid === ADMIN_UID) {
    authDurum.textContent = "Admin girişi yapıldı";
    authDurum.classList.add("admin");
    return;
  }

  authDurum.textContent = "Katılımcı girişi yapıldı";
  authDurum.classList.add("katilimci");
});

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
  const gorus = gorusInput.value.trim();

  if (isim === "" || gorus === "") {
    // Boş veri gönderimini engelle
    return alert("Lütfen boş bırakmayın!");
  }

  // Firestore'a yeni gorus belgesi ekle
  await addDoc(goruslerRef, {
    isim: isim,
    gorus: gorus,
    // Sunucu zamanı ile sıralama tutarlılığı sağlanır
    tarih: serverTimestamp(),
  });

  // Formu temizle
  isimInput.value = "";
  gorusInput.value = "";
});


// =====================================================================
// 3. GERÇEK ZAMANLI VERİ ÇEKME (READ & REALTIME DYNAMIC UI)
// =====================================================================
// Gorusleri en yeni üstte olacak şekilde sorgula
const q = query(goruslerRef, orderBy("tarih", "desc"));

onSnapshot(q, (snapshot) => {
  // Her güncellemede alanı sıfırdan çiz
  goruslerAlani.innerHTML = "";

  if (snapshot.empty) {
    // Veri yoksa bilgilendirme göster
    goruslerAlani.innerHTML =
      '<p class="bos-durum">Henüz görüş bildiren yok. İlk görüş geri bildirimini sen gönder.</p>';
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
    if (veri.gorus) {
      kartIcerigi += `<p><strong>Görüş&Geri Bildirim:</strong> ${guvenliMetin(veri.gorus)}</p>`;
    }

    for (const [anahtar, deger] of Object.entries(veri)) {
      // Sabit gösterdiklerimizi tekrar etme
      if (anahtar !== "tarih" && anahtar !== "isim" && anahtar !== "gorus") {
        // Yeni eklenen alanlar otomatik görünür
        const etiket = guvenliMetin(anahtar.toLocaleUpperCase("tr-TR"));
        kartIcerigi += `<p><strong>${etiket}:</strong> ${guvenliMetin(deger)}</p>`;
      }
    }

    // Kartı gorus listesine ekle
    const gorusId = docSnap.id; // Silme butonunda kullanılacak belge id'si
    goruslerAlani.innerHTML += `
            <div class="gorus-kutu">
                <button type="button" class="gorus-sil-btn" data-gorus-id="${gorusId}" aria-label="Görüşü sil">🗑️</button>
                <div class="gorus-kutu-govde">
                  ${kartIcerigi}
                </div>
            </div>
        `;
  });
});

// Sil butonları için tek event listener (dinamik HTML uyumlu)
goruslerAlani.addEventListener("click", async (e) => {
  const btn = e.target.closest(".gorus-sil-btn");
  if (!btn) return;

  const gorusId = btn.getAttribute("data-gorus-id");
  if (!gorusId) return;

  // Giriş yoksa sadece üstteki uyarıyı göster
  if (!auth.currentUser) {
    if (authUyari) {
      authUyari.classList.remove("gizli");
      authUyari.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return;
  }

  try {
    await deleteDoc(doc(db, "gorusler", gorusId));
    alert("Görüş silindi");
  } catch (err) {
    // Yanlış şifre / yetki yoksa veya Rules izin vermiyorsa buraya düşer
    alert("Yetkisiz işlem! Silme yetkiniz yok.");
  }
});