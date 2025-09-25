// src/utils/formatters.js

import { parse, format } from 'date-fns';

/**
 * Formata um número de celular no formato (99) 99999-9999.
 * @param {string} celular O número de celular sem formatação.
 * @returns {string} O número de celular formatado, ou a string original se inválido.
 */
export const formatarCelular = (celular) => {
  if (!celular) {
    return '';
  }

  const apenasDigitos = celular.replace(/\D/g, '');

  if (apenasDigitos.length === 11) {
    return `(${apenasDigitos.substring(0, 2)}) ${apenasDigitos.substring(2, 7)}-${apenasDigitos.substring(7, 11)}`;
  }

  return celular;
};

/**
 * Formata uma data para "dd/MM/yyyy".
 * Aceita:
 *  - string "dd-MM-yyyy"
 *  - string "yyyy-MM-dd"
 *  - objeto Date
 */
export const formatarData = (data) => {
  if (!data) return '';

  try {
    let parsedDate;

    if (data instanceof Date) {
      parsedDate = data;
    } else if (typeof data === 'string') {
      if (data.includes('-')) {
        // verifica se começa com ano (yyyy-MM-dd)
        if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
          const [year, month, day] = data.split('-').map(Number);
          parsedDate = new Date(year, month - 1, day);
        } else {
          // assume formato dd-MM-yyyy
          parsedDate = parse(data, 'dd-MM-yyyy', new Date());
        }
      } else {
        console.warn('Formato de data inesperado:', data);
        return data;
      }
    } else {
      console.warn('Tipo inesperado em formatarData:', data);
      return data;
    }

    return format(parsedDate, 'dd/MM/yyyy');
  } catch (error) {
    console.error('Erro ao formatar data:', error, data);
    return data;
  }
};


/**
 * Converte Date para string yyyy-MM-dd (sem UTC).
 */
export const formatDateToIso = (date) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Converte string ISO (yyyy-MM-dd) em Date local (sem fuso).
 * Aceita também Date e retorna como está.
 */
export const parseIsoDateLocal = (isoDate) => {
  if (!isoDate) return null;

  if (isoDate instanceof Date) {
    return isoDate;
  }

  if (typeof isoDate !== 'string') {
    console.warn('parseIsoDateLocal recebeu valor inesperado:', isoDate);
    return null;
  }

  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
};

