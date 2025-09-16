// src\components\layout\MainLayout.js

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

function MainLayout() {
  return (
    <div>
      <Header />
      <Sidebar />
      <main>
        <Outlet />
      </main>

      <footer>
        <p>&copy;Condomínio 2025</p>
      </footer>
    </div>
  );
}

export default MainLayout;