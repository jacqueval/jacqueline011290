import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";

type PetFormData = {
  nome: string;
  raca: string;
  idade: number;
  foto?: File | null;
};

export default function PetForm() {
  const { id } = useParams<{ id?: string }>();
  const [formData, setFormData] = useState<PetFormData>({
    nome: "",
    raca: "",
    idade: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isEditing = !!id;

  
  const [preview, setPreview] = useState<string | null>(null);
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (file) {
    
    setPreview(URL.createObjectURL(file));
  }
};


  useEffect(() => {
    if (isEditing && id) {
      const fetchPet = async () => {
        try {
          const response = await api.get(`/v1/pets/${id}`);
          setFormData({
            nome: response.data.nome,
            raca: response.data.raca,
            idade: response.data.idade,
          });
        } catch (err) {
          setError("Erro ao carregar dados do pet");
          console.error(err);
        }
      };
      fetchPet();
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "idade" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.raca) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isEditing && id) {
        await api.put(`/v1/pets/${id}`, formData);
        alert("Pet atualizado com sucesso!");
      } else {
        await api.post("/v1/pets", formData);
        alert("Pet cadastrado com sucesso!");
      }
      navigate("/pets");
    } catch (err) {
      setError(`Erro ao ${isEditing ? "atualizar" : "cadastrar"} pet. Tente novamente.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center p-10">
      <div className="w-[360px] bg-gradient-to-b from-[#2a1f3a] to-[#0e0e14] rounded-2xl shadow-xl overflow-hidden">
        
        <header className="pet">
          🐾 {isEditing ? "Editar" : "Cadastrar Novo"} Pet 🐾
        </header>

        <div className="search-box p-10">
          <form onSubmit={handleSubmit}>

            {/* Nome do Pet */}
            <input 
              type="text"
              name="nome"
              placeholder="Nome do Pet"
              value={formData.nome}
              onChange={handleChange}
              required
             />

            {/* Raça */}
            <input
              type="text"
              name="raca"
              placeholder="Raça"
              value={formData.raca}
              onChange={handleChange}
              required
              
            />

            {/* Idade do Pet */}
            <input
              type="number"
              name="idade"
              placeholder="Idade (anos)"
              value={formData.idade}
              onChange={handleChange}
              min="0"
              
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}


            {/* Foto do Pet */}
            <div className="flex flex-col items-center gap-3 mt-4">
              
              {preview && (
                <img
                  src={preview}
                  alt="Preview do pet"
                  className="w-32 h-32 rounded-full object-cover border-2 border-purple-400"
                />
              )}

              <label className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition">
                📸 Adicionar foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>


            <button
              type="submit"
              disabled={loading}>
              {loading ? `${isEditing ? "Atualizando" : "Cadastrando"}...` : `${isEditing ? "Atualizar" : "Cadastrar"} Pet`}
            </button>

            

            <button type="button" onClick={() => navigate(-1)}>
              ← Voltar
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
