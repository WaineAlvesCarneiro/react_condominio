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

  const fetchAuths = useCallback(async () => {
    if (!user || !user.token) {
      notificationService.error('Acesso não autorizado. Por favor, faça login.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await authService.getAllPaged(user.token);
      setAuths(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      notificationService.error(`${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

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
        await authService.update({ ...authData, id: editingAuth.id }, user.token);
        notificationService.success('Usuário atualizado com sucesso!');
        setEditingAuth(null);
      } else {
        await authService.create(authData, user.token);
        notificationService.success('Usuário adicionado com sucesso!');
      }
      setShowForm(false);
      await fetchAuths();
    } catch (err) {
      notificationService.error(`${err.message}`);
    }
  };

  const handleEdit = (auth) => {
    setEditingAuth(auth);
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