import { useState, useEffect, useContext } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Badge,
  ProgressBar
} from "react-bootstrap";
import {
  Heart,
  PencilSquare,
  TrashFill,
  ShieldFill,
  JournalPlus,
  CheckCircle,
  ExclamationTriangle,
  GeoAlt,
  EmojiSmile,
  ArrowRight,
  HandThumbsUp,
  Lightbulb,
  BookmarkHeart,
  CloudSun
} from "react-bootstrap-icons";
import api from "../api";
import { AuthContext } from "./AuthProvider";

export default function SafetyPlan({ onComplete }) {
  const { currentUser } = useContext(AuthContext);
  const [safetyPlan, setSafetyPlan] = useState(null);
  const [form, setForm] = useState({
    warningSigns: "",
    copingStrategies: "",
    safePlaces: "",
    reasonsForLiving: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      if (currentUser?.uid) {
        try {
          const res = await api.get(`/safety-plans/user/${currentUser.uid}`);
          if (res.data.length > 0) {
            const plan = res.data[0];
            setSafetyPlan(plan);
            setForm({
              warningSigns: plan.warning_signs.join("\n"),
              copingStrategies: plan.coping_strategies.join("\n"),
              safePlaces: plan.safe_places.join("\n"),
              reasonsForLiving: plan.reasons_for_living.join("\n"),
            });
          }
        } catch (err) {
          console.error("Error loading plan:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [currentUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const payload = {
      user_id: currentUser?.uid,
      warning_signs: form.warningSigns.split("\n").filter(item => item.trim()),
      coping_strategies: form.copingStrategies.split("\n").filter(item => item.trim()),
      safe_places: form.safePlaces.split("\n").filter(item => item.trim()),
      reasons_for_living: form.reasonsForLiving.split("\n").filter(item => item.trim()),
    };

    try {
      let res;
      if (safetyPlan) {
        res = await api.put(`/safety-plans/${safetyPlan.id}`, payload);
      } else {
        res = await api.post("/safety-plans", payload);
      }
      setSafetyPlan(res.data);
      setEditing(false);
      setFeedback({ type: "success", message: "Your safety plan has been saved successfully." });

      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error("Error saving plan:", err);
      setFeedback({ type: "danger", message: "We couldn't save your safety plan. Please try again." });
    }
  };

  const handleDelete = async () => {
    if (!safetyPlan) return;

    if (window.confirm("Are you sure you want to delete your safety plan?")) {
      try {
        await api.delete(`/safety-plans/${safetyPlan.id}`);
        setSafetyPlan(null);
        setForm({ warningSigns: "", copingStrategies: "", safePlaces: "", reasonsForLiving: "" });
        setFeedback({ type: "success", message: "Your safety plan has been deleted." });

        setTimeout(() => setFeedback(null), 3000);
      } catch (err) {
        console.error("Error deleting safety plan:", err);
        setFeedback({ type: "danger", message: "We couldn't delete your safety plan. Please try again." });
      }
    }
  };

  const sections = [
    {
      key: "warningSigns",
      label: "Warning Signs",
      icon: <ExclamationTriangle className="text-warning" size={20} />,
      description: "What thoughts, feelings, or behaviors tell you that you're not doing well?",
      placeholder: "For example: Racing thoughts, feeling overwhelmed, isolating myself...",
      data: safetyPlan?.warning_signs || [],
      color: "warning",
      bgClass: "bg-warning-subtle"
    },
    {
      key: "copingStrategies",
      label: "Coping Strategies",
      icon: <Lightbulb className="text-success" size={20} />,
      description: "What helps you feel better when you notice these warning signs?",
      placeholder: "For example: Deep breathing, calling a friend, going for a walk...",
      data: safetyPlan?.coping_strategies || [],
      color: "success",
      bgClass: "bg-success-subtle"
    },
    {
      key: "safePlaces",
      label: "Safe Places",
      icon: <GeoAlt className="text-info" size={20} />,
      description: "Where can you go that helps you feel safe and calm?",
      placeholder: "For example: My bedroom, the park, my friend's house...",
      data: safetyPlan?.safe_places || [],
      color: "info",
      bgClass: "bg-info-subtle"
    },
    {
      key: "reasonsForLiving",
      label: "Reasons for Living",
      icon: <Heart className="text-danger" size={20} />,
      description: "What matters to you and gives your life meaning?",
      placeholder: "For example: My family, my future goals, my pet...",
      data: safetyPlan?.reasons_for_living || [],
      color: "danger",
      bgClass: "bg-danger-subtle"
    }
  ];

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "300px" }}>
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading your safety plan...</p>
        </div>
      </Container>
    );
  }

  const getPlanCompleteness = () => {
    let completedSections = 0;
    sections.forEach(section => {
      if (section.data.length > 0) completedSections++;
    });
    return (completedSections / sections.length) * 100;
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-2">
            <ShieldFill className="me-2 text-primary" size={28} />
            <h2 className="mb-0">Your Safety Plan</h2>
            {safetyPlan && !editing && (
              <Badge bg="primary" pill className="ms-3">
                <BookmarkHeart /> Saved
              </Badge>
            )}
          </div>
          <p className="text-muted">
            A personal resource to help you navigate difficult moments and stay safe.
            Refer to this plan anytime you feel stressed or overwhelmed.
          </p>
          {feedback && (
            <Alert
              variant={feedback.type}
              onClose={() => setFeedback(null)}
              dismissible
              className="d-flex align-items-center shadow-sm border-0"
            >
              {feedback.type === "success" ? (
                <CheckCircle className="me-2" size={20} />
              ) : (
                <ExclamationTriangle className="me-2" size={20} />
              )}
              {feedback.message}
            </Alert>
          )}
        </Col>
      </Row>

      {safetyPlan && !editing && (
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm bg-primary bg-opacity-10">
              <Card.Body className="p-3">
                <div className="d-flex align-items-center">
                  <CloudSun size={20} className="text-primary me-2" />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">Safety Plan Progress</h6>
                    <ProgressBar
                      now={getPlanCompleteness()}
                      variant="primary"
                      className="mb-1"
                      style={{ height: "8px" }}
                    />
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">
                        {sections.filter(s => s.data.length > 0).length} of {sections.length} sections completed
                      </small>
                      <small className="text-primary">
                        {Math.round(getPlanCompleteness())}%
                      </small>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Card className="border-0 shadow mb-4">
        <Card.Body className="p-4">
          {editing ? (
            <Form>
              <h4 className="mb-4 d-flex align-items-center text-primary">
                <PencilSquare className="me-2" />
                {safetyPlan ? "Edit Your Safety Plan" : "Create Your Safety Plan"}
              </h4>

              {sections.map(section => (
                <Form.Group key={section.key} className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <div className={`p-2 rounded ${section.bgClass} me-2`}>
                      {section.icon}
                    </div>
                    <Form.Label className="fw-bold mb-0">{section.label}</Form.Label>
                  </div>
                  <p className="text-muted small mb-2">{section.description}</p>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name={section.key}
                    value={form[section.key]}
                    onChange={handleChange}
                    placeholder={section.placeholder}
                    className="border-light"
                  />
                  <div className="text-muted mt-1 small">Enter one item per line</div>
                </Form.Group>
              ))}

              <div className="d-flex gap-2 justify-content-end mt-4">
                <Button
                  variant="outline-secondary"
                  onClick={() => setEditing(false)}
                  className="px-4"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  className="px-4 py-2"
                >
                  <CheckCircle className="me-2" />
                  Save My Plan
                </Button>
              </div>
            </Form>
          ) : safetyPlan ? (
            <>
              <h4 className="mb-4 d-flex align-items-center text-primary">
                <ShieldFill className="me-2" />
                My Safety Plan
              </h4>

              <Row>
                {sections.map(section => (
                  <Col lg={6} key={section.key} className="mb-4">
                    <Card
                      className={`h-100 border-0 shadow-sm ${activeSection === section.key ? 'border-primary border-2' : ''}`}
                      onClick={() => setActiveSection(section.key === activeSection ? null : section.key)}
                      style={{ cursor: "pointer" }}
                    >
                      <Card.Header className={`${section.bgClass} border-0 py-3`}>
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <div className={`p-2 rounded-circle bg-white me-2`}>
                              {section.icon}
                            </div>
                            <span className="fw-bold">{section.label}</span>
                          </div>
                          <Badge bg={section.color} pill>
                            {section.data.length} {section.data.length === 1 ? 'item' : 'items'}
                          </Badge>
                        </div>
                      </Card.Header>
                      <Card.Body className="p-3">
                        {section.data.length > 0 ? (
                          <ul className="mb-0 ps-4">
                            {section.data.map((item, idx) => (
                              <li key={idx} className="mb-2">{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-center py-3">
                            <p className="text-muted fst-italic mb-0">No items added yet</p>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="mt-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditing(true);
                              }}
                            >
                              Add {section.label}
                            </Button>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button
                  variant="outline-warning"
                  onClick={() => setEditing(true)}
                  className="px-4"
                >
                  <PencilSquare className="me-1" />
                  Edit Plan
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={handleDelete}
                  className="px-3"
                >
                  <TrashFill className="me-1" />
                  Delete
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <div className="p-3 rounded-circle bg-primary bg-opacity-10 d-inline-flex mb-3">
                <ShieldFill size={40} className="text-primary" />
              </div>
              <h4 className="mb-3">Create Your Personal Safety Plan</h4>
              <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "600px" }}>
                A safety plan helps you identify warning signs, coping strategies, and resources
                to use during difficult moments. Having a plan ready can make all the difference
                when you're feeling overwhelmed.
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setEditing(true)}
                className="px-4 py-2"
              >
                <JournalPlus className="me-2" />
                Create My Safety Plan
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {
        onComplete && (
          <div className="d-flex justify-content-end mt-4">
            <Button
              variant="success"
              onClick={onComplete}
              className="px-4 py-2"
            >
              Continue to Wellness Plan <ArrowRight className="ms-2" />
            </Button>
          </div>
        )
      }

      <Row className="mt-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-3 text-center">
              <EmojiSmile className="text-warning mb-2" size={24} />
              <p className="mb-1 text-muted">
                <strong>Remember:</strong> Your safety plan is private and accessible whenever you need it.
              </p>
              <p className="mb-0 text-muted small">
                If you're experiencing a crisis, please contact emergency services or a crisis helpline immediately.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container >
  );
}