import "./App.css";
import { Routes, Route } from "react-router-dom";

import { ProtectedRoute, AuthRoute } from "./components/ProtectedRoute";
import Auth from "./components/auth/auth";
import Home from "./components/home/home";
import Chat from "./components/ui/chat/chat";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/auth" element={
          <AuthRoute>
            <Auth />
          </AuthRoute>
        }
      />
      <Route path="/chat/:id" element={<Chat/>}/>
    </Routes>
  );
}
