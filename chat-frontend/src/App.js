import "./App.css";
import { Route, Routes } from "react-router-dom";

import Auth from "./components/auth/auth";
import Home from "./components/home/home";

export default function App(){
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/auth" element={<Auth/>} />
      </Routes>
    </>
  );
}