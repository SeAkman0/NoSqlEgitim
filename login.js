import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const formBtn = document.getElementById("girisBtn");
const emailInput = document.getElementById("emailInput");
const sifreInput = document.getElementById("sifreInput");

const returnTo =
  new URLSearchParams(window.location.search).get("returnTo") ||
  "index.html";

formBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const sifre = sifreInput.value.trim();

  if (!email || !sifre) {
    return alert("Lütfen e-posta ve şifreyi girin.");
  }

  try {
    await signInWithEmailAndPassword(auth, email, sifre);
    window.location.href = returnTo;
  } catch (e) {
    alert("Giriş başarısız! E-posta/şifre yanlış olabilir.");
  }
});

