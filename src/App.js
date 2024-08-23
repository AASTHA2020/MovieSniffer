import React, { useState, useEffect } from "react";
import "./index.css"
import Navbar from './Components/Navbar'
import Main from './Components/Main'
import StarRating from './Components/StarRating'

const tempMovieData = [
    {
      imdbID: "tt1375666",
      Title: "Inception",
      Year: "2010",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    },
    {
      imdbID: "tt0133093",
      Title: "The Matrix",
      Year: "1999",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    },
    {
      imdbID: "tt6751668",
      Title: "Parasite",
      Year: "2019",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
    },
  ];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];


const api_key = process.env.REACT_APP_API_KEY;
  

export default function App() {


const [movies, setMovies] = useState([]);
const [watched,setWatched] = useState([]);
const [isLoading,setIsLoading] = useState(false)
const [query, setQuery] = useState("Inception");
const [selectedId,setSelectedId] = useState(null)
  

useEffect(()=>{
  fetchMovieData()
},[query])

async function fetchMovieData(){
  try{
    setIsLoading(true)
    const response = await fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=970c7fd3&s=${query}`)
    if(!response.ok){
      throw new Error('Network Error While Processing Your request')
    }
    const data = await response.json()
    if(query.length < 3)
    { setMovies([])
      setIsLoading(false)
      return
    }
    setMovies(data.Search)
    setIsLoading(false)
  }
  catch(error){
    console.error(error)
  }
}

function handleSelectMovie(value){
  console.log(value)
  setSelectedId((select) => value === select ? null : value)
}

function handleCloseMovie(){
  setSelectedId(null)
}

function handleOnAddWatched(movie){
  setWatched((watch)=>[...watch,movie])
}

function handleDeleteMovieFromList(id){
  setWatched((movie)=>movie.filter((watched)=>watched.imdbID !== id))
}
    return (
      <>
        <Navbar> 
            <SearchBox query={query} setQuery={setQuery}/>
            <Content movies = {movies}/>
        </Navbar>
  
        <Main>
          <List>
            {isLoading ? <Loader/> : <MovieList movies = {movies} handleSelectMovie = {handleSelectMovie}/>}
          </List>
          <WatchedBox>
            {selectedId ? <MovieDetails selectedId={selectedId} 
                                        closeSelectedId = {handleCloseMovie} 
                                        onAddMovie = {handleOnAddWatched}
                                        watched = {watched}
                                        />
            :
            <>
            <Summary watched={watched}/>
            <ListWatched watched={watched}
                         onDeleteMovie={handleDeleteMovieFromList}
            />
            </>
            }
          </WatchedBox>  
        </Main>
          
      </>
    );
  }


//Navigation Bar Component

function SearchBox({query, setQuery}){
    return(
        <input
          className="search"
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
    )
}

function Content({movies}){
    return(
        <p className="num-results">
        Found <strong>{movies?.length}</strong> results
      </p>
    )
}

//List Box Component

function List({children}){
  const [isOpen1, setIsOpen1] = useState(true);
      return(
          <div className="box">
            <button
              className="btn-toggle"
              onClick={() => setIsOpen1((open) => !open)}
            >
              {isOpen1 ? "–" : "+"}
            </button>
          {isOpen1 && children}
            
          </div>
      )
}

function MovieList({movies,handleSelectMovie}){
  return(
          <ul className="list list-movies">
            {movies?.map((movie) => (
              <Movie movie = {movie} key={movie.imdbID} selectMovie = {handleSelectMovie}/>
            ))}
          </ul>
  )
}

function Movie({movie,selectMovie}){
    return(
        <li onClick = {()=>selectMovie(movie.imdbID)}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p>
        </div>
        </li>
    )
}





//Second Box Component

function WatchedBox({children}){
    const [isOpen2, setIsOpen2] = useState(true);
        return(
            <div className="box">
                <button
                className="btn-toggle"
                onClick={() => setIsOpen2((open) => !open)}
                >
                {isOpen2 ? "–" : "+"}
                </button>
                {isOpen2 && (
                   children
                )}
            </div>
        )
}


const average = (arr) =>
arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);


function Summary({watched}){

const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
const avgUserRating = average(watched.map((movie) => movie.userRating));
const avgRuntime = average(watched.map((movie) => movie.runtime));

    return(
        <>
        <div className="summary">
                <h2>Movies you watched</h2>
                <div>
                  <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                  </p>
                  <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating}</span>
                  </p>
                  <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                  </p>
                  <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                  </p>
                </div>
              </div>
    </>
    )
}

function ListWatched({watched, onDeleteMovie}){
    return(<ul className="list">
    {watched.map((movie) => (
      <li key={movie.imdbID}>
        <button className = "btn-delete"
                onClick={()=>onDeleteMovie(movie.imdbID)}>X</button>
        <img src={movie.poster} alt={`${movie.title} poster`} />
        <h3>{movie.title}</h3>
        <div>
          <p>
            <span>⭐️</span>
            <span>{movie.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{movie.userRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{movie.runtime} min</span>
          </p>
        </div>
      </li>
    ))}
  </ul>)
}

//Additional Created Functions  :::

function Loader(){
  return(
    <p className = "loader">Loading ...</p>
  )
}


function MovieDetails({selectedId, closeSelectedId, onAddMovie, watched}){

const [movie,setMovie] = useState({})
const [loader,setLoader] = useState(false)
const [movieRating,setMovieRating] = useState('')

const isWatched = watched.map((movie)=>movie.imdbID).includes(selectedId);
const rate = watched.find((id)=>id.imdbID === selectedId)?.userRating;


const {
  Title: title,
  Year: year,
  Poster: poster,
  Runtime: runtime,
  imdbRating,
  Plot: plot,
  Released: released,
  Actors: actors,
  Director: director,
  Genre: genre,
} = movie;

useEffect(()=>{
  fetchSelectedId()
},[selectedId])

async function fetchSelectedId(){
  try{
    setLoader(true)
    const response = await fetch(`https://www.omdbapi.com/?apikey=970c7fd3&i=${selectedId}`)
    if(!response.ok){
      throw new Error(`Network Error While Processing Your Request`)
    }
    const data = await response.json()
    setMovie(data)
    setLoader(false)
  }
  catch(error){
    console.error(`Error in fetching request, ${error}`)
  }
}

function handleOnClick(){
  const newWatchedMovie = {
    imdbID:selectedId,
    title,
    year,
    poster,
    imdbRating:Number(imdbRating),
    runtime: Number(runtime.split(" ").at(0)),
    userRating:movieRating
  }
  console.log(newWatchedMovie)
  onAddMovie(newWatchedMovie)
  closeSelectedId();
}

  return(
    <div className = "details">
      {loader ? <Loader/> : <>
      <header>
      <button className = "btn-back" onClick = {closeSelectedId}>
                &larr;
      </button>
      <img src = {poster} alt = "nothing new here"/>
      <div className = "details-overview">
        <h2>{title}</h2>
        <p>
          {released} &bull; {runtime}
        </p>
        <p>{genre}</p>
        <p>
          <span>⭐️</span>
          {imdbRating} IMDB Rating
        </p>
      </div>
      </header>
            
      <section>
      <div className = "rating">
            { isWatched ? `You already rated this movie ${rate} ⭐️` :
            <>
            <StarRating star ={10} onSetRating = {setMovieRating} />
            {movieRating>0 && <button className = "btn-add" onClick = {handleOnClick}>Add to list</button>}
            </>
            }
      </div>
        <p>
        <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
      </>
    }
    </div>
  )
}







// Eliminate Prop Drilling As much As we can
