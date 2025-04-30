import React from 'react';
import { Col, Row, Card, Button, Accordion } from 'react-bootstrap';

const isValid = (val) => val !== undefined && val !== null && val !== '' && !isNaN(Number(val === '' ? NaN : val));

const MetricItem = ({ label, value, icon, formatter }) => {
    if (!isValid(value)) {
        return null;
    }

    return formatter ? formatter(label, value, icon) : (
        <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted">
                <i className={`bi ${icon} me-2`}></i>
                {label}
            </span>
            <span className="text-secondary">{value}</span>
        </div>
    );
};

const MetricCard = ({ title, icon, iconColor, bgColor, borderColor, children }) => {
    const filteredChildren = React.Children.toArray(children).filter(child => child !== null);

    if (filteredChildren.length === 0) {
        return null;
    }

    return (
        <div
            className="mb-4 p-3 rounded"
            style={{
                backgroundColor: bgColor || 'rgba(240, 247, 255, 0.5)',
                border: `1px solid ${borderColor || 'rgba(0, 0, 0, 0.05)'}`
            }}
        >
            <h6 className="fw-bold mb-3">
                <i className={`bi ${icon} me-2 ${iconColor}`}></i>
                {title}
            </h6>
            {filteredChildren}
        </div>
    );
};

const JournalImage = ({ imageUrl }) => {
    if (!imageUrl) {
        return null;
    }

    return (
        <div className="journal-image mb-4">
            <img
                src={imageUrl}
                alt="Captured moment"
                className="rounded shadow-sm img-fluid"
                style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "contain"
                }}
            />
        </div>
    );
};

