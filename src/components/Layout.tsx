import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4 text-white">
        <div className="container mx-auto flex justify-between">
            <div className="space-x-4">
           
                <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className="hover:underline bg-red-500 text-white px-2 py-1 rounded">Sair</button>

                <div className="mb-4">
                    <Link to="/protected/pet/new" className="bg-green-500 text-white px-4 py-2 rounded">Adicionar Pet</Link>
                </div>

                <Link to="tutors" className="hover:underline">Tutores</Link>

          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;