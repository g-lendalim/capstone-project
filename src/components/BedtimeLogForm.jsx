import { Accordion, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCoreLogs, setExtendedLogs } from "../features/logs/logsSlice";

export default function BedtimeLogForm({ handleImageUpload }) {
    const dispatch = useDispatch();
    const { coreLogs, extendedLogs } = useSelector((state) => state.logs);

    return (
        <div>
            {/* Mood */}
            <Form.Group>
                <Form.Label>How was your mood overall today?</Form.Label>
                <Form.Range
                    min={0}
                    max={10}
                    value={coreLogs.mood}
                    onChange={(e) =>
                        dispatch(setCoreLogs({ ...coreLogs, mood: parseInt(e.target.value) }))
                    }
                />
                <Form.Text>{coreLogs.mood}/10</Form.Text>
            </Form.Group>

            <Accordion defaultActiveKey="0" alwaysOpen className="mb-3">
                {/* Emotional Section */}
                <Accordion.Item eventKey="0">
                    <Accordion.Header>💭 Emotional Check-in</Accordion.Header>
                    <Accordion.Body>
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

                {/* Lifestyle Habits Section */}
                <Accordion.Item eventKey="2">
                    <Accordion.Header>🌿 Lifestyle Habits</Accordion.Header>
                    <Accordion.Body>
                        {/* Social Interaction */}
                        <Form.Group className="mb-3">
                            <Form.Label>👥 Social Interaction</Form.Label>
                            <Form.Select
                                value={extendedLogs.lifestyle_factors.social_interaction_level}
                                onChange={(e) =>
                                    dispatch(setExtendedLogs({
                                        ...extendedLogs,
                                        lifestyle_factors: {
                                            ...extendedLogs.lifestyle_factors,
                                            social_interaction_level: e.target.value,
                                        },
                                    }))
                                }
                            >
                                <option value="">Select</option>
                                <option value="none">I mostly kept to myself</option>
                                <option value="low">A little — maybe a quick chat</option>
                                <option value="medium">Some meaningful interactions</option>
                                <option value="high">I was very socially engaged</option>
                            </Form.Select>
                        </Form.Group>

                        {/* Physical Activity */}
                        <Form.Group className="mb-3">
                            <Form.Label>🏃 Physical Activity</Form.Label>
                            <Form.Select
                                value={extendedLogs.lifestyle_factors.physical_activity_level}
                                onChange={(e) =>
                                    dispatch(setExtendedLogs({
                                        ...extendedLogs,
                                        lifestyle_factors: {
                                            ...extendedLogs.lifestyle_factors,
                                            physical_activity_level: e.target.value,
                                        },
                                    }))
                                }
                            >
                                <option value="">Select</option>
                                <option value="none">Mostly restful</option>
                                <option value="light">Light movement</option>
                                <option value="moderate">Moderate activity</option>
                                <option value="intense">High energy/exercise</option>
                            </Form.Select>
                        </Form.Group>

                        {/* Screen Time */}
                        <Form.Group className="mb-3">
                            <Form.Label>📱 Screen Time (minutes)</Form.Label>
                            <Form.Control
                                type="number"
                                value={extendedLogs.lifestyle_factors.screen_time_minutes}
                                onChange={(e) =>
                                    dispatch(setExtendedLogs({
                                        ...extendedLogs,
                                        lifestyle_factors: {
                                            ...extendedLogs.lifestyle_factors,
                                            screen_time_minutes: parseInt(e.target.value),
                                        },
                                    }))
                                }
                            />
                        </Form.Group>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Mood-Influencing Factors Section */}
                <Accordion.Item eventKey="3">
                    <Accordion.Header>🧠 Mood-Influencing Factors</Accordion.Header>
                    <Accordion.Body>
                        {/* Substance-related */}
                        <Form.Group className="mb-3">
                            <Form.Label>🍷 Did you use anything (like alcohol or cannabis) that might’ve affected your mood or sleep?</Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Yes"
                                    name="substanceUse"
                                    checked={extendedLogs.lifestyle_factors.substance_use === true}
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
                                    checked={extendedLogs.lifestyle_factors.substance_use === false}
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
                        <Form.Group>
                            <Form.Label>🧠 Did you notice anything that felt unusual — like hearing or seeing something others didn’t?</Form.Label>
                            <Form.Text muted>
                                (Totally optional — this helps track your overall clarity and experience.)
                            </Form.Text>
                            <div className="mt-1">
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Yes"
                                    name="unusualExperiences"
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
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            {/* Journal */}
            <Form.Group>
                <Form.Label>📝 Reflect on your day</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write anything you'd like to reflect on..."
                    value={coreLogs.journal}
                    onChange={(e) => dispatch(setCoreLogs({ ...coreLogs, journal: e.target.value }))}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>🌈 Gratitude Entry</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="What made you smile today?"
                    value={extendedLogs.gratitude_entry}
                    onChange={(e) =>
                        dispatch(setExtendedLogs({ ...extendedLogs, gratitude_entry: e.target.value }))
                    }
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Upload a photo that represents your day</Form.Label>
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
        </div>
    );
}
