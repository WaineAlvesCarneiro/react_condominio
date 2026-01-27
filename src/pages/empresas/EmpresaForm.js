// src\pages\empresas\EmpresaForm.js

import React, { useState, useEffect, useRef } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import stylesForm from '../../components/common/Form.module.css';
import { IMaskInput } from 'react-imask';

// import styles from './EmpresaForm.module.css';

function EmpresaForm({ onSave, onCancel, empresaData }) {
    const [loading, setLoading] = useState(false);
    const [empresa, setEmpresa] = useState(empresaData || {
        id: 0,
        razaoSocial: '',
        fantasia: '',
        cnpj: '',
        tipoDeCondominio: 0,
        nome: '',
        celular: '',
        telefone: null,
        email: '',
        senha: null,
        host: '',
        porta: 0,
        cep: '',
        uf: '',
        cidade: '',
        endereco: '',
        complemento: null,
        dataInclusao: null,
        dataAlteracao: null,
    });
    const razaoSocialRef = useRef(null);

    useEffect(() => {
        if (razaoSocialRef.current) {
            razaoSocialRef.current.focus();
        }
    }, [empresaData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmpresa(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSave(empresa);
        setLoading(false);
    };

    return (
        <div className={stylesForm.formContainer}>
            <h2>{empresaData ? 'Editar Empresa' : 'Adicionar Novo Empresa'}</h2>
            <form onSubmit={handleSubmit}>
                {empresa.id > 0 && (
                    <div className={stylesForm.formGroup}>
                        <label htmlFor="id">Código:</label>
                        <Input
                            id="id"
                            name="id"
                            value={empresa.id}
                            onChange={handleChange}
                            autoComplete="off"
                            disabled
                        />
                    </div>
                )}
                <div className={stylesForm.formGroup}>
                    <label htmlFor="razaoSocial">Razão Social:</label>
                    <Input
                        id="razaoSocial"
                        name="razaoSocial"
                        value={empresa.razaoSocial}
                        onChange={handleChange}
                        ref={razaoSocialRef}
                        autoComplete="off"
                        required
                    />
                </div>
                <div className={stylesForm.formGroup}>
                    <label htmlFor="fantasia">Fantasia:</label>
                    <Input
                        id="fantasia"
                        name="fantasia"
                        value={empresa.fantasia}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>
                <div className={stylesForm.formGroup}>
                    <label htmlFor="cnpj">Cnpj:</label>
                    <Input
                        id="cnpj"
                        name="cnpj"
                        value={empresa.cnpj}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="tipoDeCondominio">Tipo De Condóminio:</label>
                    <Input
                        id="tipoDeCondominio"
                        name="tipoDeCondominio"
                        value={empresa.tipoDeCondominio}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="nome">Nome do Responsével:</label>
                    <Input
                        id="nome"
                        name="nome"
                        value={empresa.nome}
                        onChange={handleChange}
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
                        value={empresa.celular}
                        onAccept={(value) => setEmpresa(prev => ({ ...prev, celular: value }))}
                        autoComplete="off"
                        required
                        unmask={true}
                        placeholder="(99) 99999-9999"
                        className={stylesInput.input}
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="telefone">Telefone:</label>
                    <Input
                        id="telefone"
                        name="telefone"
                        value={empresa.telefone}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <Input
                        id="email"
                        name="email"
                        value={empresa.email}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="senha">Senha:</label>
                    <Input
                        id="senha"
                        name="senha"
                        value={empresa.senha}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="host">Host:</label>
                    <Input
                        id="host"
                        name="host"
                        value={empresa.host}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="porta">Porta:</label>
                    <Input
                        id="porta"
                        name="porta"
                        value={empresa.porta}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="cep">Cep:</label>
                    <Input
                        id="cep"
                        name="cep"
                        value={empresa.cep}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="uf">Uf:</label>
                    <Input
                        id="uf"
                        name="uf"
                        value={empresa.uf}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="cidade">Cidade:</label>
                    <Input
                        id="cidade"
                        name="cidade"
                        value={empresa.cidade}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="endereco">Endereço:</label>
                    <Input
                        id="endereco"
                        name="endereco"
                        value={empresa.endereco}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>

                <div className={stylesForm.formGroup}>
                    <label htmlFor="complemento">Complemento:</label>
                    <Input
                        id="complemento"
                        name="complemento"
                        value={empresa.complemento}
                        onChange={handleChange}
                        autoComplete="off"
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

export default EmpresaForm;