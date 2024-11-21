const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg'); // Biblioteca para integração com PostgreSQL

// Configuração do pool de conexão com PostgreSQL
const pool = new Pool({
    user: 'postgres',        // Usuário do PostgreSQL
    host: 'localhost',           // Host do banco de dados
    database: 'ABP-teste',   // Nome do banco de dados
    password: 'admin',       // Senha do usuário
    port: 5432,                  // Porta padrão do PostgreSQL ou 5433
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

app.post('/salvar-respostas', async (req, res) => {
  console.log(req.body)
  const respostas = req.body;

  try {
      // Conectando ao banco
      const client = await pool.connect();

      // Para cada resposta, buscar o idusuario a partir do email
      for (const resposta of respostas) {
          const { mail, idquestao, resposta_aluno } = resposta;

          // Busca o idusuario pelo email
          const result = await client.query('SELECT id FROM tbusuario WHERE email = $1;', [mail]);
          console.log( 'ROWS ´É: ', result.rows);
          if (result.rows.length === 0) {
              console.error(`Usuário com email ${mail} não encontrado.`);
              continue;
          }

          const idusuario = result.rows[0].id;
          console.log("o usuario é: ", idusuario);
          // Insere as respostas no banco de dados com o idusuario correto
          await client.query(
              `INSERT INTO tbquestao_por_usuario (idusuario, idquestao, resposta_aluno)
               VALUES ($1, $2, $3);`,
              [idusuario, idquestao, resposta_aluno]
          );
      }

      client.release();
      res.status(200).send('Respostas salvas com sucesso.');

  } catch (error) {
      console.error('Erro ao salvar respostas:', error.stack);
      res.status(500).send('Erro no servidor.');
  }
});


// Inicializar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});