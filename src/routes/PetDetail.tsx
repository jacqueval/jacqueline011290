import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function PetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPet = async () => {
      try {
        if (!id) return;
        const response = await api.get<Pet>(`/v1/pets/${id}`);
        setPet(response.data);
      } catch (err) {
        setError("Erro ao carregar dados do pet");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  if (loading) {
    return (
      <div>
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div>        
          <p className="text-red-400 mb-4">{error}</p>          
      </div>
    );
  }

  return (
    <div>

        <header className="pet">
          🐾 Detalhes do Pet 🐾
        </header>

        <div className="p-6 space-y-4">
          {pet.foto?.url && (
            <img
              src={pet.foto.url}
              alt={pet.nome}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          )}

          <div className="space-y-3">
            <div>
              <h1 className="text-3xl font-bold text-purple-300 mb-2">
                {pet.nome}
              </h1>
            </div>

            <div>
              <p>
                <strong>Raça:</strong> {pet.raca}
              </p>
            </div>

            <div>
              <p>
                <strong>Idade:</strong> {pet.idade} anos
              </p>
            </div>

            {pet.foto && (
              <div className="bg-white/10 p-3 rounded-lg">
                <p className="text-gray-300">
                  <strong>Foto:</strong> {pet.foto.nome}
                </p>
              </div>
            )}
          </div>

          <div>
            <button onClick={() => navigate(`/pets/${pet.id}/edit`)}>
              ✏️ Editar
            </button>
            <button onClick={() => navigate(-1)}>
              ← Voltar
            </button>
          </div>

          <div>
            <button onClick={() => navigate("/tutores")}>
              👤 Tutores
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                navigate('/login');
              }}>
              🚪 Sair
            </button>
          </div>
        </div>
      
    </div>
  );
}
