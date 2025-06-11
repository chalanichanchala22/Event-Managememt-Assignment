import React from 'react';
import '../Styles/Input.css';

const Input = ({ type, placeholder, value, onChange, onKeyPress, className, name, as, ...props }) => {
  if (as === 'textarea') {
    return (
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input ${className || ''}`}
        {...props}
      />
    );
  }

  return (
    <input
      type={type || 'text'}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      className={`input ${className || ''}`}
      {...props}
    />
  );
}

export default Input;
