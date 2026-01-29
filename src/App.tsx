// import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./routes/Login"
import Index from "./routes/Index"
import Pets from "./routes/Pets"
import PetForm from "./routes/PetForm"
import PetDetail from "./routes/PetDetail"
import Tutores from "./routes/Tutores"
import TutorForm from "./routes/TutorForm"
import TutorDetail from "./routes/TutorDetail"

import "./index.css"



function App() {
  
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/index" />} />
        <Route path="/index" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/pets/new" element={<PetForm />} />
        <Route path="/pets/:id" element={<PetDetail />} />
        <Route path="/pets/:id/edit" element={<PetForm />} />
        <Route path="/tutores" element={<Tutores />} />
        <Route path="/tutores/new" element={<TutorForm />} />
        <Route path="/tutores/:id" element={<TutorDetail />} />
        <Route path="/tutores/:id/edit" element={<TutorForm />} />
      </Routes>
    </BrowserRouter>
  
    </>
    
  )
}

export default App
