import { createContext, useContext, useState, useEffect } from "react";
import { timesMockOrdenado } from "../data/timesMock";
import type { Equipe } from "../data/timesMock";
import { sendTimeInscrito, getTimesInscritos } from "../services/useTimes";
import type { TimesInscritos } from "../services/useTimes";
import { useNavegacao } from "./NavegacaoContext";

type LoginContextType = {
  equipes: Equipe[];
  handleSelecionado: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleNomeJogador: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  timesInscritos: TimesInscritos[];
  nomeJogador: string;
  paisSelecionado: Equipe | null;
  erroInscricao: string | null;
};

const LoginContext = createContext<LoginContextType | null>(null);

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const [timesInscritos, setTimesInscritos] = useState<TimesInscritos[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [equipes, setEquipes] = useState<Equipe[]>(timesMockOrdenado);
  const [paisSelecionado, setPaisSelecionado] = useState<Equipe | null>(null);
  const [nomeJogador, setNomeJogador] = useState<string>("");
  const [erroInscricao, setErroInscricao] = useState<string | null>(null);
  const { marcarInscricaoEnviada } = useNavegacao();

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
      marcarInscricaoEnviada();
    } catch (error) {
      console.error("Erro ao enviar o time inscrito:", error);
      setErroInscricao(
        "Esse time (ou nome) já foi escolhido por outra pessoa! Escolha outro país.",
      );
    }
  }
  function handleSelecionado(e: React.ChangeEvent<HTMLSelectElement>) {
    const pais = e.currentTarget.value;
    const equipeSelecionada = equipes?.find((item) => item.pais === pais);
    setPaisSelecionado(equipeSelecionada ?? null);
    setErroInscricao(null);
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
    setErroInscricao(null);
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
        erroInscricao,
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
