// src\pages\moradores\Moradores.js

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { notificationService } from '../../services/notificationService'; 
import stylesPageLayout from '../../components/layout/PageLayout.module.css';

import moradorService from '../../services/moradorService';
import MoradorForm from './MoradorForm';
import MoradoresTable from './MoradoresTable';
// import styles from './Moradores.module.css';

function Moradores() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [moradores, setMoradores] = useState([]);
  const [editingMorador, setEditingMorador] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchMoradores = useCallback(async () => {
    if (!user || !user.token) {
      notificationService.error('Acesso não autorizado. Por favor, faça login.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await moradorService.getAll(user.token);
      setMoradores(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      notificationService.error(`${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMoradores();
  }, [fetchMoradores]);

  const confirmDelete = (moradorId) => {
    setItemToDelete(moradorId);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setItemToDelete(null);
  };

  const handleSave = async (moradorData) => {
    try {
      if (editingMorador) {
        await moradorService.update({ ...moradorData, id: editingMorador.id }, user.token);
        notificationService.success('Morador atualizado com sucesso!');
        setEditingMorador(null);
      } else {
        await moradorService.create(moradorData, user.token);
        notificationService.success('Morador adicionado com sucesso!');
      }
      setShowForm(false);
      await fetchMoradores();
    } catch (err) {
      notificationService.error(`${err.message}`);
    }
  };

  const handleEdit = (morador) => {
    setEditingMorador(morador);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await moradorService.delete(itemToDelete, user.token);
      setShowModal(false);
      setItemToDelete(null);
      notificationService.success('Morador excluído com sucesso!');
      await fetchMoradores();
    } catch (err) {
      notificationService.error(`${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className={stylesPageLayout.container}>
        <h1>Gerenciamento de Morador</h1>
        <p>Carregando moradores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={stylesPageLayout.container}>
        <h1>Gerenciamento de Morador</h1>
        <p style={{ color: 'red' }}>Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className={stylesPageLayout.container}>
      <h1>Gerenciamento de Moradores</h1>
      <p>Aqui você pode ver, adicionar, editar e remover moradores do condomínio.</p>

      {!showForm && (
        <Button
          onClick={() => setShowForm(true)}
          variant="primary"
          size="medium"
        >
          Adicionar Novo Morador
        </Button>
      )}

      {showForm ? (
        <MoradorForm
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingMorador(null);
          }}
          moradorData={editingMorador}
        />
      ) : (
        <MoradoresTable
          moradores={moradores}
          onEdit={handleEdit}
          onDelete={confirmDelete}
        />
      )}

      <ConfirmModal
        show={showModal}
        onConfirm={handleDelete}
        onCancel={handleCancel}
        title="Confirmação de Exclusão"
        message="Tem certeza que deseja excluir este morador?"
      />
    </div>
  );
}

export default Moradores;