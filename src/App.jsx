import { useState, useContext } from 'react';
import { Navbar, Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter, Route, Routes, Link, Outlet, Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import api from './api';
import { getAuth } from "firebase/auth";
import { AuthContext, AuthProvider } from './components/AuthProvider';
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard"
import ProfilePage from "./pages/ProfilePage";
import AlarmPage from "./pages/AlarmPage";
import SupportPage from "./pages/SupportPage";
import CopingToolkit from "./pages/CopingToolkit";
import SupportCircle from "./pages/SupportCircle";
import EmergencyHotline from "./pages/EmergencyHotline";
import PrivateRoute from './components/PrivateRoute';
import LogPromptModal from './components/LogPromptModal';
import { Provider } from 'react-redux';
import store from './store';

function Layout() {
  const auth = getAuth();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleLogout = () => {
    if (currentUser) {
      auth.signOut()
        .then(() => {
          navigate("/login");
        })
        .catch((error) => {
          console.error("Logout Error: ", error);
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const userMessage = { text: prompt, sender: "user" };
    setMessages([...messages, userMessage]);

    try {
      const res = await api.post("/api/generate", { prompt });

      const data = res.data;
      if (data.reply) {
        const aiMessage = { text: data.reply, sender: "ai" };
        setMessages([...messages, userMessage, aiMessage]);
        setPrompt("");
      } else {
        throw new Error("Unexpected response format from server.");
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <>
      <Navbar fixed="bottom" className="bg-white shadow-lg border-top">
        <Container>
          <Row className="w-100 text-center">
            <Col>
              <Navbar.Text as={Link} to="/home" className="d-block text-dark text-decoration-none">
                <i className="bi bi-house"></i>
                <small className="d-block">Home</small>
              </Navbar.Text>
            </Col>
            <Col>
              <Navbar.Text as={Link} to="/alarm" className="d-block text-dark text-decoration-none">
                <i className="bi bi-alarm"></i>
                <small className="d-block">Alarms</small>
              </Navbar.Text>
            </Col>
            <Col>
              <Navbar.Text as={Link} to="/profile" className="d-block text-dark text-decoration-none">
                <i className="bi bi-journal"></i>
                <small className="d-block">Journal</small>
              </Navbar.Text>
            </Col>
            <Col>
              <Navbar.Text as={Link} to="/support" className="d-block text-dark text-decoration-none">
                <i className="bi bi-people"></i>
                <small className="d-block">Support</small>
              </Navbar.Text>
            </Col>
            <Col>
              {currentUser ? (
                <Navbar.Text
                  onClick={handleLogout}
                  role="button"
                  className="d-block text-dark text-decoration-none text-center"
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <small className="d-block">Logout</small>
                </Navbar.Text>
              ) : (
                <Navbar.Text
                  as={Link}
                  to="/login"
                  className="d-block text-dark text-decoration-none text-center"
                >
                  <i className="bi bi-box-arrow-in-right"></i>
                  <small className="d-block">Login</small>
                </Navbar.Text>
              )}
            </Col>
          </Row>
        </Container>
      </Navbar>

      {currentUser && (
          <div className="chatbot-fab d-flex align-items-center justify-content-center"
            onClick={() => setIsChatOpen(!isChatOpen)}>
            <i className="bi bi-chat-dots fs-4"></i>
          </div>
        )}

        {isChatOpen && (
          <div className="chat-container">
            <div className="header-container">
              <h5 className="fw-bold">Serene</h5>
              <small className="text-muted">Your Companion in the Safe Space</small>
            </div>
            <div className="messages-container">
              {messages.map((message, index) => (
                <div key={index} className={`message-bubble ${message.sender}`}>
                  {message.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="form-control"
                placeholder="Type your message..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button type="submit" className="btn btn-primary mt-2">Send</button>
            </form>
            {error && <div className="alert alert-danger mt-2">{error}</div>}
          </div>
        )}
      <Outlet />
    </>
  );
};

export default function App() {
  return (
      <AuthProvider>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<AuthPage />} />
              <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route path="home" element={<Dashboard />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="alarm" element={<AlarmPage />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="coping" element={<CopingToolkit />} />
                <Route path="contact" element={<SupportCircle />} />
                <Route path="emergency" element={<EmergencyHotline />} />
              </Route>
              <Route path="*" element={<AuthPage />} />
            </Routes>
          </BrowserRouter>
        </Provider>
      </AuthProvider>
  );
}