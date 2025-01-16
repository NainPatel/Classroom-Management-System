import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from "./login.jsx";
import NavBar_Component from "./Pages/Navbar.jsx";
 import login from "./login.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NavBar_Component/>
    </>
  )
}

export default App
