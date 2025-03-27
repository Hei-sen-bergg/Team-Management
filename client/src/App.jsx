import React, {useState, useEffect} from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";



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

    <Route
          path="/login"
          element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to={getDashboardRedirect()} />}
        />

    <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to={getDashboardRedirect()} />}
        /> 



{/* Admin only routes */}

        <Route
          path="/users"
          element={isAuthenticated && user?.role === "admin" ? <Users /> : <Navigate to="/adminDashboard" />}
        />

        <Route
          path="/trainers"
          element={isAuthenticated && user?.role === "admin" ? <Trainers /> : <Navigate to="/adminDashboard" />}
        />
        <Route
          path="/courses"
          element={isAuthenticated && user?.role === "admin" ? <Courses /> : <Navigate to="/adminDashboard" />}
        />
        <Route
          path="/batches"
          element={isAuthenticated && user?.role === "admin" ? <Batches /> : <Navigate to="/adminDashboard" />}
        />






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