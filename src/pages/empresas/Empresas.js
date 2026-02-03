// src\pages\empresas\Empresa.js

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { notificationService } from '../../services/notificationService';
import stylesPageLayout from '../../components/layout/PageLayout.module.css';

import empresaService from '../../services/empresaService';
import EmpresasTable from './EmpresasTable';
import EmpresaForm from './EmpresaForm';
import { parseIsoDateLocal } from '../../utils/formatters';
// import styles from './Empresa.module.css';

function Empresas() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [editingEmpresa, setEditingEmpresa] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const titulo = 'Gerenciamento de Empresas';

  const fetchEmpresas = useCallback(async () => {
    if (!user || !user.token) {
      notificationService.error('Acesso não autorizado. Por favor, faça login.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await empresaService.getAllPaged(user.token);
      setEmpresas(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      notificationService.error(`${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

  const confirmDelete = (empresaId) => {
    setItemToDelete(empresaId);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setItemToDelete(null);
  };

  const handleSave = async (empresaData) => {
    try {
      if (editingEmpresa) {
        const dadosFormatados = {
          ...empresaData,
          dataAlteracao: parseIsoDateLocal(new Date()),
        };
        await empresaService.update({ ...dadosFormatados, id: editingEmpresa.id }, user.token);
        notificationService.success('Empresa atualizado com sucesso!');
        setEditingEmpresa(null);
      } else {
        const dadosFormatados = {
          ...empresaData,
          dataInclusao: parseIsoDateLocal(new Date()),
          ativo: 1,
        };
        await empresaService.create(dadosFormatados, user.token);
        notificationService.success('Empresa adicionado com sucesso!');
      }
      setShowForm(false);
      await fetchEmpresas();
    } catch (err) {
      notificationService.error(`${err.message}`);
    }
  };

  const handleEdit = (empresa) => {
    const empresaComDatas = {
      ...empresa,
      dataInclusao: parseIsoDateLocal(empresa.dataInclusao)
    };
    setEditingEmpresa(empresaComDatas);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await empresaService.delete(itemToDelete, user.token);
      setShowModal(false);
      setItemToDelete(null);
      notificationService.success('Empresa excluído com sucesso!');
      await fetchEmpresas();
    } catch (err) {
      notificationService.error(`${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className={stylesPageLayout.container}>
        <h3>{titulo}</h3>
        <p>Carregando empresas...</p>
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

        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            variant="primary"
            size="medium"
          >
            Adicionar Novo Empresa
          </Button>
        )}

        {showForm ? (
          <EmpresaForm
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingEmpresa(null);
            }}
            empresaData={editingEmpresa}
          />
        ) : (
          <EmpresasTable
            empresas={empresas}
            onEdit={handleEdit}
            onDelete={confirmDelete}
          />
        )}

        <ConfirmModal
          show={showModal}
          onConfirm={handleDelete}
          onCancel={handleCancel}
          title="Confirmação de Exclusão"
          message="Tem certeza que deseja excluir este empresa?"
        />
      </div>
    );
}

export default Empresas;