import { URL_BASE } from "./apiConfig";

async function getStatusJogo() {
  const fetchData = async () => {
    const response = await fetch(`${URL_BASE}/jogo/status`, {
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
export { getStatusJogo };

async function iniciarJogo(senha: string) {
  const sendData = async () => {
    const response = await fetch(
      `${URL_BASE}/jogo/iniciar?senha=${encodeURIComponent(senha)}`,
      {
        method: "POST",
      },
    );
    if (!response.ok) {
      throw new Error();
    }
  };
  return await sendData();
}
export { iniciarJogo };
