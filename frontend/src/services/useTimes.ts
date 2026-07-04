const URL_BASE = "http://192.168.1.15:7000/api/v1";

export type TimesInscritos = {
  id: number;
  nomeJogador: string;
  timeJogador: string;
  codigoPais: string;
};

async function getTimesInscritos() {
  const fetchData = async () => {
    const response = await fetch(`${URL_BASE}/times`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error();
    }
    const dados = await response.json();
    return dados;
  };
  return await fetchData();
}
export {getTimesInscritos}

export function getTimeInscrito() {}

export function getTimeInscritoByName() {}

export type Payload = {
  nomeJogador: string;
  timeJogador: string;
  codigoPais: string;
};

//Vai dar problemas de CORS habilitado quando eu testar em um navegador, nao no postman
async function sendTimeInscrito(payload: Payload) {
  const sendData = async () => {
    const request = await fetch(`${URL_BASE}/times`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      //Precisa do contentType se n o payload é interpretado como texto
      body: JSON.stringify(payload),
    });
    if (!request.ok) {
      throw new Error();
    }
  };
  return await sendData();
}
export { sendTimeInscrito };
