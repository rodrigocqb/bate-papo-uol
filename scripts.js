const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
promessa.then(buscarMensagens);

function buscarMensagens(response){
    console.log(response.data);
}