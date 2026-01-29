import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";

type TutorFormData = {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: string;
};

export default function TutorForm() {
  const { id } = useParams<{ id?: string }>();
  const [formData, setFormData] = useState<TutorFormData>({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    cpf: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing && id) {
      const fetchTutor = async () => {
        try {
          const response = await api.get(`/v1/tutores/${id}`);
          setFormData({
            nome: response.data.nome || response.data.nomeCompleto || "",
            email: response.data.email || "",
            telefone: response.data.telefone,
            endereco: response.data.endereco,
            cpf: response.data.cpf ? String(response.data.cpf) : "",
          });
        } catch (err) {
          setError("Erro ao carregar dados do tutor");
          console.error(err);
        }
      };
      fetchTutor();
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.telefone || !formData.endereco || !formData.cpf) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const submitData = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        endereco: formData.endereco,
        cpf: parseInt(formData.cpf),
      };

      if (isEditing && id) {
        await api.put(`/v1/tutores/${id}`, submitData);
        alert("Tutor atualizado com sucesso!");
      } else {
        await api.post("/v1/tutores", submitData);
        alert("Tutor cadastrado com sucesso!");
      }
      navigate("/tutores");
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || `Erro ao ${isEditing ? "atualizar" : "cadastrar"} tutor`;
      setError(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center p-10">
              
        <header className="pet">
          👤 {isEditing ? "Editar" : "Cadastrar Novo"} Tutor 👤
        </header>

        <div className="search-box p-6">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="nome"
              placeholder="Nome Completo"
              value={formData.nome}
              onChange={handleChange}
              required
              />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              />

            <input
              type="tel"
              name="telefone"
              placeholder="Telefone"
              value={formData.telefone}
              onChange={handleChange}
              required
              />

            <input
              type="text"
              name="endereco"
              placeholder="Endereço"
              value={formData.endereco}
              onChange={handleChange}
              required
              />

            <input
              type="text"
              name="cpf"
              placeholder="CPF (somente números)"
              value={formData.cpf}
              onChange={handleChange}
              required
              maxLength={11}
              />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}>
              {loading ? `${isEditing ? "Atualizando" : "Cadastrando"}...` : `${isEditing ? "Atualizar" : "Cadastrar"} Tutor`}
            </button>

            <button type="button" onClick={() => navigate(-1)}>
              ← Voltar
            </button>
          </form>
        </div>
      
    </div>
  );
}
