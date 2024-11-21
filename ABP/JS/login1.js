const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
const btnPopup = document.querySelector(".btnlogin-popup");
const iconClose = document.querySelector(".icon-close");

// Manter a alternância entre as abas de login e cadastro
registerLink.addEventListener("click", () => {
  wrapper.classList.add("active");
});

loginLink.addEventListener("click", () => {
  wrapper.classList.remove("active");
});

btnPopup.addEventListener("click", () => {
  wrapper.classList.add("active-popup");
});

iconClose.addEventListener("click", () => {
  wrapper.classList.remove("active-popup");
});

// Lógica de Cadastro
const registerForm = document.querySelector(".form-box.register form");
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = registerForm.querySelector('input[type="text"]').value;
  const email = registerForm.querySelector('input[type="email"]').value;

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message || "Cadastro realizado com sucesso!");
      wrapper.classList.remove("active"); // Retorna para a aba de login
    } else {
      alert(data.message || "Erro ao cadastrar usuário.");
    }
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    alert("Ocorreu um erro ao se conectar com o servidor.");
  }
});

// Seleciona o formulário de login pelo ID ou outra forma
const loginForm = document.querySelector(".form-box.login form"); // Supondo que o formulário tenha o ID "login-form"

// Lógica de Login
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = loginForm.querySelector('input[type="email"]').value;

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message || "Login realizado com sucesso!");
      localStorage.setItem("usuario", JSON.stringify({ email })); // Armazena o usuário no navegador
      window.location.href = "./template.html"; // Redireciona após o login
    } else {
      alert(data.message || "Erro ao fazer login.");
    }
  } catch (error) {
    console.error("Erro ao logar:", error);
    alert("Ocorreu um erro ao se conectar com o servidor.");
  }
});

