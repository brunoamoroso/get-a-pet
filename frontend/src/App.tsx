import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Container from "./components/layout/Container";
import Message from "./components/layout/Message";

// Pages
import Register from "./components/pages/Auth/Register";
import Login from "./components/pages/Auth/Login";
import Home from "./components/pages/Home";
import Profile from "./components/pages/User/Profile";

//Context
import { UserProvider } from "./context/UserContext";
import MyPets from "./components/pages/Pets/MyPets";
import AddPet from "./components/pages/Pets/AddPet";
import EditPets from "./components/pages/Pets/EditPets";

function App() {
  return (
    <Router>
      <UserProvider value={""}>
        <Navbar />
        <Message />
        <Container>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/pets/mypets" element={<MyPets />} />
            <Route path="/pets/add" element={<AddPet />} />
            <Route path="/pets/edit/:id" element={<EditPets />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
