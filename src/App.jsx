import Search from "./components/Search.jsx";
import {useEffect, useState} from "react";

const API_BASE_URL = 'https://www.omdbapi.com/';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const API_OPTIONS = {
}


const App = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('') ;
    const [movieList, setMovieList] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    console.log("hello")

    const fetchMovies = async () =>{
        try{

            const endpoint = `${API_BASE_URL}?apikey=${API_KEY}&s=Batman&type=movie`
            const response = await fetch(endpoint, API_OPTIONS) ;

            if(!response.ok){
                throw new Error('failed to fetch movie')
            }

            const data = await response.json() ;

            if(data.Response === 'False'){
                setErrorMessage(data.Error || 'Failed to fetch movies')
                setMovieList([]) ;
                return;
            }

            setMovieList(data.results) ;

        }catch (error) {
            console.error(`Error fetching movies: ${error}`) ;
            setErrorMessage('Error fetching movies, Please try again later') ;
        }
    }

    useEffect(() => {
         fetchMovies()
    }, [])


    return (
        <main>
            <div className="pattern"/>


            <div className="wrapper">
                <header>

                    <img src="./hero.png" alt="hero-img"></img>
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without The Hassle</h1>

                < Search searchTerm={searchTerm} setSearchTearm={setSearchTerm}/>
                </header>

                <section className={"all-movies"}>
                    <h2>All movies</h2>

                    {errorMessage && <p className="text-red-500">{errorMessage}</p> }
                </section>

            </div>
        </main>
    )
}
export default App
