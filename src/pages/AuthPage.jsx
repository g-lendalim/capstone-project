import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import {
  Container,
  Card,
  Button,
  Form,
  Row,
  Col,
  InputGroup
} from "react-bootstrap";
import api from "../api";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-page-wrapper" style={{
      background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center"
    }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col sm={10} md={8} xl={6}>
            <div className="text-center mb-4">
              <h1 className="fw-bold" style={{ color: "#8daeea", fontSize: '50px' }}>
                <i className="bi bi-house-heart-fill me-2"></i>
                Safe Space
              </h1>
              <small className="text-muted">Your daily companion for mental wellness</small>
            </div>

            <Card className="border-0 shadow" style={{ borderRadius: "16px", background: "rgba(173, 227, 239, 0.9)" }}>
              <Card.Body className="p-4 p-md-5" style={{ background: "rgba(225, 231, 241, 0.9)" }}>
                <h2 className="text-center mb-4 fw-bold" style={{ color: "#4a5568" }}>
                  {isLogin ? "Welcome Back" : "Join Us"}
                </h2>

                <Button
                  variant="outline-secondary"
                  className="w-100 mb-2 py-2 d-flex align-items-center justify-content-center"
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
                  <span className="mx-3 text-muted small">or continue with email</span>
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

                  <Form.Group className="mb-4" controlId="formPassword">
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

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-2 mb-3"
                    style={{
                      borderRadius: "12px",
                      background: "linear-gradient(135deg,rgb(104, 101, 255) 0%, #5a6ee1 100%)",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(106, 142, 251, 0.3)"
                    }}
                  >
                    {isLogin ? "Sign In" : "Create Account"}
                  </Button>

                  <div className="text-center mt-3">
                    <Button
                      variant="link"
                      onClick={() => setIsLogin(!isLogin)}
                      className="p-0 text-decoration-none"
                      style={{ color: "#5a6ee1" }}
                    >
                      {isLogin ? "New here? Create an account" : "Already have an account? Sign in"}
                    </Button>
                  </div>
                </Form>

                <p className="text-muted text-center mt-4" style={{ fontSize: "0.75rem" }}>
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}