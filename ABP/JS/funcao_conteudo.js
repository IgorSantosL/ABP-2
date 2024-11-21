const items = ["Item 1", "Item 2", "Item 3"];

const listElement = document.getElementById("conteudo");

items.forEach(item => {
  const listItem = document.createElement("div");
  listItem.innerHTML = '<div><\div>';
  listElement.appendChild(listItem); 
});


function pegar_conteudo(){
    let conteudo = "";
    let titulo = "";
    
    for(let conteudo1 of conteudoABP){
        titulo = conteudo1.titulo.toLowerCase()
        conteudo = conteudo1.conteudo.toLowerCase()
    resultados += `
        <div class="item-resultado">
            <h2>${conteudo1.titulo}</h2>
            <h3>${conteudo1.subtitulo}</h3>
            <p>${conteudo1.conteudo}</p>
        </div>
        `;
    }
    // Atribui os resultados gerados à seção HTML
    section.innerHTML = resultados;
};