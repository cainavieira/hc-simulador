import { useLogin } from "../contexts/LoginContext";
import hclogo from "../assets/image.png";


export default function Login() {
  const { handleSelecionado, handleSubmit, handleNomeJogador, equipes, loading, nomeJogador, paisSelecionado } =
    useLogin();

  if (loading)
    <div className="flex-1 justify-center items-center w100 h-screen flex">
      return <p className="text-2xl text-amber-500 font-bold">Carregando...</p>;
    </div>

  return (
    <form
      action=""
      method="post"
      className="flex flex-col gap-8 grow justify-center b"
    >
      <div className="flex justify-center">
        <img src={hclogo} alt="Logo da Copa do Mundo" className="w-1/2" />
      </div>
      <div className="flex gap-2 flex-col ">
        <label htmlFor="nome" className="text-cor-secondaria-p self-start">
          Escreva o nome:{" "}
        </label>
        <input
          type="text"
          id="nome"
          value={nomeJogador}
          onChange={handleNomeJogador}
          className="ring-border ring-1 rounded-md font-semibold  text-center p-2! text-xl"
        />
      </div>
      <div className="flex gap-2 flex-col">
        <label htmlFor="time" className="text-cor-secondaria-p self-start">
          Selecione o Pais:{" "}
        </label>
        <select
          name="time"
          id="time-name"
          value={paisSelecionado?.pais ?? ""}
          onChange={handleSelecionado}
          className="ring-border ring-1 rounded-md font-semibold text-center p-2! text-xl"
        >
          <option value="" className="ring-border">Escolha um time...</option>
          {equipes &&
            equipes.map((item) => (
              <option key={item.id} value={item.pais}>
                {item.pais}
              </option>
            ))}
        </select>
      </div>
      <div>
        <button
          onClick={handleSubmit}
          className="ring-2 ring-cor-primaria-p p-3! rounded-md cursor-pointer text-cor-secondaria-p text-xl"
        >
          Clica para Salvar
        </button>
      </div>
    </form>
  );
}
