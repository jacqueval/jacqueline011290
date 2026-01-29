import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

type Pet = {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto?: {
    id: number;
    nome: string;
    contentType: string;
    url: string;
  };
};

type PaginatedResponse = {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: Pet[];
};

export default function Pets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchNome, setSearchNome] = useState("");
  const navigate = useNavigate();

  const fetchPets = async (page: number = 0, nome: string = "") => {
    setLoading(true);
    try {
      const params = {
        page,
        size: pageSize,
        ...(nome && { nome }),
      };
      
      const response = await api.get<PaginatedResponse>("/v1/pets", { params });
      setPets(response.data.content);
      setTotalPages(response.data.pageCount);
      setCurrentPage(response.data.page);
    } catch (err) {
      console.error("Erro ao listar pets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets(0, searchNome);
  }, []);

  const handleSearch = () => {
    fetchPets(0, searchNome);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchPets(0, searchNome);
    }
  };

  const handleDelete = async (petId: number) => {
    if (window.confirm("Tem certeza que deseja deletar este pet?")) {
      try {
        await api.delete(`/v1/pets/${petId}`);
        alert("Pet deletado com sucesso!");
        fetchPets(currentPage, searchNome);
      } catch (err) {
        alert("Erro ao deletar pet");
        console.error(err);
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      fetchPets(currentPage + 1, searchNome);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      fetchPets(currentPage - 1, searchNome);
    }
  };

  return (
    <div>
        <header className="pet">
          🐾 Pets Disponíveis 🐾
        </header>

        <div className="search-box p-6">

            {/* Buscar por nome */}
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchNome}
              onChange={(e) => setSearchNome(e.target.value)}
              onKeyPress={handleKeyPress}
              />

            <button onClick={handleSearch}type="button">
              🔍
            </button>          

          <div className="indice-button">

            <button onClick={() => navigate("/index")}>
              🏠 Home
            </button>

            <button onClick={() => navigate("/pets/new")}>
              ➕ Cadastrar um novo pet
            </button>

            <button onClick={() => navigate("/tutores")}>
              👤 Tutores
            </button>

            <button onClick={() => navigate("/pets")}>
              🐾 Ver Pets
            </button>
            
          </div>

          <div className="but-pet flex gap-2 mb-4">
            <button onClick={handlePreviousPage} disabled={currentPage === 0}>
              ← Anterior
            </button>
            <span className="px-3 py-2 text-white text-center">
              Pág {currentPage + 1} de {totalPages || 1}
            </span>

            <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
              Próxima →
            </button>

          </div>

          <div className="table-container">
            {loading ? (
              <p className="text-center text-gray-400 py-8">Carregando...</p>
            ) : pets.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Raça</th>
                    <th>Idade</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pets.map(pet => (
                    <tr key={pet.id}>
                      <td>
                        <strong>{pet.nome}</strong>
                      </td>
                      <td>{pet.raca}</td>
                      <td>{pet.idade} anos</td>
                      <td>
                        <div className="table-actions">
                          <button 
                            onClick={() => navigate(`/pets/${pet.id}`)}
                            className="view-btn"
                            title="Ver detalhes"
                          >
                            👁️
                          </button>
                          <button 
                            onClick={() => navigate(`/pets/${pet.id}/edit`)}
                            className="edit-btn"
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleDelete(pet.id)}
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
              <p className="text-center text-gray-400 py-8">Nenhum pet encontrado</p>
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
