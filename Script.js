function fazerLogin() {
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    
    if (usuario === 'LOJA-CAOS-77' && senha === '777777') {
        window.location.href = 'painel.html';
    } else {
        document.getElementById('erro-login').textContent = '❌ USUÁRIO OU SENHA INCORRETOS!';
    }
}
