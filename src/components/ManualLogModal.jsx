import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, ProgressBar } from "react-bootstrap";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSelector, useDispatch } from "react-redux";
import { resetLogs, saveLog, setCoreLogs, setExtendedLogs } from "../features/logs/logsSlice";
import { getMoodEmoji, getMoodLabel, getEnergyEmoji, getEnergyLabel, getSleepQualityEmoji, getSleepQualityLabel } from "../hooks/logLabels";

export default function ManualLogModal({ show, onHide, userId }) {
  const [step, setStep] = useState(1);
  const [showMoodFactors, setShowMoodFactors] = useState(true);
  const { coreLogs, extendedLogs } = useSelector((state) => state.logs);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleImageUpload = async (file) => {
    const imageRef = ref(storage, `logs/${file.name}`);
    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);
    dispatch(setExtendedLogs({ ...extendedLogs, image_url: url }));
  };

  const handleSubmit = async () => {
    const payload = {
      user_id: userId,
      created_at: new Date().toISOString(),
      ...coreLogs,
      ...extendedLogs,
    };

    try {
      await dispatch(saveLog({ userId, logData: payload })).unwrap();
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
    dispatch(resetLogs());
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h5>Step 1: Mood and Energy</h5>
            <p className="text-muted">Take a moment to reflect on how you're feeling right now.</p>

            <Form.Group className="mb-4">
              <Form.Label className="fw-medium" style={{ color: "#f06595" }}>
                <span style={{ fontSize: "18px", marginRight: "8px" }}>🧠</span>
                How's your mood right now?
              </Form.Label>
              <div className="position-relative mb-2">
                <Form.Range
                  min={0}
                  max={10}
                  value={coreLogs.mood || 0}
                  onChange={(e) => {
                    dispatch(setCoreLogs({ ...coreLogs, mood: parseInt(e.target.value) }));
                  }}
                  className="mb-1"
                />
                <div className="d-flex justify-content-between mb-2">
                  <small className="text-muted">0</small>
                  <small className="text-muted">10</small>
                </div>
                <div className="text-center mt-3 mb-2">
                  <div style={{ fontSize: "1.2rem" }}>{getMoodEmoji(coreLogs.mood)} {getMoodLabel(coreLogs.mood)}</div>
                  <div className="text-muted small">
                    {coreLogs.mood}/10
                  </div>
                </div>
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-medium" style={{ color: "#4dabf7" }}>
                <span style={{ fontSize: "20px", marginRight: "4px" }}>⚡</span>
                How energized do you feel today?
              </Form.Label>
              <div className="position-relative mb-2">
                <Form.Range
                  min={0}
                  max={10}
                  value={coreLogs.energy_level || 0}
                  onChange={(e) =>
                    dispatch(setCoreLogs({ ...coreLogs, energy_level: parseInt(e.target.value) }))
                  }
                  className="mb-1"
                />
                <div className="d-flex justify-content-between">
                  <small className="text-muted">0</small>
                  <small className="text-muted">10</small>
                </div>
              </div>

              <div className="text-center mt-3 mb-2">
                <div style={{ fontSize: "2rem" }}>{getEnergyEmoji(coreLogs.energy_level)}</div>
                <div className="mt-1 fw-medium">{getEnergyLabel(coreLogs.energy_level)}</div>
                <div className="text-muted small">
                  {coreLogs.energy_level}/10
                </div>
              </div>
            </Form.Group>

            <div className="mt-3 d-flex justify-content-end">
              <Button onClick={() => setStep(2)} style={{ backgroundColor: "#0080ff", borderColor: "#0080ff" }}>
                Next
              </Button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h5>Step 2: Sleep and Rest</h5>
            <p className="text-muted mb-4">Let's log your sleep details.</p>

            <Form.Group className="mb-4">
              <Form.Label className="fw-medium d-flex align-items-center" style={{ color: "#f0ad4e" }}>
                <span style={{ fontSize: "20px", marginRight: "8px" }}>😴</span>
                <span>How many hours did you sleep last night?</span>
              </Form.Label>
              <Form.Control
                type="number"
                value={coreLogs.sleep_log.sleep_hours}
                onChange={(e) =>
                  dispatch(setCoreLogs({
                    ...coreLogs,
                    sleep_log: {
                      ...coreLogs.sleep_log,
                      sleep_hours: parseInt(e.target.value),
                    },
                  }))
                }
                className="py-2"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-medium d-flex align-items-center" style={{ color: "#6f42c1" }}>
                <span style={{ fontSize: "20px", marginRight: "8px" }}>💤</span>
                <span>Rate your sleep quality</span>
              </Form.Label>
              <div className="position-relative mb-2">
                <Form.Range
                  min={0}
                  max={10}
                  value={coreLogs.sleep_log.sleep_quality || 0}
                  onChange={(e) =>
                    dispatch(setCoreLogs({
                      ...coreLogs,
                      sleep_log: {
                        ...coreLogs.sleep_log,
                        sleep_quality: parseInt(e.target.value),
                      },
                    }))
                  }
                  className="mb-1"
                />
                <div className="d-flex justify-content-between mb-2">
                  <small className="text-muted">0</small>
                  <small className="text-muted">10</small>
                </div>
              </div>

              <div className="text-center mt-4 mb-2">
                <div style={{ fontSize: "2rem" }}>{getSleepQualityEmoji(coreLogs.sleep_log.sleep_quality)}</div>
                <div className="mt-2 fw-medium">{getSleepQualityLabel(coreLogs.sleep_log.sleep_quality)}</div>
                <div className="text-muted small mt-1">
                  {coreLogs.sleep_log.sleep_quality}/10
                </div>
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
                value={coreLogs.sleep_log.night_awakenings}
                onChange={(e) =>
                  dispatch(setCoreLogs({
                    ...coreLogs,
                    sleep_log: {
                      ...coreLogs.sleep_log,
                      night_awakenings: parseInt(e.target.value),
                    },
                  }))
                }
                className="py-2"
              />
            </Form.Group>

            <div className="mt-4 d-flex justify-content-between">
              <Button variant="secondary" onClick={() => setStep(1)} className="px-4">
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                style={{ backgroundColor: "#0080ff", borderColor: "#0080ff" }}
                className="px-4"
              >
                Next
              </Button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h5>Step 3: Thought Patterns</h5>
            <p className="text-muted mb-4">Let's check in on your mental clarity and thought patterns today.</p>

            <div className="mb-4 rounded-3 bg-light bg-opacity-50" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
              <div className="p-3">
                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center" style={{ fontWeight: "500" }}>
                    <span style={{ fontSize: "20px", marginRight: "10px", color: "#4c6ef5" }}>🧠</span>
                    <span>Mental Clarity</span>
                  </Form.Label>
                  <div className="mt-2 d-flex align-items-center">
                    <Form.Check
                      type="switch"
                      id="clarity-switch"
                      checked={extendedLogs.cognitive_state?.cognitive_clarity || false}
                      onChange={(e) =>
                        dispatch(setExtendedLogs({
                          ...extendedLogs,
                          cognitive_state: {
                            ...extendedLogs.cognitive_state,
                            cognitive_clarity: e.target.checked,
                          },
                        }))
                      }
                      className="me-3"
                    />
                    <span style={{ color: extendedLogs.cognitive_state?.cognitive_clarity ? "#4c6ef5" : "#6c757d" }}>
                      {extendedLogs.cognitive_state?.cognitive_clarity
                        ? "✨ Focused and mentally sharp"
                        : "🌫️ Feeling a bit foggy today"}
                    </span>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center" style={{ fontWeight: "500" }}>
                    <span style={{ fontSize: "20px", marginRight: "10px", color: "#f783ac" }}>💭</span>
                    <span>Current Mental State</span>
                  </Form.Label>
                  <div className="mt-2 d-flex align-items-center">
                    <Form.Check
                      type="switch"
                      id="negative-thoughts-switch"
                      checked={extendedLogs.cognitive_state?.negative_thoughts || false}
                      onChange={(e) =>
                        dispatch(setExtendedLogs({
                          ...extendedLogs,
                          cognitive_state: {
                            ...extendedLogs.cognitive_state,
                            negative_thoughts: e.target.checked,
                          },
                        }))
                      }
                      className="me-3"
                    />
                    <span style={{ color: extendedLogs.cognitive_state?.negative_thoughts ? "#e03131" : "#2b8a3e" }}>
                      {extendedLogs.cognitive_state?.negative_thoughts
                        ? "🌧️ Noticing negative thought patterns"
                        : "☀️ Mostly positive thoughts today"}
                    </span>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center" style={{ fontWeight: "500" }}>
                    <span style={{ fontSize: "20px", marginRight: "10px", color: "#9775fa" }}>👁️</span>
                    <span>Intrusive Thoughts</span>
                  </Form.Label>
                  <div className="mt-2 d-flex align-items-center">
                    <Form.Check
                      type="switch"
                      id="intrusive-thoughts-switch"
                      checked={extendedLogs.cognitive_state?.intrusive_thoughts || false}
                      onChange={(e) =>
                        dispatch(setExtendedLogs({
                          ...extendedLogs,
                          cognitive_state: {
                            ...extendedLogs.cognitive_state,
                            intrusive_thoughts: e.target.checked,
                          },
                        }))
                      }
                      className="me-3"
                    />
                    <span style={{ color: extendedLogs.cognitive_state?.intrusive_thoughts ? "#9775fa" : "#495057" }}>
                      {extendedLogs.cognitive_state?.intrusive_thoughts
                        ? "🔄 Experienced thoughts that don't feel like mine"
                        : "✅ No unwanted recurring thoughts"}
                    </span>
                  </div>
                </Form.Group>

                {extendedLogs.cognitive_state?.intrusive_thoughts && (
                  <Form.Group className="mt-3 ms-4 mb-2">
                    <Form.Label className="text-muted">
                      <small>Briefly describe them (optional, helps with tracking patterns)</small>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="What thoughts kept coming back?"
                      value={extendedLogs.cognitive_state?.intrusive_thoughts_description || ""}
                      onChange={(e) =>
                        dispatch(setExtendedLogs({
                          ...extendedLogs,
                          cognitive_state: {
                            ...extendedLogs.cognitive_state,
                            intrusive_thoughts_description: e.target.value,
                          },
                        }))
                      }
                    />
                    <Form.Text className="text-muted">
                      <small>This information is private and only visible to you</small>
                    </Form.Text>
                  </Form.Group>
                )}
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-between">
              <Button variant="secondary" onClick={() => setStep(2)} className="px-4">
                Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                style={{ backgroundColor: "#0080ff", borderColor: "#0080ff" }}
                className="px-4"
              >
                Next
              </Button>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h5>Step 4: Lifestyle</h5>
            <p className="text-muted mb-4">Let's log your lifestyle details.</p>

            <Form.Group className="mb-4">
              <Form.Label className="fw-medium d-flex align-items-center" style={{ color: "#5a67d8" }}>
                <span style={{ fontSize: "20px", marginRight: "8px" }}>👥</span>
                <span>How much social interaction did you have today?</span>
              </Form.Label>
              <Form.Select
                value={extendedLogs.lifestyle_factors?.social_interaction_level || ""}
                onChange={(e) =>
                  dispatch(setExtendedLogs({
                    ...extendedLogs,
                    lifestyle_factors: {
                      ...extendedLogs.lifestyle_factors,
                      social_interaction_level: e.target.value,
                    },
                  }))
                }
                className="py-2"
              >
                <option value="">Select</option>
                <option value="none">🧘 Solo day</option>
                <option value="low">🤝 Brief connections</option>
                <option value="medium">💬 Meaningful interactions</option>
                <option value="high">🎈 Socially energized</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-medium d-flex align-items-center" style={{ color: "#38a169" }}>
                <span style={{ fontSize: "20px", marginRight: "8px" }}>🏃</span>
                <span>How active were you today?</span>
              </Form.Label>
              <Form.Select
                value={extendedLogs.lifestyle_factors?.physical_activity_level || ""}
                onChange={(e) =>
                  dispatch(setExtendedLogs({
                    ...extendedLogs,
                    lifestyle_factors: {
                      ...extendedLogs.lifestyle_factors,
                      physical_activity_level: e.target.value,
                    },
                  }))
                }
                className="py-2"
              >
                <option value="">Select</option>
                <option value="none">🛌 Rest day (well-deserved!)</option>
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
                value={extendedLogs.lifestyle_factors?.screen_time_minutes || 0}
                onChange={(e) =>
                  dispatch(setExtendedLogs({
                    ...extendedLogs,
                    lifestyle_factors: {
                      ...extendedLogs.lifestyle_factors,
                      screen_time_minutes: parseInt(e.target.value),
                    },
                  }))
                }
                className="py-2"
              />
            </Form.Group>

            {/* Mood-Influencing Factors Section*/}
            <div className="mb-4 mt-4 rounded-3 bg-light bg-opacity-50" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
              <div
                className="d-flex align-items-center p-3 cursor-pointer"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
                onClick={() => setShowMoodFactors(!showMoodFactors)}
              >
                <span style={{ fontSize: "20px", marginRight: "10px", color: "#d53f8c" }}>🧠</span>
                <span style={{ fontWeight: "500", color: "#d53f8c" }}>Mood-Influencing Factors</span>
                <span className="ms-auto">
                  <i className={`bi bi-chevron-${showMoodFactors ? 'up' : 'down'}`}></i>
                </span>
              </div>

              {showMoodFactors && (
                <div className="p-3">
                  {/* Substance-related */}
                  <Form.Group className="mb-3">
                    <Form.Label className="d-block mb-2" style={{ fontWeight: "500" }}>
                      🍷 Did you use anything (like alcohol or cannabis) that might've affected your mood or sleep?
                    </Form.Label>
                    <div className="mt-2">
                      <Form.Check
                        inline
                        type="radio"
                        label="Yes"
                        name="substanceUse"
                        id="substanceUseYes"
                        checked={extendedLogs.lifestyle_factors?.substance_use === true}
                        onChange={() =>
                          dispatch(setExtendedLogs({
                            ...extendedLogs,
                            lifestyle_factors: {
                              ...extendedLogs.lifestyle_factors,
                              substance_use: true,
                            },
                          }))
                        }
                      />
                      <Form.Check
                        inline
                        type="radio"
                        label="No"
                        name="substanceUse"
                        id="substanceUseNo"
                        checked={extendedLogs.lifestyle_factors?.substance_use === false}
                        onChange={() =>
                          dispatch(setExtendedLogs({
                            ...extendedLogs,
                            lifestyle_factors: {
                              ...extendedLogs.lifestyle_factors,
                              substance_use: false,
                            },
                          }))
                        }
                      />
                    </div>
                  </Form.Group>

                  {/* Unusual experiences */}
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
                        id="unusualExperiencesYes"
                        checked={extendedLogs.psychotic_symptoms === true}
                        onChange={() =>
                          dispatch(setExtendedLogs({
                            ...extendedLogs,
                            psychotic_symptoms: true,
                          }))
                        }
                      />
                      <Form.Check
                        inline
                        type="radio"
                        label="No"
                        name="unusualExperiences"
                        id="unusualExperiencesNo"
                        checked={extendedLogs.psychotic_symptoms === false}
                        onChange={() =>
                          dispatch(setExtendedLogs({
                            ...extendedLogs,
                            psychotic_symptoms: false,
                          }))
                        }
                      />
                    </div>
                  </Form.Group>
                </div>
              )}
            </div>

            <div className="mt-4 d-flex justify-content-between">
              <Button variant="secondary" onClick={() => setStep(3)} className="px-4">
                Back
              </Button>
              <Button
                onClick={() => setStep(5)}
                style={{ backgroundColor: "#0080ff", borderColor: "#0080ff" }}
                className="px-4"
              >
                Next
              </Button>
            </div>
          </>
        );
      case 5:
        return (
          <>
            <h5>Step 5: Reflection</h5>
            <p className="text-muted">Let's reflect on your day.</p>
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
                    dispatch(setCoreLogs({ ...coreLogs, medication_taken: true }))
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
                    dispatch(setCoreLogs({ ...coreLogs, medication_taken: false }))
                  }
                />
              </div>
            </Form.Group>

            {coreLogs.medication_taken && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>📝 Optional notes about your medication</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="E.g., new dosage, side effects, skipped dose yesterday..."
                    value={extendedLogs.medication_details || ""}
                    onChange={(e) =>
                      dispatch(setExtendedLogs({
                        ...extendedLogs,
                        medication_details: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </>
            )}

            <Form.Group className="mb-3">
              <Form.Label>📝 Journal Entry</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write anything you'd like to reflect on…"
                value={coreLogs.journal || ""}
                onChange={(e) =>
                  dispatch(setCoreLogs({ ...coreLogs, journal: e.target.value }))
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>🌈 Gratitude Entry</Form.Label>
              <Form.Control
                type="text"
                placeholder="What made you smile today?"
                value={extendedLogs.gratitude_entry || ""}
                onChange={(e) =>
                  dispatch(setExtendedLogs({ ...extendedLogs, gratitude_entry: e.target.value }))
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
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
              <Button style={{ backgroundColor: "#0080ff", borderColor: "#0080ff" }} onClick={onSubmitLog}>
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
        <ProgressBar
          now={(step / 5) * 100}
          className="mb-3"
          style={{ backgroundColor: "#e9ecef" }}
          variant="primary"
        />
        {renderStep()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => { onHide(); setStep(1); }}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}