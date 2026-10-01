"use strict";

/* Para criar uma trilha nova, basta adicionar um objeto em "trilhas".
   Cards, guia rápido da navbar e a página da trilha se atualizam sozinhos. */

const categorias = {
  redes: { nome: "Redes", icone: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 7.5v4M12 11.5l-5.5 5.5M12 11.5l5.5 5.5"/>' },
  seguranca: { nome: "Segurança", icone: '<path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>' },
  dev: { nome: "Desenvolvimento", icone: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>' },
  nuvem: { nome: "Nuvem", icone: '<path d="M7 18a4 4 0 010-8 5.5 5.5 0 0110.5 1.5A3.3 3.3 0 0117 18z"/>' }
};
const icone = cat => `<svg viewBox="0 0 24 24" aria-hidden="true">${categorias[cat].icone}</svg>`;

/* Linhas do terminal: p = comando, o = saída de sucesso, c = comentário, n = texto normal */
const p = t => ["pr", t], o = t => ["ok", t], c = t => ["cm", t], n = t => ["", t];

const trilhas = [
  { id: "redes-fundamentos", titulo: "Fundamentos de redes", cat: "redes", nivel: "Iniciante", horas: 12,
    desc: "Modelo OSI, TCP/IP, endereçamento IP e sub-redes na prática.",
    modulos: [
      { t: "Modelo OSI e TCP/IP", d: "Entenda as camadas que levam um dado de um computador a outro e onde cada protocolo atua.",
        cmd: [p("$ traceroute novati.dev"), n(" 1  roteador.local  1 ms"), n(" 2  provedor.net  9 ms"), o(" 3  novati.dev  12 ms")] },
      { t: "Endereçamento IP", d: "Aprenda a ler o endereço IPv4, a máscara e o gateway da sua própria máquina.",
        cmd: [p("$ ip addr show"), n("inet 192.168.0.25/24"), p("$ ip route"), n("default via 192.168.0.1")] },
      { t: "Sub-redes", d: "Divida uma rede em partes menores usando a notação CIDR.",
        cmd: [c("# 192.168.0.0/24 = 254 hosts"), c("# 192.168.0.0/26 = 62 hosts"), o("4 sub-redes de 62 hosts cada")] }
    ] },
  { id: "redes-linux", titulo: "Linux para redes", cat: "redes", nivel: "Intermediário", horas: 16,
    desc: "Comandos essenciais, serviços, firewall e diagnóstico de conexão.",
    modulos: [
      { t: "Comandos essenciais", d: "Navegue por pastas, leia arquivos e consulte logs direto no terminal.",
        cmd: [p("$ ls -la /var/log"), p("$ tail -n 3 syslog"), n("Oct  1 09:12 serviço iniciado")] },
      { t: "Serviços e portas", d: "Veja quais serviços estão ativos e em quais portas eles escutam.",
        cmd: [p("$ ss -tuln"), n("tcp  LISTEN  0.0.0.0:22"), n("tcp  LISTEN  0.0.0.0:80")] },
      { t: "Firewall básico", d: "Libere apenas o necessário usando o UFW.",
        cmd: [p("$ sudo ufw allow 22/tcp"), o("Rule added"), p("$ sudo ufw enable"), o("Firewall is active")] }
    ] },
  { id: "seguranca-intro", titulo: "Introdução à segurança", cat: "seguranca", nivel: "Iniciante", horas: 10,
    desc: "Tríade CIA, tipos de ameaça, senhas e boas práticas de defesa.",
    modulos: [
      { t: "Tríade CIA", d: "Confidencialidade, integridade e disponibilidade são a base de qualquer decisão de segurança.",
        cmd: [c("# Confidencialidade: só quem deve, vê"), c("# Integridade: ninguém altera sem registro"), c("# Disponibilidade: o serviço continua no ar")] },
      { t: "Ameaças comuns", d: "Phishing, malware, força bruta e engenharia social: aprenda a reconhecer cada uma.",
        cmd: [p("$ grep 'Failed password' auth.log"), n("Failed password for admin from 203.0.113.7"), c("# várias tentativas seguidas = força bruta")] },
      { t: "Senhas e autenticação", d: "Hash, sal e verificação em duas etapas: por que senha nunca é guardada em texto puro.",
        cmd: [p('$ echo -n "senha123" | sha256sum'), n("<64 caracteres hexadecimais>  -"), c("# o hash não volta ao texto original")] }
    ] },
  { id: "seguranca-vuln", titulo: "Análise de vulnerabilidades", cat: "seguranca", nivel: "Intermediário", horas: 18,
    desc: "OWASP Top 10, varreduras e relatório de achados em laboratório.",
    modulos: [
      { t: "OWASP Top 10", d: "Conheça as falhas mais comuns em aplicações web, como injeção e controle de acesso quebrado.",
        cmd: [c("# A01 Controle de acesso quebrado"), c("# A03 Injeção"), c("# A07 Falhas de autenticação")] },
      { t: "Varredura em laboratório", d: "Pratique somente em ambientes seus ou autorizados, como uma máquina virtual de laboratório.",
        cmd: [p("$ nmap -sV 127.0.0.1"), n("22/tcp  open  ssh"), n("80/tcp  open  http")] },
      { t: "Relatório de achados", d: "Descreva a falha, o impacto e a correção em linguagem clara.",
        cmd: [n("Achado: cabeçalho de segurança ausente"), n("Risco: médio"), o("Correção: adicionar Content-Security-Policy")] }
    ] },
  { id: "dev-web", titulo: "HTML, CSS e JavaScript", cat: "dev", nivel: "Iniciante", horas: 20,
    desc: "Monte páginas responsivas e adicione comportamento com JavaScript.",
    modulos: [
      { t: "HTML: a estrutura", d: "Marque títulos, parágrafos, links e formulários com as tags certas.",
        cmd: [n("<h1>Olá, TI!</h1>"), n("<p>Minha primeira página.</p>"), n('<a href="contato.html">Contato</a>')] },
      { t: "CSS: a aparência", d: "Defina cores, espaçamento e layout, e deixe a página responsiva.",
        cmd: [n("h1 { color: #6d3fd9; }"), n("p  { max-width: 60ch; }"), n("@media (max-width: 800px) { ... }")] },
      { t: "JavaScript: o comportamento", d: "Reaja a cliques, valide formulários e altere a página em tempo real.",
        cmd: [n('document.querySelector("button")'), n('  .addEventListener("click", () => {'), n('    alert("Oi!");'), n("  });")] }
    ] },
  { id: "dev-git", titulo: "Git e GitHub", cat: "dev", nivel: "Iniciante", horas: 6,
    desc: "Versionamento, branches, pull requests e trabalho em equipe.",
    modulos: [
      { t: "Seu primeiro repositório", d: "Crie um repositório e registre o histórico do projeto com commits.",
        cmd: [p("$ git init"), p("$ git add ."), p('$ git commit -m "primeiro commit"')] },
      { t: "Branches", d: "Trabalhe em uma funcionalidade sem mexer na versão principal.",
        cmd: [p("$ git switch -c minha-feature"), o("Switched to a new branch 'minha-feature'")] },
      { t: "GitHub e pull requests", d: "Envie seu trabalho e peça a revisão do time antes de juntar tudo.",
        cmd: [p("$ git push -u origin minha-feature"), c("# depois, abra o pull request no GitHub")] }
    ] },
  { id: "nuvem-intro", titulo: "Nuvem do zero", cat: "nuvem", nivel: "Iniciante", horas: 8,
    desc: "IaaS, PaaS e SaaS, regiões, custos e primeiros recursos online.",
    modulos: [
      { t: "IaaS, PaaS e SaaS", d: "Veja o que você gerencia e o que o provedor gerencia em cada modelo.",
        cmd: [c("# IaaS: você cuida do servidor virtual"), c("# PaaS: você só publica o código"), c("# SaaS: você usa o software pronto")] },
      { t: "Regiões e custos", d: "Escolha onde rodar seus recursos e acompanhe o quanto está gastando.",
        cmd: [c("# região mais próxima = menos latência"), c("# crie um alerta de orçamento logo no início")] },
      { t: "Seu primeiro recurso", d: "Crie um servidor virtual e acesse por SSH.",
        cmd: [p("$ ssh usuario@203.0.113.10"), o("Welcome to Ubuntu")] }
    ] },
  { id: "nuvem-docker", titulo: "Contêineres com Docker", cat: "nuvem", nivel: "Intermediário", horas: 14,
    desc: "Imagens, volumes, redes e Docker Compose para rodar projetos.",
    modulos: [
      { t: "Imagens e contêineres", d: "Baixe uma imagem e rode uma aplicação isolada com um único comando.",
        cmd: [p("$ docker run -d -p 8080:80 nginx"), n("7f3a1c9e2b4d"), c("# abra http://localhost:8080")] },
      { t: "Volumes e redes", d: "Guarde dados fora do contêiner e conecte serviços entre si.",
        cmd: [p("$ docker volume create dados"), n("dados"), p("$ docker network create rede-app")] },
      { t: "Docker Compose", d: "Descreva vários serviços em um arquivo e suba tudo junto.",
        cmd: [n("services:"), n("  site:"), n("    image: nginx"), n('    ports: ["8080:80"]'), p("$ docker compose up -d")] }
    ] }
];
