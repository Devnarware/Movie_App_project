

const Movie = ({movie}) => {
    return (
        <div>
            <p key= {movie.imdbID} className={'text-white'}>{movie.Title}</p>
        </div>
    )
}
export default Movie
