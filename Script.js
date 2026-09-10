const USUARIO_CORRETO = "LOJA-CAOS-77";
const SENHA_CORRETA = "777777";

function carregarDados() {
    if (!localStorage.getItem('caixaFac')) localStorage.setItem('caixaFac', JSON.stringify({ valor: 0 }));
    if (!localStorage.getItem('valorFragmento')) localStorage.setItem('valorFragmento', JSON.stringify({ valor: 0 }));
    if (!localStorage.getItem('farmadores')) localStorage.setItem('farmadores', JSON.stringify([]));
    if (!localStorage.getItem('relatorios')) localStorage.setItem('relatorios', JSON.stringify([]));
}

function fazerLogin() {
    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const erro = document.getElementById('erro-login');
    if (usuario === USUARIO_CORRETO && senha === SENHA_CORRETA) {
        document.getElementById('tela-login').style.display = 'none';
        document.getElementById('conteudo').style.display = 'block';
        carregarDados();
        atualizarTela();
    } else {
        erro.textContent = "Usuário ou senha incorretos!";
    }
}

function sair() {
    document.getElementById('usuario').value = '';
    document.getElementById('senha').value = '';
    document.getElementById('erro-login').textContent = '';
    document.getElementById('tela-login').style.display = 'flex';
    document.getElementById('conteudo').style.display = 'none';
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

function alterarCaixa() {
    const caixa = JSON.parse(localStorage.getItem('caixaFac'));
    const novoValor = prompt("Digite o valor atual da caixa:", caixa.valor);
    if (novoValor === null) return;
    const valorNumerico = parseFloat(novoValor.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
    localStorage.setItem('caixaFac', JSON.stringify({ valor: valorNumerico }));
    atualizarTela();
}

function alterarFragmento() {
    const frag = JSON.parse(localStorage.getItem('valorFragmento'));
    const novoValor = prompt("Digite o valor de 1 fragmento:", frag.valor);
    if (novoValor === null) return;
    const valorNumerico = parseFloat(novoValor.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
    localStorage.setItem('valorFragmento', JSON.stringify({ valor: valorNumerico }));
    atualizarTela();
}

function adicionarFarmador() {
    const nome = prompt("Nome do farmador:");
    if (!nome) return;
    const farmadores = JSON.parse(localStorage.getItem('farmadores')) || [];
    farmadores.push({ id: Date.now(), nome: nome, quantidade: 0, observacao: "" });
    localStorage.setItem('farmadores', JSON.stringify(farmadores));
    atualizarTela();
}

function alterarQuantidade(id) {
    const farmadores = JSON.parse(localStorage.getItem('farmadores')) || [];
    const idx = farmadores.findIndex(f => f.id === id);
    if (idx === -1) return;
    const qtdAtual = farmadores[idx].quantidade;
    const novaQtd = prompt(`Quantidade de fragmentos de ${farmadores[idx].nome}:`, qtdAtual);
    if (novaQtd === null) return;
    farmadores[idx].quantidade = parseInt(novaQtd) || 0;
    localStorage.setItem('farmadores', JSON.stringify(farmadores));
    atualizarTela();
}

function removerFarmador(id) {
    if (!confirm("Tem certeza que deseja remover este farmador?")) return;
    let farmadores = JSON.parse(localStorage.getItem('farmadores')) || [];
    farmadores = farmadores.filter(f => f.id !== id);
    localStorage.setItem('farmadores', JSON.stringify(farmadores));
    atualizarTela();
}

function gerarRelatorio() {
    const caixa = JSON.parse(localStorage.getItem('caixaFac')).valor;
    const valorFrag = JSON.parse(localStorage.getItem('valorFragmento')).valor;
    const farmadores = JSON.parse(localStorage.getItem('farmadores')) || [];
    let totalFrags = 0, valorTotalFarms = 0, listaFarmadores = "";
    farmadores.forEach(f => {
        totalFrags += f.quantidade;
        valorTotalFarms += f.quantidade * valorFrag;
        listaFarmadores += `• ${f.nome}: ${f.quantidade} fragmentos — ${formatarMoeda(f.quantidade * valorFrag)}\n`;
    });
    const relatorio = {
        id: Date.now(),
        data: new Date().toLocaleString('pt-BR'),
        caixa: caixa,
        valorFragmento: valorFrag,
        totalFragmentos: totalFrags,
        valorTotal: valorTotalFarms,
        farmadores: listaFarmadores
    };
    const relatorios = JSON.parse(localStorage.getItem('relatorios')) || [];
    relatorios.unshift(relatorio);
    localStorage.setItem('relatorios', JSON.stringify(relatorios));
    atualizarTela();
    alert("✅ Relatório gerado com sucesso!");
}

function excluirRelatorio(id) {
    if (!confirm("Excluir este relatório?")) return;
    let relatorios = JSON.parse(localStorage.getItem('relatorios')) || [];
    relatorios = relatorios.filter(r => r.id !== id);
    localStorage.setItem('relatorios', JSON.stringify(relatorios));
    atualizarTela();
}

function atualizarTela() {
    const caixa = JSON.parse(localStorage.getItem('caixaFac')).valor;
    const valorFrag = JSON.parse(localStorage.getItem('valorFragmento')).valor;
    const farmadores = JSON.parse(localStorage.getItem('farmadores')) || [];
    const relatorios = JSON.parse(localStorage.getItem('relatorios')) || [];

    document.getElementById('valor-caixa').textContent = formatarMoeda(caixa);
    document.getElementById('valor-fragmento').textContent = formatarMoeda(valorFrag);
    document.getElementById('total-farmadores').textContent = farmadores.length;

    const containerFarm = document.getElementById('lista-farmadores');
    if (farmadores.length === 0) {
        containerFarm.innerHTML = "<p style='color:#888; text-align:center; padding:1rem;'>Nenhum farmador cadastrado.</p>";
    } else {
        containerFarm.innerHTML = farmadores.map(f => {
            const valorIndividual = f.quantidade * valorFrag;
            return `<div><div class="farmador-cabecalho"><span class="farmador-nome">👤 ${f.nome}</span></div><div class="farmador-dados"><div class="dado"><div class="dado-label">Fragmentos</div><div class="dado-valor">💎 ${f.quantidade}</div></div><div class="dado"><div class="dado-label">Valor Total</div><div class="dado-valor">💰 ${formatarMoeda(valorIndividual)}</div></div></div><div class="btns-acao"><button class="btn-qtd" onclick="alterarQuantidade(${f.id})">✏️ Alterar Qtd</button><button class="btn-remover" onclick="removerFarmador(${f.id})">🗑️ Remover</button></div></div>`;
        }).join('');
    }

    const containerRel = document.getElementById('lista-relatorios');
    if (relatorios.length === 0) {
        containerRel.innerHTML = "<p style='color:#888; text-align:center; padding:1rem;'>Nenhum relatório ainda.</p>";
    } else {
        containerRel.innerHTML = relatorios.map(r => `<div><div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;"><strong>📅 ${r.data}</strong><button style="background:#660000; color:white; border:none; padding:0.3rem 0.7rem; border-radius:4px; cursor:pointer" onclick="excluirRelatorio(${r.id})">✕</button></div><div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin-bottom:0.8rem;"><div>💰 Caixa: <strong>${formatarMoeda(r.caixa)}</strong></div><div>💎 Valor Frag: <strong>${formatarMoeda(r.valorFragmento)}</strong></div><div>📦 Total Frags: <strong>${r.totalFragmentos}</strong></div><div>💵 Valor Total: <strong style="color:#ffd700">${formatarMoeda(r.valorTotal)}</strong></div></div><details><summary style="cursor:pointer; color:#00ffff;">Ver farmadores</summary><pre style="margin-top:0.5rem; white-space:pre-wrap; font-size:0.9rem;">${r.farmadores}</pre></details></div>`).join('');
    }
}

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && document.getElementById('tela-login').style.display !== 'none') fazerLogin();
});
