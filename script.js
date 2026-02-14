// ===== CONFIG =====
let secondsToWait = 10;

// ✅ GIF de fondo del cartelito (pon tu URL aquí)
const MODAL_GIF_URL = "https://media1.tenor.com/m/QaPEi-tcFXQAAAAd/gato-besando-a-la-camara.gif";
// ==================

const panel = document.getElementById("panel");
const envelope = document.getElementById("envelope");
const timerEl = document.getElementById("timer");
const hintEl = document.getElementById("hint");

const modal = document.getElementById("modal");
const modalBackdrop = document.getElementById("modalBackdrop");
const closeBtn = document.getElementById("closeBtn");
const modalCard = document.getElementById("modalCard");

// ✅ MP3 (DEBE EXISTIR EN EL HTML: <audio id="bgm">)
const bgm = document.getElementById("bgm");

let remaining = secondsToWait;
let ready = false;

function pad(n){ return String(n).padStart(2,"0"); }

function formatTime(sec){
  sec = Math.max(0, sec);
  const d = Math.floor(sec / 86400);
  sec %= 86400;
  const h = Math.floor(sec / 3600);
  sec %= 3600;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${pad(d)}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`;
}

function setReady(){
  ready = true;
  hintEl.textContent = "Ya puedes abrir la carta 💗 (tócala)";
}

function tick(){
  timerEl.textContent = formatTime(remaining);
  if (remaining <= 0){
    setReady();
    clearInterval(intv);
    return;
  }
  remaining -= 1;
}
tick();
const intv = setInterval(tick, 1000);


/* =========================
   🎵 MP3 PLAY / PAUSE (Github-safe)
   ========================= */

async function playMusic(){
  if(!bgm) return;
  try{
    // opcional: arrancar desde el inicio cada vez que abre
    // bgm.currentTime = 0;
    await bgm.play();
  }catch(err){
    console.log("Audio bloqueado o no disponible:", err);
  }
}

function stopMusic(){
  if(!bgm) return;
  bgm.pause();
}

/* =========================
   MODAL
   ========================= */

function openModal(){
  // setea el gif como fondo del cartelito
  modalCard.style.backgroundImage = `url("${MODAL_GIF_URL}")`;

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

function openLetter(){
  openModal();
  playMusic();   // ✅ inicia MP3 al abrir
}

function closeLetter(){
  closeModal();
  stopMusic();   // ✅ pausa MP3 al cerrar
}

envelope.addEventListener("click", () => {
  if(!ready) return;

  // toggle (si está abierto, cierra)
  const isOpen = modal.classList.contains("show");
  if(isOpen) closeLetter();
  else openLetter();
});

// cerrar
closeBtn.addEventListener("click", closeLetter);
modalBackdrop.addEventListener("click", closeLetter);


/* =========================
   GIF FLOTANDO
   ========================= */

const heartsContainer = document.querySelector(".hearts");

// 🔥 PON AQUÍ EL NOMBRE DE TU GIF
const FLOATING_GIF = "crrr.gif";

function createGif(){
  if(!heartsContainer) return;

  const gif = document.createElement("img");
  gif.src = FLOATING_GIF;
  gif.className = "gif-float";

  const left = Math.random() * 100;
  const size = 40 + Math.random() * 40;   // tamaño variable
  const duration = 6 + Math.random() * 6;
  const dx = (Math.random() * 100 - 50) + "px";
  const scale = (0.7 + Math.random() * 0.8).toFixed(2);

  gif.style.left = left + "vw";
  gif.style.width = size + "px";
  gif.style.animationDuration = duration + "s";
  gif.style.setProperty("--dx", dx);
  gif.style.setProperty("--s", scale);

  heartsContainer.appendChild(gif);

  setTimeout(() => gif.remove(), duration * 1000 + 500);
}

setInterval(createGif, 500);

// ⚠️ OJO: en tu JS original llamabas createHeart pero NO existe.
// Eso te puede estar rompiendo el script y por eso “no pasa nada”.
/* 
setInterval(createHeart, 320);
setInterval(createHeart, 400);
*/

// tecla ESC
document.addEventListener("keydown", (e) => {
  if(e.key === "Escape" && modal.classList.contains("show")){
    closeLetter();
  }
});