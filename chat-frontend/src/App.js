import "./App.css";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from '../src/context/AuthContext';
import { ProtectedRoute, AuthRoute } from "./components/ProtectedRoute";
import Auth from "./components/auth/auth";
import Home from "./components/home/home";
import Chat from "./components/ui/chat/chat";
import Profile from "./components/profile/profile";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          <Route path="chat/:ChatId" element={<Chat />} />
        </Route>

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
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
    </AuthProvider>
  );
}