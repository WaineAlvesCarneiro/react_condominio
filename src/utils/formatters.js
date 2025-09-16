// src/utils/formatters.js

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