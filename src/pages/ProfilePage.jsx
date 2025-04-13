import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap';
import { getAuth } from "firebase/auth";
import { AuthContext } from "../components/AuthProvider";

export default function ProfilePage() {
    const auth = getAuth();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);

    if (!currentUser) {
        navigate("/login"); 
    }
    
    const handleLogout = () => {
        auth.signOut();
    };

    return (
        <>
            <Button onClick={handleLogout}>Logout</Button>
        </>
    )
}