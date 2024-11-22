const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg'); // Biblioteca para integração com PostgreSQL

// Configuração do pool de conexão com PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ABP-teste',
    password: 'admin',
    port: 5432,
});

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rota raiz
app.get('/', (req, res) => {
    res.send('Servidor está funcionando! Acesse as rotas /register e /login.');
});

// Rota de cadastro
app.post('/register', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Nome e email são obrigatórios.' });
    }

    try {
        const userExists = await pool.query('SELECT * FROM tbusuario WHERE email = $1', [email]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Usuário já cadastrado com esse email.' });
        }

        await pool.query('INSERT INTO tbusuario (nome, email) VALUES ($1, $2)', [name, email]);
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
    }
});

// Rota de login
app.post('/login', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email é obrigatório.' });
    }

    try {
        const user = await pool.query('SELECT * FROM tbusuario WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json({ message: 'Login realizado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao realizar login.' });
    }
});

// Rota para salvar respostas
app.post('/salvar-respostas', async (req, res) => {
  const { respostas, numeroQuestionario } = req.body;

  if (!respostas || !numeroQuestionario) {
      return res.status(400).json({ message: 'Respostas e número do questionário são obrigatórios.' });
  }

  try {
      const client = await pool.connect();
      let acertos = 0;
      let idusuario;

      // Extrai IDs das questões sendo respondidas
      const idQuestoes = respostas.map((resposta) => resposta.idquestao);

      for (const resposta of respostas) {
          const { mail, idquestao, resposta_aluno } = resposta;

          // Obtém o idusuario apenas uma vez
          if (!idusuario) {
              const result = await client.query('SELECT id FROM tbusuario WHERE email = $1;', [mail]);
              if (result.rows.length === 0) {
                  console.error(`Usuário com email ${mail} não encontrado.`);
                  res.status(400).json({ message: 'Usuário não encontrado.' });
                  client.release();
                  return;
              }
              idusuario = result.rows[0].id;
          }

          await client.query(
              `INSERT INTO tbquestao_por_usuario (idusuario, idquestao, resposta_aluno)
              VALUES ($1, $2, $3)
              ON CONFLICT (idusuario, idquestao) 
              DO UPDATE SET resposta_aluno = $3;`,
              [idusuario, idquestao, resposta_aluno]
          );

          const respostaCorreta = await client.query(
              `SELECT resposta FROM tbquestao WHERE id = $1;`,
              [idquestao]
          );

          if (respostaCorreta.rows.length === 0) {
              console.error(`Questão com id ${idquestao} não encontrada.`);
              continue;
          }

          const respostaEsperada = respostaCorreta.rows[0].resposta;
          if (resposta_aluno === respostaEsperada) {
              acertos++;
          }
      }

      // Campo dinâmico para o questionário
      const questionarioField = `questionario_${numeroQuestionario}`;
      const redirectPage = `trilha_${numeroQuestionario + 1}_1.html`;

      if (acertos >= 2) {
          await client.query(
              `UPDATE tbquestao_por_usuario 
              SET ${questionarioField} = TRUE 
              WHERE idusuario = $1;`,
              [idusuario]
          );

          res.status(200).json({
              message: 'Usuário passou no questionário.',
              redirect: redirectPage,
          });
      } else {
          // Remove apenas as questões do questionário atual
          await client.query(
              `DELETE FROM tbquestao_por_usuario 
              WHERE idusuario = $1 
              AND idquestao = ANY($2::int[]);`,
              [idusuario, idQuestoes]
          );

          res.status(200).json({
              message: 'Usuário não passou no questionário.',
              redirect: null,
          });
      }

      client.release();
  } catch (error) {
      console.error('Erro ao salvar respostas:', error.stack);
      res.status(500).send('Erro no servidor.');
  }
});


// Rota para verificar progresso
app.post('/verificar-progresso', async (req, res) => {
  const { email, numeroQuestionario } = req.body;

  if (!email || !numeroQuestionario) {
      return res.status(400).json({ message: 'Email e número do questionário são obrigatórios.' });
  }

  try {
      // Campo dinâmico baseado no número do questionário
      const questionarioField = `questionario_${numeroQuestionario}`;

      const result = await pool.query(
          `SELECT ${questionarioField} AS questionario_respondido 
          FROM tbquestao_por_usuario 
          JOIN tbusuario ON tbquestao_por_usuario.idusuario = tbusuario.id 
          WHERE tbusuario.email = $1;`,
          [email]
      );

      if (result.rows.length === 0) {
          return res.status(200).json({ questionarioRespondido: false });
      }

      const questionarioRespondido = result.rows[0].questionario_respondido;
      res.status(200).json({ questionarioRespondido });
  } catch (error) {
      console.error('Erro ao verificar progresso:', error);
      res.status(500).json({ message: 'Erro ao verificar progresso.' });
  }
});


// Inicializar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
