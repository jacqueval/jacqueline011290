import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { Tutor } from '../types';

const TutorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState<Tutor | null>(null);

  useEffect(() => {
    const fetchTutor = async () => {
      if (!id) return;
      const res = await api.get(`/v1/tutores/${id}`);
      setTutor(res.data);
    };
    fetchTutor();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await api.delete(`/v1/tutores/${id}`);
      navigate('/protected/tutors');
    } catch (error) {
      console.error(error);
    }
  };

  if (!tutor) return <p>Carregando...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{tutor.nomeCompleto}</h1>
      <p>Email: {tutor.email}</p>
      <p>CPF: {tutor.cpf}</p>
      <p>Telefone: {tutor.telefone}</p>
      <p>Endereço: {tutor.endereco}</p>
      {tutor.foto && <img src={tutor.foto} alt={tutor.nomeCompleto} className="w-32 h-32 object-cover" />}
      <h2 className="text-2xl font-bold mt-4">Pets</h2>
      {tutor.pets.length > 0 ? (
        <ul>
          {tutor.pets.map((pet) => (
            <li key={pet.id}>
              <Link to={`/protected/pet/${pet.id}`} className="text-blue-500">{pet.nome}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum pet cadastrado.</p>
      )}
      <div className="mt-4 space-x-2">
        <Link to={`/protected/tutors/edit/${id}`} className="bg-yellow-500 text-white px-4 py-2 rounded inline-block">Editar</Link>
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Excluir</button>
      </div>
    </div>
  );
};

export default TutorDetail;