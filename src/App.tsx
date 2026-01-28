// import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./routes/Login"
import Pets from "./routes/Pets"
import "./index.css"

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    {/* ================Colocar aqui link das telas================= */}
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div> */}

     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pets" element={<Pets />} />
      </Routes>
    </BrowserRouter>
  
    </>
    
  )
}

export default App
