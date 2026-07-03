import "./App.css";
import Header from "./components/Header";
import Login from "./components/Login";
import { LoginProvider } from "./contexts/LoginContext";

function App() {
  return (
    <LoginProvider>
      <div className=" grow min-h-screen w-full flex flex-col">
        <Header />
        <Login />
      </div>
    </LoginProvider>
  );
}

export default App;
