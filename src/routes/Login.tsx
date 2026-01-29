import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Input } from "../components/Input";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Preencha todos os campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/autenticacao/login", {
        username,
        password,
      });

      if (response.data.access_token) {
        localStorage.setItem("authToken", response.data.access_token);
        localStorage.setItem("refreshToken", response.data.refresh_token);
      navigate("/index");
      }
    } catch (err) {
      setError("Erro ao fazer login. Verifique as credenciais.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div>
      
        <header className="login">
          🐾 Bem-vindo! 🐾
        </header>

        <div className="login-form">
          <Input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Input 
            type="password" 
            placeholder="Senha" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button 
            onClick={handleLogin}
            disabled={loading}
            className="mt-4 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold hover:from-purple-600 hover:to-purple-800 transition disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="login-link">
            <a href="#">Esqueceu a senha?</a>
            <a href="#">Cadastre-se</a>
          </div>
        </div>
      
    </div>
  );
}
