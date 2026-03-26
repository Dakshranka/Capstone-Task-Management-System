function Loader({ text = 'Loading...' }) {
  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="text-center">
        <div className="spinner-border text-success" role="status" aria-hidden="true"></div>
        <p className="mt-2 mb-0 text-secondary">{text}</p>
      </div>
    </div>
  );
}

export default Loader;
