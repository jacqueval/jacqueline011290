type Pet = {
  id: number;
  nome: string;
  especie: string;
  idade: number;
};

type Props = {
  pet: Pet;
  onClick: () => void;
};

export function PetCard({ pet, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-2xl bg-white/10 p-5 shadow hover:bg-white/20 transition"
    >
      <h2 className="text-2xl font-bold text-purple-300 mb-2">
        {pet.nome}
      </h2>

      <p><strong>Espécie:</strong> {pet.especie}</p>
      <p><strong>Idade:</strong> {pet.idade} anos</p>
    </div>
  );
}
