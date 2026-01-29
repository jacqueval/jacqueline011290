import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('authToken');

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <div className="conteudo">
              
        <header className="pet">
          🐾 Pets e Tutores 🐾
        </header>

        <div className="pet-tutores">          
            <p>
              Cadastro de pets e tutores
            </p>
      
          <button onClick={() => navigate('/pets')}>
            <span>🐾</span> Pets
            <p>
              Pets Cadastrados
            </p>
          </button>

          <button onClick={() => navigate('/tutores')}>
            <span>👤</span> Tutores
            <p>
              Tutores Cadastrados
            </p>
          </button>

          <div>
            <button
              onClick={() => {
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                navigate('/login');
              }}
              className="sair"
            >
              🚪 Sair
            </button>
          </div>
        </div>

        <footer className="footer">
          <p>
            Processo Seletivo Conjunto Nº 001/2026/SEPLAG - jacqueline011290
          </p>
        </footer>
      
    </div>
  );
}
