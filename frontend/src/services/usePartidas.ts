import type { TimesInscritos } from "./useTimes";

const URL_BASE = "http://192.168.1.15:7000/api/v1";

export type Partida = {
  id: number;
  grupo: string;
  rodada: number;
  timeCasaId: number;
  timeVisitanteId: number;
  placarCasa: number | null;
  placarVisitante: number | null;
};

export type ResultadoPartida = {
  id: number;
  placarCasa: number;
  placarVisitante: number;
};

export type LinhaClassificacao = {
  time: TimesInscritos;
  pontos: number;
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  gp: number;
  gc: number;
  sg: number;
};

async function gerarRodadas(senha: string) {
  const sendData = async () => {
    const response = await fetch(
      `${URL_BASE}/partidas/gerar-rodadas?senha=${encodeURIComponent(senha)}`,
      { method: "POST" },
    );
    if (!response.ok) {
      throw new Error();
    }
  };
  return await sendData();
}
export { gerarRodadas };

async function getPartidas() {
  const fetchData = async () => {
    const response = await fetch(`${URL_BASE}/partidas`, { method: "GET" });
    if (!response.ok) {
      throw new Error();
    }
    const dados = await response.json();
    return dados;
  };
  return await fetchData();
}
export { getPartidas };

async function registrarResultados(
  resultados: ResultadoPartida[],
  senha: string,
) {
  const sendData = async () => {
    const response = await fetch(
      `${URL_BASE}/partidas/registrar-resultados?senha=${encodeURIComponent(senha)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultados),
      },
    );
    if (!response.ok) {
      throw new Error();
    }
  };
  return await sendData();
}
export { registrarResultados };

async function getClassificacao() {
  const fetchData = async () => {
    const response = await fetch(`${URL_BASE}/partidas/classificacao`, {
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
export { getClassificacao };
