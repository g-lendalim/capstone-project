import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from './components/AuthProvider';
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import AlarmPage from "./pages/AlarmPage";
import { Provider } from 'react-redux';
import store from './store';

export default function App() {
  return (
    <AuthProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/alarm" element={<AlarmPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </AuthProvider>
  );
}