function listarQuestao() {
    // Verifica se o usuário está logado
    if (usuarioLogado) {
        document.getElementById("btnLogin").style.display = "none";
    } else {
        alert("Ocorreu um erro ao se conectar com o servidor.");
    }
}

async function verificarProgresso(numeroQuestionario) {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
        console.error('Usuário não está logado.');
        return;
    }

    const usuarioObj = JSON.parse(usuario);
    const email = usuarioObj.email;

    try {
        const response = await fetch('http://localhost:3000/verificar-progresso', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, numeroQuestionario }),
        });

        if (response.ok) {
            const data = await response.json();
            const questionarioRespondido = data.questionarioRespondido;

            // Atualiza dinamicamente o localStorage com base no número do questionário
            const storageKey = `questionario${numeroQuestionario}Respondido`;
            localStorage.setItem(storageKey, questionarioRespondido ? 'true' : 'false');
        } else {
            console.error('Erro ao verificar progresso.');
        }
    } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await verificarProgresso(4);

    const usuarioRespondeu = localStorage.getItem('questionario4Respondido');
    if (usuarioRespondeu === 'true') {
        alert('Você já passou neste questionário e não pode respondê-lo novamente.');
        document.getElementById('enviarRespostas').disabled = true;
        window.location.href = 'trilha_5_1.html';
    }

    const enviarRespostasBtn = document.getElementById('enviarRespostas');
    if (enviarRespostasBtn) {
        enviarRespostasBtn.addEventListener('click', async () => {
            const form = document.getElementById('questionario');
            if (form) {
                console.log("botão encontrado");
            } else {
                console.log("botão não encontrado");
            }

            // IDs das questões do questionário atual
            const questionarioAtual = [10, 11, 12]; // IDs fictícios; substitua pelos corretos do quarto questionário
            const numeroQuestionario = 4; // Número do questionário atual

            // Mapeia as respostas do formulário
            const respostas = questionarioAtual.map((idquestao, index) => ({
                idquestao,
                resposta_aluno: form[`q${index + 1}`].value === 'true',
            }));

            // Obtém o email do usuário
            const usuario = localStorage.getItem('usuario');
            const usuarioObj = JSON.parse(usuario);
            const mail = usuarioObj?.email;

            if (!mail) {
                alert('Usuário não está logado.');
                return;
            }

            // Adiciona o email e o número do questionário às respostas
            const data = {
                respostas: respostas.map(item => ({ ...item, mail })),
                numeroQuestionario, // Inclui o número do questionário
            };

            try {
                const response = await fetch('http://localhost:3000/salvar-respostas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log("o resultado do result é :", result);
                    if (result.redirect) {
                        alert('Você obteve êxito no questionário. Parabéns!');
                        document.getElementById('enviarRespostas').disabled = true;
                        window.location.href = result.redirect;
                        localStorage.setItem('questionario4Respondido', 'true');
                        
                    } else {
                        alert('Você não atingiu o número mínimo de acertos. Tente novamente.');
                    }
                } else {
                    alert('Erro ao enviar respostas.');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao conectar com o servidor.');
            }
        });
    } else {
        console.log('Botão "Enviar Respostas" não encontrado');
    }
});
