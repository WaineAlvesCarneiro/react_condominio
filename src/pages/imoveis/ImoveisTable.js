// src\pages\imoveis\ImoveisTable.js

import React from 'react';
import Button from '../../components/common/Button';
import stylesDataTable from '../../components/common/DataTable.module.css';
import stylesPageLayout from '../../components/layout/PageLayout.module.css';

// import styles from './ImoveisTable.module.css';

function ImoveisTable({ imoveis, onEdit, onDelete }) {
  const data = Array.isArray(imoveis) 
    ? imoveis 
    : (imoveis && imoveis.items ? imoveis.items : []);

  return (
    <div className={stylesPageLayout.tableContainer}>
      <table className={stylesDataTable.dataTable}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Bloco</th>
            <th>Apartamento</th>
            <th>Box Garagem</th>
            <th className={stylesDataTable.action}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>  Nenhum imóvel encontrado.</td>
            </tr>
          )}
          {data.map(imovel => (
            <tr key={imovel.id}>
              <td>{imovel.id}</td>
              <td>{imovel.bloco}</td>
              <td>{imovel.apartamento}</td>
              <td>{imovel.boxGaragem}</td>
              <td className={stylesDataTable.action}>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => onEdit(imovel)}
                  customClass={stylesDataTable.actionButton}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => onDelete(imovel.id)}
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

export default ImoveisTable;