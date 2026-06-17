import Search from "./components/Search.jsx";


const App = () => {
    return (
        <main>
            <div className="pattern" />


            <div className="wrapper">
                <header>

                    <img src="./hero.png" alt="hero-img"></img>
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without The Hassle</h1>
                </header>

                < Search/>
            </div>
        </main>
    )
}
export default App
