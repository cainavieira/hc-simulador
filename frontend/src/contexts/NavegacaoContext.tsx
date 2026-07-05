import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

type NavegacaoContextType = {
  inscricaoEnviada: boolean;
  marcarInscricaoEnviada: () => void;
};

const NavegacaoContext = createContext<NavegacaoContextType | null>(null);

export function NavegacaoProvider({ children }: { children: React.ReactNode }) {
  const [inscricaoEnviada, setInscricaoEnviada] = useState<boolean>(
    () => localStorage.getItem("inscricaoEnviada") === "true",
  );
  const navigate = useNavigate();

  function marcarInscricaoEnviada() {
    localStorage.setItem("inscricaoEnviada", "true");
    setInscricaoEnviada(true);
    navigate("/espera");
  }

  return (
    <NavegacaoContext.Provider value={{ inscricaoEnviada, marcarInscricaoEnviada }}>
      {children}
    </NavegacaoContext.Provider>
  );
}

export function useNavegacao() {
  const contexto = useContext(NavegacaoContext);
  if (!contexto)
    throw new Error("useNavegacao deve ser usado dentro do NavegacaoProvider");
  return contexto;
}
