import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";

type Pet = {
  id: number;
  nome: string;
  raca: string;
  idade: number;
};

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
  content: Pet[];
};

export default function TutorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [petLinks, setPetLinks] = useState<Pet[]>([]);
  const [availablePets, setAvailablePets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [linkingLoading, setLinkingLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        
        // Fetch tutor data
        const tutorResponse = await api.get<Tutor>(`/v1/tutores/${id}`);
        setTutor(tutorResponse.data);

        // Fetch all pets to determine which are available
        const allPetsResponse = await api.get<PaginatedResponse>("/v1/pets", { 
          params: { page: 0, size: 1000 } 
        });
        
        // Try to fetch linked pets (this endpoint might not exist)
        // For now, we'll just show all pets as available
        setAvailablePets(allPetsResponse.data.content);
        setPetLinks([]);
      } catch (err) {
        setError("Erro ao carregar dados");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleLinkPet = async () => {
    if (!selectedPetId || !id) return;

    setLinkingLoading(true);
    try {
      await api.post(`/v1/tutores/${id}/pets/${selectedPetId}`);
      alert("Pet vinculado com sucesso!");
      
      // Add to linked pets
      const linkedPet = availablePets.find(p => p.id === selectedPetId);
      if (linkedPet) {
        setPetLinks([...petLinks, linkedPet]);
      }
      
      setShowLinkModal(false);
      setSelectedPetId(null);
    } catch (err) {
      alert("Erro ao vincular pet");
      console.error(err);
    } finally {
      setLinkingLoading(false);
    }
  };

  const handleUnlinkPet = async (petId: number) => {
    if (!id) return;

    if (window.confirm("Tem certeza que deseja desvinculcar este pet?")) {
      try {
        await api.delete(`/v1/tutores/${id}/pets/${petId}`);
        alert("Pet desvinculado com sucesso!");
        setPetLinks(petLinks.filter(p => p.id !== petId));
      } catch (err) {
        alert("Erro ao desvinculcar pet");
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  if (error || !tutor) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate("/tutores")}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700 transition"
          >
            Voltar para lista
          </button>
        </div>
      </div>
    );
  }

  const unlinkedPets = availablePets.filter(p => !petLinks.some(pl => pl.id === p.id));

  return (
    <div>
      <div>        
        <header className="pet">
          👤 Detalhes do Tutor 👤
        </header>
                
          <div>
            <h1>
              {tutor.nome || tutor.nomeCompleto}
            </h1>
          </div>

          <div>
            <p>
              <strong>Email:</strong> {tutor.email}
            </p>
          </div>

          <div>
            <p>
              <strong>Telefone:</strong> {tutor.telefone}
            </p>
          </div>

          <div>
            <p>
              <strong>Endereço:</strong> {tutor.endereco}
            </p>
          </div>

          {tutor.cpf && (
            <div>
              <p>
                <strong>CPF:</strong> {tutor.cpf}
              </p>
            </div>
          )}

          <div>
            <h2>
              🐾 Pets Vinculados ({petLinks.length})
            </h2>

            {petLinks.length > 0 ? (
              <div className="space-y-2 mb-4">
                {petLinks.map(pet => (
                  
                  <div key={pet.id} className="bg-white/10 p-3 rounded-lg flex justify-between items-start">
                    <div>
                      <p className="font-bold text-white">{pet.nome}</p>
                      <p className="text-xs text-gray-400">{pet.raca} - {pet.idade}a</p>
                    </div>
                    <button
                      onClick={() => handleUnlinkPet(pet.id)}
                      className="px-2 py-1 rounded text-xs bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

            ) : (

              <p>Nenhum pet vinculado</p>
            )}

            <button onClick={() => setShowLinkModal(true)} disabled={unlinkedPets.length === 0}>
              ➕ Vincular Pet
            </button>
          </div>

          <div>
            <button onClick={() => navigate(`/tutores/${tutor.id}/edit`)}>
              ✏️ Editar
            </button>
            <button
              onClick={() => navigate(-1)}>
              ← Voltar
            </button>
          </div>
        
      </div>

      {/* Modal para vincular pet */}
      {showLinkModal && (
        <div>
          <div>
            <h3>
              Vincular Pet
            </h3>

            {unlinkedPets.length > 0 ? (
              <>
                <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                  {unlinkedPets.map(pet => (
                    <button
                      key={pet.id}
                      onClick={() => setSelectedPetId(pet.id)}
                      className={`w-full p-3 rounded-lg text-left transition ${
                        selectedPetId === pet.id
                          ? "bg-purple-600 border border-purple-400"
                          : "bg-white/10 border border-white/20 hover:bg-white/20"
                      }`}
                    >
                      <p className="font-bold text-white">{pet.nome}</p>
                      <p className="text-xs text-gray-400">{pet.raca} - {pet.idade}a</p>
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleLinkPet}
                    disabled={!selectedPetId || linkingLoading}
                    className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {linkingLoading ? "Vinculando..." : "Vincular"}
                  </button>
                  <button
                    onClick={() => {
                      setShowLinkModal(false);
                      setSelectedPetId(null);
                    }}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-400 mb-4">
                  Todos os pets já estão vinculados a este tutor.
                </p>
                <button
                  onClick={() => {
                    setShowLinkModal(false);
                    setSelectedPetId(null);
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition"
                >
                  Fechar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
