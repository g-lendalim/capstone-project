import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, ProgressBar, Card } from 'react-bootstrap';

export default function WelcomeModal({ onComplete, show, onHide, initialProfileData = {} }) {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    name: initialProfileData.name || '',
    gender: initialProfileData.gender || '',
    age: initialProfileData.age || '',
    location: initialProfileData.location || '',
    profile_pic_url: initialProfileData.profile_pic_url || '',
  });
  const [file, setFile] = useState(null);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onComplete(profileData, file);
    onHide;
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProfileData((prev) => ({
        ...prev,
        profile_pic_url: URL.createObjectURL(selectedFile)
      }));
    }
  };

  const progress = (step / 3) * 100;

  const colors = {
    primary: '#6590b6',
    light: '#f7f9fb',
    accent: '#bcd1da',
    text: '#5a6a74'
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      size="lg"
      contentClassName="modal-content"
      style={{ background: 'transparent' }}
    >
      <div style={{ background: colors.light }}>
        <Modal.Header className="border-0 pb-0" style={{ background: colors.light }}>
          <div className="w-100">
            <ProgressBar
              now={progress}
              variant="info"
              className="mb-3"
              style={{ height: '8px', backgroundColor: '#e1e8ed' }}
            />
            <div className="d-flex justify-content-between small mb-2" style={{ color: colors.text }}>
              <span>Getting Started</span>
              <span>Profile Details</span>
              <span>Profile Picture</span>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body className="px-4 py-4" style={{ background: colors.light }}>
          {step === 1 && (
            <div className="text-center">
              <i className="bi bi-emoji-smile" style={{ fontSize: '4rem', color: colors.primary }}></i>
              <h2 className="mt-3 mb-3 fw-bold" style={{ color: colors.text }}>Welcome to Your Wellness Journey</h2>
              <p className="mt-4 mb-5" style={{ color: colors.text }}>
                We're so glad you're here. Taking care of your mental wellbeing is an important step,
                and we're honored to be part of your journey. Let's set up your profile now!
              </p>
              <div className="d-flex justify-content-center gap-3 mt-4">
                <Button variant="light" onClick={onHide}>
                  Maybe Later
                </Button>
                <Button style={{ backgroundColor: colors.primary, borderColor: colors.primary }} onClick={handleNext} size="lg">
                  Let's Begin <i className="bi bi-arrow-right-short"></i>
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="mb-4 fw-bold" style={{ color: colors.text }}>
                <i className="bi bi-person-circle me-2" style={{ color: colors.primary }}></i>
                Tell Us About Yourself
              </h3>
              <p style={{ color: colors.text }} className="mb-4">
                This information helps us personalize your experience. Your data is kept private and secure.
              </p>
              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: colors.text }}>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        placeholder="How would you like to be called?"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: colors.text }}>Age</Form.Label>
                      <Form.Control
                        type="number"
                        name="age"
                        value={profileData.age}
                        onChange={handleInputChange}
                        placeholder={"Enter your age"}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: colors.text }}>Gender</Form.Label>
                      <Form.Select
                        name="gender"
                        value={profileData.gender}
                        onChange={handleInputChange}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: colors.text }}>Location</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={profileData.location}
                        onChange={handleInputChange}
                        placeholder="City"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
              <div className="d-flex justify-content-between mt-4">
                <Button variant="outline-secondary" onClick={handleBack}>
                  <i className="bi bi-arrow-left-short"></i> Back
                </Button>
                <Button
                  style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
                  onClick={handleNext}
                >
                  Continue <i className="bi bi-arrow-right-short"></i>
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <i className="bi bi-camera" style={{ fontSize: '3rem', color: colors.primary }}></i>
              <h3 className="mt-3 mb-3 fw-bold" style={{ color: colors.text }}>Add a Profile Picture</h3>
              <p style={{ color: colors.text }} className="mb-4">
                Adding a photo helps personalize your experience, but it's completely optional.
              </p>

              <Card className="p-4 mx-auto" style={{ maxWidth: '300px', backgroundColor: '#f8fafc', borderColor: colors.accent }}>
                {profileData.profile_pic_url ? (
                  <div className="position-relative mb-3">
                    <img
                      src={profileData.profile_pic_url}
                      alt="Profile preview"
                      className="rounded-circle mx-auto d-block"
                      style={{ width: '150px', height: '150px', objectFit: 'cover', border: `3px solid ${colors.accent}` }}
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="position-absolute"
                      style={{ top: '5px', right: '5px', borderRadius: '50%', padding: '0.25rem 0.5rem' }}
                      onClick={() => {
                        setProfileData(prev => ({ ...prev, profile_pic_url: '' }));
                        setFile(null);
                      }}
                    >
                      <i className="bi bi-x"></i>
                    </Button>
                  </div>
                ) : (
                  <div
                    className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                    style={{ width: '150px', height: '150px', backgroundColor: colors.accent, opacity: 0.4 }}
                  >
                    <i className="bi bi-person" style={{ fontSize: '4rem', color: colors.text }}></i>
                  </div>
                )}

                <Form.Group className="mb-3">
                  <Form.Label className="btn btn-outline-secondary d-block">
                    <i className="bi bi-upload me-2"></i>
                    {profileData.profile_pic_url ? 'Change Photo' : 'Upload Photo'}
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </Form.Label>
                </Form.Group>
              </Card>

              <div className="d-flex justify-content-between mt-4">
                <Button variant="outline-secondary" onClick={handleBack}>
                  <i className="bi bi-arrow-left-short"></i> Back
                </Button>
                <Button style={{ backgroundColor: colors.primary, borderColor: colors.primary }} onClick={handleNext}>
                  Complete Profile <i className="bi bi-check2"></i>
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-2 pb-3" style={{ backgroundColor: colors.light }}>
          <div className="w-100 text-center small" style={{ color: colors.text }}>
            <p className="mb-0">
              <i className="bi bi-shield-lock me-1"></i>
              Your information is kept private and secure
            </p>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
}