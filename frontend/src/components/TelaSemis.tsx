import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../contexts/LoginContext";
import { getPartidas, registrarResultados } from "../services/usePartidas";
import type { Partida, ResultadoPartida } from "../services/usePartidas";

type PlacarInput = { placarCasa: string; placarVisitante: string };

export default function TelaSemis() {
  const { timesInscritos } = useLogin();
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [placares, setPlacares] = useState<Record<number, PlacarInput>>({});
  const [penaltiVencedor, setPenaltiVencedor] = useState<Record<number, number>>({});
  const [senha, setSenha] = useState<string>("");

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

  function estaEmpatado(partida: Partida) {
    const placar = placares[partida.id];
    if (!placar || placar.placarCasa === "" || placar.placarVisitante === "") {
      return false;
    }
    return Number(placar.placarCasa) === Number(placar.placarVisitante);
  }

  async function handleConfirmarResultados() {
    try {
      const resultados: ResultadoPartida[] = semis.map((partida) => ({
        id: partida.id,
        placarCasa: Number(placares[partida.id]?.placarCasa ?? 0),
        placarVisitante: Number(placares[partida.id]?.placarVisitante ?? 0),
        vencedorId: estaEmpatado(partida) ? (penaltiVencedor[partida.id] ?? null) : null,
      }));
      await registrarResultados(resultados, senha);
      const dados = await getPartidas();
      setPartidas(dados);
      setPlacares({});
      setPenaltiVencedor({});
    } catch (error) {
      console.error("Erro ao registrar os resultados da semifinal:", error);
    }
  }

  const semis = partidas.filter((p) => p.fase === "SEMIS");

  if (semis.length === 0) {
    return <p className="text-lg! font-bold">Aguardando a semifinal ser gerada...</p>;
  }

  const semisSemVencedor = semis.filter((p) => p.vencedorId === null);

  if (semisSemVencedor.length === 0) {
    return (
      <div className="flex flex-col gap-4 items-center">
        <p className="text-lg! font-bold">Semifinal completa! Todos os confrontos foram decididos.</p>
        <p className="text-cor-secondaria-p">A final ainda não foi implementada.</p>
        <Link
          to="/estatisticas/semis"
          className="ring-2 ring-cor-primaria-p p-3! rounded-md text-cor-secondaria-p text-xl"
        >
          Ver estatísticas
        </Link>
      </div>
    );
  }

  function nomeDoTime(timeId: number) {
    return timesInscritos.find((t) => t.id === timeId);
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-cor-h text-xl! font-bold">Semifinal</h2>
      <Link to="/estatisticas/semis" className="text-cor-secondaria-p underline">
        Ver estatísticas
      </Link>
      <div className="flex flex-col gap-3 w-full">
        {semis.map((partida) => {
          const timeCasa = nomeDoTime(partida.timeCasaId);
          const timeVisitante = nomeDoTime(partida.timeVisitanteId);
          const empatado = estaEmpatado(partida);
          return (
            <div
              key={partida.id}
              className="flex flex-col gap-2 ring-1 ring-border rounded-md p-2! text-cor-secondaria-p"
            >
              <div className="flex items-center justify-between gap-2">
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
              {empatado && (
                <div className="flex items-center justify-between gap-2 text-cor-h">
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={penaltiVencedor[partida.id] === partida.timeCasaId}
                      onChange={() =>
                        setPenaltiVencedor((atual) => ({
                          ...atual,
                          [partida.id]: partida.timeCasaId,
                        }))
                      }
                    />
                    Venceu nos pênaltis
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={penaltiVencedor[partida.id] === partida.timeVisitanteId}
                      onChange={() =>
                        setPenaltiVencedor((atual) => ({
                          ...atual,
                          [partida.id]: partida.timeVisitanteId,
                        }))
                      }
                    />
                    Venceu nos pênaltis
                  </label>
                </div>
              )}
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
        onClick={handleConfirmarResultados}
        className="ring-2 ring-cor-primaria-p p-3! rounded-md cursor-pointer text-cor-secondaria-p text-xl"
      >
        Confirmar resultados
      </button>
    </div>
  );
}
