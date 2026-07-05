import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../contexts/LoginContext";
import { getPartidas } from "../services/usePartidas";
import type { Partida } from "../services/usePartidas";

type Posicao = {
  posicao: number;
  titulo: string;
  timeId: number;
  corFundo: string;
  corTexto: string;
};

export default function TelaResultadoFinal() {
  const { timesInscritos } = useLogin();
  const [partidas, setPartidas] = useState<Partida[]>([]);

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

  const partidaFinal = partidas.find((p) => p.fase === "FINAL");
  const partidaTerceiro = partidas.find((p) => p.fase === "TERCEIRO");

  if (!partidaFinal?.vencedorId || !partidaTerceiro?.vencedorId) {
    return <p className="text-lg! font-bold">Aguardando os resultados da final...</p>;
  }

  const primeiroId = partidaFinal.vencedorId;
  const segundoId =
    primeiroId === partidaFinal.timeCasaId ? partidaFinal.timeVisitanteId : partidaFinal.timeCasaId;
  const terceiroId = partidaTerceiro.vencedorId;

  const posicoes: Posicao[] = [
    { posicao: 1, titulo: "1º Lugar", timeId: primeiroId, corFundo: "bg-yellow-400", corTexto: "text-black" },
    { posicao: 2, titulo: "2º Lugar", timeId: segundoId, corFundo: "bg-gray-300", corTexto: "text-black" },
    { posicao: 3, titulo: "3º Lugar", timeId: terceiroId, corFundo: "bg-[#cd7f32]", corTexto: "text-white" },
  ];

  function nomeDoTime(timeId: number) {
    return timesInscritos.find((t) => t.id === timeId);
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-cor-h text-xl! font-bold">Resultado Final</h2>
      <div className="flex flex-col gap-3 w-full">
        {posicoes.map(({ posicao, titulo, timeId, corFundo, corTexto }) => {
          const time = nomeDoTime(timeId);
          return (
            <div
              key={posicao}
              className={`flex items-center gap-3 rounded-md p-3! ${corFundo} ${corTexto}`}
            >
              <span className="font-bold text-xl!">{titulo}</span>
              {time && (
                <>
                  <img
                    src={`https://flagsapi.com/${time.codigoPais}/flat/64.png`}
                    alt={time.timeJogador}
                    className="w-8"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold">{time.timeJogador}</span>
                    <span>{time.nomeJogador}</span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <Link
        to="/estatisticas"
        className="ring-2 ring-cor-primaria-p p-3! rounded-md text-cor-secondaria-p text-xl"
      >
        Ver estatísticas
      </Link>
    </div>
  );
}
