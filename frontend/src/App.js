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
import Income from "./Components/Income";
function App() {
  const [user, setUser] = useState([]);
  const [showForm, setShowForm]=useState(false)
  return (
    <userContext.Provider value={{ user, setUser, showForm, setShowForm }}>
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
            <Route exact path="/income" element={<Income />}></Route>
          </Routes>
        </div>
      </Router>
    </userContext.Provider>
  );
}

export default App;
