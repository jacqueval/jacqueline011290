import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Tutor } from '../types';

const Tutors = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/v1/tutores');
      setTutors(res.data.content || res.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este tutor?')) {
      try {
        await api.delete(`/v1/tutores/${id}`);
        fetchTutors(); // Refresh the list
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <section className="screen">
      <header className="header">
        🐾 Tutores 🐾
      </header>

      <div className="content">
        <div className="mb-4">
          <Link to="new" className="bg-green-500 text-white px-4 py-2 rounded">Novo Tutor</Link>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : tutors.length > 0 ? (
          <div>
            {tutors.map((tutor) => (
              <div key={tutor.id} style={{ marginBottom: '16px', padding: '12px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}>
                <h2 style={{ color: '#fff' }}>{tutor.nomeCompleto}</h2>
                <p style={{ color: '#fff' }}>Email: {tutor.email}</p>
                <p style={{ color: '#fff' }}>Telefone: {tutor.telefone}</p>
                <p style={{ color: '#fff' }}>CPF: {tutor.cpf}</p>
                <div style={{ marginTop: '8px' }}>
                  <Link to={`${tutor.id}`} style={{ color: '#bda9ff', marginRight: '8px' }}>Ver Detalhes</Link>
                  <Link to={`edit/${tutor.id}`} style={{ color: '#ffeb3b', marginRight: '8px' }}>Editar</Link>
                  <button onClick={() => handleDelete(tutor.id)} style={{ color: '#f44336', background: 'none', border: 'none', cursor: 'pointer' }}>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhum tutor encontrado.</p>
        )}
      </div>
    </section>
  );
};

export default Tutors;