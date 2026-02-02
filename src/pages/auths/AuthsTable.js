// src\pages\auths\AuthsTable.js

import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import stylesDataTable from '../../components/common/DataTable.module.css';
import stylesPageLayout from '../../components/layout/PageLayout.module.css';
import { useEnum } from '../../hooks/useEnum';
import { formatarData } from '../../utils/formatters';

// import styles from './AuthsTable.module.css';

function AuthsTable({ auths, onEdit, onDelete }) {
  const { user } = useAuth();
  const { options: tipoPerfilOptions } = useEnum('tipo-role');
  const { options: tipoUserAtivoOptions } = useEnum('tipo-user-ativo');
  const { options: tipoEmpresaAtivoOptions } = useEnum('tipo-empresa-ativo');

  const data = Array.isArray(auths) 
    ? auths 
    : (auths && auths.items ? auths.items : []);
  
  const getTipoPerfilLabel = (id) => {
    const option = tipoPerfilOptions.find(opt => opt.value === id);
    return option ? option.label : 'Não definido';
  };

  const getTipoUserAtivoLabel = (id) => {
    const option = tipoUserAtivoOptions.find(opt => opt.value === id);
    return option ? option.label : 'Não definido';
  };

  const getTipoEmpresaAtivoLabel = (id) => {
    const option = tipoEmpresaAtivoOptions.find(opt => opt.value === id);
    return option ? option.label : 'Não definido';
  };

  return (
    <div className={stylesPageLayout.tableContainer}>
      <table className={stylesDataTable.dataTable}>
        <thead>
          <tr>
            {/* <th>Código</th> */}
            <th>Usuário</th>
            <th>Perfil</th>
            <th>Data Inclusão</th>
            <th>Data Alteração</th>
            <th>Ativo</th>
            <th>Empresa</th>
            <th>Empresa Ativa</th>
            {(user.role === 'Suporte' || user.role === 'Sindico') && (
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
              {/* <td>{auth.id}</td> */}
              <td>{auth.userName}</td>
              <td>{getTipoPerfilLabel(auth.role)}</td>
              <td>{auth.dataInclusao && formatarData(auth.dataInclusao)}</td>
              <td>{auth.dataAlteracao && formatarData(auth.dataAlteracao)}</td>
              <td>{getTipoUserAtivoLabel(auth.ativo)}</td>
              <td>{auth.empresaId}</td>
              <td>{getTipoEmpresaAtivoLabel(auth.empresaAtiva)}</td>
              <td className={stylesDataTable.action}>
                {(user.role === 'Suporte' || user.role === 'Sindico') && (
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => onEdit(auth)}
                    customClass={stylesDataTable.actionButton}
                  >
                    Editar
                  </Button>
                )}
                {user.role === 'Suporte' && (
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => onDelete(auth.id)}
                    customClass={stylesDataTable.actionButton}
                  >
                    Excluir
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AuthsTable;