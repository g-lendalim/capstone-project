import { Card, Button, Row, Col } from "react-bootstrap";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateLog, deleteLog } from '../features/logs/logsSlice';
import UpdateLogModal from './UpdateLogModal';
import DeleteLogModal from './DeleteLogModal'; 

export default function MoodJournal({ logs, formatDate, getMoodLabel, getMoodColor, getMoodDescription, getMoodEmoji, getPhysicalActivityLabel, getSocialInteractionLabel, renderMetric}){
    const dispatch = useDispatch();
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [selectedLogId, setSelectedLogId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleOpenUpdateModal = (log) => {
        setSelectedLog(log);
        setShowUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        setSelectedLog(null);
    };

    const handleUpdateLog = async (logId, newLogContent, newFile) => {
        try {
          await dispatch(updateLog({ logId, newLogContent, newFile })).unwrap();
          console.log("Log updated successfully!");
          handleCloseUpdateModal();
        } catch (error) {
          console.error("Failed to update log", error);
        }
    };
    
    const handleOpenDeleteModal = (logId) => {
        setSelectedLogId(logId);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setSelectedLogId(null);
        setShowDeleteModal(false);
    };

    const handleDelete = async () => {
        if (!selectedLogId) return;
        
        await dispatch(deleteLog(selectedLogId)); 
        handleCloseDeleteModal();
    };
    
    return (
        <>
            {logs.length === 0 ? (
                <Card className="text-center py-5 shadow-sm border-0" style={{ backgroundColor: "#f8f9fa" }}>
                    <Card.Body>
                    <i className="bi bi-journal-plus" style={{ fontSize: "3rem", color: "#6c757d" }}></i>
                    <h4 className="mt-3">Your journey begins here</h4>
                    <p className="text-muted">
                        Recording your thoughts and feelings is the first step toward greater self-awareness.
                    </p>
                    <Button variant="info" className="rounded-pill text-white">
                        <i className="bi bi-plus-lg me-1"></i>
                        Create Your First Mood Journal
                    </Button>
                    </Card.Body>
                </Card>
                ) : (
                <div className="journal-entries">
                    {logs.map((entry) => (
                    <Card 
                        className="mb-4 shadow-sm border-0 overflow-hidden journal-card" 
                        key={entry.id}
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
                                <i className="bi bi-calendar-week text-info me-2" style={{ fontSize: '1.2rem' }}></i>
                                <div>
                                    <h5 className="mb-0">Reflection</h5>
                                    <small>{formatDate(entry.created_at)}</small>
                                </div>
                            </div>
                            <Button variant="link" className="text-muted p-0">
                                <i className="bi bi-three-dots-vertical"></i>
                            </Button>
                        </Card.Header>
    
                        <Card.Body className="pt-4 pb-4">
                            <Row className="g-4">
                                {/* Determine column widths based on image presence */}
                                <Col lg={entry.image_url ? 8 : 12}>
                                    <Row className="g-4">
                                        <Col md={6}>
                                            {entry.mood != null && (
                                                <div className="mb-4 p-3 rounded" style={{ backgroundColor: getMoodColor(entry.mood), border: '1px solid rgba(0, 0, 0, 0.05)' }}>
                                                    <h6 className="fw-bold mb-2">
                                                        How you were feeling
                                                    </h6>
                                                    <div className="d-flex align-items-center">
                                                        <div style={{ fontSize: "2rem", marginRight: "12px" }}>{getMoodEmoji(entry.mood)}</div>
                                                        <div style={{ fontSize: "1.1rem", marginRight: "14px" }}>{getMoodLabel(entry.mood)}</div>
                                                        <div className="text-muted" style={{ fontSize: "0.8rem" }}>{getMoodDescription(entry.mood)}</div>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="mb-4 p-3 rounded" style={{ backgroundColor: 'rgba(230, 252, 245, 0.5)', border: '1px solid rgba(200, 240, 230, 0.8)' }}>
                                                <h6 className="fw-bold mb-3">
                                                    <i className="bi bi-lightning-charge me-2 text-warning"></i>
                                                    Mind & Body
                                                </h6>
                                                {entry.energy_level != undefined && renderMetric("Energy level", entry.energy_level, "bi-battery-charging", "energy")}
                                                {entry.anxiety_level != undefined && renderMetric("Anxiety", entry.anxiety_level, "bi-heart-pulse", "anxiety")}
                                                {entry.stress_level != undefined && renderMetric("Stress", entry.stress_level, "bi-activity", "stress")}
                                                {entry.irritability_level != undefined && renderMetric("Irritability", entry.irritability_level, "bi-emoji-expressionless", "irritability")}
                                                
                                                {entry.cognitive_clarity != null ? (
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <span className="text-muted">
                                                            <i className="bi bi-lightbulb me-2"></i>
                                                            Mental Clarity
                                                        </span>
                                                        <span 
                                                            className={`px-2 py-1 rounded-pill small ${entry.cognitive_clarity ? "text-success" : "text-danger"}`}
                                                        >
                                                            {entry.cognitive_clarity ? "Clear minded" : "Bit foggy"}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <span className="text-muted">
                                                            <i className="bi bi-lightbulb me-2"></i>
                                                            Mental Clarity
                                                        </span>
                                                        <span className="text-muted fst-italic small">Not recorded</span>
                                                    </div>
                                                )}
                                            </div>
    
                                            {(entry.sleep_hours != null ||
                                                entry.sleep_quality != null ||
                                                entry.night_awakenings != null) && (
                                                <div className="mb-4 p-3 rounded" style={{ backgroundColor: 'rgba(240, 235, 255, 0.5)', border: '1px solid rgba(230, 220, 250, 0.8)' }}>
                                                    <h6 className="fw-bold mb-3">
                                                        <i className="bi bi-moon-stars me-2 text-warning"></i>
                                                        Rest & Recovery
                                                    </h6>
                                                    
                                                    {entry.sleep_hours != null ? (
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <span className="text-muted">
                                                                <i className="bi bi-clock me-2"></i>
                                                                Sleep Duration
                                                            </span>
                                                            <span
                                                                className={`px-2 py-1 rounded-pill small ${
                                                                    entry.sleep_hours >= 7 
                                                                        ? 'text-success' 
                                                                        : entry.sleep_hours >= 5 
                                                                            ? 'text-warning' 
                                                                            : 'text-danger'
                                                                }`}
                                                                style={{ 
                                                                    background: entry.sleep_hours >= 7 
                                                                        ? 'rgba(40, 167, 69, 0.1)' 
                                                                        : entry.sleep_hours >= 5 
                                                                            ? 'rgba(255, 193, 7, 0.1)' 
                                                                            : 'rgba(220, 53, 69, 0.1)'
                                                                }}
                                                            >
                                                                {entry.sleep_hours} hours
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <span className="text-muted">
                                                                <i className="bi bi-clock me-2"></i>
                                                                Sleep Duration
                                                            </span>
                                                            <span className="text-muted fst-italic small">Not recorded</span>
                                                        </div>
                                                    )}
                                                    
                                                    {renderMetric("Sleep Quality", entry.sleep_quality, "bi-stars", "sleep")}
                                                    
                                                    {entry.night_awakenings != null ? (
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <span className="text-muted">
                                                                <i className="bi bi-eye-slash me-2"></i>
                                                                Night Awakenings
                                                            </span>
                                                            <span
                                                                className="px-2 py-1 rounded-pill small"
                                                                style={{ 
                                                                    background: entry.night_awakenings <= 1 
                                                                        ? 'rgba(40, 167, 69, 0.1)' 
                                                                        : entry.night_awakenings <= 3 
                                                                            ? 'rgba(108, 117, 125, 0.1)' 
                                                                            : 'rgba(255, 193, 7, 0.1)',
                                                                    color: entry.night_awakenings <= 1 
                                                                        ? '#28a745' 
                                                                        : entry.night_awakenings <= 3 
                                                                            ? '#6c757d' 
                                                                            : '#ffc107'
                                                                }}
                                                            >
                                                                {entry.night_awakenings === 0 ? "Slept through" : 
                                                                entry.night_awakenings === 1 ? "Woke once" : 
                                                                `Woke ${entry.night_awakenings} times`}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <span className="text-muted">
                                                                <i className="bi bi-eye-slash me-2"></i>
                                                                Night Awakenings
                                                            </span>
                                                            <span className="text-muted fst-italic small">Not recorded</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </Col>
    
                                        <Col md={6}>
                                            {(entry.medication_taken != null ||
                                                entry.physical_activity_level ||
                                                entry.screen_time_minutes != null ||
                                                entry.social_interaction_level) && (
                                                <div className="mb-4 p-3 rounded" style={{ backgroundColor: 'rgba(255, 246, 230, 0.5)', border: '1px solid rgba(252, 232, 205, 0.8)' }}>
                                                    <h6 className="fw-bold mb-3">
                                                        <i className="bi bi-calendar-check me-2 text-info"></i>
                                                        Daily Activities
                                                    </h6>
                                                    
                                                    {entry.medication_taken != null ? (
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <span className="text-muted">
                                                                <i className="bi bi-capsule me-2"></i>
                                                                Medication
                                                            </span>
                                                            <span 
                                                                className="px-2 py-1 rounded-pill small"
                                                                style={{ 
                                                                    background: entry.medication_taken ? 'rgba(40, 167, 69, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                                                                    color: entry.medication_taken ? '#28a745' : '#ffc107'
                                                                }}
                                                            >
                                                                {entry.medication_taken ? "✓ Taken as prescribed" : "Skipped today"}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <span className="text-muted">
                                                                <i className="bi bi-capsule me-2"></i>
                                                                Medication
                                                            </span>
                                                            <span className="text-muted fst-italic small">Not applicable</span>
                                                        </div>
                                                    )}
                                                    
                                                    {entry.physical_activity_level ? (
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <span className="text-muted">
                                                                <i className="bi bi-bicycle me-2"></i>
                                                                Physical Activity
                                                            </span>
                                                            <span className="text-secondary">
                                                                {getPhysicalActivityLabel(entry.physical_activity_level)}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <span className="text-muted">
                                                                <i className="bi bi-bicycle me-2"></i>
                                                                Physical Activity
                                                            </span>
                                                            <span className="text-muted fst-italic small">Not recorded</span>
                                                        </div>
                                                    )}
                                                    
                                                    {entry.screen_time_minutes != null ? (
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <span className="text-muted">
                                                                <i className="bi bi-phone me-2"></i>
                                                                Screen Time
                                                            </span>
                                                            <span
                                                                className="px-2 py-1 rounded-pill small"
                                                                style={{ 
                                                                    background: entry.screen_time_minutes <= 120 
                                                                        ? 'rgba(40, 167, 69, 0.1)' 
                                                                        : entry.screen_time_minutes <= 300 
                                                                            ? 'rgba(108, 117, 125, 0.1)' 
                                                                            : 'rgba(255, 193, 7, 0.1)',
                                                                    color: entry.screen_time_minutes <= 120 
                                                                        ? '#28a745' 
                                                                        : entry.screen_time_minutes <= 300 
                                                                            ? '#6c757d' 
                                                                            : '#ffc107'
                                                                }}
                                                            >
                                                                {Math.floor(entry.screen_time_minutes / 60)}h {entry.screen_time_minutes % 60}m
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <span className="text-muted">
                                                                <i className="bi bi-phone me-2"></i>
                                                                Screen Time
                                                            </span>
                                                            <span className="text-muted fst-italic small">Not tracked</span>
                                                        </div>
                                                    )}
                                                    
                                                    {entry.social_interaction_level ? (
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <span className="text-muted">
                                                                <i className="bi bi-people me-2"></i>
                                                                Social Interaction
                                                            </span>
                                                            <span className="text-secondary">
                                                                {getSocialInteractionLabel(entry.social_interaction_level)}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <span className="text-muted">
                                                                <i className="bi bi-people me-2"></i>
                                                                Social Interaction
                                                            </span>
                                                            <span className="text-muted fst-italic small">Not recorded</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
    
                                            {(entry.journal || entry.gratitude_entry) && (
                                                <div className="mb-4 p-3 rounded" style={{ backgroundColor: 'rgba(255, 220, 230, 0.5)', border: '1px solid rgba(245, 200, 210, 0.8)' }}>
                                                    <h6 className="fw-bold mb-3">
                                                        <i className="bi bi-chat-heart me-2 text-danger"></i>
                                                        Your Thoughts
                                                    </h6>
                                                    
                                                    {entry.journal && (
                                                        <div className="mb-3 p-3 rounded" style={{ 
                                                            backgroundColor: "rgba(250, 250, 250, 0.7)", 
                                                            borderRadius: '8px',
                                                            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                                                        }}>
                                                            <i className="bi bi-quote text-secondary me-1"></i>
                                                            {entry.journal}
                                                        </div>
                                                    )}
                                                    
                                                    {entry.gratitude_entry && (
                                                        <div className="mb-3 p-3 rounded" style={{ 
                                                            backgroundColor: "rgb(255, 255, 255)", 
                                                            borderLeft: "3px solid rgba(250, 225, 235, 0.8)",
                                                            borderRadius: '8px'
                                                        }}>
                                                            <div className="mb-1 fw-medium" style={{
                                                                fontSize: '0.95rem',
                                                                letterSpacing: '0.5px',
                                                                color: '#e06b9f'
                                                            }}>
                                                                <i className="bi bi-emoji-smile me-1"></i>
                                                                Moments of gratitude
                                                            </div>
                                                            <div className="fst-italic" style={{
                                                                lineHeight: '1.5',
                                                                padding: '4px 0 2px 8px',
                                                            }}>
                                                                "{entry.gratitude_entry}"
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            
                                            {(entry.negative_thoughts || entry.intrusive_thoughts || entry.psychotic_symptoms) && (
                                                <div className="mb-4 p-3 rounded" style={{ backgroundColor: 'rgba(240, 240, 240, 0.61)', border: '1px solid rgba(250, 235, 245, 0.8)' }}>
                                                    <h6 className="fw-bold mb-3">
                                                        <i className="bi bi-shield-check me-2 text-secondary"></i>
                                                        Things to Be Aware Of
                                                    </h6>
                                                    <div className="d-flex flex-wrap">
                                                        {entry.negative_thoughts && (
                                                            <span className="me-2 mb-2 px-2 py-1 rounded-pill" style={{ background: 'rgba(108, 117, 125, 0.1)', color: '#6c757d', fontSize: '0.85rem' }}>
                                                                <i className="bi bi-cloud me-1"></i>
                                                                Challenging Thoughts
                                                            </span>
                                                        )}
                                                        {entry.intrusive_thoughts && (
                                                            <span className="me-2 mb-2 px-2 py-1 rounded-pill" style={{ background: 'rgba(255, 193, 7, 0.1)', color: '#856404', fontSize: '0.85rem' }}>
                                                                <i className="bi bi-exclamation me-1"></i>
                                                                Unwanted Thoughts
                                                            </span>
                                                        )}
                                                        {entry.psychotic_symptoms && (
                                                            <span className="me-2 mb-2 px-2 py-1 rounded-pill" style={{ background: 'rgba(220, 53, 69, 0.1)', color: '#721c24', fontSize: '0.85rem' }}>
                                                                <i className="bi bi-exclamation-circle me-1"></i>
                                                                Distorted Perceptions 
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </Col>
                                    </Row>
                                </Col>
                                
                                {/* Improved Image Display */}
                                {entry.image_url && (
                                    <Col lg={4} className="d-flex align-items-start">
                                        <div className="position-relative w-100 h-100" style={{ minHeight: '300px' }}>
                                            <img
                                                src={entry.image_url}
                                                alt="Captured moment"
                                                className="rounded shadow-sm"
                                                style={{ 
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    objectPosition: "center",
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0
                                                }}
                                            />
                                        </div>
                                    </Col>
                                )}
                            </Row>
                        </Card.Body>
                        
                        <Card.Footer 
                            className="bg-white border-top-0 py-3 px-4 d-flex justify-content-end" 
                            style={{ borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}
                        >
                            <Button 
                                variant="outline-warning" 
                                className="rounded-pill me-2" 
                                onClick={() => handleOpenUpdateModal(entry)} 
                                size="sm"
                            >
                                <i className="bi bi-pencil me-1"></i>
                                Edit
                            </Button>
                            <Button variant="outline-danger" className="rounded-pill" onClick={() => handleOpenDeleteModal(entry.id)} size="sm">
                                <i className="bi bi-trash me-1"></i>
                                Delete
                            </Button>
                        </Card.Footer>
                    </Card>
                    ))}
                </div>
            )}

            <UpdateLogModal
                show={showUpdateModal}
                onHide={handleCloseUpdateModal}
                logData={selectedLog}
                onUpdate={handleUpdateLog}
            />

            <DeleteLogModal
                show={showDeleteModal}
                onHide={handleCloseDeleteModal}
                onConfirm={handleDelete}
            />
        </>
    );
}