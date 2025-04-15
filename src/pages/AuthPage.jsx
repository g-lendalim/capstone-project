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
  Col
} from "react-bootstrap";
import api from "../api";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const { currentUser } = useContext(AuthContext);

  const createUserInDatabase = async (token) => {
    try {
      localStorage.setItem('token', token); // ✅ Save for interceptor
      console.log("🔥 Firebase ID Token:", token);
      await api.post("/api/users", {}); // token already auto-attached by interceptor
    } catch (error) {
      console.error("Error inserting user into DB:", error);
    }
  };  

  useEffect(() => {
    if (currentUser) navigate("/profile");
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
      await createUserInDatabase(token); // ✅ pass the token
  
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
  

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              
              <Button 
                variant="outline-secondary" 
                className="w-100 mb-3 d-flex align-items-center justify-content-center"
                onClick={handleGoogleAuth}
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
                <hr className="flex-grow-1" />
                <span className="mx-3 text-muted">or</span>
                <hr className="flex-grow-1" />
              </div>
              
              <Form onSubmit={handleAuth}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 py-2 rounded-pill"
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </Button>
              </Form>
              
              <div className="text-center mt-3">
                <Button 
                  variant="link" 
                  onClick={() => setIsLogin(!isLogin)}
                  className="p-0"
                >
                  {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
                </Button>
              </div>
              
              <p className="text-muted text-center mt-4" style={{ fontSize: "0.8rem" }}>
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}