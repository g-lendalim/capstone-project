import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from './components/AuthProvider';
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}