// src\utils\formatters.js
import { parse, format, isValid } from 'date-fns';

/**
 * Converte string do banco (ISO ou pt-BR) para Objeto Date
 */
export const parseIsoDateLocal = (dateString) => {
    if (!dateString) return null;
    if (dateString instanceof Date) return dateString;

    try {
        // Se for formato ISO (2026-01-23 ou 2026-01-23T00:00:00)
        if (dateString.includes('-')) {
            const [datePart] = dateString.split('T');
            const [year, month, day] = datePart.split('-').map(Number);
            return new Date(year, month - 1, day);
        }
        
        // Se for formato pt-BR (23/01/2026)
        if (dateString.includes('/')) {
            const [day, month, year] = dateString.split('/').map(Number);
            return new Date(year, month - 1, day);
        }
        
        // Tenta como último recurso
        const date = new Date(dateString);
        return isValid(date) ? date : null;
    } catch (e) {
        console.error("Erro no parse da data:", e);
        return null;
    }
};

/**
 * Formata para exibição (dd/MM/yyyy)
 */
export const formatarData = (data) => {
    const d = parseIsoDateLocal(data);
    return d ? format(d, 'dd/MM/yyyy') : '';
};

/**
 * Valida se uma data está no formato correto para envio
 */
export const validarDataParaEnvio = (data) => {
    if (!data) return true; // null é válido para dataSaida
    
    const d = parseIsoDateLocal(data);
    return d && isValid(d);
};

// src\utils\formatters.js (adicione esta função)
export const validarDataSaida = (dataEntrada, dataSaida) => {
    if (!dataSaida) return { valido: true, mensagem: '' };
    
    const entrada = parseIsoDateLocal(dataEntrada);
    const saida = parseIsoDateLocal(dataSaida);
    
    if (!entrada || !saida) {
        return { valido: false, mensagem: 'Datas inválidas!' };
    }
    
    // Permite datas iguais
    if (saida < entrada) {
        return { 
            valido: false, 
            mensagem: 'Data de saída não pode ser anterior à data de entrada!' 
        };
    }
    
    return { valido: true, mensagem: '' };
};

// Mantenha formatarCelular como está
export const formatarCelular = (celular) => {
    if (!celular) return '';
    const apenasDigitos = celular.replace(/\D/g, '');
    if (apenasDigitos.length === 11) {
        return `(${apenasDigitos.substring(0, 2)}) ${apenasDigitos.substring(2, 7)}-${apenasDigitos.substring(7, 11)}`;
    }
    return celular;
};