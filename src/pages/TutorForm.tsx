import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import InputMask from 'react-input-mask';
import api from '../services/api';
import type { Tutor } from '../types';

const tutorSchema = z.object({
  nomeCompleto: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos').max(11, 'CPF deve ter 11 dígitos'),
});

type TutorFormData = z.infer<typeof tutorSchema>;

const TutorForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [foto, setFoto] = useState<File | null>(null);
  const [currentFoto, setCurrentFoto] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<TutorFormData>({
    resolver: zodResolver(tutorSchema),
  });

  useEffect(() => {
    if (id && id !== 'new') {
      const fetchTutor = async () => {
        const res = await api.get(`/v1/tutores/${id}`);
        const tutor: Tutor = res.data;
        setValue('nomeCompleto', tutor.nomeCompleto);
        setValue('email', tutor.email);
        setValue('telefone', tutor.telefone);
        setValue('endereco', tutor.endereco);
        setValue('cpf', tutor.cpf);
        setCurrentFoto(tutor.foto || null);
      };
      fetchTutor();
    }
  }, [id, setValue]);

  const onSubmit = async (data: TutorFormData) => {
    try {
      let tutorId: string;
      if (id && id !== 'new') {
        await api.put(`/v1/tutores/${id}`, data);
        tutorId = id;
      } else {
        const res = await api.post('/v1/tutores', data);
        tutorId = res.data.id;
      }
      if (foto) {
        const formData = new FormData();
        formData.append('foto', foto);
        await api.post(`/v1/tutores/${tutorId}/fotos`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      navigate('/protected/tutors');
    } catch (error) {
      console.error(error);
      navigate('/protected/tutors');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
      <div className="mb-4">
        <label className="block">Nome Completo</label>
        <input {...register('nomeCompleto')} className="border p-2 w-full" />
        {errors.nomeCompleto && <p className="text-red-500">{errors.nomeCompleto.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block">Email</label>
        <input type="email" {...register('email')} className="border p-2 w-full" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block">CPF</label>
        <InputMask mask="999.999.999-99" {...register('cpf')}>
          {(inputProps: any) => <input {...inputProps} className="border p-2 w-full" />}
        </InputMask>
        {errors.cpf && <p className="text-red-500">{errors.cpf.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block">Telefone</label>
        <InputMask mask="(99) 99999-9999" {...register('telefone')}>
          {(inputProps: any) => <input {...inputProps} className="border p-2 w-full" />}
        </InputMask>
        {errors.telefone && <p className="text-red-500">{errors.telefone.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block">Endereço</label>
        <input {...register('endereco')} className="border p-2 w-full" />
        {errors.endereco && <p className="text-red-500">{errors.endereco.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block">Foto</label>
        {currentFoto && <img src={currentFoto} alt="Foto atual" className="w-32 h-32 object-cover mb-2" />}
        <input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files?.[0] || null)} className="border p-2 w-full" />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Salvar</button>
    </form>
  );
};

export default TutorForm;