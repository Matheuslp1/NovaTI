"use strict";

/* ---------- Utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const norm = t => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function lerArmazenamento(chave) {
  try { return localStorage.getItem(chave); } catch { return null; }
}
function gravarArmazenamento(chave, valor) {
  try { localStorage.setItem(chave, valor); } catch { /* ignora */ }
}

let toastTimer;
function toast(msg) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("mostra");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("mostra"), 3000);
}

/* Card de trilha (usado na home e na página da trilha) */
const cartao = t => `
  <a class="card cat-${t.cat}" href="trilha.html?id=${t.id}">
    <span class="icone-cat">${icone(t.cat)}</span>
    <h3>${t.titulo}</h3>
    <p>${t.desc}</p>
    <div class="meta">
      <span class="tag">${categorias[t.cat].nome}</span>
      <span class="tag">${t.nivel}</span>
      <span class="tag">${t.horas} h</span>
    </div>
    <span class="abrir">Abrir trilha</span>
  </a>`;

/* ---------- Modo escuro ---------- */
const btnTema = $("#tema");
function aplicarTema(escuro) {
  document.documentElement.dataset.tema = escuro ? "escuro" : "claro";
  btnTema.setAttribute("aria-pressed", String(escuro));
}
const salvo = lerArmazenamento("tema");
aplicarTema(salvo ? salvo === "escuro" : matchMedia("(prefers-color-scheme: dark)").matches);
btnTema.addEventListener("click", () => {
  const escuro = document.documentElement.dataset.tema !== "escuro";
  aplicarTema(escuro);
  gravarArmazenamento("tema", escuro ? "escuro" : "claro");
});

/* ---------- Menu mobile ---------- */
const menu = $("#menu"), menuBtn = $("#menuBtn");
menuBtn.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  menuBtn.setAttribute("aria-expanded", String(aberto));
});
$$(".aba").forEach(a => a.addEventListener("click", () => {
  menu.classList.remove("aberto");
  menuBtn.setAttribute("aria-expanded", "false");
}));

/* ---------- Guia rápido (aparece ao passar o mouse em "Trilhas") ---------- */
$("#guia").innerHTML = `
  <div class="guia-caixa">
    <p class="guia-titulo">Guia rápido: escolha uma trilha e comece</p>
    <div class="guia-cols">
      ${Object.entries(categorias).map(([k, cat]) => `
        <div class="guia-col cat-${k}">
          <div class="guia-cab"><span class="icone-cat">${icone(k)}</span><strong>${cat.nome}</strong></div>
          <ul>
            ${trilhas.filter(t => t.cat === k).map(t => `
              <li><a href="trilha.html?id=${t.id}">${t.titulo}<small>${t.nivel}, ${t.horas} h</small></a></li>`).join("")}
          </ul>
        </div>`).join("")}
    </div>
    <a class="guia-todas" href="index.html#trilhas">Ver todas as trilhas</a>
  </div>`;

$("#ano").textContent = new Date().getFullYear();
