const btnAdicionarTarefa = document.querySelector(".app__button--add-task");
const formAdicionarTarefa = document.querySelector(".app__form-add-task");
const textarea = document.querySelector(".app__form-textarea");
const ulTarefa = document.querySelector(".app__section-task-list");
const btnCancelar = document.querySelector(".app__form-footer__button--cancel");
const btnRemoverConcluidas = document.querySelector("#btn-remover-concluidas");
const btnRemoverTodas = document.querySelector("#btn-remover-todas");
const paragrafoDescricaoTarefa = document.querySelector(
  ".app__section-active-task-description"
);

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

const limparFormulario = () => {
  formAdicionarTarefa.classList.add("hidden");
  textarea.value = "";
};

function atualizarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

//riamos o método que transforma uma tarefa em um HTML que representa uma tarefa,
function criarElementoTarefa(tarefa) {
  const li = document.createElement("li");
  li.classList.add("app__section-task-list-item");

  const svg = document.createElement("svg");
  svg.innerHTML = `  
  <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
      <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
  </svg>
  `;

  const paragrafo = document.createElement("p");
  paragrafo.classList.add("app__section-task-list-item-description");
  paragrafo.textContent = tarefa.descricao;

  const botao = document.createElement("button");
  botao.classList.add("app_button-edit");

  // pegamos a nova descrição do prompt, atualizamos o parágrafo que é a camada visual, atualizamos a referência da tarefa, ou seja, a camada de dados e, por fim, fizemos o update do localStorage.
  botao.onclick = () => {
    const novaDescricao = prompt("Qual é o novo nome da tarefa?");
    //debugger;
    if (!novaDescricao) return; //se o prompt não retornar um valor, não atualiza a tarefa
    paragrafo.textContent = novaDescricao;
    tarefa.descricao = novaDescricao; //atualizar a tarefa no array
    atualizarTarefas();
  };

  const imagemBotao = document.createElement("img");
  imagemBotao.setAttribute("src", "./imagens/edit.png");
  botao.append(imagemBotao);

  li.append(svg, paragrafo, botao); // append coloca tudo dentro

  if (tarefa.completa) {
    li.classList.add("app__section-task-list-item-complete");
    botao.setAttribute("disabled", "disabled");
  } else {
  }

  li.onclick = () => {
    // Seleciona todos os itens com a classe ativa e remove a classe deles
    document
      .querySelectorAll(".app__section-task-list-item-active")
      .forEach((elemento) => {
        elemento.classList.remove("app__section-task-list-item-active");
      });
    if (tarefaSelecionada == tarefa) {
      paragrafoDescricaoTarefa.textContent = "";
      tarefaSelecionada = null;
      liTarefaSelecionada = null;
      return; //se não for uma tarefa clicada novamente, não precisa fazer nada
    }
    tarefaSelecionada = tarefa;
    liTarefaSelecionada = li;
    // Atualiza o conteúdo do parágrafo com a descrição da tarefa
    paragrafoDescricaoTarefa.textContent = tarefa.descricao;

    // Adiciona a classe ativa ao item atual
    li.classList.add("app__section-task-list-item-active");
  };

  return li;
}

btnCancelar.addEventListener("click", limparFormulario);

btnAdicionarTarefa.addEventListener("click", () => {
  formAdicionarTarefa.classList.toggle("hidden"); //formulario aparecer e desaparecer
});

// In this code snippet, we've added a form to add tasks to a list. When the user submits the form, the new task is added to the `tarefas` array and saved to localStorage. The form is also hidden and displayed when the "Adicionar tarefa" button is clicked.

formAdicionarTarefa.addEventListener("submit", (evento) => {
  evento.preventDefault(); //prevenir comportamento padrao //prevenir a submissão natural de um formulário em JavaScript //Ao enviar o formulário, você precisa garantir que a página não atualize.\

  const tarefa = {
    descricao: textarea.value,
  };
  console.log(tarefa.descricao);
  tarefas.push(tarefa);
  const elementoTarefa = criarElementoTarefa(tarefa);
  ulTarefa.append(elementoTarefa);
  atualizarTarefas();
  textarea.value = ""; //limpar o textarea
  formAdicionarTarefa.classList.add("hidden"); //formulario aparecer e desaparecer
});

tarefas.forEach((tarefa) => {
  // Array.prototype.forEach() é uma função que executa uma função fornecida para cada elemento do array, um de cada vez.
  const elementoTarefa = criarElementoTarefa(tarefa);
  ulTarefa.append(elementoTarefa);
});

document.addEventListener("FocoFinalizado", () => {
  if (tarefaSelecionada && liTarefaSelecionada) {
    liTarefaSelecionada.classList.remove("app__section-task-list-item-active");
    liTarefaSelecionada.classList.add("app__section-task-list-item-complete");
    liTarefaSelecionada
      .querySelector("button")
      .setAttribute("disabled", "disabled");
    tarefaSelecionada.completa = true;
    atualizarTarefas();
  }
});

const removerTarefas = (somenteCompletas) => {
  // const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item"
  let seletor = ".app__section-task-list-item";
  if (somenteCompletas) {
    seletor = ".app__section-task-list-item-complete";
  }
  document.querySelectorAll(seletor).forEach((elemento) => {
    elemento.remove();
  });
  tarefas = somenteCompletas
    ? tarefas.filter((tarefa) => !tarefa.completa)
    : [];
  atualizarTarefas();
};

btnRemoverConcluidas.onclick = () => removerTarefas(true);
btnRemoverTodas.onclick = () => removerTarefas(false);
