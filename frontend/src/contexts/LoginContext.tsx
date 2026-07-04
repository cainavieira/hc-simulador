import { createContext, useContext, useState, useEffect } from "react";
import { timesMock } from "../data/timesMock";
import type { Equipe } from "../data/timesMock";
import { sendTimeInscrito, getTimesInscritos } from "../services/useTimes";
import type { TimesInscritos } from "../services/useTimes";

type LoginContextType = {
  equipes: Equipe[];
  handleSelecionado: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleNomeJogador: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  timesInscritos: TimesInscritos[];
  nomeJogador: string;
  paisSelecionado: Equipe | null;
};

const LoginContext = createContext<LoginContextType | null>(null);

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const [timesInscritos, setTimesInscritos] = useState<TimesInscritos[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [equipes, setEquipes] = useState<Equipe[]>(timesMock);
  const [paisSelecionado, setPaisSelecionado] = useState<Equipe | null>(null);
  const [nomeJogador, setNomeJogador] = useState<string>("");


  async function handleTimesInscritos(paisSelecionado: Equipe) {
    const inscrito = {
      nomeJogador: nomeJogador,
      timeJogador: paisSelecionado.pais,
      codigoPais: paisSelecionado.codigo
    };
    try {
      await sendTimeInscrito(inscrito);
      const dados = await getTimesInscritos();
      setTimesInscritos(dados);
    } catch (error) {
      console.error("Erro ao enviar o time inscrito:", error);
    }
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
    setPaisSelecionado(null);
  }

  function handleNomeJogador(e: React.ChangeEvent<HTMLInputElement>) {
    setNomeJogador(e.currentTarget.value);
  }

  useEffect(() => {
    async function handleGetTimesInscritos() {
      try {
        const dadosTimesInscritos = await getTimesInscritos();
        setTimesInscritos(dadosTimesInscritos);
      } catch (error) {
        console.error("Erro ao buscar os times inscritos:", error);
      } finally {
        setLoading(false);
      }
    }
    handleGetTimesInscritos();
  }, []);


  return (
    <LoginContext.Provider
      value={{
        equipes: equipes,
        handleSelecionado,
        handleSubmit,
        handleNomeJogador,
        timesInscritos,
        loading,
        nomeJogador,
        paisSelecionado,
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
