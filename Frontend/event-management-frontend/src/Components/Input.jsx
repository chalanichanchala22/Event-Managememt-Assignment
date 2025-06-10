import '../Styles/Input.css';

function Input({ label, type = 'text', value, onChange, name, required, error }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        name={name}
        required={required}
        className={error ? 'error' : ''}
      />
      {error && <span className="error-msg">{error}</span>}
    </div>
  );
}

export default Input;