// 🔑 USUÁRIOS CADASTRADOS
const usuarios = {
  "ADMIN": { senha: "123477", nivel: "admin" },
  "VISITANTE": { senha: "1234", nivel: "visitante" }
};

// 🔐 FUNÇÃO DE LOGIN
function verificarLogin() {
  const user = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value;
  const msgErro = document.getElementById("erro");

  if (usuarios[user] && usuarios[user].senha === senha) {
    localStorage.setItem("usuario", user);
    localStorage.setItem("nivel", usuarios[user].nivel);
    
    if (usuarios[user].nivel === "admin") {
      window.location.href = "controle.html";
    } else {
      window.location.href = "painel.html";
    }
  } else {
    msgErro.style.display = "block";
  }
}

// 🚀 VERIFICAR SESSÃO
function verificarSessao() {
  const user = localStorage.getItem("usuario");
  const nivel = localStorage.getItem("nivel");
  
  if (!user && !window.location.pathname.includes("index.html")) {
    window.location.href = "index.html";
  }
}

// 📝 SALVAR DADOS
function salvarDados(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

// 📖 CARREGAR DADOS
function carregarDados(chave, padrao = []) {
  const dados = localStorage.getItem(chave);
  return dados ? JSON.parse(dados) : padrao;
}

// 🔒 BLOQUEAR CAMPOS PARA VISITANTE
function bloquearParaVisitante() {
  if (localStorage.getItem("nivel") === "visitante") {
    document.querySelectorAll("input, button, select, textarea").forEach(el => {
      if (!el.classList.contains("permite-visitante")) {
        el.disabled = true;
        el.style.opacity = "0.5";
      }
    });
    const avisos = document.createElement("div");
    avisos.style.cssText = "background:#ff6b0020;color:#ff6b00;padding:10px;border-radius:6px;margin-bottom:20px;text-align:center;";
    avisos.innerHTML = "👁️ Modo visualização — sem permissão para editar";
    document.querySelector(".container").prepend(avisos);
  }
}

// 🚪 SAIR
function sair() {
  localStorage.clear();
  window.location.href = "index.html";
}
