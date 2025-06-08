
import '../App.css';

const Model = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        {children}
        <button className="modal-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default Model;
