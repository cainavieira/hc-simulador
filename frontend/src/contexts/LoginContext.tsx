import { createContext, useContext, useState } from "react";
import { timesMock } from "../data/timesMock";
import type { Equipe } from "../data/timesMock";

type TimeInscrito = {
  nome: string;
  pais: string;
  bandeira: string;
  id: string;
};

type LoginContextType = {
  timesInscritos: TimeInscrito[];
  equipes: Equipe[];
  handleSelecionado: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleNomeJogador: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const LoginContext = createContext<LoginContextType | null>(null);

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const [equipes, setEquipes] = useState<Equipe[]>(timesMock);
  const [paisSelecionado, setPaisSelecionado] = useState<Equipe | null>(null);
  const [nomeJogador, setNomeJogador] = useState<string>("");
  const [timesInscritos, setTimesInscritos] = useState<TimeInscrito[]>([]);

  function handleTimesInscritos(paisSelecionado: Equipe) {
    const inscrito = {
      id: crypto.randomUUID(),
      nome: nomeJogador,
      pais: paisSelecionado.pais,
      bandeira: `https://flagsapi.com/${paisSelecionado.codigo}/flat/64.png`,
    };
    setTimesInscritos([...timesInscritos, inscrito]);
  }
  function handleSelecionado(e: React.ChangeEvent<HTMLSelectElement>) {
    const pais = e.currentTarget.value;
    const equipeSelecionada = equipes?.find((item) => item.pais === pais);
    setPaisSelecionado(equipeSelecionada ?? null);
  }

  function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    if (!paisSelecionado) return;
    const equipesAtualizadas = equipes.filter(
      (item) => item.pais !== paisSelecionado?.pais,
    );
    handleTimesInscritos(paisSelecionado);
    setEquipes(equipesAtualizadas);
    setNomeJogador("");
  }

  function handleNomeJogador(e: React.ChangeEvent<HTMLInputElement>) {
    setNomeJogador(e.currentTarget.value);
  }

  return (
    <LoginContext.Provider
      value={{
        timesInscritos: timesInscritos,
        equipes: equipes,
        handleSelecionado,
        handleSubmit,
        handleNomeJogador,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export function useLogin() {
  const contexto = useContext(LoginContext);
  if (!contexto)
    throw new Error("useLogin deve ser usado dentro do LoginProvider");
  return contexto;
}
