const URL_BASE = "http://192.168.1.15:7000/api/v1";

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
