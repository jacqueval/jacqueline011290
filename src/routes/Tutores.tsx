import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

type Tutor = {
  id: number;
  nome: string;
  nomeCompleto?: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf?: number;
};

type PaginatedResponse = {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: Tutor[];
};

export default function Tutores() {
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchName, setSearchName] = useState("");
  const navigate = useNavigate();

  const fetchTutores = async (page: number = 0, nome: string = "") => {
    setLoading(true);
    try {
      const params = {
        page,
        size: pageSize,
        ...(nome && { nome }),
      };
      
      const response = await api.get<PaginatedResponse>("/v1/tutores", { params });
      setTutores(response.data.content);
      setTotalPages(response.data.pageCount);
      setCurrentPage(response.data.page);
    } catch (err) {
      console.error("Erro ao listar tutores:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutores(0, searchName);
  }, []);

  const handleSearch = () => {
    fetchTutores(0, searchName);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchTutores(0, searchName);
    }
  };

  const handleDelete = async (tutoId: number) => {
    if (window.confirm("Tem certeza que deseja deletar este tutor?")) {
      try {
        await api.delete(`/v1/tutores/${tutoId}`);
        alert("Tutor deletado com sucesso!");
        fetchTutores(currentPage, searchName);
      } catch (err) {
        alert("Erro ao deletar tutor");
        console.error(err);
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      fetchTutores(currentPage + 1, searchName);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      fetchTutores(currentPage - 1, searchName);
    }
  };

  return (
    <div>
        
        <header className="pet">
          👤 Tutores Cadastrados 👤
        </header>

        <div className="search-box p-6">
          
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={handleKeyPress}
              />

            <button onClick={handleSearch} type="button">
              🔍
            </button>          

          <div className="indice-button">

            <button onClick={() => navigate("/index")}>
              🏠 Home
            </button>

            <button onClick={() => navigate("/tutores/new")}>
                ➕ Novo Tutor
            </button>

            <button onClick={() => navigate("/pets")}>
                🐾 Ver Pets
            </button>
           
          </div>

          <div className="but-pet flex gap-2 mb-4">
            <button onClick={handlePreviousPage} disabled={currentPage === 0}>
              ← Anterior
            </button>
            <span>
              Pág {currentPage + 1} de {totalPages || 1}
            </span>

            <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
              Próxima →
            </button>
          </div>

          <div className="table-container">
            {loading ? (
              <p className="text-center text-gray-400 py-8">Carregando...</p>
            ) : tutores.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {tutores.map(tutor => (
                    <tr key={tutor.id}>
                      <td>
                        <strong>{tutor.nome || tutor.nomeCompleto}</strong>
                      </td>
                      <td>{tutor.email}</td>
                      <td>{tutor.telefone}</td>
                      <td>
                        <div className="table-actions">
                          <button 
                            onClick={() => navigate(`/tutores/${tutor.id}`)}
                            className="view-btn"
                            title="Ver detalhes"
                          >
                            👁️
                          </button>
                          <button 
                            onClick={() => navigate(`/tutores/${tutor.id}/edit`)}
                            className="edit-btn"
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleDelete(tutor.id)}
                            className="delete-btn"
                            title="Deletar"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-400 py-8">Nenhum tutor encontrado</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 p-6">
          <div className="flex-1"></div>
          <button 
            onClick={() => {
              localStorage.removeItem('authToken');
              localStorage.removeItem('refreshToken');
              navigate('/login');
            }}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition"
          >
            🚪 Sair
          </button>
        </div>
      
    </div>
  );
}
