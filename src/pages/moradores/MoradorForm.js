// src\pages\moradores\MoradorForm.js

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
// import BooleanInput from '../../components/common/BooleanInput';
import SwitchInput from '../../components/common/SwitchInput';
import Button from '../../components/common/Button';
import { notificationService } from '../../services/notificationService';
import stylesForm from '../../components/common/Form.module.css';
import DatePicker from '../../components/common/DatePicker';
import { IMaskInput } from 'react-imask';

import imovelService from '../../services/imovelService';
// import styles from './MoradorForm.module.css';

function MoradorForm({ onSave, onCancel, moradorData }) {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    // const [error, setError] = useState(null);
    const [morador, setMorador] = useState(() => {
        const initialData = moradorData || {
            id: 0,
            nome: '',
            celular: '',
            email: '',
            isProprietario: false,
            dataEntrada: null,
            dataSaida: null,
            imovelId: 0
        };
        if (initialData.dataEntrada) {
            initialData.dataEntrada = new Date(initialData.dataEntrada);
        }
        if (initialData.dataSaida) {
            initialData.dataSaida = new Date(initialData.dataSaida);
        }
        return initialData;
    });
    const [imoveis, setImoveis] = useState([]);
    const nomeRef = useRef(null);

    useEffect(() => {
        const fetchImoveis = async () => {
            if (user && user.token) {
                try {
                    const data = await imovelService.getAll(user.token);
                    const options = data.map(imovel => ({
                        value: imovel.id,
                        label: `Bloco ${imovel.bloco} - Apartamento ${imovel.apartamento}`
                    }));
                    setImoveis(options);
                } catch (err) {
                    notificationService.error(`${err.message}`);
                }
            }
        };
        fetchImoveis();
    }, [user]);

    useEffect(() => {
        if (nomeRef.current) {
            nomeRef.current.focus();
        }
    }, [moradorData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setMorador(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDateChange = (date, name) => {
        setMorador(prev => ({
            ...prev,
            [name]: date
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const moradorToSend = {
            ...morador,
            dataEntrada: morador.dataEntrada ? morador.dataEntrada.toISOString().split('T')[0] : null,
            dataSaida: morador.dataSaida ? morador.dataSaida.toISOString().split('T')[0] : null,
            imovelId: parseInt(morador.imovelId)
        };

        delete moradorToSend.imovelDto;

        await onSave(moradorToSend);
        setLoading(false);
    };

    return (
        <div className={stylesForm.formContainer}>
            <h2>{moradorData ? 'Editar Morador' : 'Adicionar Novo Morador'}</h2>
            <form onSubmit={handleSubmit}>
                {morador.id > 0 && (
                    <div className={stylesForm.formGroup}>
                        <label htmlFor="id">Código:</label>
                        <Input
                            id="id"
                            name="id"
                            value={morador.id}
                            onChange={handleChange}
                            autoComplete="off"
                            disabled
                        />
                    </div>
                )}
                <div className={stylesForm.formGroup}>
                    <label htmlFor="nome">Nome:</label>
                    <Input
                        id="nome"
                        name="nome"
                        value={morador.nome}
                        onChange={handleChange}
                        ref={nomeRef}
                        autoComplete="off"
                        required
                    />
                </div>
                <div className={stylesForm.formGroup}>
                    <label htmlFor="celular">Celular:</label>
                    <IMaskInput
                        mask="(00) 00000-0000"
                        id="celular"
                        name="celular"
                        value={morador.celular}
                        onAccept={(value) => setMorador(prev => ({ ...prev, celular: value }))}
                        autoComplete="off"
                        required
                        unmask={true}
                        render={(ref, props) => <Input {...props} ref={ref} />}
                    />
                </div>
                <div className={stylesForm.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <Input
                        id="email"
                        name="email"
                        value={morador.email}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>
                <div className={stylesForm.formGroup}>
                    <label htmlFor="dataEntrada">Data Entrada:</label>
                    <DatePicker
                        id="dataEntrada"
                        name="dataEntrada"
                        value={morador.dataEntrada}
                        onChange={(date) => handleDateChange(date, 'dataEntrada')}
                        required
                    />
                </div>
                {morador.id > 0 && (
                    <div className={stylesForm.formGroup}>
                        <label htmlFor="dataSaida">Data Saída:</label>
                        <DatePicker
                            id="dataSaida"
                            name="dataSaida"
                            value={morador.dataSaida}
                            onChange={(date) => handleDateChange(date, 'dataSaida')}
                        />
                    </div>
                )}
                <div className={stylesForm.formGroup}>
                    <label htmlFor="imovelId">Imóvel:</label>
                    <Select
                        id="imovelId"
                        name="imovelId"
                        value={morador.imovelId}
                        onChange={handleChange}
                        options={imoveis}
                        required
                    />
                </div>
                {/* <BooleanInput
                    label="É proprietário?"
                    name="isProprietario"
                    checked={morador.isProprietario}
                    onChange={handleChange}
                /> */}
                <SwitchInput
                    label="É proprietário?"
                    name="isProprietario"
                    checked={morador.isProprietario}
                    onChange={handleChange}
                />

                <div className={stylesForm.formActions}>
                    <Button
                        type="submit"
                        loading={loading}
                        loadingText="Salvando..."
                        variant="primary"
                        size="medium"
                    >
                        Salvar
                    </Button>
                    <Button
                        type="button"
                        onClick={onCancel}
                        variant="secondary"
                        size="medium"
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default MoradorForm;