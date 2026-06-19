import Search from "./components/Search.jsx";
import { useEffect, useState } from "react";
import Spinner from "./components/Spinner.jsx";
import Movie from "./components/Movie.jsx";
import { useDebounce } from "react-use";

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
    const [isLoading, setIsLoading] = useState(false)
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])


    const fetchMovies = async (query = '') => {

        setIsLoading(true)
        setErrorMessage('')

        try {
            const endpoint = query 
            ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
            : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`


            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error('failed to fetch movie')
            }

            const data = await response.json();
            console.log(data)

            if (data.Response === 'False') {
                setErrorMessage(data.Error || 'Failed to fetch movies')
                setMovieList([]);
                return;
            }

            setMovieList(data.results || []);

        } catch (error) {
            console.error(`Error fetching movies: ${error}`);
            setErrorMessage('Error fetching movies, Please try again later');
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm)
    }, [debouncedSearchTerm])


    return (
        <main>
            <div className="pattern" />


            <div className="wrapper">
                <header>

                    <img src="./hero.png" alt="hero-img"></img>
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without The Hassle</h1>

                    < Search searchTerm={searchTerm} setSearchTearm={setSearchTerm} />
                </header>

                <section className={"all-movies"}>
                    <h2 className={'mt-10'}>All movies</h2>

                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className={'text-red-500'}>{errorMessage}</p>
                    ) : (
                        <ul>
                            {movieList.map((movie) => (
                                <Movie key={movie.id} movie={movie} />
                            ))}
                        </ul>
                    )}
                </section>

            </div>
        </main>
    )
}
export default App
