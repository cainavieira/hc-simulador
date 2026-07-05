import type { TimesInscritos } from "./useTimes";

const URL_BASE = "http://192.168.1.15:7000/api/v1";

export type Partida = {
  id: number;
  fase: string;
  grupo: string | null;
  rodada: number;
  timeCasaId: number;
  timeVisitanteId: number;
  placarCasa: number | null;
  placarVisitante: number | null;
  vencedorId: number | null;
};

export type ResultadoPartida = {
  id: number;
  placarCasa: number;
  placarVisitante: number;
  vencedorId: number | null;
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

async function gerarOitavas(senha: string) {
  const sendData = async () => {
    const response = await fetch(
      `${URL_BASE}/partidas/gerar-oitavas?senha=${encodeURIComponent(senha)}`,
      { method: "POST" },
    );
    if (!response.ok) {
      throw new Error();
    }
  };
  return await sendData();
}
export { gerarOitavas };

async function gerarQuartas(senha: string) {
  const sendData = async () => {
    const response = await fetch(
      `${URL_BASE}/partidas/gerar-quartas?senha=${encodeURIComponent(senha)}`,
      { method: "POST" },
    );
    if (!response.ok) {
      throw new Error();
    }
  };
  return await sendData();
}
export { gerarQuartas };

async function gerarSemis(senha: string) {
  const sendData = async () => {
    const response = await fetch(
      `${URL_BASE}/partidas/gerar-semis?senha=${encodeURIComponent(senha)}`,
      { method: "POST" },
    );
    if (!response.ok) {
      throw new Error();
    }
  };
  return await sendData();
}
export { gerarSemis };

async function gerarFinal(senha: string) {
  const sendData = async () => {
    const response = await fetch(
      `${URL_BASE}/partidas/gerar-final?senha=${encodeURIComponent(senha)}`,
      { method: "POST" },
    );
    if (!response.ok) {
      throw new Error();
    }
  };
  return await sendData();
}
export { gerarFinal };

async function getEstatisticas() {
  const fetchData = async () => {
    const response = await fetch(`${URL_BASE}/partidas/estatisticas`, {
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
export { getEstatisticas };
