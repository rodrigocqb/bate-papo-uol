setInterval(() => {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promessa.then(buscarMensagens);
}, 3000)

let nome = prompt("Qual o seu nome de usuário?");

function registrar() {
    let promessaEntrar = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", { name: nome });
    promessaEntrar.then(entrar);
    promessaEntrar.catch(nomerepetido);
}
registrar();

let mensagens;

function buscarMensagens(response) {
    mensagens = response.data;
    escreverMensagens(mensagens);
}

function escreverMensagens(mensagens) {
    const MessageBoard = document.querySelector(".message-board");
    MessageBoard.innerHTML = "";
    let ultima = "";
    for (let i = 0; i < mensagens.length; i++) {
        if (i === (mensagens.length - 1)) {
            ultima = "true";
        }
        switch (mensagens[i].type) {
            case "message":
                MessageBoard.innerHTML +=
                    `<div class="${mensagens[i].type} ${ultima}"><p><span class="horario">(${mensagens[i].time})</span> <span><strong>${mensagens[i].from}</strong></span> para <span><strong>${mensagens[i].to}</strong></span>: ${mensagens[i].text}</p></div>`;
                break

            case "status":
                MessageBoard.innerHTML +=
                    `<div class="${mensagens[i].type} ${ultima}"><p><span class="horario">(${mensagens[i].time})</span> <span><strong>${mensagens[i].from}</strong></span>  ${mensagens[i].text}</p></div>`;
                break

            case "private_message":
                if (mensagens[i].to === nome) {
                    MessageBoard.innerHTML +=
                        `<div class="${mensagens[i].type} ${ultima}"><p><span class="horario">(${mensagens[i].time})</span> <span><strong>${mensagens[i].from}</strong></span> reservadamente para <span><strong>${mensagens[i].to}</strong></span>: ${mensagens[i].text}</p></div>`;
                }
                break
        }
    }
    document.querySelector(".true").scrollIntoView();
}

function entrar(resposta) {
    console.log(resposta);
}

function nomerepetido(erro) {
    console.log(erro.response.status);
    if (erro.response.status === 400) {
        nome = prompt('Escolha um nome ainda não utilizado');
        registrar();
    }
}

function stayConnected() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", { name: nome });
}

setInterval(stayConnected, 5000);

let messagebox = document.querySelector("textarea");
messagebox.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        enviarMensagem();
    }
});
function enviarMensagem() {
    console.log(messagebox.value);
    const envio = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", { from: nome, to: "Todos", text: messagebox.value, type: "message" });
    messagebox.value = "";
    envio.then(() => {
        const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
        promessa.then(buscarMensagens);
    });
    envio.catch(() => {
        window.location.reload();
    });
}