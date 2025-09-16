// src\components\common\DatePicker.js

import React from 'react';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './DatePicker.module.css';
import styles from './Input.module.css';

const DatePicker = ({ id, name, value, onChange, placeholder, required }) => {
    return (
        <ReactDatePicker
            id={id}
            name={name}
            selected={value}
            onChange={onChange}
            dateFormat="dd/MM/yyyy"
            placeholderText={placeholder}
            className={styles.input}
            required={required}
        />
    );
};

export default DatePicker;