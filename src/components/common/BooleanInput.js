// src\components\common\BooleanInput.js

import React from 'react';
import styles from './BooleanInput.module.css';

function BooleanInput({ label, checked, onChange, name, ...props }) {
  return (
    <div className={styles.checkboxContainer}>
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        className={styles.checkbox}
        {...props}
      />
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
    </div>
  );
}

export default BooleanInput;