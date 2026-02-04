# Processo Seletivo Conjunto Nº 001/2026/SEPLAG

Frontend desenvolvido em React + Vite + TypeScript + Tailwind CSS, 
consumindo a API pública: https://pet-manager-api.geia.vip/q/swagger-ui/

#### Run:
 - npm install     # Instalar dependências
 - npm run dev     # Servidor de desenvolvimento
 - npm run build   # Build de produção

#### Credenciais de teste: 
 - Usuário: admin
 - Senha: admin

##### Link/Localhost:
- http://localhost:3000/login

#### Estrutura do Projeto
src/
├── App.tsx              # Configuração de rotas
├── main.tsx             # Ponto de entrada
├── index.css            # Estilos globais com Tailwind
├── routes/              # Componentes de página
│   ├── Index.tsx        # Menu principal (Home)
│   ├── Login.tsx        # Autenticação
│   ├── Pets.tsx         # Lista de pets
│   ├── PetForm.tsx      # Criar/editar pet
│   ├── PetDetail.tsx    # Detalhes do pet
│   ├── Tutores.tsx      # Lista de tutores
│   ├── TutorForm.tsx    # Criar/editar tutor
│   └── TutorDetail.tsx  # Detalhes do tutor
├── components/          # Componentes reutilizáveis
│   └── Input.tsx        # Input customizado
└── services/
    └── api.ts           # Cliente Axios com interceptors


###  Projeto Desenvolvedor Front End

1. Tela Inicial;
2. Tela de Detalhamento do Pet;
3. Tela de Cadastro/Edição de Pet;
4. Tela de Cadastro/Edição de Tutor;
5. Autenticação.

#### Principais Funcionalidades
##### Gerenciamento de Pets
 - Visualizar Pets: Lista todos os pets com paginação
 - Buscar: Encontre pets pelo nome
 - Criar: Adicionar novo pet (nome, raca, idade)
 - Editar: Alterar dados do pet
 - Excluir: Remover pet (com confirmação)
 - Detalhes: Visualizar informações completas do pet

##### Gerenciamento de Tutores
 - Visualizar Tutores: Lista todos os tutores com paginação
 - Buscar: Encontre tutores pelo nome
 - Criar: Adicionar novo tutor (nome, telefone, endereço)
 - Editar: Alterar dados do tutor
 - Excluir: Remover tutor (com confirmação)

### Implementação Técnica
 - TypeScript com tipagens corretas
 - React Hooks (useState, useEffect)
 - React Router v6 para navegação
 - Axios com interceptors customizados
 - Tailwind CSS para estilização
 - Vite para builds rápidos
 - localStorage para persistência de tokens

### Design & UX
 - Tema escuro (Dark Mode)
 - Acentos em roxo e azul
 - Design responsivo (mobile-first)
 - Tabelas interativas com hover
 - Animações suaves com Tailwind CSS
