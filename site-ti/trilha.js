"use strict";
/* Página de uma trilha: lê ?id=... da URL e monta o conteúdo */

const esc = s => s.replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
const figura = (linhas, rotulo) => `
  <div class="terminal" role="img" aria-label="${esc(rotulo)}">
    <div class="terminal-barra"><i></i><i></i><i></i></div>
    <pre>${linhas.map(([cl, tx]) => `<span class="${cl}">${esc(tx)}</span>`).join("\n")}</pre>
  </div>`;

const id = new URLSearchParams(location.search).get("id");
const t = trilhas.find(x => x.id === id);
const raiz = $("#trilha");

if (!t) {
  document.title = "Trilha não encontrada — NovaTI";
  raiz.innerHTML = `
    <section class="secao">
      <h1>Trilha não encontrada</h1>
      <p class="sub">O endereço não corresponde a nenhuma trilha. Volte e escolha uma da lista.</p>
      <p style="margin-top:20px"><a class="btn btn-primario" href="index.html#trilhas">Ver trilhas</a></p>
    </section>`;
} else {
  document.title = `${t.titulo} — NovaTI`;
  const cat = categorias[t.cat];
  const proximas = [...trilhas.filter(x => x.cat === t.cat && x.id !== t.id), ...trilhas.filter(x => x.cat !== t.cat)].slice(0, 3);

  raiz.innerHTML = `
    <section class="trilha-hero cat-${t.cat}">
      <div>
        <p class="migalhas"><a href="index.html#trilhas">Trilhas</a> / ${cat.nome}</p>
        <h1>${t.titulo}</h1>
        <p class="lead">${t.desc}</p>
        <div class="hero-botoes">
          <a class="btn btn-primario" href="#modulos">Começar a trilha</a>
          <a class="btn btn-sec" href="index.html#trilhas">Voltar às trilhas</a>
        </div>
      </div>
      <div class="painel">
        <span class="icone-cat grande">${icone(t.cat)}</span>
        <dl>
          <div><dt>Módulos</dt><dd>${t.modulos.length}</dd></div>
          <div><dt>Duração</dt><dd>${t.horas} h</dd></div>
          <div><dt>Nível</dt><dd>${t.nivel}</dd></div>
        </dl>
      </div>
    </section>

    <section class="secao" id="modulos">
      <h2>O que você vai aprender</h2>
      <p class="sub">Siga os módulos na ordem. Cada um traz uma explicação e um exemplo prático.</p>
      <div class="modulos">
        ${t.modulos.map((m, i) => `
          <article class="modulo">
            <div class="modulo-texto">
              <span class="modulo-n">${i + 1}</span>
              <h3>${m.t}</h3>
              <p>${m.d}</p>
            </div>
            ${figura(m.cmd, "Exemplo: " + m.t)}
          </article>`).join("")}
      </div>
    </section>

    <section class="secao">
      <h2>Continue estudando</h2>
      <p class="sub">Outras trilhas para o seu próximo passo.</p>
      <div class="grade">${proximas.map(cartao).join("")}</div>
    </section>`;
}
