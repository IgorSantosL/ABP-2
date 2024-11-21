document.getElementById("btnLogin").addEventListener("click", function() {
    window.location.href = "./login.html";
});

document.getElementById("btn trilha5_1").addEventListener("click", function(){
    window.location.href = "./trilha_5_1.html";
});

document.getElementById("btn trilha5_2").addEventListener("click", function(){
    window.location.href = "./trilha_5_2.html";
});

document.getElementById("btn trilha5_3").addEventListener("click", function(){
    window.location.href = "./trilha_5_3.html";
});

document.getElementById("btn trilha5_5").addEventListener("click", function(){
    window.location.href = "./trilha_5_5.html";
});

document.getElementById("btn trilha5_6").addEventListener("click", function(){
    window.location.href = "./trilha_5_6.html";
});

// Seleciona os elementos relevantes
const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');
const navigation = document.querySelector('.navigation');
const closeBtn = document.createElement('button'); // Cria o botão de fechar

// Configura o botão de fechar (aparece quando a sidebar está aberta)
closeBtn.textContent = 'Fechar';
closeBtn.classList.add('close-btn');
closeBtn.style.display = 'none'; // Inicialmente não visível
sidebar.appendChild(closeBtn);

// Quando o hambúrguer é clicado, abre a sidebar
hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    navigation.classList.toggle('open'); // Oculta os links de navegação
});

// Quando o botão de fechar é clicado, fecha a sidebar
closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
    navigation.classList.remove('open'); // Restaura a visibilidade dos links
    closeBtn.style.display = 'none'; // Oculta o botão de fechar
});