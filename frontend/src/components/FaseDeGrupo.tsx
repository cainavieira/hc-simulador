import type { TimesInscritos } from "../services/useTimes";

type FaseDeGrupoProps = {
  grupos: Record<string, TimesInscritos[]>;
};

export default function FaseDeGrupo({ grupos }: FaseDeGrupoProps) {
  const letras = Object.keys(grupos).sort();

  return (
    <section className="flex flex-col gap-4 w-full">
      <h2 className="text-cor-h text-xl! font-bold">Fase de Grupos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {letras.map((letra) => (
          <GrupoCard key={letra} letra={letra} times={grupos[letra]} />
        ))}
      </div>
    </section>
  );
}

function GrupoCard({ letra, times }: { letra: string; times: TimesInscritos[] }) {
  return (
    <div className="rounded-md overflow-hidden ring-1 ring-border">
      <div className="bg-emerald-800 px-3 py-2 text-cor-h font-bold text-left p-2!">
        Grupo {letra}
      </div>
      <ul>
        {times.map((time) => (
          <li
            key={time.id}
            className="flex items-center gap-2 px-3 py-2 border-t border-border text-cor-secondaria-p p-2!"
          >
            <img
              src={`https://flagsapi.com/${time.codigoPais}/flat/64.png`}
              alt={time.timeJogador}
              className="w-6"
            />
            <span>{time.nomeJogador}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
