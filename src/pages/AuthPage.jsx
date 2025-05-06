import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import {
  Container,
  Card,
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  Modal
} from "react-bootstrap";
import api from "../api";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const { currentUser } = useContext(AuthContext);

  const createUserInDatabase = async (token) => {
    try {
      localStorage.setItem('token', token);
      console.log("🔥 Firebase ID Token:", token);
      await api.post("/api/users", {});
    } catch (error) {
      console.error("Error inserting user into DB:", error);
    }
  };

  useEffect(() => {
    if (currentUser) navigate("/home");
  }, [currentUser, navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }

      const user = userCredential.user;
      const token = await user.getIdToken();
      await createUserInDatabase(token);

    } catch (error) {
      console.error(error.message);
      alert(`Authentication error: ${error.message}`);
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      await createUserInDatabase(token);
    } catch (error) {
      console.error(error.message);
      alert(`Google authentication error: ${error.message}`);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent. Check your inbox.");
      setShowForgotPassword(false);
    } catch (error) {
      console.error("Password reset error:", error);
      alert("Failed to send reset email. Please check the email address.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const appFeatures = [
    {
      title: "Mood Tracking",
      description: "Log your daily mood patterns and track emotional trends.",
      icon: "bi-emoji-smile"
    },
    {
      title: "Smart Alarms",
      description: "Set alarms for mood logs, medication, and therapy sessions.",
      icon: "bi-alarm"
    },
    {
      title: "Coping Toolkit",
      description: "Access grounding techniques, safety plans, and wellness strategies during difficult moments.",
      icon: "bi-tools"
    },
    {
      title: "Support Network",
      description: "Keep important contacts and emergency hotlines readily available.",
      icon: "bi-people"
    }
  ];

  return (
    <div className="auth-page-wrapper" style={{
      background: "linear-gradient(135deg, #e0f7fa 0%, #bbdefb 100%)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center"
    }}>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col lg={10} xl={9} className="px-0">
            <Card className="border-0 shadow overflow-hidden" style={{ borderRadius: "20px" }}>
              <Row className="g-0">
                <Col md={5} className="d-md-block" style={{
                  background: "linear-gradient(150deg, #5b86e5 0%, #36d1dc 100%)",
                  padding: "2rem",
                  position: "relative"
                }}>
                  <div className="h-100 d-flex flex-column justify-content-between text-white">
                    <div className="text-center">
                      <h2 className="fw-bold" style={{ fontSize: "1.8rem" }}>
                        <i className="bi bi-house-heart-fill me-2"></i>
                        Safe Space
                      </h2>
                      <small>Your daily companion for mental wellness</small>
                    </div>                 
                    <div className="features-container py-3 d-none d-md-block mt-4">
                      <h5 className="mb-3 fw-bold">What we offer:</h5>
                      <ul className="list-unstyled">
                        {appFeatures.map((feature, index) => (
                          <li key={index} className="mb-3 d-flex align-items-start">
                            <i className={`${feature.icon} me-3 mt-3`} style={{ fontSize: "1.5rem" }}></i>
                            <div>
                              <div className="fw-bold">{feature.title}</div>
                              <small className="text-white-50">{feature.description}</small>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-auto text-center text-white- d-none d-md-block" style={{ fontSize: "0.8rem" }}>
                      <p>© 2025 Safe Space. All rights reserved.</p>
                    </div>
                  </div>
                </Col>
                
                <Col md={7}>
                  <Card.Body className="p-4 p-lg-5">
                   <h2 className="text-center mb-4 fw-bold" style={{ color: "#4a5568" }}>
                      {isLogin ? "Welcome Back" : "Create Your Account"}
                    </h2>

                    <Button
                      variant="outline-secondary"
                      className="w-100 mb-3 py-2 d-flex align-items-center justify-content-center"
                      onClick={handleGoogleAuth}
                      style={{
                        borderRadius: "12px",
                        borderColor: "#d1d9e6",
                        backgroundColor: "white",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                      }}
                    >
                      <svg className="me-2" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                      </svg>
                      Continue with Google
                    </Button>

                    <div className="d-flex align-items-center my-4">
                      <hr className="flex-grow-1" style={{ borderColor: "#e2e8f0" }} />
                      <span className="mx-3 text-muted small">or use email</span>
                      <hr className="flex-grow-1" style={{ borderColor: "#e2e8f0" }} />
                    </div>

                    <Form onSubmit={handleAuth}>
                      <Form.Group className="mb-3" controlId="formEmail">
                        <InputGroup>
                          <InputGroup.Text className="bg-light border-end-0">
                            <i className="bi bi-envelope text-muted"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border-start-0"
                            style={{
                              borderRadius: "0 8px 8px 0",
                              boxShadow: "none",
                              backgroundColor: "#f8fafc"
                            }}
                          />
                        </InputGroup>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formPassword">
                        <InputGroup>
                          <InputGroup.Text className="bg-light border-end-0">
                            <i className="bi bi-lock text-muted"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="border-start-0 border-end-0"
                            style={{
                              borderRadius: "0",
                              boxShadow: "none",
                              backgroundColor: "#f8fafc"
                            }}
                          />
                          <InputGroup.Text
                            onClick={togglePasswordVisibility}
                            style={{
                              cursor: "pointer",
                              borderRadius: "0 8px 8px 0",
                              backgroundColor: "#f8fafc",
                              borderLeft: "0"
                            }}
                          >
                            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} text-muted`}></i>
                          </InputGroup.Text>
                        </InputGroup>
                      </Form.Group>

                      {isLogin && (
                        <div className="d-flex justify-content-end mb-3">
                          <Button
                            variant="link"
                            onClick={() => setShowForgotPassword(true)}
                            className="p-0 text-decoration-none small"
                            style={{ color: "#5b86e5", fontSize: "0.85rem" }}
                          >
                            Forgot password?
                          </Button>
                        </div>
                      )}

                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100 py-2 mb-3"
                        style={{
                          borderRadius: "12px",
                          background: "linear-gradient(135deg,#5b86e5 0%, #36d1dc 100%)",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(91, 134, 229, 0.3)"
                        }}
                      >
                        {isLogin ? "Sign In" : "Create Account"}
                      </Button>

                      <div className="text-center mt-3">
                        <Button
                          variant="link"
                          onClick={() => setIsLogin(!isLogin)}
                          className="p-0 text-decoration-none"
                          style={{ color: "#5b86e5" }}
                        >
                          {isLogin ? "New here? Create an account" : "Already have an account? Sign in"}
                        </Button>
                      </div>
                    </Form>

                    <p className="text-muted text-center mt-4" style={{ fontSize: "0.75rem" }}>
                      By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Forgot Password Modal */}
      <Modal show={showForgotPassword} onHide={() => setShowForgotPassword(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reset Your Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-3">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowForgotPassword(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleForgotPassword}
            style={{
              background: "linear-gradient(135deg,#5b86e5 0%, #36d1dc 100%)",
              border: "none"
            }}
          >
            Send Reset Link
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}