// src\pages\auth\AuthForm.js

import React, { useState, useEffect, useRef } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import stylesForm from '../../components/common/Form.module.css';
import { useEnum } from '../../hooks/useEnum'
import Select from '../../components/common/Select';
import stylesInput from '../../components/common/Input.module.css';

// import styles from './AuthForm.module.css';

function AuthForm({ onSave, onCancel, authData }) {
    const { options: tipoPerfilOptions, loading: loadingEnums } = useEnum('tipo-role');

    const [loading, setLoading] = useState(false);
    const [auth, setAuth] = useState(authData || {
        id: 0,
        empresaId: 0,
        userName: '',
        passwordHash: '',
        role: '',
        dataInclusao: null,
        dataAlteracao: null
    });
    const userNameRef = useRef(null);

    useEffect(() => {
        if (userNameRef.current) {
            userNameRef.current.focus();
        }
    }, [authData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAuth(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSave(auth);
        setLoading(false);
    };

    return (
        <div className={stylesForm.formContainer}>
            <h2>{authData ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h2>
            <form onSubmit={handleSubmit}>
                {auth.id > 0 && (
                    <div className={stylesForm.formGroup}>
                        <label htmlFor="id">Código:</label>
                        <Input
                            id="id"
                            name="id"
                            value={auth.id}
                            onChange={handleChange}
                            autoComplete="off"
                            disabled
                        />
                    </div>
                )}
                <div className={stylesForm.formGroup}>
                    <label htmlFor="userName">Usuário:</label>
                    <Input
                        id="userName"
                        name="userName"
                        value={auth.userName}
                        onChange={handleChange}
                        ref={userNameRef}
                        minLength={1}
                        maxLength={100}
                        autoComplete="off"
                        required
                    />
                </div>
                <div className={stylesForm.formGroup}>
                    <label htmlFor="passwordHash">Senha:</label>
                    <Input
                        id="passwordHash"
                        name="passwordHash"
                        value={auth.passwordHash}
                        onChange={handleChange}
                        minLength={1}
                        maxLength={100}
                        autoComplete="off"
                        required
                    />
                </div>
                <div className={stylesForm.formGroup}>
                    <label htmlFor="role">Tipo De Condomínio:</label>
                    <Select
                        id="role"
                        name="role"
                        value={auth.role}
                        onChange={handleChange}
                        options={tipoPerfilOptions}
                        disabled={loadingEnums}
                        firstOptionLabel={loadingEnums ? "Carregando..." : "Selecione uma opção"}
                        required
                    />
                </div>
                <div className={stylesForm.formGroup}>
                    <label htmlFor="empresaId">Empresa:</label>
                    <Input
                        id="empresaId"
                        name="empresaId"
                        value={auth.empresaId}
                        onChange={handleChange}
                        minLength={2}
                        maxLength={10}
                        autoComplete="off"
                        className={stylesInput.input}
                        required
                    />
                </div>

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

export default AuthForm;