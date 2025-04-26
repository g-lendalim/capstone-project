import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';

export default function GroundingTechniques() {
  const [step, setStep] = useState(1);
  const [showBreathing, setShowBreathing] = useState(true);
  const [showGrounding, setShowGrounding] = useState(true);
  const [affirmation, setAffirmation] = useState('You are safe right now');

  // Breathing cycle states
  const cycle = ['Inhale', 'Hold', 'Exhale', 'Hold'];
  const [breathIndex, setBreathIndex] = useState(0);
  const boxBreathState = cycle[breathIndex];

  const getBreathClass = () => {
    const state = cycle[breathIndex];
    if (state === 'Hold') {
      return breathIndex === 1 ? 'hold-big' : 'hold-small';
    }
    return state.toLowerCase(); 
  };

  const [completedExercises, setCompletedExercises] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  const affirmations = useMemo(
    () => [
    "You are safe right now",
    "This feeling will pass",
    "You are doing great",
    "Take one moment at a time",
    "Your feelings are valid",
    "You've gotten through this before"
    ],
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setBreathIndex((prevIndex) => (prevIndex + 1) % cycle.length);
    }, 4000);

    const affirmationInterval = setInterval(() => {
      setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(affirmationInterval);
    };
  }, [cycle.length, affirmations]);

  const groundingSteps = [
    { num: 5, text: 'things you can see', icon: '👁️' },
    { num: 4, text: 'things you can touch', icon: '🖐️' },
    { num: 3, text: 'things you can hear', icon: '🦻' },
    { num: 2, text: 'things you can smell', icon: '👃' },
    { num: 1, text: 'thing you can taste', icon: '👅' }
  ];

  const completeGroundingStep = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      setStep(1);
      setCompletedExercises(completedExercises + 1);
      setShowProgress(true);
      setTimeout(() => setShowProgress(false), 3000);
    }
  };

  return (
    <>
    <Alert variant="success" className="text-center sticky-top">
        <i className="bi bi-chat-heart-fill me-2"></i>
        <strong>{affirmation}</strong>
    </Alert>
    <Container className="py-4">
        <Row className="mb-4">
            <Col className="d-flex justify-content-between align-items-center">
            <h2>
                <i className="bi bi-heart-pulse-fill text-danger me-2"></i>
                Grounding Techniques
            </h2>
            </Col>
        </Row>

      <Row className="g-4">
        {/* Breathing Exercise Card */}
        <Col lg={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4>
                <i className="bi bi-wind me-2 text-info"></i>
                Box Breathing
              </h4>
              <Button
                variant="outline-info"
                size="sm"
                onClick={() => setShowBreathing(!showBreathing)}
              >
                <i className={`bi ${showBreathing ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
              </Button>
            </Card.Header>
            {showBreathing && (
              <Card.Body className="text-center">
                <div className={`breath-box ${getBreathClass()}`}>
                  <p className="breath-text">{boxBreathState}</p>
                </div>
                <p className="text-muted mt-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Breathe in rhythm — 4 seconds each phase
                </p>
              </Card.Body>
            )}
          </Card>
        </Col>

        {/* 5-4-3-2-1 Grounding Card */}
        <Col lg={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4>
                <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                5-4-3-2-1 Grounding
              </h4>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setShowGrounding(!showGrounding)}
              >
                <i className={`bi ${showGrounding ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
              </Button>
            </Card.Header>

            {showGrounding && (
              <Card.Body className="text-center">
                <div className="grounding-progress mb-3">
                    {groundingSteps.map((_, index) => (
                      <div 
                        key={index} 
                        className={`progress-dot ${index < step - 1 ? 'completed' : ''} ${index === step - 1 ? 'current' : ''}`}
                      />
                    ))}
                </div>

                <div className="grounding-content">
                    <div className="grounding-number">{groundingSteps[step - 1].num}</div>
                    <div className="grounding-prompt">
                      Name {groundingSteps[step - 1].num} {groundingSteps[step - 1].text} 
                      <span className="me-2" style={{ fontSize: '1.5rem' }}>
                        {groundingSteps[step - 1].icon}
                      </span>
                    </div>
                </div>
                
                <Button
                  variant="primary"
                  size="lg"
                  onClick={completeGroundingStep}
                >
                  {step < 5 ? (
                      <>Next <i className="bi bi-arrow-right"></i></>
                    ) : (
                      <>Start Over <i className="bi bi-arrow-repeat"></i></>
                    )}
                </Button>
                {showProgress && (
                  <Alert variant="success" className="mt-3">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Great job! You've completed {completedExercises} grounding cycles.
                  </Alert>
                )}
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="card-title">
                <i className="bi bi-lightning-charge-fill text-warning me-2"></i>
                Feeling overwhelmed? Try one of these fast-acting techniques!
              </h5>
              <Row className="g-3 mt-2">
                <Col md={4}>
                  <div className="d-flex align-items-center">
                    <span className="relief-icon">
                      🧊
                    </span>
                    <div>
                      <h6 className="mb-1">Cold Stimulus</h6>
                      <p className="mb-0 small">Splash cold water on your face or dip your head into a bowl of ice cube to reset your nervous system</p>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-flex align-items-center">
                    <span className="relief-icon">
                      🤜
                    </span>
                    <div>
                      <h6 className="mb-1">Progressive Muscle Relaxation</h6>
                      <p className="mb-0 small">Clench your fists for 5 seconds, then release. Try this with your shoulders, arms, or legs to ease tension</p>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-flex align-items-center">
                    <span className="relief-icon">
                      🦋
                    </span>
                    <div>
                      <h6 className="mb-1">Butterfly Hug</h6>
                      <p className="mb-0 small"> Cross your arms over your chest and gently tap your shoulders, left-right-left. This soothing rhythm can help ground and comfort you</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  );
}