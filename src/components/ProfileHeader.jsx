import React, { useState, useContext } from "react";
import { Container, Row, Col, Image, Badge, Button, Spinner, Form } from "react-bootstrap";
import { AuthContext } from "./AuthProvider";
import ManualLogModal from "./ManualLogModal";

export default function ProfileHeader({ logs }) {
    const [showModal, setShowModal] = useState(false);
    const { currentUser, createOrUpdateUserProfile } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);

    const [profileData, setProfileData] = useState({
        name: "",
        gender: "",
        age: "",
        location: "",
        profile_pic_url: ""
    });

    const handleEditToggle = () => {
        if (!editMode) {
            setProfileData({
                name: currentUser?.name || "",
                gender: currentUser?.gender || "",
                age: currentUser?.age || "",
                location: currentUser?.location || "",
                profile_pic_url: currentUser?.profile_pic_url || ""
            });
        }
        setEditMode(!editMode);
        setError(null);
    };

    const handleManualLog = () => {
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setProfileData(prev => ({
                ...prev,
                profile_pic_url: URL.createObjectURL(selectedFile)
            }));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);

        try {
            await createOrUpdateUserProfile(profileData, file);
            setEditMode(false);
        } catch (err) {
            console.error("Error updating profile:", err);
            setError("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditMode(false);
        setError(null);
        setFile(null);
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
                        <p className="mt-2 text-muted">Updating profile...</p>
                    </div>
                ) : (
                    <Row className="align-items-center">
                        <Col md={2} className="text-center">
                            <div className="avatar-container position-relative">
                                {editMode ? (
                                    <>
                                        <Image
                                            src={profileData.profile_pic_url || "/default-avatar.png"}
                                            roundedCircle
                                            className="mb-2 shadow-sm"
                                            style={{
                                                width: '110px',
                                                height: '110px',
                                                objectFit: 'cover',
                                                backgroundColor: '#f8f9fa'
                                            }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/default-avatar.png";
                                            }}
                                        />
                                        <div className="mt-2">
                                            <Form.Group>
                                                <Form.Label className="btn btn-sm btn-outline-primary">
                                                    <i className="bi bi-camera me-1"></i>
                                                    Change Photo
                                                    <Form.Control
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        style={{ display: 'none' }}
                                                    />
                                                </Form.Label>
                                            </Form.Group>
                                        </div>
                                    </>
                                ) : (
                                    <Image
                                        src={currentUser.profile_pic_url || "/default-avatar.png"}
                                        roundedCircle
                                        className="mb-2 shadow-sm"
                                        style={{
                                            width: '110px',
                                            height: '110px',
                                            objectFit: 'cover',
                                            backgroundColor: '#f8f9fa'
                                        }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/default-avatar.png";
                                        }}
                                    />
                                )}
                            </div>
                        </Col>
                        <Col md={7}>
                            {editMode ? (
                                <Form>
                                    {error && (
                                        <div className="alert alert-danger py-2" role="alert">
                                            {error}
                                        </div>
                                    )}
                                    <Form.Group className="mb-2">
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleInputChange}
                                            placeholder="Name"
                                            style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <div className="input-group input-group-sm">
                                            <span className="input-group-text bg-light">
                                                <i className="bi bi-geo-alt text-primary"></i>
                                            </span>
                                            <Form.Control
                                                type="text"
                                                name="location"
                                                value={profileData.location}
                                                onChange={handleInputChange}
                                                placeholder="Location"
                                                size="sm"
                                            />
                                        </div>
                                    </Form.Group>
                                    <input
                                        type="hidden"
                                        name="age"
                                        value={profileData.age}
                                    />
                                    <input
                                        type="hidden"
                                        name="gender"
                                        value={profileData.gender}
                                    />
                                    <div className="mt-3">
                                        <Button
                                            variant="light"
                                            size="sm"
                                            onClick={handleCancel}
                                            className="me-2"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={handleSave}
                                        >
                                            <i className="bi bi-check2 me-1"></i>
                                            Save Changes
                                        </Button>
                                    </div>
                                </Form>
                            ) : (
                                <>
                                    <div className="ms-3 d-flex align-items-center">
                                        <h3 className="fw-bold mb-2 me-2">{currentUser.name || "Journal Owner"}</h3>
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            className="rounded-pill"
                                            onClick={handleEditToggle}
                                        >
                                            <i className="bi bi-pencil-square me-1"></i>
                                            Edit Profile
                                        </Button>
                                    </div>
                                    <div className="ms-3 d-flex flex-column">
                                        {renderProfileItem("Location", currentUser.location, "geo-alt")}
                                        <div className="mt-2">
                                            <Badge bg="light" text="dark" className="px-2 py-1 border">
                                                <i className="bi bi-journal-text me-1"></i>
                                                {logs.length} Mood Journal{logs.length !== 1 ? 's' : ''}
                                            </Badge>
                                        </div>
                                    </div>
                                </>
                            )}
                        </Col>
                        <Col md={3} className="mt-3 text-end">
                            <Button
                                variant="primary"
                                className="rounded-pill px-3 text-white"
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