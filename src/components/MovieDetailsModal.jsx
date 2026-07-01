import { useEffect, useRef, useState } from "react";
import Spinner from "./Spinner.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
  }
};

const MovieDetailsModal = ({ movieId, onClose }) => {
  const dialogRef = useRef(null);
  const [movie, setMovie] = useState(null);
  const [videoKey, setVideoKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [detailsRes, videosRes] = await Promise.all([
          fetch(`${API_BASE_URL}/movie/${movieId}`, API_OPTIONS),
          fetch(`${API_BASE_URL}/movie/${movieId}/videos`, API_OPTIONS)
        ]);

        if (!detailsRes.ok) throw new Error("Failed to fetch movie details");

        const detailsData = await detailsRes.json();
        setMovie(detailsData);

        if (videosRes.ok) {
          const videosData = await videosRes.json();
          const trailer = 
            videosData.results?.find(v => v.site === "YouTube" && v.type === "Trailer" && v.official) ||
            videosData.results?.find(v => v.site === "YouTube" && v.type === "Trailer") ||
            videosData.results?.find(v => v.site === "YouTube");
          
          if (trailer) {
            setVideoKey(trailer.key);
          } else {
            setVideoKey(null);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Could not load movie details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  // Show native modal dialog on mount and manage focus/esc
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    // Lock body scroll while modal is open
    document.body.style.overflow = "hidden";

    const handleCancel = (e) => {
      e.preventDefault();
      onClose();
    };

    dialog.addEventListener("cancel", handleCancel);
    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.close();
      // Restore body scroll
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Fallback backdrop click handler for browsers without closedby support
  const handleBackdropClick = (event) => {
    const dialog = dialogRef.current;
    if (event.target !== dialog) return;

    const rect = dialog.getBoundingClientRect();
    const isDialogContent = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );

    if (!isDialogContent) {
      onClose();
    }
  };

  if (!movieId) return null;

  return (
    <dialog
      ref={dialogRef}
      className="relative max-w-4xl w-[90%] md:w-full rounded-2xl border border-white/10 bg-[#09090b] text-white p-0 shadow-2xl backdrop:bg-black/85 backdrop:backdrop-blur-md overflow-y-auto max-h-[90vh] outline-none hide-scrollbar transition-all duration-300"
      onClick={handleBackdropClick}
    >
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer shadow-lg"
          aria-label="Close modal"
        >
          ✕
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-96 w-full items-center justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex h-64 w-full flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-red-500 font-medium text-lg">{error}</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-amber-500 text-white rounded-lg font-semibold hover:opacity-90 transition-all cursor-pointer"
          >
            Go Back
          </button>
        </div>
      ) : movie ? (
        <div className="flex flex-col">
          {/* Backdrop Image / Video Trailer Section */}
          <div className="relative w-full aspect-video bg-black/40 overflow-hidden">
            {videoKey ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=0&modestbranding=1&rel=0`}
                title={`${movie.title} Trailer`}
                className="w-full h-full border-0 absolute inset-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : movie.backdrop_path ? (
              <>
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent"></div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 border-b border-white/5">
                <p className="text-zinc-500 text-lg">No Trailer or Backdrop Available</p>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Poster column (hidden on mobile, shown on md+) */}
            {movie.poster_path && (
              <div className="hidden md:block w-48 shrink-0">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full rounded-xl border border-white/10 shadow-lg object-cover"
                />
              </div>
            )}

            {/* Info column */}
            <div className="flex-1 flex flex-col justify-start">
              {movie.tagline && (
                <p className="text-amber-400 font-semibold uppercase tracking-wider text-xs mb-1">
                  {movie.tagline}
                </p>
              )}
              <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3">
                {movie.title}
              </h2>

              {/* Badges/Metadata */}
              <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-zinc-400 mb-6">
                {movie.release_date && (
                  <span className="font-semibold text-white bg-white/5 px-2.5 py-1 rounded-md">
                    {movie.release_date.split("-")[0]}
                  </span>
                )}
                {movie.runtime && (
                  <span>• {movie.runtime} min</span>
                )}
                {movie.vote_average > 0 && (
                  <span className="flex items-center gap-1 font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                    ★ {movie.vote_average.toFixed(1)}
                  </span>
                )}
                {movie.original_language && (
                  <span className="uppercase font-semibold bg-white/5 px-2 py-0.5 rounded-md text-[10px]">
                    {movie.original_language}
                  </span>
                )}
              </div>

              {/* Overview */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-2">Synopsis</h3>
                <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
                  {movie.overview || "No overview available."}
                </p>
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {movie.genres.map((g) => (
                    <span
                      key={g.id}
                      className="text-xs bg-zinc-800/80 text-zinc-300 px-3 py-1.5 rounded-full border border-zinc-700/50 hover:bg-zinc-800 transition"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
};

export default MovieDetailsModal;
