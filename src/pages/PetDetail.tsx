import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import type { Pet } from '../types';

const PetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;
      const res = await api.get(`/v1/pets/${id}`);
      setPet(res.data);
    };
    fetchPet();
  }, [id]);

  if (!pet) return <p>Carregando...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{pet.nome}</h1>
      <p>Espécie: {pet.especie}</p>
      <p>Idade: {pet.idade}</p>
      <p>Raça: {pet.raca}</p>
      {pet.foto && <img src={pet.foto} alt={pet.nome} className="w-32 h-32 object-cover" />}
      <Link to={`/protected/pet/edit/${id}`} className="bg-yellow-500 text-white px-4 py-2 rounded mt-4 inline-block">Editar</Link>
    </div>
  );
};

export default PetDetail;