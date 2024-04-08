import { useEffect, useState } from "react";

export function useMovies(Quearys,SetSelected){
  const [Errors, setError]=useState(null);
  const [isLoaded,setLoaded]=useState(false);
  const [movies, setMovies] = useState([]);
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
        SetSelected(null)
        FindMovie()
        return ()=>{
          controller.abort()
        }
      },[Quearys,SetSelected])
    
    return {movies, isLoaded,Errors}
} 