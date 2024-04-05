import { useEffect, useState } from "react";
import Rating from './Rating'


const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function NavBar({children}){
  return(
    <nav className="nav-bar">
      {children}
  </nav>
  )
}
function Total({movies}){
  let Len=movies.length
  return(
    <p className="num-results">
    {Len? `Found ${Len} results`:""}
  </p>
  )
}
function Logo(){
  return(
    <div className="logo">
      <span role="img">🎦</span>
      <h1>Watch List</h1>
    </div>
  )
}

function Search({Quearys,setQuerys}){
  return(
    <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={Quearys}
    onChange={(e) => setQuerys(e.target.value)}
  />
  )
}

function Frame({children}){
  const [isOpen1, setIsOpen1] = useState(true);
  return(
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "-" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  )
}

function Movie({movie,SetSelected}){
  return(
    <li key={movie.imdbID} onClick={()=>SetSelected(movie.imdbID)}>
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
function MovieList({Movies,SetSelected}){
  return (
    <ul className="list list-movies">
    {Movies?.map((movie) => (
      <Movie movie={movie} SetSelected={SetSelected} key={movie.imdbID}/>
    ))}
  </ul>
  )
}
function Watched({movie, DeleteMovie}){
  return(
    <li>
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
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
        <span>{movie.Runtime} min</span>
      </p>
    </div>
    <button className="btn-delete" onClick={()=>DeleteMovie(movie.imdbID)}>-</button>
  </li>
  )
}
function WatchedList({watched,setWatched}){
  function DeleteMovie(imdbID){
    setWatched(watched=>watched.filter(x=>x.imdbID!==imdbID))
  }
  return (
    <ul className="list">
    {watched.map((movie) => (
      <Watched key={movie.imdbID} movie={movie}  DeleteMovie={DeleteMovie}/>
    ))}
  </ul>
  )
}
function Summery({watched}){
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.Runtime));
return(
  <div className="summary">
  <h2>Movies you watched</h2>
  <div>
    <p>
      <span>#️⃣</span>
      <span>{watched.length} movies</span>
    </p>
    <p>
      <span>⭐️</span>
      <span>{avgImdbRating.toFixed(1)}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{avgUserRating.toFixed(1)}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{avgRuntime.toFixed(1)} min</span>
    </p>
  </div>
</div>
)
}

function Main({children}){
  return(
    <main className="main">
      {children}
  </main>
  )
}

export default function App() {
  const [Selected, SetSelected]=useState(null)
  const [Errors, setError]=useState(null)
  const [isLoaded,setLoaded]=useState(false)
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [Quearys, setQuerys]=useState('')
  useEffect(()=>{
    const controller = new AbortController();
    async function FindMovie(){
      try{
        setLoaded(true)
        setError(null)
        const Res= await fetch(`http://www.omdbapi.com/?apikey=faaa0cb7&s=${Quearys}`,{signal:controller.signal})
        if(!Res.ok) throw new Error('❌ Something is wrong')
        const Data=await Res.json()
        if(Data.Response==="False") throw new Error('Movie not found')
        setMovies(Data.Search)
      } catch(err){
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      }
      finally{
        setLoaded(false)
      }
    }
    if(Quearys<1){
      setMovies([])
      setError(null)
      return
    }
    FindMovie()
    return ()=>{
      controller.abort()
    }
  },[Quearys])
  return (
    <>
    <NavBar>
      <Logo/>
      <Search Quearys={Quearys} setQuerys={setQuerys}/>
      <Total movies={movies}/>
    </NavBar>
    <Main> 
      <Frame>
        {isLoaded && <Loading/>}
        {!isLoaded && !Errors && <MovieList SetSelected={SetSelected} Movies={movies}/>}
        {Errors && <ErrorOccur Errors={Errors}/>}
      </Frame>
      <Frame>
        {Selected? <MovieDetails Selected={Selected} watched={watched} setWatched={setWatched} SetSelected={SetSelected}/>:
        <>
        <Summery watched={watched}/>
        <WatchedList watched={watched} setWatched={setWatched}/>
        </>
        }
      </Frame>
    </Main>
    </>
  );
}
function MovieDetails({Selected,SetSelected,watched,setWatched}){
  const [Errors, setError]=useState(null)
  const [isLoaded,setLoaded]=useState(false)
  const [Details,SetDetails]=useState({})
  const {Poster,Title,Plot,Director,Runtime,Actors,imdbRating,Released,Genre}=Details
  const [MyRate,setMyRate]=useState(null)
  function MyRating(rate){
    setMyRate(rate)
  }
  
  function AddNew(){
    const New={
      imdbID:Selected,
      Poster,
      Title,
      imdbRating,
      userRating:MyRate,
      Runtime: Runtime==="N/A"? 0 : Number(Runtime.split(" ")[0])
    }
    setWatched(Movie=>[...Movie,New])
    SetSelected(null)
  }
  useEffect(()=>{
    if(Title){
      document.title=`Movie: ${Title}`
    }
    return function(){
      document.title=`Watch List`
    }
  },[Title])
  const isIn=watched.map(x=>x.imdbID).includes(Selected)
  
  useEffect(()=>{
    async function ShowDetails(){
      try{
        setLoaded(true)
        setError(null)
        const Res= await fetch(`http://www.omdbapi.com/?apikey=faaa0cb7&i=${Selected}`)
        if(!Res.ok) throw new Error('❌ Something is wrong')
        const Data=await Res.json()
        SetDetails(Data)
      }
      catch(err){
        setError(err.message)
      }
      finally{
        setLoaded(false)
      }
    }
    ShowDetails()
  },[Selected])

  return <div className="details">
    {Errors && <ErrorOccur Errors={Errors}/>}
    {isLoaded && <Loading/> }
    {!isLoaded && !Errors &&
    <>
          <header>
            <button className="btn-back" onClick={()=> SetSelected(null)}>&larr;</button>
            <img className="poster" src={Poster} alt={Title}/>
            <div className="details-overview">
              <h1>{Title}</h1>
              <p>{Released} ({Runtime})</p>
              <p>⭐ {imdbRating}</p>
              <p>{Genre}</p>
            </div>
          </header>
          <section>
            <div className="rating" key={Selected}>
              {isIn && <p>You have rated {watched.find(x=>x.imdbID===Selected).userRating}⭐</p>}
              {Selected && !isIn &&<>
              <Rating Number={10} SetExternal={MyRating}/>
              {MyRate && <button className="btn-add" onClick={()=> AddNew()}>+ Add to List</button>}
              </>}
            </div>
            <p>
              <em>{Plot}</em>
            </p>
            <p>Starring: {Actors}</p>
            <p>
              Director: {Director}
            </p>
          </section>
    </>
    }

  </div>
}
function Loading(){
  return <div style={{fontSize:'18px',fontWeight:'bold',textAlign:'center',paddingTop:'10px'}}>
    <p>Loading...</p>
  </div>
}
function ErrorOccur({Errors}){
  return <div style={{fontSize:'18px',fontWeight:'bold',textAlign:'center',paddingTop:'10px'}}>
    <p>{Errors}</p>
  </div>
}