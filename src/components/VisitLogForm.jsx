import { Form } from "react-bootstrap";

export default function VisitLogForm ({ coreLogs, setCoreLogs, extendedLogs, setExtendedLogs, handleImageUpload }) {
    return (
            <>
            <h5>🩺 Upcoming Visit Check-in</h5>
            <p className="text-muted">
                You have an appointment coming up. Want to take a moment to check in with how you’re feeling today?
            </p>
        
            {/* Mood (0–10 slider to match integer type) */}
            <Form.Group className="mb-3">
                <Form.Label>🙂 Mood (0–10)</Form.Label>
                <Form.Range
                min={0}
                max={10}
                value={coreLogs.mood}
                onChange={(e) =>
                    setCoreLogs({ ...coreLogs, mood: parseInt(e.target.value) })
                }
                />
            </Form.Group>
        
            {/* Anxiety Level (integer 0–10) */}
            <Form.Group className="mb-3">
                <Form.Label>😟 Anxiety Level</Form.Label>
                <Form.Range
                min={0}
                max={10}
                value={extendedLogs.emotional_state.anxiety_level}
                onChange={(e) =>
                    setExtendedLogs({
                    ...extendedLogs,
                    emotional_state: {
                        ...extendedLogs.emotional_state,
                        anxiety_level: parseInt(e.target.value),
                    },
                    })
                }
                />
            </Form.Group>
        
            {/* Stress Level (integer 0–10) */}
            <Form.Group className="mb-3">
                <Form.Label>😣 Stress Level</Form.Label>
                <Form.Range
                min={0}
                max={10}
                value={extendedLogs.emotional_state.stress_level}
                onChange={(e) =>
                    setExtendedLogs({
                    ...extendedLogs,
                    emotional_state: {
                        ...extendedLogs.emotional_state,
                        stress_level: parseInt(e.target.value),
                    },
                    })
                }
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
                    setExtendedLogs((prev) => ({
                        ...prev,
                        image_url: url,
                    }));
                    }
                }}
                />
            </Form.Group>
        </>
    );  
}