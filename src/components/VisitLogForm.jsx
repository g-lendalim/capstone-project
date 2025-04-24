import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCoreLogs, setExtendedLogs } from "../features/logs/logsSlice";

export default function VisitLogForm({ handleImageUpload }) {
    const dispatch = useDispatch();
    const { coreLogs, extendedLogs } = useSelector((state) => state.logs);

    return (
        <>
            <h5>🩺 Upcoming Visit Check-in</h5>
            <p className="text-muted">
                You have an appointment coming up. Want to take a moment to check in with how you’re feeling today?
            </p> 

            <Accordion defaultActiveKey="0" alwaysOpen className="mb-3">
                {/* Emotional Section */}
                <Accordion.Item eventKey="0">
                    <Accordion.Header>💭 Emotional Check-in</Accordion.Header>
                    <Accordion.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>🙂 Mood (0–10)</Form.Label>
                            <Form.Range
                                min={0}
                                max={10}
                                value={coreLogs.mood}
                                onChange={(e) =>
                                    dispatch(setCoreLogs({ ...coreLogs, mood: parseInt(e.target.value) }))
                                }
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>😰 Anxiety Level</Form.Label>
                            <Form.Range
                                min={0}
                                max={10}
                                value={extendedLogs.emotional_state.anxiety_level}
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
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>😤 Irritability Level</Form.Label>
                            <Form.Range
                                min={0}
                                max={10}
                                value={extendedLogs.emotional_state.irritability_level}
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
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>😓 Stress Level</Form.Label>
                            <Form.Range
                                min={0}
                                max={10}
                                value={extendedLogs.emotional_state.stress_level}
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
                        </Form.Group>
                    </Accordion.Body>
                </Accordion.Item>

            {/* Cognitive Section */}
            <Accordion.Item eventKey="1">
                <Accordion.Header>🧠 Thought Patterns</Accordion.Header>
                <Accordion.Body>
                    <Form.Check
                        type="checkbox"
                        label="🧘 I felt mentally clear today"
                        checked={extendedLogs.cognitive_state.cognitive_clarity}
                        onChange={(e) =>
                            dispatch(setExtendedLogs({
                                ...extendedLogs,
                                cognitive_state: {
                                    ...extendedLogs.cognitive_state,
                                    cognitive_clarity: e.target.checked,
                                },
                            }))
                        }
                    />

                    <Form.Check
                        type="checkbox"
                        label="🌧️ I had negative thoughts"
                        checked={extendedLogs.cognitive_state.negative_thoughts}
                        onChange={(e) =>
                            dispatch(setExtendedLogs({
                                ...extendedLogs,
                                cognitive_state: {
                                    ...extendedLogs.cognitive_state,
                                    negative_thoughts: e.target.checked,
                                },
                            }))
                        }
                    />

                    <Form.Check
                        type="checkbox"
                        label="👁️ I experienced intrusive thoughts"
                        checked={extendedLogs.cognitive_state.intrusive_thoughts}
                        onChange={(e) =>
                            dispatch(setExtendedLogs({
                                ...extendedLogs,
                                cognitive_state: {
                                    ...extendedLogs.cognitive_state,
                                    intrusive_thoughts: e.target.checked,
                                },
                            }))
                        }
                    />

                    {extendedLogs.cognitive_state.intrusive_thoughts && (
                        <Form.Group className="mt-2">
                            <Form.Label>📝 Describe them (optional)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={extendedLogs.cognitive_state.intrusive_thoughts_description}
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
                        </Form.Group>
                    )}
                </Accordion.Body>
            </Accordion.Item>

            <Form.Group>
                <Form.Label>📝 Additional notes</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write anything you'd like to tell your therapist..."
                    value={coreLogs.journal}
                    onChange={(e) => dispatch(setCoreLogs({ ...coreLogs, journal: e.target.value }))}
                />
            </Form.Group>

            {/* Optional Image Upload */}
            <Form.Group className="mb-3">
                <Form.Label>
                    📸 Add a photo that reflects how you’ve been
                    <div className="text-muted" style={{ fontSize: "0.9em" }}>
                        Totally optional — it can help with memory or journaling.
                    </div>
                </Form.Label>
                <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const url = await handleImageUpload(file);
                            const updatedLogs = { ...extendedLogs, image_url: url };
                            dispatch(setExtendedLogs(updatedLogs)); 
                        }
                    }}
                />
            </Form.Group>
            </Accordion>
        </>
    );
}