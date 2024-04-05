import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import Rating from './Rating'
// function Check(){
//   const [External,SetExternal]=useState(0)
//   return(
//     <>
//     <Rating SetExternal={SetExternal}/>
// <p>The Value is {External}</p>
//     </>
//   )
// }
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    
    {/* <Check /> */}
  </React.StrictMode>
);

