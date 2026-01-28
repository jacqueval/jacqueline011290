import { useNavigate } from "react-router-dom";
import { Input } from "../components/Input";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-[360px] bg-gradient-to-b from-[#2a1f3a] to-[#0e0e14] rounded-2xl shadow-xl overflow-hidden">

        <header className="login">
          🐾 Bem-vindo! 🐾
        </header>

        <div className="login-form">
          <Input type="email" placeholder="E-mail" />
          <Input type="password" placeholder="Senha" />

          <button onClick={() => navigate("/pets")}>
            Entrar
          </button>

          <div className="login-link">
            <a href="#">Esqueceu a senha?</a>
            <a href="#">Cadastre-se</a>
          </div>
        </div>
      </div>
    </div>
  );
}
