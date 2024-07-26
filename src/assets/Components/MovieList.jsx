export default function MovieList({ movies, onsetSelectId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onsetSelectId={onsetSelectId} />
      ))}
    </ul>
  );
}

function Movie({ movie, onsetSelectId }) {
  return (
    <li onClick={() => onsetSelectId(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
