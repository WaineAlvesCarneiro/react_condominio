// src\pages\imoveis\Imoveis.js

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { notificationService } from '../../services/notificationService';
import stylesPageLayout from '../../components/layout/PageLayout.module.css';

import imovelService from '../../services/imovelService';
import ImovelForm from './ImovelForm';
import ImoveisTable from './ImoveisTable';
// import styles from './Imoveis.module.css';

function Imoveis() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imoveis, setImoveis] = useState([]);
  const [editingImovel, setEditingImovel] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const titulo = 'Gerenciamento de Imóveis';

  const fetchImoveis = useCallback(async () => {
    if (!user || !user.token) {
      notificationService.error('Acesso não autorizado. Por favor, faça login.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await imovelService.getAllPaged(user.token);
      setImoveis(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      notificationService.error(`${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchImoveis();
  }, [fetchImoveis]);

  const confirmDelete = (imovelId) => {
    setItemToDelete(imovelId);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setItemToDelete(null);
  };

  const handleSave = async (imovelData) => {
    try {
      if (editingImovel) {
        await imovelService.update({ ...imovelData, id: editingImovel.id }, user.token);
        notificationService.success('Imóvel atualizado com sucesso!');
        setEditingImovel(null);
      } else {
        await imovelService.create(imovelData, user.token);
        notificationService.success('Imóvel adicionado com sucesso!');
      }
      setShowForm(false);
      await fetchImoveis();
    } catch (err) {
      notificationService.error(`${err.message}`);
    }
  };

  const handleEdit = (imovel) => {
    setEditingImovel(imovel);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await imovelService.delete(itemToDelete, user.token);
      setShowModal(false);
      setItemToDelete(null);
      notificationService.success('Imóvel excluído com sucesso!');
      await fetchImoveis();
    } catch (err) {
      notificationService.error(`${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className={stylesPageLayout.container}>
        <h3>{titulo}</h3>
        <p>Carregando imóveis...</p>
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

        {!showForm && user.role === 'Sindico' && (
          <Button
            onClick={() => setShowForm(true)}
            variant="primary"
            size="medium"
          >
            Adicionar Novo Imóvel
          </Button>
        )}

        {showForm ? (
          <ImovelForm
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingImovel(null);
            }}
            imovelData={editingImovel}
          />
        ) : (
          <ImoveisTable
            imoveis={imoveis}
            onEdit={handleEdit}
            onDelete={confirmDelete}
          />
        )}

        <ConfirmModal
          show={showModal}
          onConfirm={handleDelete}
          onCancel={handleCancel}
          title="Confirmação de Exclusão"
          message="Tem certeza que deseja excluir este imóvel?"
        />
      </div>
    );
}

export default Imoveis;