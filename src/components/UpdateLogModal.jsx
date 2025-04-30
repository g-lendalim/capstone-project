import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Tab, Tabs, Alert } from "react-bootstrap";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getMoodEmoji, getMoodLabel, getEnergyEmoji, getEnergyLabel, getAnxietyEmoji, getAnxietyLabel, getIrritabilityEmoji, getIrritabilityLabel, getStressEmoji, getStressLabel, getSleepQualityEmoji, getSleepQualityLabel } from "../hooks/logLabels";

export default function UpdateLogModal({ show, onHide, logData, onUpdate }) {
  const [updatedLog, setUpdatedLog] = useState({ ...logData });
  const [activeTab, setActiveTab] = useState("core");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (show && logData) {
      setUpdatedLog({ ...logData });
      setSuccessMessage("");
      setErrorMessage("");
    }
  }, [show, logData]);

  const handleImageUpload = async (file) => {
    const imageRef = ref(storage, `logs/${file.name}`);
    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);
    setUpdatedLog({ ...updatedLog, image_url: url });
  };

  const handleSubmit = async () => {
    if (onUpdate) {
      await onUpdate(updatedLog.id, updatedLog, null);
    }
  };


  const handleChange = (section, field, value) => {
    if (section) {
      setUpdatedLog({
        ...updatedLog,
        [section]: {
          ...(updatedLog[section] || {}),
          [field]: value
        }
      });
    } else {
      setUpdatedLog({
        ...updatedLog,
        [field]: value
      });
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Log</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {successMessage && (
          <Alert variant="success" className="mb-3">
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert variant="danger" className="mb-3">
            {errorMessage}
          </Alert>
        )}

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
          fill
        >
          <Tab eventKey="core" title="Mood & Energy">
            <div className="p-2">
              {/* Mood Section */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium" style={{ color: "#f06595" }}>
                  <span style={{ fontSize: "18px", marginRight: "8px" }}>🧠</span>
                  How's your mood right now?
                </Form.Label>
                <div className="position-relative mb-2">
                  <Form.Range
                    min={0}
                    max={10}
                    value={updatedLog.mood || 0}
                    onChange={(e) => handleChange(null, "mood", parseInt(e.target.value))}
                    className="mb-1"
                  />
                  <div className="d-flex justify-content-between mb-2">
                    <small className="text-muted">0</small>
                    <small className="text-muted">10</small>
                  </div>
                </div>
                <div className="text-center mt-3 mb-2">
                  <div style={{ fontSize: "1.2rem" }}>
                    {getMoodEmoji(updatedLog.mood)} {getMoodLabel(updatedLog.mood)}
                  </div>
                  <div className="text-muted small">{updatedLog.mood}/10</div>
                </div>
              </Form.Group>

              {/* Energy Section */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium" style={{ color: "#4dabf7" }}>
                  <span style={{ fontSize: "20px", marginRight: "4px" }}>⚡</span>
                  How energized do you feel today?
                </Form.Label>
                <div className="position-relative mb-2">
                  <Form.Range
                    min={0}
                    max={10}
                    value={updatedLog.energy_level || 0}
                    onChange={(e) => handleChange(null, "energy_level", parseInt(e.target.value))}
                    className="mb-1"
                  />
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">0</small>
                    <small className="text-muted">10</small>
                  </div>
                </div>
                <div className="text-center mt-3 mb-2">
                  <div style={{ fontSize: "2rem" }}>{getEnergyEmoji(updatedLog.energy_level)}</div>
                  <div className="mt-1 fw-medium">{getEnergyLabel(updatedLog.energy_level)}</div>
                  <div className="text-muted small">{updatedLog.energy_level}/10</div>
                </div>
              </Form.Group>
            </div>
          </Tab>

          <Tab eventKey="mind" title="Mind & Body">
            <div className="p-2">
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium" style={{ color: "#4c6ef5" }}>
                  <span style={{ fontSize: "18px", marginRight: "8px" }}>😰</span>
                  How anxious are you feeling?
                </Form.Label>
                <div className="position-relative mb-2">
                  <Form.Range
                    min={0}
                    max={10}
                    value={updatedLog.anxiety_level || 0}
                    onChange={(e) =>
                      handleChange(null, "anxiety_level", parseInt(e.target.value))
                    }
                  />
                  <div className="d-flex justify-content-between mb-2">
                    <small className="text-muted">0</small>
                    <small className="text-muted">10</small>
                  </div>
                  <div className="text-center mt-3 mb-2">
                    <div style={{ fontSize: "1.2rem" }}>
                      {getAnxietyEmoji(updatedLog.anxiety_level)} {getAnxietyLabel(updatedLog.anxiety_level)}
                    </div>
                    <div className="text-muted small">
                      {updatedLog.anxiety_level}/10
                    </div>
                  </div>
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-medium" style={{ color: "#f06595" }}>
                  <span style={{ fontSize: "18px", marginRight: "8px" }}>😤</span>
                  How irritable are you feeling?
                </Form.Label>
                <div className="position-relative mb-2">
                  <Form.Range
                    min={0}
                    max={10}
                    value={updatedLog.irritability_level || 0}
                    onChange={(e) =>
                      handleChange(null, "irritability_level", parseInt(e.target.value))
                    }
                  />
                  <div className="d-flex justify-content-between mb-2">
                    <small className="text-muted">0</small>
                    <small className="text-muted">10</small>
                  </div>
                  <div className="text-center mt-3 mb-2">
                    <div style={{ fontSize: "1.2rem" }}>
                      {getIrritabilityEmoji(updatedLog.irritability_level)} {getIrritabilityLabel(updatedLog.irritability_level)}
                    </div>
                    <div className="text-muted small">
                      {updatedLog.irritability_level}/10
                    </div>
                  </div>
                </div>
              </Form.Group>

              {/* Stress Level Tracker - Updated with emoji and label */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium" style={{ color: "#ff922b" }}>
                  <span style={{ fontSize: "18px", marginRight: "8px" }}>😓</span>
                  How stressed are you feeling?
                </Form.Label>
                <div className="position-relative mb-2">
                  <Form.Range
                    min={0}
                    max={10}
                    value={updatedLog.stress_level || 0}
                    onChange={(e) =>
                      handleChange(null, "stress_level", parseInt(e.target.value))
                    }
                  />
                  <div className="d-flex justify-content-between mb-2">
                    <small className="text-muted">0</small>
                    <small className="text-muted">10</small>
                  </div>
                  <div className="text-center mt-3 mb-2">
                    <div style={{ fontSize: "1.2rem" }}>
                      {getStressEmoji(updatedLog.stress_level)} {getStressLabel(updatedLog.stress_level)}
                    </div>
                    <div className="text-muted small">
                      {updatedLog.stress_level}/10
                    </div>
                  </div>
                </div>
              </Form.Group>
            </div>
          </Tab>

          <Tab eventKey="sleep" title="Sleep & Rest">
            <div className="p-2">
              {/* Sleep Hours */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium" style={{ color: "#f0ad4e" }}>
                  <span style={{ fontSize: "20px", marginRight: "8px" }}>😴</span>
                  How many hours did you sleep last night?
                </Form.Label>
                <Form.Control
                  type="number"
                  value={updatedLog.sleep_hours || ""}
                  onChange={(e) => handleChange(0, "sleep_hours", parseInt(e.target.value))}
                  className="py-2"
                />
              </Form.Group>

              {/* Sleep Quality */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium" style={{ color: "#6f42c1" }}>
                  <span style={{ fontSize: "20px", marginRight: "8px" }}>💤</span>
                  Rate your sleep quality
                </Form.Label>
                <div className="position-relative mb-2">
                  <Form.Range
                    min={0}
                    max={10}
                    value={updatedLog.sleep_quality || 0}
                    onChange={(e) => handleChange(null, "sleep_quality", parseInt(e.target.value))}
                    className="mb-1"
                  />
                  <div className="d-flex justify-content-between mb-2">
                    <small className="text-muted">0</small>
                    <small className="text-muted">10</small>
                  </div>
                </div>
                <div className="text-center mt-3 mb-2">
                  <div style={{ fontSize: "2rem" }}>
                    {getSleepQualityEmoji(updatedLog.sleep_quality)}
                  </div>
                  <div className="mt-1 fw-medium">
                    {getSleepQualityLabel(updatedLog.sleep_quality)}
                  </div>
                  <div className="text-muted small">{updatedLog.sleep_quality}/10</div>
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-medium d-flex align-items-center" style={{ color: "#20c997" }}>
                  <span style={{ fontSize: "20px", marginRight: "8px" }}>⏰</span>
                  <span>Sleep Disruptions</span>
                </Form.Label>
                <Form.Text muted className="d-block mb-2">
                  Number of times you woke up during the night
                </Form.Text>
                <Form.Control
                  type="number"
                  value={updatedLog.night_awakenings || 0}
                  onChange={(e) => handleChange(null, "night_awakenings", parseInt(e.target.value))}
                  className="py-2"
                />
              </Form.Group>
            </div>
          </Tab>

          <Tab eventKey="thoughts" title="Thought Patterns">
            <div className="p-2">
              {/* Cognitive Section */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium" style={{ color: "#4c6ef5" }}>
                  <span style={{ fontSize: "20px", marginRight: "8px" }}>🧠</span>
                  Mental Clarity
                </Form.Label>
                <div className="mt-2 d-flex align-items-center">
                  <Form.Check
                    type="switch"
                    id="clarity-switch-update"
                    checked={updatedLog.cognitive_clarity || false}
                    onChange={(e) => handleChange(null, "cognitive_clarity", e.target.checked)}
                    className="me-3"
                  />
                  <span style={{ color: updatedLog.cognitive_clarity ? "#4c6ef5" : "#6c757d" }}>
                    {updatedLog.cognitive_clarity
                      ? "✨ Focused and mentally sharp"
                      : "🌫️ Feeling a bit foggy today"}
                  </span>
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-medium" style={{ color: "#f783ac" }}>
                  <span style={{ fontSize: "20px", marginRight: "8px" }}>💭</span>
                  Current Mental State
                </Form.Label>
                <div className="mt-2 d-flex align-items-center">
                  <Form.Check
                    type="switch"
                    id="negative-thoughts-switch-update"
                    checked={updatedLog.negative_thoughts || false}
                    onChange={(e) => handleChange(null, "negative_thoughts", e.target.checked)}
                    className="me-3"
                  />
                  <span style={{ color: updatedLog.negative_thoughts ? "#e03131" : "#2b8a3e" }}>
                    {updatedLog.negative_thoughts
                      ? "🌧️ Noticing negative thought patterns"
                      : "☀️ Mostly positive thoughts today"}
                  </span>
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-medium" style={{ color: "#9775fa" }}>
                  <span style={{ fontSize: "20px", marginRight: "8px" }}>👁️</span>
                  Intrusive Thoughts
                </Form.Label>
                <div className="mt-2 d-flex align-items-center">
                  <Form.Check
                    type="switch"
                    id="intrusive-thoughts-switch-update"
                    checked={updatedLog.intrusive_thoughts || false}
                    onChange={(e) => handleChange(null, "intrusive_thoughts", e.target.checked)}
                    className="me-3"
                  />
                  <span style={{ color: updatedLog.intrusive_thoughts ? "#9775fa" : "#495057" }}>
                    {updatedLog.intrusive_thoughts
                      ? "🔄 Experienced thoughts that don't feel like mine"
                      : "✅ No unwanted recurring thoughts"}
                  </span>
                </div>
              </Form.Group>

              {updatedLog.intrusive_thoughts && (
                <Form.Group className="mt-3 ms-4 mb-2">
                  <Form.Label className="text-muted">
                    <small>Briefly describe them (optional, helps with tracking patterns)</small>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="What thoughts kept coming back?"
                    value={updatedLog.intrusive_thoughts_description || ""}
                    onChange={(e) => handleChange(null, "intrusive_thoughts_description", e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    <small>This information is private and only visible to you</small>
                  </Form.Text>
                </Form.Group>
              )}
            </div>
          </Tab>

          <Tab eventKey="lifestyle" title="Lifestyle">
            <div className="p-2">
              {/* Social Interaction */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium" style={{ color: "#5a67d8" }}>
                  <span style={{ fontSize: "20px", marginRight: "8px" }}>👥</span>
                  How much social interaction did you have today?
                </Form.Label>
                <Form.Select
                  value={updatedLog.social_interaction_level || ""}
                  onChange={(e) => handleChange(null, "social_interaction_level", e.target.value)}
                  className="py-2"
                >
                  <option value="">Select</option>
                  <option value="none">🧘 Solo day</option>
                  <option value="low">🤝 Brief connections</option>
                  <option value="medium">💬 Meaningful interactions</option>
                  <option value="high">🎈 Socially energized</option>
                </Form.Select>
              </Form.Group>

              {/* Physical Activity */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium" style={{ color: "#38a169" }}>
                  <span style={{ fontSize: "20px", marginRight: "8px" }}>🏃</span>
                  How active were you today?
                </Form.Label>
                <Form.Select
                  value={updatedLog.physical_activity_level || ""}
                  onChange={(e) => handleChange(null, "physical_activity_level", e.target.value)}
                  className="py-2"
                >
                  <option value="">Select</option>
                  <option value="none">🛌 Rest day</option>
                  <option value="light">🚶 Light movement</option>
                  <option value="moderate">🏃 Moderate activity</option>
                  <option value="intense">💪 Very active</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-medium d-flex align-items-center" style={{ color: "#4299e1" }}>
                  <span style={{ fontSize: "20px", marginRight: "8px" }}>📱</span>
                  <span>Screen Time (minutes)</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  value={updatedLog.screen_time_minutes || 0}
                  onChange={(e) =>
                    handleChange(0, "screen_time_minutes", e.target.value)}
                  className="py-2"
                />
              </Form.Group>
            </div>
          </Tab>

          <Tab eventKey="moodInfluencingFactors" title="Mood Influencing Factors">
            <div className="p-2">
              {/* Substance Use */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium" style={{ fontWeight: "500" }}>
                  <span style={{ fontSize: "20px", marginRight: "8px" }}>🍷</span>
                  Did you use anything (like alcohol or cannabis) that might've affected your mood or sleep?
                </Form.Label>
                <div className="mt-2">
                  <Form.Check
                    inline
                    type="radio"
                    label="Yes"
                    name="substanceUse"
                    id="substanceUseYes-update"
                    checked={updatedLog.substance_use === true}
                    onChange={() => handleChange(null, "substance_use", true)}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="No"
                    name="substanceUse"
                    id="substanceUseNo-update"
                    checked={updatedLog.substance_use === false}
                    onChange={() => handleChange(null, "substance_use", false)}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="d-block mb-1" style={{ fontWeight: "500" }}>
                  🧠 Did you notice anything that felt unusual — like hearing, seeing, or sensing things others didn't?
                </Form.Label>
                <Form.Text className="text-muted d-block mb-2">
                  (Totally optional — this just helps track your clarity and perception over time.)
                </Form.Text>
                <div className="mt-2">
                  <Form.Check
                    inline
                    type="radio"
                    label="Yes"
                    name="unusualExperiences"
                    id="unusualExperiencesYes-update"
                    checked={updatedLog.psychotic_symptoms === true}
                    onChange={() => handleChange(null, "psychotic_symptoms", true)}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="No"
                    name="unusualExperiences"
                    id="unusualExperiencesNo-update"
                    checked={updatedLog.psychotic_symptoms === false}
                    onChange={() => handleChange(null, "psychotic_symptoms", false)}
                  />
                </div>
              </Form.Group>
            </div>
          </Tab>

          <Tab eventKey="reflection" title="Reflection">
            <div className="p-2">
              {/* Medication Section */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">
                  <span style={{ fontSize: "20px", marginRight: "8px" }}>💊</span>
                  Did you take your medication today?
                </Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    label="Yes"
                    name="medicationTaken"
                    id="medicationYes-update"
                    checked={updatedLog.medication_taken === true}
                    onChange={() => handleChange(null, "medication_taken", true)}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="No"
                    name="medicationTaken"
                    id="medicationNo-update"
                    checked={updatedLog.medication_taken === false}
                    onChange={() => handleChange(null, "medication_taken", false)}
                  />
                </div>
              </Form.Group>

              {updatedLog.medication_taken && (
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">
                    <span style={{ fontSize: "20px", marginRight: "8px" }}>📝</span>
                    Optional notes about your medication
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedLog.medication_details || ""}
                    placeholder="E.g., new dosage, side effects, skipped dose yesterday..."
                    onChange={(e) => handleChange(null, "medication_details", e.target.value)}
                  />
                </Form.Group>
              )}

              {/* Journal Entry */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">
                  <span style={{ fontSize: "20px", marginRight: "8px" }}>📓</span>
                  Journal Entry
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={updatedLog.journal || ""}
                  onChange={(e) => handleChange(null, "journal", e.target.value)}
                  placeholder="Write anything you'd like to reflect on…"
                />
              </Form.Group>

              {/* Gratitude Entry */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">
                  <span style={{ fontSize: "20px", marginRight: "8px" }}>🌈</span>
                  Gratitude Entry
                </Form.Label>
                <Form.Control
                  type="text"
                  value={updatedLog.gratitude_entry || ""}
                  onChange={(e) => handleChange(null, "gratitude_entry", e.target.value)}
                  placeholder="What made you smile today?"
                />
              </Form.Group>
            </div>
          </Tab>

          <Tab eventKey="photo" title="Photo">
            <div className="p-2">
              <Form.Group>
                <Form.Label className="fw-medium">
                  <span style={{ fontSize: "20px", marginRight: "8px" }}>📸</span>
                  Upload a photo from your day
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleImageUpload(file);
                    }
                  }}
                />
                {updatedLog.image_url && (
                  <div className="mt-3 text-center">
                    <img
                      src={updatedLog.image_url}
                      alt="Log image"
                      style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px" }}
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="me-2"
                      onClick={() => setUpdatedLog({ ...updatedLog, image_url: "" })}
                    >
                      Remove Image
                    </Button>
                  </div>
                )}
              </Form.Group>
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          style={{ backgroundColor: "#0080ff", borderColor: "#0080ff" }}
          onClick={handleSubmit}
        >Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
}