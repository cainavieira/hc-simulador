import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTimesInscritos } from "../services/useTimes";
import type { TimesInscritos } from "../services/useTimes";
import { sortearGrupos } from "../services/useGrupos";
import { gerarRodadas } from "../services/usePartidas";
import FaseDeGrupo from "./FaseDeGrupo";

export default function TelaGrupos() {
  const [timesInscritos, setTimesInscritos] = useState<TimesInscritos[]>([]);
  const [numeroDeGrupos, setNumeroDeGrupos] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [senhaRodadas, setSenhaRodadas] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    async function buscarTimesInscritos() {
      try {
        const dados = await getTimesInscritos();
        setTimesInscritos(dados);
      } catch (error) {
        console.error("Erro ao buscar os times inscritos:", error);
      }
    }
    buscarTimesInscritos();
    const intervalId = setInterval(buscarTimesInscritos, 3000);
    return () => clearInterval(intervalId);
  }, []);

  async function handleSortearGrupos() {
    try {
      await sortearGrupos(Number(numeroDeGrupos), senha);
      const dados = await getTimesInscritos();
      setTimesInscritos(dados);
    } catch (error) {
      console.error("Erro ao sortear grupos:", error);
    }
  }

  async function handleGerarRodadas() {
    try {
      await gerarRodadas(senhaRodadas);
      navigate("/rodadas");
    } catch (error) {
      console.error("Erro ao gerar as rodadas:", error);
    }
  }

  const grupoJaSorteado =
    timesInscritos.length > 0 && timesInscritos.every((t) => t.grupo);

  if (grupoJaSorteado) {
    const grupos: Record<string, TimesInscritos[]> = {};
    timesInscritos.forEach((time) => {
      const letra = time.grupo as string;
      if (!grupos[letra]) grupos[letra] = [];
      grupos[letra].push(time);
    });
    return (
      <div className="flex flex-col gap-4 items-center">
        <FaseDeGrupo grupos={grupos} />
        <input
          type="password"
          value={senhaRodadas}
          onChange={(e) => setSenhaRodadas(e.currentTarget.value)}
          placeholder="Senha do organizador"
          className="ring-border ring-1 rounded-md font-semibold text-center p-2! text-xl"
        />
        <button
          onClick={handleGerarRodadas}
          className="ring-2 ring-cor-primaria-p p-3! rounded-md cursor-pointer text-cor-secondaria-p text-xl"
        >
          Gerar rodadas
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8! items-center">
      <p className="text-2xl!">Aguardando o sorteio dos grupos...</p>
      <input
        type="number"
        value={numeroDeGrupos}
        onChange={(e) => setNumeroDeGrupos(e.currentTarget.value)}
        placeholder="Número de grupos"
        className="ring-border ring-1 rounded-md font-semibold text-center p-2! text-xl"
      />
      <input
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.currentTarget.value)}
        placeholder="Senha do organizador"
        className="ring-border ring-1 rounded-md font-semibold text-center p-2! text-xl"
      />
      <button
        onClick={handleSortearGrupos}
        className="ring-2 ring-cor-primaria-p p-3! rounded-md cursor-pointer text-cor-secondaria-p text-xl"
      >
        Sortear grupos
      </button>
    </div>
  );
}
