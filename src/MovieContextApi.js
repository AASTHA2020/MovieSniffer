import React, { useState, useEffect, createContext } from "react";


const MovieContext = createContext()


function MovieContextApi({children}) {

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

return(
    <MovieContext.Provider
      value = {{query,
                movies,
                selectedId,
                watched,
                setQuery,
                handleSelectMovie,
                closeSelectedId : handleCloseMovie,
                onAddMovie : handleOnAddWatched,
                onDeleteMovie : handleDeleteMovieFromList
                }}
      >
        {children}
      </MovieContext.Provider>
)

}


export {MovieContextApi, MovieContext};