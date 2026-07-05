import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../contexts/LoginContext";
import { getPartidas, registrarResultados, gerarOitavas } from "../services/usePartidas";
import type { Partida, ResultadoPartida } from "../services/usePartidas";

type PlacarInput = { placarCasa: string; placarVisitante: string };

export default function TelaRodadas() {
  const { timesInscritos } = useLogin();
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [placares, setPlacares] = useState<Record<number, PlacarInput>>({});
  const [senha, setSenha] = useState<string>("");
  const [senhaOitavas, setSenhaOitavas] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    async function buscarPartidas() {
      try {
        const dados = await getPartidas();
        setPartidas(dados);
      } catch (error) {
        console.error("Erro ao buscar as partidas:", error);
      }
    }
    buscarPartidas();
    const intervalId = setInterval(buscarPartidas, 3000);
    return () => clearInterval(intervalId);
  }, []);

  function handlePlacarChange(
    partidaId: number,
    lado: "placarCasa" | "placarVisitante",
    valor: string,
  ) {
    setPlacares((atual) => ({
      ...atual,
      [partidaId]: {
        placarCasa: atual[partidaId]?.placarCasa ?? "",
        placarVisitante: atual[partidaId]?.placarVisitante ?? "",
        [lado]: valor,
      },
    }));
  }

  async function handleConfirmarResultados(partidasDaRodada: Partida[]) {
    try {
      const resultados: ResultadoPartida[] = partidasDaRodada.map((partida) => ({
        id: partida.id,
        placarCasa: Number(placares[partida.id]?.placarCasa ?? 0),
        placarVisitante: Number(placares[partida.id]?.placarVisitante ?? 0),
        vencedorId: null,
      }));
      await registrarResultados(resultados, senha);
      const dados = await getPartidas();
      setPartidas(dados);
      setPlacares({});
    } catch (error) {
      console.error("Erro ao registrar os resultados da rodada:", error);
    }
  }

  async function handleGerarOitavas() {
    try {
      await gerarOitavas(senhaOitavas);
      navigate("/oitavas");
    } catch (error) {
      console.error("Erro ao gerar as oitavas:", error);
    }
  }

  const partidasDeGrupos = partidas.filter((p) => p.fase === "GRUPOS");

  if (partidasDeGrupos.length === 0) {
    return <p className="text-lg! font-bold">Aguardando as rodadas serem geradas...</p>;
  }

  const partidasSemPlacar = partidasDeGrupos.filter((p) => p.placarCasa === null);

  if (partidasSemPlacar.length === 0) {
    return (
      <div className="flex flex-col gap-4 items-center">
        <p className="text-lg! font-bold">Fase de grupos completa! Todas as partidas foram jogadas.</p>
        <Link
          to="/classificacao"
          className="ring-2 ring-cor-primaria-p p-3! rounded-md text-cor-secondaria-p text-xl"
        >
          Ver classificação
        </Link>
        <input
          type="password"
          value={senhaOitavas}
          onChange={(e) => setSenhaOitavas(e.currentTarget.value)}
          placeholder="Senha do organizador"
          className="ring-border ring-1 rounded-md font-semibold text-center p-2! text-xl"
        />
        <button
          onClick={handleGerarOitavas}
          className="ring-2 ring-cor-primaria-p p-3! rounded-md cursor-pointer text-cor-secondaria-p text-xl"
        >
          Gerar oitavas
        </button>
      </div>
    );
  }

  const rodadaAtual = Math.min(...partidasSemPlacar.map((p) => p.rodada));
  const partidasDaRodada = partidasDeGrupos
    .filter((p) => p.rodada === rodadaAtual)
    .sort((a, b) => (a.grupo ?? "").localeCompare(b.grupo ?? ""));

  function nomeDoTime(timeId: number) {
    return timesInscritos.find((t) => t.id === timeId);
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-cor-h text-xl! font-bold">Rodada {rodadaAtual}</h2>
      <Link to="/classificacao" className="text-cor-secondaria-p underline">
        Ver classificação
      </Link>
      <div className="flex flex-col gap-3 w-full">
        {partidasDaRodada.map((partida) => {
          const timeCasa = nomeDoTime(partida.timeCasaId);
          const timeVisitante = nomeDoTime(partida.timeVisitanteId);
          return (
            <div
              key={partida.id}
              className="flex items-center justify-between gap-2 ring-1 ring-border rounded-md p-2! text-cor-secondaria-p"
            >
              <span>Grupo {partida.grupo}</span>
              <span>{timeCasa?.nomeJogador}</span>
              <input
                type="number"
                value={placares[partida.id]?.placarCasa ?? ""}
                onChange={(e) =>
                  handlePlacarChange(partida.id, "placarCasa", e.currentTarget.value)
                }
                className="ring-border ring-1 rounded-md w-12 text-center"
              />
              <span>x</span>
              <input
                type="number"
                value={placares[partida.id]?.placarVisitante ?? ""}
                onChange={(e) =>
                  handlePlacarChange(
                    partida.id,
                    "placarVisitante",
                    e.currentTarget.value,
                  )
                }
                className="ring-border ring-1 rounded-md w-12 text-center"
              />
              <span>{timeVisitante?.nomeJogador}</span>
            </div>
          );
        })}
      </div>
      <input
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.currentTarget.value)}
        placeholder="Senha do organizador"
        className="ring-border ring-1 rounded-md font-semibold text-center p-2! text-xl"
      />
      <button
        onClick={() => handleConfirmarResultados(partidasDaRodada)}
        className="ring-2 ring-emerald-700 rounded-md cursor-pointer text-cor-secondaria-p text-xl p-2! bg-amber-500 hover:bg-amber-600 hover:text-cor-h transition-colors"
      >
        Confirmar resultados
      </button>
    </div>
  );
}
