import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Loadnav } from "./components/Navigation";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loadnav />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;
