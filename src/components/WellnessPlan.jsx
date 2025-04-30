import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Button, Form, Badge, Alert, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  HeartFill,
  PlusCircle,
  EmojiSmile,
  MusicNoteBeamed,
  PeopleFill,
  TreeFill,
  BookHalf,
  CupHotFill,
  XCircleFill,
  CheckCircleFill,
  InfoCircle,
  PencilFill
} from "react-bootstrap-icons";
import api from "../api";
import { AuthContext } from "./AuthProvider";

const presetItems = [
  { label: "Listening to music", icon: <MusicNoteBeamed />, color: "#8884d8" },
  { label: "Spending time with friends", icon: <PeopleFill />, color: "#82ca9d" },
  { label: "Going for a walk", icon: <TreeFill />, color: "#4caf50" },
  { label: "Reading a book", icon: <BookHalf />, color: "#ff7300" },
  { label: "Having a warm drink", icon: <CupHotFill />, color: "#a05195" },
];

const morePresetItems = [
  { label: "Meditation", icon: <EmojiSmile />, color: "#6a0dad" },
  { label: "Cooking a meal", icon: <CupHotFill />, color: "#ff7043" },
  { label: "Watching a movie", icon: <EmojiSmile />, color: "#3f51b5" },
  { label: "Taking a bath", icon: <EmojiSmile />, color: "#2196f3" },
  { label: "Drawing or art", icon: <PencilFill />, color: "#e91e63" },
];

