import { useState, useEffect } from "react";
import StarRating from "./StarRating";

export default function MovieDetails({
  selectedId,
  onClose,
  onAddWatched,
  KEY,
}) {
  const [movie, setMovie] = useState(null);
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie || {};
  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return () => {
      document.title = "UsePopCorn";
    };
  }, [title]);
  useEffect(() => {
    function callback(e) {
      if (e.code === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", callback);
    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, [onClose]);
  function handleAdd() {
    const newMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ")[0]),
      userRating: 0, // Add userRating initialization here
    };
    onAddWatched(newMovie);
  }

  useEffect(() => {
    async function loadMovie() {
      const resp = await fetch(
        `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await resp.json();
      setMovie(data);
    }

    loadMovie();
  }, [selectedId, KEY]);

  return (
    <div className="detail">
      <header>
        <button className="btn-back" onClick={onClose}>
          &larr;
        </button>
        <img src={poster} alt={`Poster of ${title} movie`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐️</span>
            {imdbRating} IMDb rating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
          <StarRating maxRating={10} size={20} />
          <button className="btn-add" onClick={handleAdd}>
            Add
          </button>
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}
