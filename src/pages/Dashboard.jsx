import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getMoodEmoji, getMoodLabel } from '../hooks/logLabels';
import services from '../hooks/support';
import { AuthContext } from "../components/AuthProvider";
import WelcomeModal from "../components/WelcomeModal";
import ManualLogModal from "../components/ManualLogModal";
import DailyStreaksLog from '../components/DailyStreaksLog';
import '../css/Dashboard.css';
import api from "../api";

export default function Dashboard() {
  const { currentUser, createOrUpdateUserProfile, profileExists, loading, isProfileComplete } = useContext(AuthContext);

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = today.toLocaleDateString('en-US', options);

  const [showModal, setShowModal] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);

  const initialProfileData = {
    name: currentUser?.name || '',
    gender: currentUser?.gender || '',
    age: currentUser?.age || '',
    location: currentUser?.location || '',
    profile_pic_url: currentUser?.profile_pic_url || ''
  };

  const handleCompleteProfile = async (profileData, file) => {
    try {
      await createOrUpdateUserProfile(profileData, file);
      setShowWelcomeModal(false);
      setSuccessMessage("Profile data successfully saved.");
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
    }
  };

  useEffect(() => {
    if (!isProfileComplete) {
      setShowWelcomeModal(true);
    }
  }, [isProfileComplete]);

  const handleManualLog = () => {
    setShowModal(true);
  };

  const quotes = [
    "Every step forward matters. You're already showing courage by being here.",
    "Small progress is still progress.",
    "You don't have to see the whole staircase, just take the first step.",
    "Growth happens one moment at a time."
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const moodOptions = [
    { value: 0, emoji: getMoodEmoji(0), label: getMoodLabel(0) },
    { value: 1, emoji: getMoodEmoji(1), label: getMoodLabel(1) },
    { value: 2, emoji: getMoodEmoji(2), label: getMoodLabel(2) },
    { value: 3, emoji: getMoodEmoji(3), label: getMoodLabel(3) },
    { value: 4, emoji: getMoodEmoji(4), label: getMoodLabel(4) },
    { value: 5, emoji: getMoodEmoji(5), label: getMoodLabel(5) },
    { value: 6, emoji: getMoodEmoji(6), label: getMoodLabel(6) },
    { value: 7, emoji: getMoodEmoji(7), label: getMoodLabel(7) },
    { value: 8, emoji: getMoodEmoji(8), label: getMoodLabel(8) },
    { value: 9, emoji: getMoodEmoji(9), label: getMoodLabel(9) },
    { value: 10, emoji: getMoodEmoji(10), label: getMoodLabel(10) }
  ];

  const toolkitItems = [
    { icon: "journal", label: "Journal", path: "/profile", color: "#6a9bcc" },
    { icon: "alarm", label: "Alarms", path: "/alarm", color: "#ff9f7f" },
    { icon: "people", label: "Support", path: "/support", color: "#8a6de9" },
    { icon: "wind", label: "Breathe", path: "/coping", color: "#6dcbb9" },
    { icon: "person-heart", label: "Contact", path: "/contact", color: "#ffcd56" },
    { icon: "thermometer-high", label: "Emergency", path: "/emergency", color: "#78c2ad" }
  ];

  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);
  };

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser?.uid) {
        try {
          const response = await api.get(`/contacts/user/${currentUser.uid}`);
          setContacts(response.data);
        } catch (err) {
          console.error("Error fetching contacts:", err);
          setError("Failed to fetch contacts.");
        }
      }
    };

    fetchContacts();
  }, [currentUser]);

  return (
    <div className="dashboard-container pb-5 mb-5">
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      {!isProfileComplete && showWelcomeModal && <WelcomeModal onComplete={handleCompleteProfile} show={showWelcomeModal} onHide={() => setShowWelcomeModal(false)} initialProfileData={initialProfileData} />}
      <Container className="py-5">
        <section className="mb-4 header-section">
          <div className="greeting">
            <h1 className="fw-bold">Welcome, {currentUser.name || "dear"}!</h1>
            <p className="text-muted">{dateString}</p>
          </div>

          <p className="quote fst-italic text-muted ps-3 border-start border-4 border-primary">
            "{randomQuote}"
          </p>
        </section>

        {/* Card for mood tracking */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body className="text-center py-4">
            <h5 className="mb-3">How are you feeling today?</h5>
            <div className="mood-grid">
              {moodOptions.map((mood, index) => (
                <div
                  key={index}
                  className={`mood-option ${currentMood === mood.value ? 'selected' : ''}`}
                  onClick={() => handleMoodSelect(mood.value)}
                >
                  <div className="d-flex flex-column align-items-center">
                    <span className="mood-emoji fs-3 mb-1">{mood.emoji}</span>
                    <span className="mood-label small">{mood.label}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="primary"
              className="px-4 rounded-pill mt-3"
              onClick={handleManualLog}
            >
              Check In
            </Button>
            <ManualLogModal
              show={showModal}
              onHide={() => setShowModal(false)}
              userId={currentUser?.uid}
              currentMood={currentMood}
              setCurrentMood={setCurrentMood}
            />
          </Card.Body>
        </Card>

        {/* Weekly Streaks */}
        {currentUser?.uid && <DailyStreaksLog userId={currentUser.uid} />}

        {/* Toolkit Section */}
        <div className="section-header d-flex align-items-center mb-3">
          <i className="bi bi-tools me-2" style={{ color: "#5a6e8c" }}></i>
          <h5 className="mb-0" style={{ color: "#5a6e8c" }}>Your Toolkit</h5>
        </div>

        <Row className="g-3 mb-4">
          {toolkitItems.map((item, index) => (
            <Col xs={6} md={4} key={index}>
              <Card
                as={Link}
                to={item.path}
                className="border-0 shadow-sm toolkit-card h-100 text-decoration-none"
                style={{
                  borderRadius: "16px",
                  transition: "all 0.2s ease-in-out"
                }}
              >
                <Card.Body className="text-center py-3">
                  <div
                    className="toolkit-icon-container mx-auto mb-2 text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: item.color,
                      boxShadow: `0 4px 10px rgba(0, 0, 0, 0.1)`
                    }}
                  >
                    <i className={`bi bi-${item.icon}`}></i>
                  </div>
                  <h6 className="toolkit-label mb-0 fs-6" style={{ color: "#4a5568" }}>{item.label}</h6>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Support Services */}
        <div className="section-header d-flex align-items-center mb-3">
          <i className="bi bi-people fs-5 me-2" style={{ color: "#5a6e8c" }}></i>
          <h5 className="mb-0" style={{ color: "#5a6e8c" }}>Support</h5>
        </div>

        <Col xs={12} >
          <Card className="border-0 shadow-sm mb-3" style={{ borderRadius: "16px" }}>
            <Card.Body className="p-4">
              {/* Service support item */}
              <div className="support-item d-flex align-items-center">
                <div
                  className="support-icon me-3 rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "46px",
                    height: "46px",
                    backgroundColor: "rgba(220, 53, 69, 0.1)",
                    color: "#dc3545"
                  }}
                >
                  <i className={`bi bi-${services[0].icon || 'telephone'} fs-4`}></i>
                </div>
                <div className="support-info flex-grow-1">
                  <h6 className="mb-0">{services[0].name}</h6>
                  <Badge bg="light" text="dark" className="me-2">Emergency</Badge>
                </div>
                <Button
                  sm={12}
                  variant="danger"
                  className="rounded-pill px-3"
                  onClick={() => window.location.href = `tel:${services[0].phone}`}
                >
                  <i className="bi bi-telephone-fill me-2"></i>
                  Call
                </Button>
              </div>
            </Card.Body>
          </Card>

          {contacts && contacts.length > 0 && (
            <Card className="border-0 shadow-sm" style={{ borderRadius: "16px" }}>
              <Card.Body className="p-4">
                {/* Personal contact support item */}
                <div className="support-item d-flex align-items-center">
                  <div
                    className="support-icon me-3 rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "46px",
                      height: "46px",
                      backgroundColor: "rgba(138, 109, 233, 0.1)",
                      color: "#8a6de9"
                    }}
                  >
                    <i className="bi bi-person-heart fs-4"></i>
                  </div>
                  <div className="support-info flex-grow-1">
                    <h6 className="mb-0">{contacts[0].name}</h6>
                    <Badge bg="light" text="dark" className="me-2">Personal Contact</Badge>
                  </div>
                  <Button
                    sm={12}
                    variant="primary"
                    className="rounded-pill px-3"
                    style={{
                      background: "linear-gradient(135deg, #8a6de9 0%, #6a55c2 100%)",
                      border: "none"
                    }}
                    onClick={() => window.location.href = `tel:${contacts[0].phone}`}
                  >
                    <i className="bi bi-telephone-fill me-2"></i>
                    Call
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Container>
    </div>
  );
}