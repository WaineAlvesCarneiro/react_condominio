// src\pages\auths\Auths.js

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { notificationService } from '../../services/notificationService';
import stylesPageLayout from '../../components/layout/PageLayout.module.css';

import { authService } from '../../services/authService';
import AuthForm from './AuthForm';
import AuthsTable from './AuthsTable';
import { parseIsoDateLocal } from '../../utils/formatters';

// import styles from './Auths.module.css';

function Auths() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [auths, setAuths] = useState([]);
  const [editingAuth, setEditingAuth] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const titulo = 'Gerenciamento de Usuários';
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    sortBy: 'UserName',
    direction: 'ASC',
    empresaId: user.empresaId
  });

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleSort = (column) => {
    setFilters(prev => ({
        ...prev,
        sortBy: column,
        direction: prev.sortBy === column && prev.direction === 'ASC' ? 'DESC' : 'ASC',
        page: 1
    }));
  };

  const fetchAuths = useCallback(async () => {
    if (!user || !user.token) return;

    try {
      setLoading(true);
      const data = await authService.getAllPaged(
        user.token,
        filters.page,
        filters.pageSize,
        filters.sortBy,
        filters.direction,
        filters.empresaId
      );
      setAuths(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      notificationService.error(`${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    fetchAuths();
  }, [fetchAuths]);

  const confirmDelete = (authId) => {
    setItemToDelete(authId);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setItemToDelete(null);
  };

  const handleSave = async (authData) => {
    try {
      if (editingAuth) {
        const dadosFormatados = {
          ...authData,
          dataAlteracao: parseIsoDateLocal(new Date()),
        };
        await authService.update({ ...dadosFormatados, id: editingAuth.id }, user.token);
        notificationService.success('Usuário atualizado com sucesso!');
        setEditingAuth(null);
      } else {
        const dadosFormatados = {
          ...authData,
          dataInclusao: parseIsoDateLocal(new Date()),
          ativo: 1
        };
        await authService.create(dadosFormatados, user.token);
        notificationService.success('Usuário adicionado com sucesso!');
      }
      setShowForm(false);
      await fetchAuths();
    } catch (err) {
      notificationService.error(`${err.message}`);
    }
  };

  const handleEdit = (auth) => {
    const authComDatas = {
      ...auth,
      dataInclusao: parseIsoDateLocal(auth.dataInclusao)
    };
    setEditingAuth(authComDatas);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await authService.delete(itemToDelete, user.token);
      setShowModal(false);
      setItemToDelete(null);
      notificationService.success('Usuário excluído com sucesso!');
      await fetchAuths();
    } catch (err) {
      notificationService.error(`${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className={stylesPageLayout.container}>
        <h3>{titulo}</h3>
        <p>Carregando usuários...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={stylesPageLayout.container}>
        <h3>{titulo}</h3>
        <p style={{ color: 'red' }}>Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className={stylesPageLayout.container}>
      <h3>{titulo}</h3>

      {!showForm && user.role === 'Suporte' && (
        <Button
          onClick={() => setShowForm(true)}
          variant="primary"
          size="medium"
        >
          Adicionar Novo Usuário
        </Button>
      )}

      {showForm ? (
        <AuthForm
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingAuth(null);
          }}
          authData={editingAuth}
        />
      ) : (
        <AuthsTable
          auths={auths}
          onEdit={handleEdit}
          onDelete={confirmDelete}
          onPageChange={handlePageChange}
          onSort={handleSort}
          currentSort={{ sortBy: filters.sortBy, direction: filters.direction }}
        />
      )}

      <ConfirmModal
        show={showModal}
        onConfirm={handleDelete}
        onCancel={handleCancel}
        title="Confirmação de Exclusão"
        message="Tem certeza que deseja excluir este usuário?"
      />
    </div>
  );
}

export default Auths;