// src\components\layout\Sidebar.js

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';

function Sidebar() {
  return (
    <nav className={styles.sidebar}>
      <ul>
        <li>
          <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
        </li>
        <li>
          <Link to="/imoveis" className={styles.navLink}>Imóveis</Link>
        </li>
        <li>
          <Link to="/moradores" className={styles.navLink}>Moradores</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;