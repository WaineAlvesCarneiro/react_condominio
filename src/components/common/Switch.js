// src/components/common/Switch.js

import React from 'react';
import styles from './Switch.module.css';

// src/components/common/Switch.js

function Switch({ label, checked, onChange, name, disabled, ...props }) {
  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ''}`}>
      <span className={styles.label}>{label}</span>
      <label className={styles.switchWrapper}>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className={styles.hiddenCheckbox}
          disabled={disabled}
          {...props}
        />
        <span className={styles.switch}></span>
      </label>
    </div>
  );
}

export default Switch;