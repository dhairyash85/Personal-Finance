import "./App.css";
import Home from "./Components/Home";
import Login from "./Components/Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Signup from "./Components/Signup";
import Navbar from "./Components/Navbar";
import userContext from "./Context/Context";
import { useState } from "react";
import Stats from "./Components/Stats";
function App() {
  const [user, setUser] = useState([]);
  return (
    <userContext.Provider value={{ user, setUser }}>
      <Router>
        <div
          style={{
            backgroundImage: `url("https://www.transparenttextures.com/patterns/crissxcross.png")`,
            backgroundColor: "#000000",
          }}
        >
          <Navbar />

          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route exact path="/login" element={<Login />}></Route>
            <Route exact path="/signup" element={<Signup />}></Route>
            <Route exact path="/stats" element={<Stats />}></Route>
          </Routes>
        </div>
      </Router>
    </userContext.Provider>
  );
}

export default App;
