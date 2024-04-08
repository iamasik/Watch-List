import { useState,useEffect } from "react";
export function useStorage(key){
    console.log(key);
    const [watched, setWatched] = useState(function(){
        const Data=localStorage.getItem(key)
        return Data? JSON.parse(Data): []
        });
    useEffect(function(){ 
        localStorage.setItem(key,JSON.stringify(watched))
      },[watched,key]) 
    return [watched,setWatched]
}