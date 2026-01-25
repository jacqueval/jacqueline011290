import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../services/api';
import type { Pet } from '../types';

const petSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  especie: z.string().min(1, 'Espécie é obrigatória'),
  idade: z.number().min(0, 'Idade deve ser positiva'),
  raca: z.string().optional(),
});

type PetFormData = z.infer<typeof petSchema>;

const PetForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [foto, setFoto] = useState<File | null>(null);
  const [currentFoto, setCurrentFoto] = useState<string | null>(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
  });

  useEffect(() => {
    if (id && id !== 'new') {
      const fetchPet = async () => {
        const res = await api.get(`/v1/pets/${id}`);
        const pet: Pet = res.data;
        setValue('nome', pet.nome);
        setValue('especie', pet.especie);
        setValue('idade', pet.idade);
        setValue('raca', pet.raca || '');
        setCurrentFoto(pet.foto || null);
      };
      fetchPet();
    }
  }, [id, setValue]);

  const onSubmit = async (data: PetFormData) => {
    try {
      let petId: string;
      if (id && id !== 'new') {
        await api.put(`/v1/pets/${id}`, data);
        petId = id;
      } else {
        const res = await api.post('/v1/pets', data);
        petId = res.data.id;
      }
      if (foto) {
        const formData = new FormData();
        formData.append('foto', foto);
        await api.post(`/v1/pets/${petId}/fotos`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      navigate('/protected');
    } catch (error) {
      console.error(error);
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
      <div className="mb-4">
        <label className="block">Nome</label>
        <input {...register('nome')} className="border p-2 w-full" />
        {errors.nome && <p className="text-red-500">{errors.nome.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block">Espécie</label>
        <input {...register('especie')} className="border p-2 w-full" />
        {errors.especie && <p className="text-red-500">{errors.especie.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block">Idade</label>
        <input type="number" {...register('idade', { valueAsNumber: true })} className="border p-2 w-full" />
        {errors.idade && <p className="text-red-500">{errors.idade.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block">Raça</label>
        <input {...register('raca')} className="border p-2 w-full" />
      </div>
      <div className="mb-4">
        <label className="block">Foto</label>
        {currentFoto && <img src={currentFoto} alt="Foto atual" className="w-32 h-32 object-cover mb-2" />}
        <input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files?.[0] || null)} className="border p-2 w-full" />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Salvar</button>
    </form>
  );
};

export default PetForm;