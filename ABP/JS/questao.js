function exibirMail() {
    let usuario = localStorage.getItem("usuario");
    //if (usuario) {
    //  usuario.mail = JSON.parse(usuario);
    //  document.getElementById("email").innerText = usuario.mail;
    //}
    //   }
}
function listarQuestao() {
    // Verifica se o usuário está logado
    if (usuarioLogado) {
      document.getElementById("btnLogin").style.display="none"
  
    } else {
        document.getElementById("botao-logout").style.display="none"
        document.getElementById("saida").innerHTML =
       "<p>O usuário não está logado. Clique para efetuar o <a href='./login.html'>login</a>.</p>";
        const mensagem = "Usuário não logado, realize o login para continuar";
        alert(mensagem);
    }
}

  