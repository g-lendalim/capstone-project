import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, ProgressBar } from "react-bootstrap";
import api from "../api";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ManualLogModal({ show, onHide, userId }) {
  const [step, setStep] = useState(1);
  const [coreLogs, setCoreLogs] = useState({
    mood: 0,
    energy_level: 0,
    sleep_log: {
      sleep_hours: 0,
      sleep_quality: 0,
      night_awakenings: 0,
    },
    medication_taken: false,
    journal: "",
  });

  const [extendedLogs, setExtendedLogs] = useState({
    lifestyle_factors: {
      social_interaction_level: "",
      physical_activity_level: "",
      screen_time_minutes: 0,
    },
    gratitude_entry: "",
    image_url: "",
  });

  const navigate = useNavigate();

  const handleImageUpload = async (file) => {
    const imageRef = ref(storage, `logs/${file.name}`);
    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);
    setExtendedLogs((prev) => ({ ...prev, image_url: url }));
  };

  const handleSubmit = async () => {
    const payload = {
      user_id: userId,
      created_at: new Date().toISOString(),
      ...coreLogs,
      ...extendedLogs,
    };

    try {
      await api.post("/logs", payload);
      return true;
    } catch (err) {
      console.error("Log error", err);
      return false;
    }
  };

  const onSubmitLog = async () => {
    const success = await handleSubmit();
    if (success) {
      resetForm();
      onHide();
      navigate("/profile");
    }
  };

  const resetForm = () => {
    setStep(1);
    setCoreLogs({
      mood: 0,
      energy_level: 0,
      sleep_log: {
        sleep_hours: 0,
        sleep_quality: 0,
        night_awakenings: 0,
      },
      medication_taken: false,
      journal: "",
    });
    setExtendedLogs({
      lifestyle_factors: {
        social_interaction_level: "",
        physical_activity_level: "",
        screen_time_minutes: 0,
      },
      gratitude_entry: "",
      image_url: "",
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h5>Step 1: Mood and Energy</h5>
            <p className="text-muted">Take a moment to reflect on how you're feeling right now.</p>
            <Form.Group>
              <Form.Label>🧠 How’s your mood right now?</Form.Label>
              <Form.Range
                min={0}
                max={10}
                value={coreLogs.mood}
                onChange={(e) =>
                  setCoreLogs({ ...coreLogs, mood: parseInt(e.target.value) })
                }
              />
              <Form.Text>{coreLogs.mood}/10</Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Label>⚡ Energy Level</Form.Label>
              <Form.Range
                min={0}
                max={10}
                value={coreLogs.energy_level}
                onChange={(e) =>
                  setCoreLogs({ ...coreLogs, energy_level: parseInt(e.target.value) })
                }
              />
              <Form.Text>{coreLogs.energy_level}/10</Form.Text>
            </Form.Group>

            <div className="mt-3 d-flex justify-content-end">
              <Button onClick={() => setStep(2)}>Next</Button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h5>Step 2: Sleep and Rest</h5>
            <p className="text-muted">Let’s log your sleep details.</p>
            <Form.Group>
              <Form.Label>😴 Hours Slept</Form.Label>
              <Form.Control
                type="number"
                value={coreLogs.sleep_log.sleep_hours}
                onChange={(e) =>
                  setCoreLogs({
                    ...coreLogs,
                    sleep_log: {
                      ...coreLogs.sleep_log,
                      sleep_hours: parseInt(e.target.value),
                    },
                  })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>💤 Sleep Quality</Form.Label>
              <Form.Range
                min={0}
                max={10}
                value={coreLogs.sleep_log.sleep_quality}
                onChange={(e) =>
                  setCoreLogs({
                    ...coreLogs,
                    sleep_log: {
                      ...coreLogs.sleep_log,
                      sleep_quality: parseInt(e.target.value),
                    },
                  })
                }
              />
              <Form.Text>{coreLogs.sleep_log.sleep_quality}/10</Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Label>🌙 Night Awakenings</Form.Label>
              <Form.Control
                type="number"
                value={coreLogs.sleep_log.night_awakenings}
                onChange={(e) =>
                  setCoreLogs({
                    ...coreLogs,
                    sleep_log: {
                      ...coreLogs.sleep_log,
                      night_awakenings: parseInt(e.target.value),
                    },
                  })
                }
              />
            </Form.Group>

            <div className="mt-3 d-flex justify-content-between">
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)}>Next</Button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h5>Step 3: Lifestyle</h5>
            <p className="text-muted">Let’s log your lifestyle details.</p>
            <Form.Group>
              <Form.Label>👥 Social Interaction</Form.Label>
              <Form.Select
                value={extendedLogs.lifestyle_factors.social_interaction_level}
                onChange={(e) =>
                  setExtendedLogs({
                    ...extendedLogs,
                    lifestyle_factors: {
                      ...extendedLogs.lifestyle_factors,
                      social_interaction_level: e.target.value,
                    },
                  })
                }
              >
                <option value="">Select</option>
                <option value="none">Kept to myself</option>
                <option value="low">A little socializing</option>
                <option value="medium">Meaningful interactions</option>
                <option value="high">Very social today</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>🏃 Physical Activity</Form.Label>
              <Form.Select
                value={extendedLogs.lifestyle_factors.physical_activity_level}
                onChange={(e) =>
                  setExtendedLogs({
                    ...extendedLogs,
                    lifestyle_factors: {
                      ...extendedLogs.lifestyle_factors,
                      physical_activity_level: e.target.value,
                    },
                  })
                }
              >
                <option value="">Select</option>
                <option value="none">Rest day</option>
                <option value="light">Light movement</option>
                <option value="moderate">Some activity</option>
                <option value="intense">Very active</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>📱 Screen Time (minutes)</Form.Label>
              <Form.Control
                type="number"
                value={extendedLogs.lifestyle_factors.screen_time_minutes}
                onChange={(e) =>
                  setExtendedLogs({
                    ...extendedLogs,
                    lifestyle_factors: {
                      ...extendedLogs.lifestyle_factors,
                      screen_time_minutes: parseInt(e.target.value),
                    },
                  })
                }
              />
            </Form.Group>

            <div className="mt-3 d-flex justify-content-between">
              <Button variant="secondary" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={() => setStep(4)}>Next</Button>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h5>Step 4: Reflection</h5>
            <p className="text-muted">Let’s reflect on your day.</p>
            <Form.Group className="mb-3">
              <Form.Label>💊 Did you take your medication today?</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Yes"
                  name="medicationTaken"
                  id="medicationYes"
                  checked={coreLogs.medication_taken === true}
                  onChange={() =>
                    setCoreLogs({ ...coreLogs, medication_taken: true })
                  }
                />
                <Form.Check
                  inline
                  type="radio"
                  label="No"
                  name="medicationTaken"
                  id="medicationNo"
                  checked={coreLogs.medication_taken === false}
                  onChange={() =>
                    setCoreLogs({ ...coreLogs, medication_taken: false })
                  }
                />
              </div>
            </Form.Group>

            {coreLogs.medication_taken && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>💬 Optional notes about your medication</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="E.g., new dosage, side effects, skipped dose yesterday..."
                    value={extendedLogs.medication_details}
                    onChange={(e) =>
                      setExtendedLogs({
                        ...extendedLogs,
                        medication_details: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </>
            )}

            <Form.Group className="mt-3">
              <Form.Label>📝 Journal Entry</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write anything you’d like to reflect on…"
                value={coreLogs.journal}
                onChange={(e) =>
                  setCoreLogs({ ...coreLogs, journal: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>🌈 Gratitude Entry</Form.Label>
              <Form.Control
                type="text"
                placeholder="What made you smile today?"
                value={extendedLogs.gratitude_entry}
                onChange={(e) =>
                  setExtendedLogs({ ...extendedLogs, gratitude_entry: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>📸 Upload a photo from your day</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    await handleImageUpload(file);
                  }
                }}
              />
              {extendedLogs.image_url && (
                <div className="mt-3">
                  <img
                    src={extendedLogs.image_url}
                    alt="Uploaded"
                    style={{ maxWidth: "100%", borderRadius: "8px" }}
                  />
                </div>
              )}
            </Form.Group>

            <div className="mt-3 d-flex justify-content-between">
              <Button variant="secondary" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button variant="primary" onClick={onSubmitLog}>
                Submit Log
              </Button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal show={show} onHide={() => { onHide(); setStep(1); }} centered>
      <Modal.Header closeButton>
        <Modal.Title>Check-In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ProgressBar now={(step / 4) * 100} className="mb-3" />
        {renderStep()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => { onHide(); setStep(1); }}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}