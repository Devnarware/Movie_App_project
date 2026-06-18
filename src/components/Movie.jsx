// , Year

const Movie = ({movie: {title}}) => {
    return (
        <div className={'movie-card'}>
            {/* <img src={Poster} alt="" /> */}
            <p className="text-white text-3xl">{title}</p>
        </div>
    )
}
export default Movie
