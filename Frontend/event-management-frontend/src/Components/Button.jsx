import '../App.css'; // import global styles

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false }) => {
  const className = `btn btn-${variant}`;

  return (
    <button className={className} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
