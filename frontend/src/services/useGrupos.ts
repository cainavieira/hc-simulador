import { URL_BASE } from "./apiConfig";

async function sortearGrupos(numeroDeGrupos: number, senha: string) {
  const sendData = async () => {
    const response = await fetch(
      `${URL_BASE}/grupos/sortear?numeroDeGrupos=${numeroDeGrupos}&senha=${encodeURIComponent(senha)}`,
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
export { sortearGrupos };
