import Search from "./components/Search.jsx";
import { useEffect, useState, useRef, useCallback } from "react";
import Spinner from "./components/Spinner.jsx";
import Movie from "./components/Movie.jsx";
import MovieDetailsModal from "./components/MovieDetailsModal.jsx";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
    }
}


const App = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([])
    const [trendingMovies, setTrendingMovies] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [selectedMovieId, setSelectedMovieId] = useState(null);

    // Infinite scroll state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const sentinelRef = useRef(null);

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 700, [searchTerm])


    const fetchMovies = async (query = '', pageNum = 1) => {

        // Use different loading states for first page vs subsequent pages
        if (pageNum === 1) {
            setIsLoading(true);
            setErrorMessage('');
        } else {
            setIsLoadingMore(true);
        }

        try {
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${pageNum}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${pageNum}`


            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error('failed to fetch movie')
            }

            const data = await response.json();

            if (data.Response === 'False') {
                setErrorMessage(data.Error || 'Failed to fetch movies')
                setMovieList([]);
                return;
            }

            const newResults = data.results || [];

            if (pageNum === 1) {
                setMovieList(newResults);
            } else {
                setMovieList(prev => [...prev, ...newResults]);
            }

            setTotalPages(data.total_pages || 1);

            if (query && pageNum === 1 && newResults.length > 0 && newResults[0].poster_path) {
                await updateSearchCount(query, newResults[0])
            }

        } catch (error) {
            console.error(`Error fetching movies: ${error}`);
            if (pageNum === 1) {
                setErrorMessage('Error fetching movies, Please try again later');
            }
        } finally {
            if (pageNum === 1) {
                setIsLoading(false);
            } else {
                setIsLoadingMore(false);
            }
        }
    }

    const loadTrendingMovies = async () => {
        try {
            const movies = await getTrendingMovies();

            setTrendingMovies(movies.filter(movie => movie.poster_url && !movie.poster_url.endsWith('null')));
        } catch (error) {
            console.error(`Error fetching Treniding movies: ${error}`)
        }
    }

    // Reset page to 1 when search term changes
    useEffect(() => {
        setPage(1);
        fetchMovies(debouncedSearchTerm, 1);
    }, [debouncedSearchTerm])

    // Fetch next page when page increments (but not for page 1, that's handled above)
    useEffect(() => {
        if (page > 1) {
            fetchMovies(debouncedSearchTerm, page);
        }
    }, [page])

    useEffect(() => {
        loadTrendingMovies();
    }, [])

    // IntersectionObserver to detect when sentinel is near viewport
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting && !isLoading && !isLoadingMore && page < totalPages) {
                    setPage(prev => prev + 1);
                }
            },
            { rootMargin: '400px' } // Trigger 400px before reaching the bottom
        );

        observer.observe(sentinel);

        return () => observer.disconnect();
    }, [isLoading, isLoadingMore, page, totalPages]);


    return (
        <main>
            <div className="pattern" />


            <div className="wrapper">
                <header>

                    <img src="./hero.png" alt="hero-img"></img>
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without The Hassle</h1>

                    < Search searchTerm={searchTerm} setSearchTearm={setSearchTerm} />
                </header>

                {trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2>Most Searched Movies</h2>

                        <ul>
                            {trendingMovies.map((movie, index) => (
                                <li key={movie.$id} className="cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200" onClick={() => setSelectedMovieId(movie.movie_id)}>
                                    <p>{index + 1}</p>
                                    <img src={movie.poster_url} alt={movie.title} />
                                </li>
                            )
                            )}
                        </ul>
                    </section>
                )}

                <section className={"all-movies"}>
                    <h2>All Movies</h2>

                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className={'text-red-500'}>{errorMessage}</p>
                    ) : (
                        <>
                            <ul>
                                {movieList.map((movie) => (
                                    <Movie key={movie.id} movie={movie} onClick={() => setSelectedMovieId(movie.id)} />
                                ))}
                            </ul>

                            {/* Sentinel element — triggers loading next page when scrolled into view */}
                            <div ref={sentinelRef} className="w-full py-8 flex justify-center">
                                {isLoadingMore && <Spinner />}
                                {page >= totalPages && movieList.length > 0 && (
                                    <p className="text-zinc-500 text-sm">You've reached the end 🎬</p>
                                )}
                            </div>
                        </>
                    )}
                </section>

            </div>

            {selectedMovieId && (
                <MovieDetailsModal movieId={selectedMovieId} onClose={() => setSelectedMovieId(null)} />
            )}
        </main>
    )
}
export default App

