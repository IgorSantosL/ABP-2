function listarQuestao() {
    // Verifica se o usuário está logado
    if (usuarioLogado) {
      
    } else {
        alert("Ocorreu um erro ao se conectar com o servidor.")
    }
}

document.getElementById('enviarRespostas').addEventListener('click', async () => {
  console.log('Enviando requisição para /salvar-respostas');

  const form = document.getElementById('questionario');
  const respostas = {
      q1: form.q1.value === "true",
      q2: form.q2.value === "true",
      q3: form.q3.value === "true",
  };
  console.log('Respostas:', respostas);

  // Obtém o email do usuário do localStorage
  const usuario = localStorage.getItem('usuario');
  const usuarioObj = JSON.parse(usuario);  // Parse para objeto
  const mail = usuarioObj.email;  // Agora usamos o email
  console.log('Email do Usuário:', mail);
  
  if (!mail) {
      alert('Usuário não está logado.');
      return;
  }

  // Estrutura os dados para envio com o email
  const data = [
      { idquestao: 1, resposta_aluno: respostas.q1 },
      { idquestao: 2, resposta_aluno: respostas.q2 },
      { idquestao: 3, resposta_aluno: respostas.q3 },
  ].map(item => ({ ...item, mail })); // Enviando email no lugar de idusuario

  console.log('Dados enviados:', JSON.stringify(data, null, 2));

  // Enviar para o servidor
  try {
      const response = await fetch('http://localhost:3000/salvar-respostas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
      });

      console.log('Resposta do servidor:', response);

    if (response.ok) {
        alert('Respostas enviadas com sucesso!');
    } else {
        const errorText = await response.text(); // Tenta obter a mensagem de erro do servidor
        console.log('Erro no servidor:', errorText); // Log do erro retornado
        alert('Erro ao enviar respostas.');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao conectar com o servidor.');
}});

