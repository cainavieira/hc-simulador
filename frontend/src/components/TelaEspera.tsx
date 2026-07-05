import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../contexts/LoginContext";
import { getStatusJogo, iniciarJogo } from "../services/useJogo";

export default function TelaEspera() {
  const { timesInscritos } = useLogin();
  const [senha, setSenha] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const iniciado = await getStatusJogo();
        if (iniciado) {
          navigate("/grupos");
        }
      } catch (error) {
        console.error("Erro ao checar status do jogo:", error);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [navigate]);

  async function handleIniciarJogo() {
    try {
      await iniciarJogo(senha);
    } catch (error) {
      console.error("Senha errada ou erro ao iniciar o jogo:", error);
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <p className="text-2xl! my-2! text-amber-50">Aguardando o organizador iniciar o jogo...</p>
      <p className=" font-bold text-xl! my-2! ">{timesInscritos.length} participante(s) inscrito(s)</p>
      <ul className="flex flex-col gap-2">
        {timesInscritos.map((t) => (
          <li key={t.id} className="flex items-center gap-2">
            <img
              src={`https://flagsapi.com/${t.codigoPais}/flat/64.png`}
              alt={t.timeJogador}
              className="w-8"
            />
            <span>
              {t.nomeJogador} — {t.timeJogador}
            </span>
          </li>
        ))}
      </ul>
      <input
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.currentTarget.value)}
        placeholder="Senha do organizador"
        className="ring-border ring-1 rounded-md font-semibold text-center p-2! text-xl"
      />
      <button
        onClick={handleIniciarJogo}
        className="ring-2 ring-cor-primaria-p p-3! rounded-md cursor-pointer text-cor-secondaria-p text-xl"
      >
        Iniciar jogo
      </button>
    </div>
  );
}
