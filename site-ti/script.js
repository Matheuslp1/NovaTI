"use strict";

/* ---------- Dados ---------- */
const trilhas = [
  { titulo: "Fundamentos de redes", cat: "redes", nivel: "Iniciante", horas: 12, desc: "Modelo OSI, TCP/IP, endereçamento IP e sub-redes na prática." },
  { titulo: "Linux para redes", cat: "redes", nivel: "Intermediário", horas: 16, desc: "Comandos essenciais, serviços, firewall e diagnóstico de conexão." },
  { titulo: "Introdução à segurança", cat: "seguranca", nivel: "Iniciante", horas: 10, desc: "Tríade CIA, tipos de ameaça, senhas e boas práticas de defesa." },
  { titulo: "Análise de vulnerabilidades", cat: "seguranca", nivel: "Intermediário", horas: 18, desc: "OWASP Top 10, varreduras e relatório de achados em laboratório." },
  { titulo: "HTML, CSS e JavaScript", cat: "dev", nivel: "Iniciante", horas: 20, desc: "Monte páginas responsivas e adicione comportamento com JavaScript." },
  { titulo: "Git e GitHub", cat: "dev", nivel: "Iniciante", horas: 6, desc: "Versionamento, branches, pull requests e trabalho em equipe." },
  { titulo: "Nuvem do zero", cat: "nuvem", nivel: "Iniciante", horas: 8, desc: "IaaS, PaaS e SaaS, regiões, custos e primeiros recursos online." },
  { titulo: "Contêineres com Docker", cat: "nuvem", nivel: "Intermediário", horas: 14, desc: "Imagens, volumes, redes e Docker Compose para rodar projetos." }
];
const nomesCat = { redes: "Redes", seguranca: "Segurança", dev: "Desenvolvimento", nuvem: "Nuvem" };

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
  el.textContent = msg;
  el.classList.add("mostra");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("mostra"), 3000);
}

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

/* Destaca a aba da seção visível */
const secoes = ["inicio", "trilhas", "contato"].map(id => document.getElementById(id));
const obs = new IntersectionObserver(entradas => {
  entradas.forEach(e => {
    if (e.isIntersecting) {
      $$(".aba").forEach(a => a.classList.toggle("ativa", a.getAttribute("href") === "#" + e.target.id));
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });
secoes.forEach(s => obs.observe(s));

/* ---------- Terminal animado ---------- */
const linhas = [
  ["pr", "$ ping -c 2 novati.dev"],
  ["", "64 bytes from 203.0.113.10: time=12 ms"],
  ["", "64 bytes from 203.0.113.10: time=11 ms"],
  ["pr", "$ nmap -p 443 novati.dev"],
  ["ok", "443/tcp open  https"],
  ["pr", "$ _"]
];
const saida = $("#terminalTexto");
if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
  saida.innerHTML = linhas.map(([c, t]) => `<span class="${c}">${t}</span>`).join("\n");
} else {
  let i = 0;
  const passo = () => {
    if (i >= linhas.length) return;
    const [c, t] = linhas[i++];
    saida.insertAdjacentHTML("beforeend", `<span class="${c}">${t}</span>\n`);
    setTimeout(passo, 650);
  };
  passo();
}

/* ---------- Filtros ---------- */
const grade = $("#grade"), vazio = $("#vazio"), contagem = $("#contagem"), busca = $("#busca");
let catAtual = "todas";

function renderizar() {
  const termo = norm(busca.value.trim());
  const lista = trilhas.filter(t =>
    (catAtual === "todas" || t.cat === catAtual) &&
    (!termo || norm(t.titulo + " " + t.desc).includes(termo))
  );
  grade.innerHTML = lista.map(t => `
    <article class="card">
      <h3>${t.titulo}</h3>
      <p>${t.desc}</p>
      <div class="meta">
        <span class="tag">${nomesCat[t.cat]}</span>
        <span class="tag">${t.nivel}</span>
        <span class="tag">${t.horas} h</span>
      </div>
    </article>`).join("");
  vazio.hidden = lista.length > 0;
  contagem.textContent = lista.length === 1 ? "1 trilha encontrada" : `${lista.length} trilhas encontradas`;
}

$$(".chip").forEach(chip => chip.addEventListener("click", () => {
  $$(".chip").forEach(c => c.classList.remove("ativo"));
  chip.classList.add("ativo");
  catAtual = chip.dataset.cat;
  renderizar();
}));
busca.addEventListener("input", renderizar);
renderizar();

/* ---------- Formulário ---------- */
const form = $("#form"), msg = $("#msg");
msg.addEventListener("input", () => { $("#cont").textContent = msg.value.length; });

const regras = {
  nome: v => v.trim().length >= 2 || "Digite seu nome com pelo menos 2 letras.",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || "Digite um e-mail válido, como nome@exemplo.com.",
  area: v => v !== "" || "Escolha uma área de interesse.",
  msg: v => v.trim().length >= 10 || "Escreva pelo menos 10 caracteres."
};

function validar(campo) {
  const el = form.elements[campo];
  const r = regras[campo](el.value);
  const ok = r === true;
  el.setAttribute("aria-invalid", String(!ok));
  $("#erro-" + campo).textContent = ok ? "" : r;
  return ok;
}
Object.keys(regras).forEach(c => form.elements[c].addEventListener("blur", () => validar(c)));

form.addEventListener("submit", e => {
  e.preventDefault();
  const todosOk = Object.keys(regras).map(validar).every(Boolean);
  if (!todosOk) {
    toast("Corrija os campos destacados.");
    const primeiro = form.querySelector("[aria-invalid='true']");
    if (primeiro) primeiro.focus();
    return;
  }
  // Aqui você enviaria os dados a uma API (fetch). Neste projeto é apenas demonstração.
  form.reset();
  $("#cont").textContent = "0";
  toast("Mensagem enviada. Obrigado pelo contato!");
});

$("#ano").textContent = new Date().getFullYear();
