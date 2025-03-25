import React, {useState, useEffect} from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";



function App(){

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if(token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData, token ) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  }


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  }

 
  const getDashboardRedirect = () => {
    if (user?.role === "admin") return "/adminDashboard";
    if (user?.role === "student") return "/studentDashboard";
    if (user?.role === "trainer") return "/trainerDashboard";
    return "/login";
  };








  return(

    <BrowserRouter>
    {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
    <Routes>
      <Route path="/" element={!isAuthenticated ? <LandingPage /> : <Navigate to={getDashboardRedirect()} />} />


    {/* Auth Routes */}






   {/* Dashboard */}

      <Route path="/adminDashboard" 
      element={isAuthenticated && user?.role === "admin" ? <AdminDashboard user={user} /> : <Navigate to="/login" />} />

      <Route path="/studentDashboard"
      element={isAuthenticated && user?.role === "student" ? <StudentDashboard user={user} /> : <Navigate to="/login" />} />

      <Route path="/trainerDashboard"
      element={isAuthenticated && user?.role === "trainer" ? <TrainerDashboard user={user} /> : <Navigate to="/login" />} />

    </Routes>
    </BrowserRouter>

  )

}


export default App