import Search from "./components/Search.jsx";
import {useEffect, useState} from "react";

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/son',
            Authorization: `Bearer ${API_KEY}`
    }
}


const App = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('')

    const fetchMovies = async () =>{
        try{
            
        }catch (error) {
            console.error(`Error fetching movies: ${error}`) ;
            setErrorMessage('Error fetching movies, Please try again later') ;
        }
    }

    useEffect(() => {

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
