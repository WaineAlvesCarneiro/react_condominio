// src\components\common\Select.jssim

import React, { forwardRef } from 'react';
import styles from './Select.module.css';

const Select = forwardRef(({ options, value, onChange, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={styles.select}
      value={value}
      onChange={onChange}
      {...props}
    >
      <option value="0">Selecione uma opção</option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
});

export default Select;