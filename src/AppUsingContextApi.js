import React, { useState, useEffect, useContext } from "react";
import "./index.css"
import Navbar from './Components/Navbar'
import Main from './Components/Main'
import StarRating from './Components/StarRating'
import { MovieContext} from "./MovieContextApi";


  

export default function AppUsingContextApi() {

  const {isLoading, selectedId} = useContext(MovieContext)

    return (
      <>
        <Navbar> 
            <SearchBox/>
            <Content/>
        </Navbar>
  
        <Main>
          <List>
            {isLoading ? <Loader/> : <MovieList/>}
          </List>
          <WatchedBox>
            {selectedId ? <MovieDetails/>
            :
            <>
            <Summary/>
            <ListWatched/>
            </>
            }
          </WatchedBox>  
        </Main>
      </>
    );
  }


//Navigation Bar Component

function SearchBox(){

  const {query, setQuery} = useContext(MovieContext);

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

function Content(){

    const {movies} = useContext(MovieContext)
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

function MovieList(){

  const {movies, handleSelectMovie} = useContext(MovieContext);
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


function Summary(){

  const {watched} = useContext(MovieContext)

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

function ListWatched(){

  const {watched, onDeleteMovie} = useContext(MovieContext);

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


function MovieDetails(){

const {selectedId, closeSelectedId, onAddMovie, watched} = useContext(MovieContext)

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
