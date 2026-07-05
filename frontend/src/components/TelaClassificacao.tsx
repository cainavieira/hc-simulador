import { useState, useEffect } from "react";
import { getClassificacao } from "../services/usePartidas";
import type { LinhaClassificacao } from "../services/usePartidas";

const TOTAL_OITAVAS = 16;

export default function TelaClassificacao() {
  const [classificacao, setClassificacao] = useState<
    Record<string, LinhaClassificacao[]>
  >({});

  useEffect(() => {
    async function buscarClassificacao() {
      try {
        const dados = await getClassificacao();
        setClassificacao(dados);
      } catch (error) {
        console.error("Erro ao buscar a classificação:", error);
      }
    }
    buscarClassificacao();
    const intervalId = setInterval(buscarClassificacao, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const letras = Object.keys(classificacao).sort();
  const numeroDeGrupos = letras.length;
  const quantosPassam = numeroDeGrupos > 0 ? TOTAL_OITAVAS / numeroDeGrupos : 0;

  return (
    <section className="flex flex-col gap-4 w-full">
      <h2 className="text-cor-h text-xl! font-bold">Classificação</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {letras.map((letra) => (
          <GrupoClassificacao
            key={letra}
            letra={letra}
            linhas={classificacao[letra]}
            quantosPassam={quantosPassam}
          />
        ))}
      </div>
    </section>
  );
}

function GrupoClassificacao({
  letra,
  linhas,
  quantosPassam,
}: {
  letra: string;
  linhas: LinhaClassificacao[];
  quantosPassam: number;
}) {
  return (
    <div className="rounded-md overflow-hidden ring-1 ring-border">
      <div className="bg-cor-primaria-p px-3 py-2 text-cor-h font-bold text-left p-2!">
        Grupo {letra}
      </div>
      <table className="w-full text-cor-secondaria-p text-sm!">
        <thead>
          <tr className="border-t border-border">
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
            <tr
              key={linha.time.id}
              className={
                "border-t border-border " +
                (i < quantosPassam ? "text-cor-h" : "")
              }
            >
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
  );
}
