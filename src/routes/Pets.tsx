import { useEffect, useState } from "react";
import { api } from "../services/api";
import { PetCard } from "../components/PetCard";

type Pet = {
  id: number;
  nome: string;
  especie: string;
  idade: number;
};

export default function Pets() {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    api.get("/v1/pets")
      .then(res => setPets(res.data.content || res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen flex justify-center p-10">
      <div className="w-[360px] bg-gradient-to-b from-[#2a1f3a] to-[#0e0e14] rounded-2xl shadow-xl overflow-hidden">

        <header className="pet">
          🐾 Pets Disponíveis 🐾
        </header>

        <div className="search-box">
          <input
            placeholder="Buscar por nome..."
          
          />

          <div className="but-pet">
            <button>Anterior</button>
            <button>Próxima</button>
          </div>

          <div className="space-y-3 mt-6">
            {pets.length > 0 ? (
              pets.map(pet => (
                <PetCard key={pet.id} pet={pet} onClick={() => console.log(pet)} />
              ))
            ) : (
              <p className="text-center text-gray-400">Nenhum pet encontrado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
