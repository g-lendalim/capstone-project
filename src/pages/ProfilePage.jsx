import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap';
import { getAuth } from "firebase/auth";
import { AuthContext } from "../components/AuthProvider";
import ManualLogModal from "../components/ManualLogModal";

export default function ProfilePage() {
    const auth = getAuth();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [ showModal, setShowModal ] = useState(false);

    if (!currentUser) {
        navigate("/login"); 
    }
    
    const handleLogout = () => {
        auth.signOut();
    };

    const handleManualLog = () => {
        setShowModal(true);
    };

    return (
        <>
            <Button onClick={handleLogout}>Logout</Button>
            <Button onClick={handleManualLog}>Click here to check in today</Button>

            <ManualLogModal 
                show = {showModal}
                onHide ={setShowModal}
                userId = {currentUser.uid} 
            />
        </>
    )
}