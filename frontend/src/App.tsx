import "./App.css";
import Header from "./components/Header";
import Login from "./components/Login";
import TelaEspera from "./components/TelaEspera";
import TelaGrupos from "./components/TelaGrupos";
import TelaRodadas from "./components/TelaRodadas";
import TelaClassificacao from "./components/TelaClassificacao";
import TelaOitavas from "./components/TelaOitavas";
import TelaQuartas from "./components/TelaQuartas";
import TelaSemis from "./components/TelaSemis";
import TelaEstatisticas from "./components/TelaEstatisticas";
import { LoginProvider } from "./contexts/LoginContext";
import { NavegacaoProvider, useNavegacao } from "./contexts/NavegacaoContext";
import { Routes, Route, Navigate } from "react-router-dom";

function Conteudo() {
  const { inscricaoEnviada } = useNavegacao();
  return (
    <Routes>
      <Route
        path="/"
        element={inscricaoEnviada ? <Navigate to="/espera" /> : <Login />}
      />
      <Route
        path="/espera"
        element={inscricaoEnviada ? <TelaEspera /> : <Navigate to="/" />}
      />
      <Route
        path="/grupos"
        element={inscricaoEnviada ? <TelaGrupos /> : <Navigate to="/" />}
      />
      <Route
        path="/rodadas"
        element={inscricaoEnviada ? <TelaRodadas /> : <Navigate to="/" />}
      />
      <Route
        path="/classificacao"
        element={inscricaoEnviada ? <TelaClassificacao /> : <Navigate to="/" />}
      />
      <Route
        path="/oitavas"
        element={inscricaoEnviada ? <TelaOitavas /> : <Navigate to="/" />}
      />
      <Route
        path="/quartas"
        element={inscricaoEnviada ? <TelaQuartas /> : <Navigate to="/" />}
      />
      <Route
        path="/semis"
        element={inscricaoEnviada ? <TelaSemis /> : <Navigate to="/" />}
      />
      <Route
        path="/estatisticas/:fase"
        element={inscricaoEnviada ? <TelaEstatisticas /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

function App() {
  return (
    <NavegacaoProvider>
      <LoginProvider>
        <div className=" grow min-h-screen w-full flex flex-col">
          <Header />
          <Conteudo />
        </div>
      </LoginProvider>
    </NavegacaoProvider>
  );
}

export default App;
