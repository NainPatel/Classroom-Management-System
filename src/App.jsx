import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from "./login.jsx";
import NavBar_Component from "./Pages/Navbar.jsx";
 import login from "./login.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Home} from "./Pages/Home.jsx";

function App() {
  const [count, setCount] = useState(0)
    const role = '';

  return (
    <>
      <NavBar_Component/>
        <BrowserRouter>
            {
                role === '' && (
                    <Routes>
                        <Route path={'/'} element={<Home/>}/>
                    </Routes>
                )
            }
        </BrowserRouter>

    </>
  )
}

export default App
