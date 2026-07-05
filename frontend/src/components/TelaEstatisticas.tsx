import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getEstatisticas } from "../services/usePartidas";
import type { LinhaClassificacao } from "../services/usePartidas";

const CONFIG_POR_FASE: Record<
  string,
  { titulo: string; voltarPara: string; voltarTexto: string }
> = {
  OITAVAS: { titulo: "Estatística — Oitavas", voltarPara: "/oitavas", voltarTexto: "Voltar pras oitavas" },
  QUARTAS: { titulo: "Estatística — Quartas", voltarPara: "/quartas", voltarTexto: "Voltar pras quartas" },
  SEMIS: { titulo: "Estatística — Semifinal", voltarPara: "/semis", voltarTexto: "Voltar pra semifinal" },
};

export default function TelaEstatisticas() {
  const { fase } = useParams<{ fase: string }>();
  const faseAtual = (fase ?? "oitavas").toUpperCase();
  const { titulo, voltarPara, voltarTexto } = CONFIG_POR_FASE[faseAtual] ?? CONFIG_POR_FASE.OITAVAS;
  const [linhas, setLinhas] = useState<LinhaClassificacao[]>([]);

  useEffect(() => {
    async function buscarEstatisticas() {
      try {
        const dados = await getEstatisticas(faseAtual);
        setLinhas(dados);
      } catch (error) {
        console.error("Erro ao buscar as estatísticas:", error);
      }
    }
    buscarEstatisticas();
    const intervalId = setInterval(buscarEstatisticas, 3000);
    return () => clearInterval(intervalId);
  }, [faseAtual]);

  return (
    <section className="flex flex-col gap-4 w-full items-center">
      <h2 className="text-cor-h text-xl! font-bold">{titulo}</h2>
      <Link to={voltarPara} className="text-cor-secondaria-p underline">
        {voltarTexto}
      </Link>
      <div className="rounded-md overflow-hidden ring-1 ring-border w-full">
        <table className="w-full text-cor-secondaria-p text-sm!">
          <thead>
            <tr className="bg-cor-primaria-p">
              <th className="p-1!">#</th>
              <th className="p-1! text-left">Time</th>
              <th className="p-1!" title="Pontos">Pts</th>
              <th className="p-1!" title="Jogos">J</th>
              <th className="p-1!" title="Vitórias">V</th>
              <th className="p-1!" title="Empates">E</th>
              <th className="p-1!" title="Derrotas">D</th>
              <th className="p-1!" title="Saldo de gols">SG</th>
              <th className="p-1!" title="Gols pró">GP</th>
              <th className="p-1!" title="Gols contra">GC</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha, i) => (
              <tr key={linha.time.id} className="border-t border-border">
                <td className="p-1!">{i + 1}</td>
                <td className="p-1! text-left flex items-center gap-1">
                  <img
                    src={`https://flagsapi.com/${linha.time.codigoPais}/flat/64.png`}
                    alt={linha.time.timeJogador}
                    className="w-5"
                  />
                  {linha.time.nomeJogador}
                </td>
                <td className="p-1! font-bold">{linha.pontos}</td>
                <td className="p-1!">{linha.jogos}</td>
                <td className="p-1!">{linha.vitorias}</td>
                <td className="p-1!">{linha.empates}</td>
                <td className="p-1!">{linha.derrotas}</td>
                <td className="p-1!">{linha.sg > 0 ? `+${linha.sg}` : linha.sg}</td>
                <td className="p-1!">{linha.gp}</td>
                <td className="p-1!">{linha.gc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
