import React, { useState, useContext } from "react";
import { Container, Row, Col, Image, Badge, Button, Spinner, Form } from "react-bootstrap";
import { AuthContext } from "./AuthProvider";
import ManualLogModal from "./ManualLogModal";
import { updateProfile } from "firebase/auth"; // Assuming you're using Firebase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Assuming Firebase storage
import { doc, updateDoc } from "firebase/firestore"; // Assuming Firestore

export default function ProfileHeader({ logs, firestore, storage }) {
    const [showModal, setShowModal] = useState(false);
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    // Edit mode states
    const [editingInfo, setEditingInfo] = useState(false);
    const [editingImage, setEditingImage] = useState(false);

    // Temporary values for editing
    const [tempName, setTempName] = useState("");
    const [tempLocation, setTempLocation] = useState("");
    const [tempImageFile, setTempImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleManualLog = () => {
        setShowModal(true);
    };

    // Start editing info
    const startEditingInfo = () => {
        setTempName(currentUser.name || "");
        setTempLocation(currentUser.location || "");
        setEditingInfo(true);
    };

    // Save user info changes
    const saveUserInfo = async () => {
        try {
            setLoading(true);

            // Update in Firestore
            const userRef = doc(firestore, "users", currentUser.uid);
            await updateDoc(userRef, {
                name: tempName,
                location: tempLocation
            });

            // Update local state
            setCurrentUser({
                ...currentUser,
                name: tempName,
                location: tempLocation
            });

            setEditingInfo(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile information");
        } finally {
            setLoading(false);
        }
    };

    // Cancel info editing
    const cancelInfoEdit = () => {
        setEditingInfo(false);
    };

    // Handle image selection
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setTempImageFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);

            setEditingImage(true);
        }
    };

    // Save profile image
    const saveProfileImage = async () => {
        if (!tempImageFile) return;

        try {
            setUploadingImage(true);

            // Upload to Firebase Storage
            const storageRef = ref(storage, `profile_pics/${currentUser.uid}`);
            await uploadBytes(storageRef, tempImageFile);

            // Get download URL
            const downloadURL = await getDownloadURL(storageRef);

            // Update in Firestore
            const userRef = doc(firestore, "users", currentUser.uid);
            await updateDoc(userRef, {
                profile_pic_url: downloadURL
            });

            // Update local state
            setCurrentUser({
                ...currentUser,
                profile_pic_url: downloadURL
            });

            setEditingImage(false);
            setImagePreview(null);
            setTempImageFile(null);
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to update profile image");
        } finally {
            setUploadingImage(false);
        }
    };

    // Cancel image edit
    const cancelImageEdit = () => {
        setEditingImage(false);
        setImagePreview(null);
        setTempImageFile(null);
    };

    const renderProfileItem = (label, value, icon) => {
        return value ? (
            <div className="d-flex align-items-center mb-2">
                <i className={`bi bi-${icon} me-2 text-primary`}></i>
                <span className="fw-bold me-2" style={{ fontSize: '0.9rem', color: '#5a6a74' }}>{label}:</span>
                <span style={{ color: '#5a6a74' }}>{value}</span>
            </div>
        ) : null;
    };

    if (!currentUser) {
        return (
            <div className="profile-header py-4 mb-4" style={{
                background: 'linear-gradient(to right, #e6f2ff, #d1e6ff)',
                borderBottom: '1px solid #b8d8ff'
            }}>
                <Container>
                    <div className="text-center p-4">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted">Loading profile...</p>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="profile-header py-4 mb-4" style={{
            background: 'linear-gradient(to right, #e6f2ff, #d1e6ff)',
            borderBottom: '1px solid #b8d8ff'
        }}>
            <Container>
                {loading ? (
                    <div className="text-center p-4">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted">Loading profile...</p>
                    </div>
                ) : (
                    <Row className="align-items-center">
                        {/* Profile Picture - Full Width on Mobile */}
                        <Col xs={12} md={2} className="text-center mb-3 mb-md-0">
                            <div className="avatar-container position-relative mx-auto" style={{ maxWidth: '120px' }}>
                                {editingImage ? (
                                    <>
                                        <Image
                                            src={imagePreview || currentUser.profile_pic_url || "/default-avatar.png"}
                                            roundedCircle
                                            className="mb-2 shadow-sm"
                                            style={{
                                                width: '110px',
                                                height: '110px',
                                                objectFit: 'cover',
                                                backgroundColor: '#f8f9fa'
                                            }}
                                        />
                                        <div className="mt-2">
                                            {uploadingImage ? (
                                                <Spinner animation="border" size="sm" />
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        className="me-1"
                                                        onClick={saveProfileImage}
                                                    >
                                                        <i className="bi bi-check"></i> Save
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={cancelImageEdit}
                                                    >
                                                        <i className="bi bi-x"></i> Cancel
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Image
                                            src={currentUser.profile_pic_url || "/default-avatar.png"}
                                            roundedCircle
                                            className="mb-2 shadow-sm"
                                            style={{
                                                width: '110px',
                                                height: '110px',
                                                objectFit: 'cover',
                                                border: '3px solid #fff',
                                                backgroundColor: '#f8f9fa'
                                            }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/default-avatar.png";
                                            }}
                                        />
                                        <div
                                            className="edit-avatar-overlay"
                                            style={{
                                                position: 'absolute',
                                                bottom: '15px',
                                                right: '0',
                                                left: '0',
                                                margin: 'auto',
                                                width: 'fit-content'
                                            }}
                                        >
                                            <label htmlFor="profile-pic-upload" className="btn btn-sm btn-light rounded-circle shadow-sm">
                                                <i className="bi bi-pencil"></i>
                                            </label>
                                            <input
                                                type="file"
                                                id="profile-pic-upload"
                                                className="d-none"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </Col>

                        {/* User Info */}
                        <Col xs={12} md={7} className="mb-3 mb-md-0">
                            {editingInfo ? (
                                <div>
                                    <Form.Group className="mb-2">
                                        <Form.Label className="fw-bold">Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tempName}
                                            onChange={(e) => setTempName(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-2 text-muted">
                                        <Form.Label className="fw-bold">Location</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tempLocation}
                                            onChange={(e) => setTempLocation(e.target.value)}
                                        />
                                    </Form.Group>
                                    <div>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="me-2"
                                            onClick={saveUserInfo}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <><Spinner animation="border" size="sm" /> Saving...</>
                                            ) : (
                                                <><i className="bi bi-check"></i> Save Changes</>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={cancelInfoEdit}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="d-flex align-items-center">
                                        <h3 className="fw-bold mb-2 fs-4 fs-md-3">{currentUser.name || "Journal Owner"}</h3>
                                        <Button
                                            variant="link"
                                            className="p-0 ms-2"
                                            onClick={startEditingInfo}
                                        >
                                            <i className="bi bi-pencil-square text-primary"></i>
                                        </Button>
                                    </div>
                                    <div className="d-flex flex-column">
                                        {renderProfileItem("Location", currentUser.location, "geo-alt")}
                                        <div className="mt-1">
                                            <Badge bg="light" text="dark" className="px-2 py-1 border">
                                                <i className="bi bi-journal-text me-1"></i>
                                                {logs.length} Mood Journal{logs.length !== 1 ? 's' : ''}
                                            </Badge>
                                        </div>
                                    </div>
                                </>
                            )}
                        </Col>

                        {/* Add Journal Button */}
                        <Col xs={12} md={3} className="text-center text-md-end">
                            <Button
                                variant="primary"
                                className="rounded-pill px-3 text-white w-100 w-md-auto"
                                onClick={handleManualLog}
                            >
                                <i className="bi bi-plus-lg me-1"></i>
                                New Mood Journal
                            </Button>
                        </Col>
                    </Row>
                )}
            </Container>

            <ManualLogModal
                show={showModal}
                onHide={() => setShowModal(false)}
                userId={currentUser.uid}
            />
        </div>
    );
}