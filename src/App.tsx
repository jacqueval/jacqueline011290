import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { isAuthenticated } from './utils/auth';

const Home = lazy(() => import('./pages/Home'));
const PetDetail = lazy(() => import('./pages/PetDetail'));
const PetForm = lazy(() => import('./pages/PetForm'));
const Tutors = lazy(() => import('./pages/Tutors'));
const TutorDetail = lazy(() => import('./pages/TutorDetail'));
const TutorForm = lazy(() => import('./pages/TutorForm'));
const Login = lazy(() => import('./pages/Login'));

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App(){
    return(
        <BrowserRouter>
      <Suspense fallback={<div>Carregando...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={isAuthenticated() ? <Navigate to="/protected" /> : <Navigate to="/login" />} />
          <Route path="/protected" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Home />} />
            <Route path="pet/:id" element={<PetDetail />} />
            <Route path="pet/new" element={<PetForm />} />
            <Route path="pet/edit/:id" element={<PetForm />} />
            <Route path="tutors" element={<Tutors />} />
            <Route path="tutors/:id" element={<TutorDetail />} />
            <Route path="tutors/new" element={<TutorForm />} />
            <Route path="tutors/edit/:id" element={<TutorForm />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