export default function WellnessPlan() {
  const { currentUser } = useContext(AuthContext);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customItem, setCustomItem] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [savingStatus, setSavingStatus] = useState("idle");
  const [showAllPresets, setShowAllPresets] = useState(false);

  useEffect(() => {
    const loadPlan = async () => {
      if (currentUser?.uid) {
        try {
          setSavingStatus("loading");
          const res = await api.get(`/wellness-plan/user/${currentUser.uid}`);
          setSelectedItems(res.data.items || []);
          setSavingStatus("idle");
        } catch (err) {
          console.error("Failed to load wellness plan", err);
          setSavingStatus("error");
        }
      }
    };
    loadPlan();
  }, [currentUser]);

  const toggleItem = (label) => {
    setSelectedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const handleAddCustom = () => {
    if (!customItem.trim()) return;
    if (!selectedItems.includes(customItem)) {
      setSelectedItems([...selectedItems, customItem.trim()]);
      setCustomItem("");
    }
  };

  const handleRemoveItem = (item) => {
    setSelectedItems(prev => prev.filter(i => i !== item));
  };

  const handleSave = async () => {
    try {
      setSavingStatus("saving");
      await api.post("/wellness-plan", {
        user_id: currentUser.uid,
        items: selectedItems,
      });
      setSavingStatus("success");
      setFeedback({ type: "success", message: "Your wellness plan has been saved!" });

      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        if (feedback?.type === "success") {
          setFeedback(null);
        }
        setSavingStatus("idle");
      }, 3000);
    } catch (err) {
      console.error("Error saving wellness plan", err);
      setSavingStatus("error");
      setFeedback({ type: "danger", message: "Failed to save wellness plan. Please try again." });
    }
  };

  // Combine preset items based on view toggle
  const displayedPresets = showAllPresets
    ? [...presetItems, ...morePresetItems]
    : presetItems;

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="p-4 rounded-3 bg-gradient" style={{
            background: "linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}>
            <h2 className="d-flex align-items-center" style={{ color: "#2c3e50" }}>
              <HeartFill className="me-2" style={{ color: "#e74c3c" }} />
              Your Wellness Plan
            </h2>
            <p className="text-muted mb-1">
              Create a personalized list of activities that boost your mood and well-being
            </p>
            <p className="small text-muted mb-0">
              <InfoCircle className="me-1" />
              These activities will be recommended to you when your mood tracking indicates you might benefit from them
            </p>
          </div>

          {feedback && (
            <Alert
              variant={feedback.type}
              onClose={() => setFeedback(null)}
              dismissible
              className="mt-3 d-flex align-items-center"
              style={{ borderRadius: "12px" }}
            >
              {feedback.type === "success" ? (
                <CheckCircleFill className="me-2" size={18} />
              ) : (
                <XCircleFill className="me-2" size={18} />
              )}
              {feedback.message}
            </Alert>
          )}
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={7}>
          <Card className="mb-4 border-0 shadow-sm" style={{ borderRadius: "16px" }}>
            <Card.Body className="p-4">
              <Card.Title className="mb-3 d-flex align-items-center">
                <div className="me-2 p-2 rounded-circle" style={{ background: "rgba(40, 167, 69, 0.1)" }}>
                  <EmojiSmile className="text-success" />
                </div>
                Suggested Wellness Activities
              </Card.Title>

              <div className="d-flex flex-wrap gap-2 mb-3">
                {displayedPresets.map((item) => (
                  <Button
                    key={item.label}
                    variant={selectedItems.includes(item.label) ? "primary" : "outline-primary"}
                    onClick={() => toggleItem(item.label)}
                    className="rounded-pill shadow-sm"
                    style={{
                      borderColor: selectedItems.includes(item.label) ? item.color : "#dee2e6",
                      backgroundColor: selectedItems.includes(item.label) ? item.color : "white",
                      color: selectedItems.includes(item.label) ? "white" : "#495057",
                      transition: "all 0.2s ease-in-out"
                    }}
                  >
                    <span className="me-1">{item.icon}</span> {item.label}
                  </Button>
                ))}
              </div>

              <Button
                variant="link"
                className="text-decoration-none p-0"
                onClick={() => setShowAllPresets(!showAllPresets)}
              >
                {showAllPresets ? "Show fewer suggestions" : "Show more suggestions"}
              </Button>
            </Card.Body>
          </Card>

          <Card className="mb-4 border-0 shadow-sm" style={{ borderRadius: "16px" }}>
            <Card.Body className="p-4">
              <Card.Title className="mb-3 d-flex align-items-center">
                <div className="me-2 p-2 rounded-circle" style={{ background: "rgba(13, 110, 253, 0.1)" }}>
                  <PlusCircle className="text-primary" />
                </div>
                Add Your Own Activities
              </Card.Title>

              <Form className="d-flex gap-2" onSubmit={(e) => { e.preventDefault(); handleAddCustom(); }}>
                <Form.Control
                  type="text"
                  placeholder="E.g. painting, journaling, playing with pets..."
                  value={customItem}
                  onChange={(e) => setCustomItem(e.target.value)}
                  className="shadow-sm"
                  style={{ borderRadius: "12px" }}
                />
                <Button
                  variant="primary"
                  onClick={handleAddCustom}
                  className="rounded-pill"
                >
                  Add
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="border-0 shadow-sm sticky-top" style={{
            borderRadius: "16px",
            top: "20px",
            background: "linear-gradient(145deg, #ffffff, #f5f9ff)"
          }}>
            <Card.Body className="p-4">
              <Card.Title className="mb-4 d-flex justify-content-between align-items-center">
                <span>🌈 My Wellness List</span>
                <Badge bg={selectedItems.length > 0 ? "primary" : "secondary"} pill>
                  {selectedItems.length} items
                </Badge>
              </Card.Title>

              {selectedItems.length > 0 ? (
                <div className="mb-4">
                  {selectedItems.map((item, i) => {
                    // Find matching preset to get color
                    const matchingPreset = [...presetItems, ...morePresetItems].find(preset => preset.label === item);
                    const itemColor = matchingPreset ? matchingPreset.color : "#5e72e4";

                    return (
                      <div
                        key={i}
                        className="d-flex justify-content-between align-items-center p-2 mb-2 rounded"
                        style={{
                          backgroundColor: "rgba(0,0,0,0.02)",
                          borderLeft: `3px solid ${itemColor}`
                        }}
                      >
                        <span>{item}</span>
                        <Button
                          variant="link"
                          className="text-danger p-0"
                          onClick={() => handleRemoveItem(item)}
                          aria-label={`Remove ${item}`}
                        >
                          <XCircleFill />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center my-5 py-4">
                  <p className="text-muted">
                    <InfoCircle size={24} className="mb-2" />
                    <br />
                    You haven't added any activities yet.<br />
                    Start by selecting from the suggestions or adding your own!
                  </p>
                </div>
              )}

              <div className="d-grid">
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="save-tooltip">
                      {selectedItems.length === 0 ? "Please add at least one activity" : "Save your wellness plan"}
                    </Tooltip>
                  }
                >
                  <Button
                    variant="success"
                    onClick={handleSave}
                    className="py-2"
                    style={{ borderRadius: "12px" }}
                    disabled={selectedItems.length === 0 || savingStatus === "saving"}
                  >
                    {savingStatus === "saving" ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : savingStatus === "success" ? (
                      <>
                        <CheckCircleFill className="me-2" /> Saved Successfully!
                      </>
                    ) : (
                      <>Save My Wellness Plan</>
                    )}
                  </Button>
                </OverlayTrigger>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}