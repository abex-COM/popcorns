import { useEffect, useState } from "react";
import WatchedMovieList from "./assets/Components/WatchedMovieList.jsx";
import MovieList from "./assets/Components/MovieList.jsx";
import WatchedSummary from "./assets/Components/WatchedSummary.jsx";
import MovieDetails from "./assets/Components/MovieDetails.jsx";
import Loader from "./assets/Components/Loader.jsx";
import { ErrorMessage } from "./assets/Components/Loader.jsx";
import Search from "./assets/Components/Search.jsx";
const average = (arr) => arr.reduce((acc, cur) => acc + cur, 0) / arr.length;

const KEY = "f84fc31d";

export default function App() {
  const [query, setQuery] = useState("inception");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }
  function handleClose() {
    setSelectedId(null);
  }
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchData() {
        try {
          setError("");
          setIsLoading(true);
          const resp = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!resp.ok) throw new Error("Something went wrong");

          const data = await resp.json();

          if (data.Response === "False") throw new Error("Data not found");
          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
          console.log(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setError("");
        setMovies([]);
        return;
      }
      fetchData();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <nav className="nav-bar">
        <div className="logo">
          <span role="img">🍿</span>
          <h1>usePopcorn</h1>
        </div>
        <Search query={query} setQuery={setQuery} />
        <p className="num-results">
          Found <strong>{movies.length}</strong> results
        </p>
      </nav>

      <main className="main">
        <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen1((isOpen1) => !isOpen1)}
            style={{ border: "2px solid" }}
          >
            {isOpen1 ? "–" : "+"}
          </button>
          {isOpen1 && isLoading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage err={error} />
          ) : (
            <MovieList movies={movies} onsetSelectId={handleSelectMovie} />
          )}
        </div>

        <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen2((open) => !open)}
          >
            {isOpen2 ? "–" : "+"}
          </button>
          {isOpen2 &&
            (selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                onClose={handleClose}
                onAddWatched={handleAddWatched}
                KEY={KEY}
              />
            ) : (
              <>
                <WatchedSummary
                  watched={watched}
                  avgImdbRating={avgImdbRating}
                  avgRuntime={avgRuntime}
                  avgUserRating={avgUserRating}
                />
                <WatchedMovieList watched={watched} />
              </>
            ))}
        </div>
      </main>
    </>
  );
}
