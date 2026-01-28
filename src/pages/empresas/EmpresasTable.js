// src\pages\empresas\empresasTable.js

import React from 'react';
import Button from '../../components/common/Button';
import stylesDataTable from '../../components/common/DataTable.module.css';
import stylesPageLayout from '../../components/layout/PageLayout.module.css';
import { formatarCnpj, formatarCelular } from '../../utils/formatters';
import { useEnum } from '../../hooks/useEnum';

// import styles from './EmpresasTable.module.css';

function EmpresasTable({ empresas, onEdit, onDelete }) {
  const { options: tipoCondominioOptions } = useEnum('tipo-condominio');

  const data = Array.isArray(empresas) 
    ? empresas 
    : (empresas && empresas.items ? empresas.items : []);

  const getTipoCondominioLabel = (id) => {
    const option = tipoCondominioOptions.find(opt => opt.value === id);
    return option ? option.label : 'Não definido';
  };

  return (
    <div className={stylesPageLayout.tableContainer}>
      <table className={stylesDataTable.dataTable}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Razão Social</th>
            <th>Fantasia</th>
            <th>Cnpj</th>
            <th>Tipo De Condomínio</th>
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
              <td>{formatarCnpj(empresa.cnpj)}</td>
              <td>{getTipoCondominioLabel(empresa.tipoDeCondominio)}</td>
              <th>{empresa.nome}</th>
              <th>{formatarCelular(empresa.celular)}</th>
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