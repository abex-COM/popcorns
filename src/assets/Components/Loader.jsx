 export default function Loader() {
    return <p className="loader">Loading...</p>;
  }
  
 export function ErrorMessage({ err }) {
    return (
      <p className="error">
        <span>⚠️</span>
        {err}
      </p>
    );
  }
  