const html = document.querySelector("html");
const focoBt = document.querySelector(".app__card-button--foco");
const curtoBt = document.querySelector(".app__card-button--curto");
const longoBt = document.querySelector(".app__card-button--longo");
const banner = document.querySelector(".app__image");
const titulo = document.querySelector(".app__title");
const botoes = document.querySelectorAll(".app__card-button");
const startPauseBt = document.querySelector("#start-pause");
const musicaFocoInput = document.querySelector("#alternar-musica");
const iniciarOuPausarBt = document.querySelector("#start-pause span");
const iniciarOuPausarBtIcone = document.querySelector(
  ".app__card-primary-butto-icon"
);
const tempoNaTela = document.querySelector("#timer");
const musica = new Audio("sons/luna-rise-part-one.mp3");
const play = new Audio("sons/play.wav");
const pause = new Audio("sons/pause.mp3");
const beep = new Audio("sons/softbeep.wav");

let tempoDecorridoeEmSegundos = 5;
let intervaloId = null;

musica.loop = true;

musicaFocoInput.addEventListener("change", () => {
  if (musica.paused) {
    musica.play();
  } else {
    musica.pause();
  }
});

pause.addEventListener("change", () => {
  if (musica.paused) {
    musica.play();
  } else {
    musica.pause();
  }
});

focoBt.addEventListener("click", () => {
  tempoDecorridoeEmSegundos = 1500;
  alterarContexto("foco");
  focoBt.classList.add("active");
});

curtoBt.addEventListener("click", () => {
  tempoDecorridoeEmSegundos = 300;
  alterarContexto("descanso-curto");
  curtoBt.classList.add("active");
});

longoBt.addEventListener("click", () => {
  tempoDecorridoeEmSegundos = 900;
  alterarContexto("descanso-longo");
  longoBt.classList.add("active");
});

// document.addEventListener("DOMContentLoaded", () => {
//   alterarContexto("foco");
//   iniciarOuPausarBt.textContent = "Começar";
//   iniciarOuPausarBtIcone.setAttribute("src", `imagens/play_arrow.png`);
//   //mostrarTempo();
// });
function alterarContexto(contexto) {
  mostrarTempo();
  botoes.forEach(function (contexto) {
    //forEach é usado em arrays em JavaScript para executar uma função uma vez para cada elemento no array, permitindo que você realize operações em cada item individualmente. É uma maneira mais concisa e legível de percorrer um array em comparação com o uso de loops tradicionais. Aqui está um exemplo simple
    contexto.classList.remove("active");
  });
  html.setAttribute("data-contexto", contexto);
  banner.setAttribute("src", `imagens/${contexto}.png`);
  switch (contexto) {
    case "foco": //O método innerHTML é ótimo quando queremos passar um formato completo no HTML, tanto com o texto, quanto com classes e tags HTML.
      titulo.innerHTML = ` 
            Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>
            `;

      break;
    case "descanso-curto":
      titulo.innerHTML = `
            Que tal dar uma respirada? <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `;
      break;
    case "descanso-longo":
      titulo.innerHTML = `
            Hora de voltar à superfície.<strong class="app__title-strong"> Faça uma pausa longa.</strong>
            `;

    default:
      break;
  }
}

const contagemRegressiva = () => {
  if (tempoDecorridoeEmSegundos <= 0) {
    beep.play();

    alert("Tempo finalizado!");
    const focoAtivo = html.getAttribute("data-contexto") == "foco";
    if (focoAtivo) {
      const evento = new CustomEvent("FocoFinalizado");
      document.dispatchEvent(evento);
    }
    zerar();
    return;
  }
  tempoDecorridoeEmSegundos -= 1;
  mostrarTempo();
};

startPauseBt.addEventListener("click", iniciarOuPausar);

function iniciarOuPausar() {
  if (intervaloId) {
    pause.play();
    zerar();
    return;
  }
  play.play();

  intervaloId = setInterval(contagemRegressiva, 1000);
  iniciarOuPausarBt.textContent = "Pausar";
  iniciarOuPausarBtIcone.setAttribute("src", `imagens/pause.png`);
}

function zerar() {
  clearInterval(intervaloId);
  iniciarOuPausarBt.textContent = "Começar"; //o metodo text contente serve somente para textos já o INNER HTML alem de textos aceita tags tbm
  iniciarOuPausarBtIcone.setAttribute("src", `imagens/play_arrow.png`);
  intervaloId = null;
}

function mostrarTempo() {
  const tempo = new Date(tempoDecorridoeEmSegundos * 1000); // O New Date é um objeto e  oferece vários métodos para formatar o tempo.
  const tempoFormatado = tempo.toLocaleTimeString("pt-br", {
    // o toLocaleString é um metodo nativo do New Date
    minute: "2-digit", // o 2-digit siginifica que queremos passar dois dígitos para o minuto e segundo
    second: "2-digit",
  });
  tempoNaTela.innerHTML = `${tempoFormatado}`;
}
mostrarTempo();
alterarContexto("foco");
