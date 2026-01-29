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
import { parseIsoDateLocal, validarDataParaEnvio, validarDataSaida } from '../../utils/formatters';
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
  const titulo = 'Gerenciamento de Moradores';
  
  const fetchMoradores = useCallback(async () => {
    if (!user || !user.token) {
      notificationService.error('Acesso não autorizado. Por favor, faça login.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await moradorService.getAllPaged(user.token);
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
      if (!validarDataParaEnvio(moradorData.dataEntrada)) {
        notificationService.error('Data de entrada inválida!');
        return;
      }
      
      if (moradorData.dataSaida && !validarDataParaEnvio(moradorData.dataSaida)) {
        notificationService.error('Data de saída inválida!');
        return;
      }
      
      if (moradorData.dataSaida && moradorData.dataEntrada) {
        const entrada = parseIsoDateLocal(moradorData.dataEntrada);
        const saida = parseIsoDateLocal(moradorData.dataSaida);
        
        if (saida < entrada) {
          notificationService.error('Data de saída não pode ser anterior à data de entrada!');
          return;
        }

        const validacaoData = validarDataSaida(moradorData.dataEntrada, moradorData.dataSaida);
        if (!validacaoData.valido) {
          notificationService.error(validacaoData.mensagem);
          return;
        }
      }

      if (editingMorador) {
        const dadosFormatados = {
          ...moradorData,
          dataEntrada: parseIsoDateLocal(moradorData.dataEntrada),
          dataSaida: moradorData.dataSaida
            ? parseIsoDateLocal(moradorData.dataSaida)
            : null,
          dataAlteracao: parseIsoDateLocal(new Date()),
        };

        await moradorService.update({ ...dadosFormatados, id: editingMorador.id }, user.token);
        notificationService.success('Morador atualizado com sucesso!');
        setEditingMorador(null);
      } else {
        const dadosFormatados = {
          ...moradorData,
          dataEntrada: parseIsoDateLocal(moradorData.dataEntrada),
          dataInclusao: parseIsoDateLocal(new Date()),
        };

        await moradorService.create(dadosFormatados, user.token);
        notificationService.success('Morador adicionado com sucesso!');
      }
        
      setShowForm(false);
      await fetchMoradores();
    } catch (err) {
      notificationService.error(`${err.message}`);
    }
  };

  const handleEdit = (morador) => {
    const moradorComDatas = {
      ...morador,
      dataEntrada: parseIsoDateLocal(morador.dataEntrada),
      dataSaida: morador.dataSaida ? parseIsoDateLocal(morador.dataSaida) : null,
      dataInclusao: parseIsoDateLocal(morador.dataInclusao)
    };
    setEditingMorador(moradorComDatas);
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
        <h3>{titulo}</h3>
        <p>Carregando moradores...</p>
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