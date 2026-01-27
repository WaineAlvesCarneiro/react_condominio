// src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/login/Login';
import PrivateRoute from './components/common/PrivateRoute';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Imoveis from './pages/imoveis/Imoveis';
import Moradores from './pages/moradores/Moradores';
import Empresas from './pages/empresas/Empresas';
// import Usuarios from './pages/usuarios/Usuarios';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute allowedRoles={['Suporte', 'Sindico', 'Porteiro']} />}>
            <Route path="/" element={<MainLayout />}>
              
              <Route element={<PrivateRoute allowedRoles={['Sindico', 'Porteiro']} />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="imoveis" element={<Imoveis />} />
                <Route path="moradores" element={<Moradores />} />
              </Route>

              <Route element={<PrivateRoute allowedRoles={['Suporte']} />}>
                <Route path="empresas" element={<Empresas />} />
                {/* { <Route path="usuarios" element={<Usuarios />} /> } */}
              </Route>

            </Route>
          </Route>
          
          <Route path="/unauthorized" element={<h1>Acesso Negado</h1>} />
        </Routes>
      </AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;