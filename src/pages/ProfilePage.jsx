import React, { useEffect, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTimeline } from "../features/logs/logsSlice";
import { AuthContext } from "../components/AuthProvider";
import ProfileHeader from "../components/ProfileHeader";
import { Spinner, Alert, Container, Nav, Tab } from "react-bootstrap";
import { getMoodLabel, getMoodEmoji, getMoodColor, getMoodDescription, getEnergyEmoji, getEnergyLabel, getAnxietyEmoji, getAnxietyLabel, getStressEmoji, getStressLabel, getIrritabilityEmoji, getIrritabilityLabel, getSleepQualityEmoji, getSleepQualityLabel, getPhysicalActivityLabel, getSocialInteractionLabel } from "../hooks/logLabels";
import MoodJournal from "../components/MoodJournal";
import Reminders from "../components/Reminders";

export default function ProfileMainBody() {
  const { currentUser } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { timeline, loading, error } = useSelector((state) => state.logs);
  const userId = currentUser.uid;
  const [activeKey, setActiveKey] = useState("journal");

  useEffect(() => {
    if (userId) {
      dispatch(fetchTimeline(userId));
    }
  }, [dispatch, userId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "numeric",
      hour12: true
    });
  };

  const getScaleDescription = (value, type) => {
    if (value === null || value === undefined) {
      return "Not recorded";
    }
    
    switch (type) {
      case "energy":
        return `${getEnergyEmoji(value)} ${getEnergyLabel(value)}`;
      case "anxiety":
        return `${getAnxietyEmoji(value)} ${getAnxietyLabel(value)}`;
      case "stress":
        return `${getStressEmoji(value)} ${getStressLabel(value)}`;
      case "irritability":
        return `${getIrritabilityEmoji(value)} ${getIrritabilityLabel(value)}`;
      case "sleep":
        return `${getSleepQualityEmoji(value)} ${getSleepQualityLabel(value)}`;
      default:
        return value;
    }
  };
  
  const renderMetric = (label, value, icon, type) => {
    // Handle undefined values with gentle messaging
    if (value === null || value === undefined) {
      return (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-muted d-flex align-items-center">
            <i className={`bi ${icon} me-2`}></i>
            {label}
          </span>
          <span className="text-muted fst-italic small">Not yet recorded</span>
        </div>
      );
    }

    let className, backgroundColor;

    if (["anxiety", "stress", "irritability"].includes(type)) {
      if (value <= 3) {
        className = "text-success";
        backgroundColor = "rgba(40, 167, 69, 0.1)";
      } else if (value <= 6) {
        className = "text-warning";
        backgroundColor = "rgba(255, 193, 7, 0.1)";
      } else {
        className = "text-danger";
        backgroundColor = "rgba(220, 53, 69, 0.1)";
      }
    } else {
      if (value >= 7) {
        className = "text-success";
        backgroundColor = "rgba(40, 167, 69, 0.1)";
      } else if (value >= 4) {
        className = "text-warning";
        backgroundColor = "rgba(255, 193, 7, 0.1)";
      } else {
        className = "text-danger";
        backgroundColor = "rgba(220, 53, 69, 0.1)";
      }
    }

    return (
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted d-flex align-items-center">
          <i className={`bi ${icon} me-2`}></i>
          {label}
        </span>
        <span 
          className={`px-2 py-1 rounded-pill ${className}`}
          style={{ 
            background: backgroundColor,
            fontSize: '0.85rem'
          }}
        >
          {getScaleDescription(value, type)}
        </span>
      </div>
    );
  }

  // Filter logs and alarms from timeline
  const logs = timeline.filter((entry) => entry.type === "log");
  const alarms = timeline.filter((entry) => entry.type === "alarm");

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
        <Spinner animation="border" variant="info" />
        <span className="ms-2">Opening your journal...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="warning" className="d-flex align-items-center">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        We couldn't load your entries. Please try again in a moment.
      </Alert>
    );
  }

  return (
    <Container fluid className="px-0">
      <ProfileHeader 
        currentUser={currentUser}
        logs={logs}
        alarms={alarms}
      />
      <Container>
        <Tab.Container id="journal-tabs" defaultActiveKey="journal" activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
          <Nav variant="pills" className="mb-4">
            <Nav.Item className="me-2">
              <Nav.Link eventKey="journal" className="px-4 rounded-pill">
                <i className="bi bi-journal-text me-2"></i>
                Mood Journals
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="reminders" className="px-4 rounded-pill">
                <i className="bi bi-bell me-2"></i>
                Reminders
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="journal">
              <MoodJournal 
                logs={logs}
                formatDate={formatDate}
                getMoodColor={getMoodColor}
                getMoodLabel={getMoodLabel}
                getMoodDescription={getMoodDescription}
                getMoodEmoji={getMoodEmoji}
                getPhysicalActivityLabel={getPhysicalActivityLabel}
                getSocialInteractionLabel={getSocialInteractionLabel}
                renderMetric={renderMetric}
              />
            </Tab.Pane>

            <Tab.Pane eventKey="reminders">
              <Reminders alarms={alarms}/>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </Container>
  );
}