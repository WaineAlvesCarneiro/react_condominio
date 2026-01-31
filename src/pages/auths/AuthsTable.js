// src\pages\auths\AuthsTable.js

import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import stylesDataTable from '../../components/common/DataTable.module.css';
import stylesPageLayout from '../../components/layout/PageLayout.module.css';
import { useEnum } from '../../hooks/useEnum';

// import styles from './AuthsTable.module.css';

function AuthsTable({ auths, onEdit, onDelete }) {
  const { options: tipoPerfilOptions } = useEnum('tipo-role');
  
  const getTipoPerfilLabel = (id) => {
    const option = tipoPerfilOptions.find(opt => opt.value === id);
    return option ? option.label : 'Não definido';
  };

  const { user } = useAuth();

  const data = Array.isArray(auths) 
    ? auths 
    : (auths && auths.items ? auths.items : []);

  return (
    <div className={stylesPageLayout.tableContainer}>
      <table className={stylesDataTable.dataTable}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Empresa</th>
            <th>Usuário</th>
            <th>Perfil</th>
            <th>Data Inclusão</th>
            <th>Data Alteração</th>
            {user.role === 'Suporte' && (
              <th className={stylesDataTable.action}>Ações</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>  Nenhum usuário encontrado.</td>
            </tr>
          )}
          {data.map(auth => (
            <tr key={auth.id}>
              <td>{auth.id}</td>
              <td>{auth.empresaId}</td>
              <td>{auth.userName}</td>
              <td>{getTipoPerfilLabel(auth.role)}</td>
              <td>{auth.dataInclusao}</td>
              <td>{auth.dataAlteracao}</td>
              {user.role === 'Suporte' && (
                <td className={stylesDataTable.action}>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => onEdit(auth)}
                    customClass={stylesDataTable.actionButton}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => onDelete(auth.id)}
                    customClass={stylesDataTable.actionButton}
                  >
                    Excluir
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AuthsTable;