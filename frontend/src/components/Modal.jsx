export default function Modal({ titulo, onFechar, children }) {
  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
        <div className="modal-cabecalho">
          <h3>{titulo}</h3>
          <button className="btn-fechar" onClick={onFechar}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
