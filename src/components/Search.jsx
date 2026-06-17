

const Search = ({searchTerm, setSearchTearm}) => {
    return (
        <div className={'search'}>
            <div>
                <img src={"search.svg"} alt={"search"}/>

                < input
                    type={"text"}
                    placeholder={"Search through thousands of movies "}
                    value={searchTerm}
                    onChange={(e)=>{setSearchTearm(e.target.value)}}
                />
            </div>
        </div>
    )
}
export default Search