export default function LogEntryCard({
    entry,
    formatDateTime,
    getMoodLabel,
    getMoodColor,
    getMoodDescription,
    getMoodEmoji,
    getPhysicalActivityLabel,
    getSocialInteractionLabel,
    renderMetric,
    onEdit,
    onDelete,
    isAccordionItem = false
}) {
    if (!entry) {
        return null;
    }

    const { formattedDate, formattedTime } = formatDateTime(entry.created_at);

    const formatSleepAwakenings = (label, value) => {
        if (!isValid(value)) return null;

        return (
            <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">
                    <i className="bi bi-eye-slash me-2"></i>
                    {label}
                </span>
                <span
                    className="px-2 py-1 rounded-pill small"
                    style={{
                        background: value <= 1 ? 'rgba(40, 167, 69, 0.1)' : value <= 3 ? 'rgba(108, 117, 125, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                        color: value <= 1 ? '#28a745' : value <= 3 ? '#6c757d' : '#ffc107'
                    }}
                >
                    {value === 0 ? "Slept through" : value === 1 ? "Woke once" : `Woke ${value} times`}
                </span>
            </div>
        );
    };

    const formatScreenTime = (label, minutes) => {
        if (!isValid(minutes)) return null;

        return (
            <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">
                    <i className="bi bi-phone me-2"></i>
                    {label}
                </span>
                <span
                    className="px-2 py-1 rounded-pill small"
                    style={{
                        background: minutes <= 120 ? 'rgba(40, 167, 69, 0.1)' : minutes <= 300 ? 'rgba(108, 117, 125, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                        color: minutes <= 120 ? '#28a745' : minutes <= 300 ? '#6c757d' : '#ffc107'
                    }}
                >
                    {Math.floor(minutes / 60)}h {minutes % 60}m
                </span>
            </div>
        );
    };

    const formatMedication = (label, taken) => {
        if (taken === null || taken === undefined) {
            return null;
        }

        return (
            <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">
                    <i className="bi bi-capsule me-2"></i>
                    {label}
                </span>
                <span
                    className="px-2 py-1 rounded-pill small"
                    style={{
                        background: taken ? 'rgba(40, 167, 69, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                        color: taken ? '#28a745' : '#ffc107'
                    }}
                >
                    {taken ? "✓ Taken" : "Skipped"}
                </span>
            </div>
        );
    };

    const formatSleepHours = (label, hours) => {
        if (!isValid(hours)) return null;

        return (
            <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">
                    <i className="bi bi-clock me-2"></i>
                    {label}
                </span>
                <span
                    className={`px-2 py-1 rounded-pill small ${hours >= 7 ? 'text-success' : hours >= 5 ? 'text-warning' : 'text-danger'
                        }`}
                    style={{
                        background: hours >= 7 ? 'rgba(40, 167, 69, 0.1)' : hours >= 5 ? 'rgba(255, 193, 7, 0.1)' : 'rgba(220, 53, 69, 0.1)'
                    }}
                >
                    {hours} hours
                </span>
            </div>
        );
    };

    const cardContent = (
        <>
            <Card.Body className="pt-4 pb-4">
                <Row className="g-4">
                    <Col lg={12}>
                        <Row className="g-4">
                            <Col md={4}>
                                {isValid(entry.mood) && (
                                    <div
                                        className="mb-4 p-3 rounded"
                                        style={{
                                            backgroundColor: getMoodColor(entry.mood),
                                            border: '1px solid rgba(0, 0, 0, 0.05)'
                                        }}
                                    >
                                        <h6 className="fw-bold mb-2">How you were feeling</h6>
                                        <div className="d-flex align-items-center">
                                            <div style={{ fontSize: "2rem", marginRight: "12px" }}>{getMoodEmoji(entry.mood)}</div>
                                            <div style={{ fontSize: "1.1rem", marginRight: "14px" }}>{getMoodLabel(entry.mood)}</div>
                                            <div className="text-muted" style={{ fontSize: "0.8rem" }}>{getMoodDescription(entry.mood)}</div>
                                        </div>
                                    </div>
                                )}

                                <MetricCard
                                    title="Mind & Body"
                                    icon="bi-lightning-charge"
                                    iconColor="text-warning"
                                    bgColor="rgba(230, 252, 245, 0.5)"
                                    borderColor="rgba(200, 240, 230, 0.8)"
                                >
                                    {isValid(entry.energy_level) && renderMetric("Energy level", entry.energy_level, "bi-battery-charging", "energy")}
                                    {isValid(entry.anxiety_level) && renderMetric("Anxiety", entry.anxiety_level, "bi-heart-pulse", "anxiety")}
                                    {isValid(entry.stress_level) && renderMetric("Stress", entry.stress_level, "bi-activity", "stress")}
                                    {isValid(entry.irritability_level) && renderMetric("Irritability", entry.irritability_level, "bi-emoji-expressionless", "irritability")}

                                    <MetricItem
                                        label="Mental Clarity"
                                        value={entry.cognitive_clarity}
                                        icon="bi-lightbulb"
                                        formatter={(label, value) => {
                                            if (value === null || value === undefined) return null;

                                            return (
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <span className="text-muted">
                                                        <i className="bi bi-lightbulb me-2"></i>
                                                        {label}
                                                    </span>
                                                    <span
                                                        className={`px-2 py-1 rounded-pill small ${value ? "text-success" : "text-danger"}`}
                                                    >
                                                        {value ? "Clear minded" : "Bit foggy"}
                                                    </span>
                                                </div>
                                            );
                                        }}
                                    />
                                </MetricCard>

                                {(isValid(entry.sleep_hours) || isValid(entry.sleep_quality) || isValid(entry.night_awakenings)) && (
                                    <MetricCard
                                        title="Rest & Recovery"
                                        icon="bi-moon-stars"
                                        iconColor="text-warning"
                                        bgColor="rgba(240, 235, 255, 0.5)"
                                        borderColor="rgba(230, 220, 250, 0.8)"
                                    >
                                        <MetricItem
                                            label="Sleep Duration"
                                            value={entry.sleep_hours}
                                            icon="bi-clock"
                                            formatter={formatSleepHours}
                                        />
                                        {isValid(entry.sleep_quality) && renderMetric("Sleep Quality", entry.sleep_quality, "bi-stars", "sleep")}
                                        <MetricItem
                                            label="Night Awakenings"
                                            value={entry.night_awakenings}
                                            icon="bi-eye-slash"
                                            formatter={formatSleepAwakenings}
                                        />
                                    </MetricCard>
                                )}
                            </Col>

                            <Col md={4}>
                                {(entry.medication_taken !== null ||
                                    isValid(entry.physical_activity_level) ||
                                    isValid(entry.screen_time_minutes) ||
                                    isValid(entry.social_interaction_level)) && (
                                        <MetricCard
                                            title="Daily Activities"
                                            icon="bi-calendar-check"
                                            iconColor="text-info"
                                            bgColor="rgba(255, 246, 230, 0.5)"
                                            borderColor="rgba(252, 232, 205, 0.8)"
                                            fontSize="10px"
                                        >
                                            <MetricItem
                                                label="Medication"
                                                value={entry.medication_taken}
                                                icon="bi-capsule"
                                                formatter={formatMedication}
                                            />
                                            {isValid(entry.physical_activity_level) && (
                                                <MetricItem
                                                    label="Physical Activity"
                                                    value={getPhysicalActivityLabel(entry.physical_activity_level)}
                                                    icon="bi-bicycle"
                                                />
                                            )}
                                            <MetricItem
                                                label="Screen Time"
                                                value={entry.screen_time_minutes}
                                                icon="bi-phone"
                                                formatter={formatScreenTime}
                                            />
                                            {isValid(entry.social_interaction_level) && (
                                                <MetricItem
                                                    label="Social Interaction"
                                                    value={getSocialInteractionLabel(entry.social_interaction_level)}
                                                    icon="bi-people"
                                                />
                                            )}
                                        </MetricCard>
                                    )}

                                {(entry.journal || entry.gratitude_entry) && (
                                    <MetricCard
                                        title="Your Thoughts"
                                        icon="bi-chat-heart"
                                        iconColor="text-danger"
                                        bgColor="rgba(255, 220, 230, 0.5)"
                                        borderColor="rgba(245, 200, 210, 0.8)"
                                    >
                                        {entry.journal && (
                                            <div
                                                className="mb-3 p-3 rounded"
                                                style={{
                                                    backgroundColor: "rgba(250, 250, 250, 0.7)",
                                                    borderRadius: '8px',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                                                }}
                                            >
                                                <i className="bi bi-quote text-secondary me-1"></i>
                                                {entry.journal}
                                            </div>
                                        )}

                                        {entry.gratitude_entry && (
                                            <div
                                                className="mb-3 p-3 rounded"
                                                style={{
                                                    backgroundColor: "rgb(255, 255, 255)",
                                                    borderLeft: "3px solid rgba(250, 225, 235, 0.8)",
                                                    borderRadius: '8px'
                                                }}
                                            >
                                                <div
                                                    className="mb-1 fw-medium"
                                                    style={{
                                                        fontSize: '0.95rem',
                                                        letterSpacing: '0.5px',
                                                        color: '#e06b9f'
                                                    }}
                                                >
                                                    <i className="bi bi-emoji-smile me-1"></i>
                                                    Moments of gratitude
                                                </div>
                                                <div
                                                    className="fst-italic"
                                                    style={{
                                                        lineHeight: '1.5',
                                                        padding: '4px 0 2px 8px',
                                                    }}
                                                >
                                                    "{entry.gratitude_entry}"
                                                </div>
                                            </div>
                                        )}
                                    </MetricCard>
                                )}

                                {(entry.negative_thoughts || entry.intrusive_thoughts || entry.psychotic_symptoms) && (
                                    <MetricCard
                                        title="Things to Be Aware Of"
                                        icon="bi-shield-check"
                                        iconColor="text-secondary"
                                        bgColor="rgba(240, 240, 240, 0.61)"
                                        borderColor="rgba(250, 235, 245, 0.8)"
                                    >
                                        <div className="d-flex flex-wrap">
                                            {entry.negative_thoughts && (
                                                <span
                                                    className="me-2 mb-2 px-2 py-1 rounded-pill"
                                                    style={{
                                                        background: 'rgba(108, 117, 125, 0.1)',
                                                        color: '#6c757d',
                                                        fontSize: '0.85rem'
                                                    }}
                                                >
                                                    <i className="bi bi-cloud me-1"></i>
                                                    Challenging Thoughts
                                                </span>
                                            )}
                                            {entry.intrusive_thoughts && (
                                                <span
                                                    className="me-2 mb-2 px-2 py-1 rounded-pill"
                                                    style={{
                                                        background: 'rgba(255, 193, 7, 0.1)',
                                                        color: '#856404',
                                                        fontSize: '0.85rem'
                                                    }}
                                                >
                                                    <i className="bi bi-exclamation me-1"></i>
                                                    Unwanted Thoughts
                                                </span>
                                            )}
                                            {entry.psychotic_symptoms && (
                                                <span
                                                    className="me-2 mb-2 px-2 py-1 rounded-pill"
                                                    style={{
                                                        background: 'rgba(220, 53, 69, 0.1)',
                                                        color: '#721c24',
                                                        fontSize: '0.85rem'
                                                    }}
                                                >
                                                    <i className="bi bi-exclamation-circle me-1"></i>
                                                    Distorted Perceptions
                                                </span>
                                            )}
                                        </div>
                                    </MetricCard>
                                )}
                            </Col>
                            {entry.image_url && (
                                <Col md={4}>
                                    <JournalImage imageUrl={entry.image_url} />
                                </Col>
                            )}
                        </Row>
                    </Col>
                </Row>
            </Card.Body>

            <Card.Footer
                className="bg-white border-top-0 py-3 px-4 d-flex justify-content-between align-items-center"
                style={{ borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}
            >
                <div>
                    <small className="text-muted">
                        <i className="bi bi-clock me-1"></i> {formattedTime}
                    </small>
                </div>
                <div>
                    <Button
                        variant="outline-warning"
                        className="rounded-pill me-2"
                        onClick={() => onEdit(entry)}
                        size="sm"
                    >
                        <i className="bi bi-pencil me-1"></i>
                        Edit
                    </Button>
                    <Button
                        variant="outline-danger"
                        className="rounded-pill"
                        onClick={() => onDelete(entry.id)}
                        size="sm"
                    >
                        <i className="bi bi-trash me-1"></i>
                        Delete
                    </Button>
                </div>
            </Card.Footer>
        </>
    );

    if (isAccordionItem) {
        return (
            <Accordion.Item eventKey={entry.id.toString()}>
                <Accordion.Header>
                    <div className="d-flex justify-content-between align-items-center w-100 me-3">
                        <div className="d-flex align-items-center">
                            <div className="me-2" style={{ fontSize: "2rem" }}>
                                {isValid(entry.mood) ? getMoodEmoji(entry.mood) : "📝"}
                            </div>
                            <div className="me-3">
                                {isValid(entry.mood) && (
                                    <span className="ms-2 px-2 py-1 rounded-pill small" style={{ backgroundColor: getMoodColor(entry.mood) }}>
                                        {getMoodLabel(entry.mood)}
                                    </span>
                                )}
                            </div>
                            <div>
                                <span className="text-secondary">{formattedTime}</span>
                            </div>
                        </div>
                    </div>
                </Accordion.Header>
                <Accordion.Body>
                    {cardContent}
                </Accordion.Body>
            </Accordion.Item>
        );
    }

    return (
        <Card
            className="mb-4 shadow-sm border-0 overflow-hidden journal-card"
            style={{
                borderRadius: '16px',
                backgroundColor: '#fcfcfd'
            }}
        >
            <Card.Header
                className="d-flex justify-content-between align-items-center py-3"
                style={{
                    backgroundColor: "rgba(240, 247, 255, 0.5)",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                }}
            >
                <div className="d-flex align-items-center">
                    <i className="bi bi-clock text-info me-2" style={{ fontSize: '1.2rem' }}></i>
                    <div>
                        <h5 className="mb-0">{formattedTime}</h5>
                    </div>
                </div>
                <Button variant="link" className="text-muted p-0">
                    <i className="bi bi-three-dots-vertical"></i>
                </Button>
            </Card.Header>
            {cardContent}
        </Card>
    );
}