// src\pages\empresas\empresasTable.js

import React from 'react';
import Button from '../../components/common/Button';
import stylesDataTable from '../../components/common/DataTable.module.css';
import stylesPageLayout from '../../components/layout/PageLayout.module.css';

// import styles from './EmpresasTable.module.css';

function EmpresasTable({ empresas, onEdit, onDelete }) {
  const data = Array.isArray(empresas) 
    ? empresas 
    : (empresas && empresas.items ? empresas.items : []);

  return (
    <div className={stylesPageLayout.tableContainer}>
      <table className={stylesDataTable.dataTable}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Razão Social</th>
            <th>Fantasia</th>
            <th>Cnpj</th>
            <th>Tipo De Condóminio</th>
            <th>Nome</th>
            <th>Celular</th>
            <th className={stylesDataTable.action}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>  Nenhum empresa encontrado.</td>
            </tr>
          )}
          {data.map(empresa => (
            <tr key={empresa.id}>
              <td>{empresa.id}</td>
              <td>{empresa.razaoSocial}</td>
              <td>{empresa.fantasia}</td>
              <td>{empresa.cnpj}</td>
              <td>{empresa.TipoDeCondominio == 1 ? "Casas" : "Apartamentos"}</td>
              <th>{empresa.Nome}</th>
              <th>{formatarCelular(empresa.Celular)}</th>
              <td className={stylesDataTable.action}>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => onEdit(empresa)}
                  customClass={stylesDataTable.actionButton}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => onDelete(empresa.id)}
                  customClass={stylesDataTable.actionButton}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmpresasTable;