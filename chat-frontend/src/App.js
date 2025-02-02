import "./App.css";
import { Routes, Route } from "react-router-dom";

import { ProtectedRoute, AuthRoute } from "./components/ProtectedRoute";
import Auth from "./components/auth/auth";
import Home from "./components/home/home";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/auth"
        element={
          <AuthRoute>
            <Auth />
          </AuthRoute>
        }
      />
    </Routes>
  );
}
