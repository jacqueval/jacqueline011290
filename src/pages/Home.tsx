import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Pet } from '../types';

const Home = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/v1/pets', {
        params: { nome: search || undefined },
      });
      setPets(res.data.content || res.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este pet?')) {
      try {
        await api.delete(`/v1/pets/${id}`);
        fetchPets(); // Refresh the list
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchPets();
  }, [search]);

  return (
    <section className="screen">
      <header className="header">
        🐾 Pets Disponíveis 🐾
      </header>

      <div className="content">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="pagination">
          <button>Anterior</button>
          <button>Próxima</button>
        </div>
     
        {/* Área onde futuramente entram os cards dos pets */}
        <div className="list-placeholder">
          {loading ? (
            <p>Carregando...</p>
          ) : pets.length > 0 ? (
            <div>
              {pets.map((pet) => (
                <div key={pet.id} style={{ marginBottom: '16px', padding: '12px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}>
                  <h2 style={{ color: '#fff' }}>{pet.nome}</h2>
                  <p style={{ color: '#fff' }}>Espécie: {pet.especie}</p>
                  <p style={{ color: '#fff' }}>Idade: {pet.idade}</p>
                  <div style={{ marginTop: '8px' }}>
                    <Link to={`/protected/pet/${pet.id}`} style={{ color: '#bda9ff', marginRight: '8px' }}>Ver Detalhes</Link>
                    <Link to={`/protected/pet/edit/${pet.id}`} style={{ color: '#ffeb3b', marginRight: '8px' }}>Editar</Link>
                    <button onClick={() => handleDelete(pet.id)} style={{ color: '#f44336', background: 'none', border: 'none', cursor: 'pointer' }}>Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Lista de pets aqui...</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;