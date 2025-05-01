import React from "react";
import { Accordion, Form, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCoreLogs, setExtendedLogs } from "../features/logs/logsSlice";
import { getMoodEmoji, getMoodLabel, getAnxietyEmoji, getAnxietyLabel, getStressEmoji, getStressLabel, getIrritabilityEmoji, getIrritabilityLabel } from "../hooks/logLabels";

export default function BedtimeLogForm({ handleImageUpload }) {
    const dispatch = useDispatch();
    const { coreLogs, extendedLogs } = useSelector((state) => state.logs);

    return (
        <div className="bedtime-log-form">
            <Form.Group className="mb-4">
                <Form.Label className="fw-medium" style={{ color: "#f06595" }}>
                    <span style={{ fontSize: "18px", marginRight: "8px" }}>🧠</span>
                    How would you rate your mood this morning?
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
                        <div style={{ fontSize: "1.8rem" }}>{getMoodEmoji(coreLogs.mood)} {getMoodLabel(coreLogs.mood)}</div>
                        <div className="text-muted small">
                            {coreLogs.mood}/10
                        </div>
                    </div>
                </div>
            </Form.Group>

            <Accordion defaultActiveKey="0" className="mb-4">
                {/* Emotional Section */}
                <Accordion.Item eventKey="0" className="mb-3 border-0 shadow-sm">
                    <Accordion.Header className="bg-light rounded py-2">
                        <span className="d-flex align-items-center">
                            <span style={{ fontSize: "24px", marginRight: "12px" }}>💭</span>
                            <span className="fw-bold">Emotional Check-in</span>
                        </span>
                    </Accordion.Header>
                    <Accordion.Body className="p-4">
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-medium" style={{ color: "#4c6ef5" }}>
                                <span style={{ fontSize: "18px", marginRight: "8px" }}>😰</span>
                                How anxious are you feeling?
                            </Form.Label>
                            <div className="position-relative mb-2">
                                <Form.Range
                                    min={0}
                                    max={10}
                                    value={extendedLogs.emotional_state?.anxiety_level || 0}
                                    onChange={(e) =>
                                        dispatch(setExtendedLogs({
                                            ...extendedLogs,
                                            emotional_state: {
                                                ...extendedLogs.emotional_state,
                                                anxiety_level: parseInt(e.target.value),
                                            },
                                        }))
                                    }
                                />
                                <div className="d-flex justify-content-between mb-2">
                                    <small className="text-muted">0</small>
                                    <small className="text-muted">10</small>
                                </div>
                                <div className="text-center mt-3 mb-2">
                                    <div style={{ fontSize: "1.2rem" }}>
                                        {getAnxietyEmoji(extendedLogs.emotional_state.anxiety_level)} {getAnxietyLabel(extendedLogs.emotional_state.anxiety_level)}
                                    </div>
                                    <div className="text-muted small">
                                        {extendedLogs.emotional_state.anxiety_level}/10
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
                                    value={extendedLogs.emotional_state?.irritability_level || 0}
                                    onChange={(e) =>
                                        dispatch(setExtendedLogs({
                                            ...extendedLogs,
                                            emotional_state: {
                                                ...extendedLogs.emotional_state,
                                                irritability_level: parseInt(e.target.value),
                                            },
                                        }))
                                    }
                                />
                                <div className="d-flex justify-content-between mb-2">
                                    <small className="text-muted">0</small>
                                    <small className="text-muted">10</small>
                                </div>
                                <div className="text-center mt-3 mb-2">
                                    <div style={{ fontSize: "1.2rem" }}>
                                        {getIrritabilityEmoji(extendedLogs.emotional_state.irritability_level)} {getIrritabilityLabel(extendedLogs.emotional_state.irritability_level)}
                                    </div>
                                    <div className="text-muted small">
                                        {extendedLogs.emotional_state.irritability_level}/10
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
                                    value={extendedLogs.emotional_state?.stress_level || 0}
                                    onChange={(e) =>
                                        dispatch(setExtendedLogs({
                                            ...extendedLogs,
                                            emotional_state: {
                                                ...extendedLogs.emotional_state,
                                                stress_level: parseInt(e.target.value),
                                            },
                                        }))
                                    }
                                />
                                <div className="d-flex justify-content-between mb-2">
                                    <small className="text-muted">0</small>
                                    <small className="text-muted">10</small>
                                </div>
                                <div className="text-center mt-3 mb-2">
                                    <div style={{ fontSize: "1.2rem" }}>
                                        {getStressEmoji(extendedLogs.emotional_state.stress_level)} {getStressLabel(extendedLogs.emotional_state.stress_level)}
                                    </div>
                                    <div className="text-muted small">
                                        {extendedLogs.emotional_state.stress_level}/10
                                    </div>
                                </div>
                            </div>
                        </Form.Group>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Cognitive Section */}
                <Accordion.Item eventKey="1" className="mb-3 border-0 shadow-sm">
                    <Accordion.Header className="bg-light rounded py-2">
                        <span className="d-flex align-items-center">
                            <span style={{ fontSize: "24px", marginRight: "12px" }}>🧠</span>
                            <span className="fw-bold">Thought Patterns</span>
                        </span>
                    </Accordion.Header>
                    <Accordion.Body className="p-4">
                        <Row className="g-4">
                            <Col>
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
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Lifestyle Habits Section */}
                <Accordion.Item eventKey="2" className="mb-3 border-0 shadow-sm">
                    <Accordion.Header className="bg-light rounded py-2">
                        <span className="d-flex align-items-center">
                            <span style={{ fontSize: "24px", marginRight: "12px" }}>🌿</span>
                            <span className="fw-bold">Lifestyle Habits</span>
                        </span>
                    </Accordion.Header>
                    <Accordion.Body className="p-4">
                        <Row className="g-4">
                            <Col>
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
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Mood-Influencing Factors Section */}
                <Accordion.Item eventKey="3" className="mb-3 border-0 shadow-sm">
                    <Accordion.Header className="bg-light rounded py-2">
                        <span className="d-flex align-items-center">
                            <span style={{ fontSize: "24px", marginRight: "12px" }}>🔍</span>
                            <span className="fw-bold">Mood-Influencing Factors</span>
                        </span>
                    </Accordion.Header>
                    <Accordion.Body className="p-4">
                        <Row className="g-4">
                            <Col>
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
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Reflection Section */}
                <Accordion.Item eventKey="4" className="border-0 shadow-sm">
                    <Accordion.Header className="bg-light rounded py-2">
                        <span className="d-flex align-items-center">
                            <span style={{ fontSize: "24px", marginRight: "12px" }}>✨</span>
                            <span className="fw-bold">Reflection & Journaling</span>
                        </span>
                    </Accordion.Header>
                    <Accordion.Body className="p-4">
                        <Row className="g-4">
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
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div >
    );
}