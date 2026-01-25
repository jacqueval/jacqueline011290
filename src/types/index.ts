export interface Pet {
  id: string;
  nome: string;
  especie: string;
  idade: number;
  raca?: string;
  foto?: string;
  tutorId?: string;
}

export interface Tutor {
  id: string;
  nomeCompleto: string;
  email: string;
  cpf: string;
  telefone: string;
  endereco: string;
  foto?: string;
  pets: Pet[];
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
}

export interface LoginData {
  username: string;
  password: string;
}