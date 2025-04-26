import React, { useState } from 'react';
import { Container, Tab, Tabs, Card, Row, Col } from 'react-bootstrap';
import { HeartPulseFill, ShieldFill, HeartFill } from 'react-bootstrap-icons';
import GroundingTechniques from '../components/GroundingTechniques';
import SafetyPlan from '../components/SafetyPlan';
import WellnessPlan from '../components/WellnessPlan';

export default function CopingToolkit() {
  const [key, setKey] = useState('grounding');

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col lg={8} className="mx-auto text-center">
          <h1 className="display-5 fw-bold">
            <span className="me-2">🧰</span>
            Your Strength Toolkit
          </h1>
          <p className="lead text-muted">
            Resources and techniques to support your mental wellbeing journey
          </p>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0 p-md-4">
          <Tabs
            id="strength-toolkit-tabs"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-4 nav-pills nav-fill"
          >
            <Tab 
              eventKey="grounding" 
              title={
                <span className="d-flex align-items-center justify-content-center">
                  <HeartPulseFill className="me-2" /> Grounding Techniques
                </span>
              }
            >
              <div className="p-3">
                <GroundingTechniques />
              </div>
            </Tab>
            <Tab 
              eventKey="safety" 
              title={
                <span className="d-flex align-items-center justify-content-center">
                  <ShieldFill className="me-2" /> Safety Plan
                </span>
              }
            >
              <div className="p-3">
                <SafetyPlan />
              </div>
            </Tab>
            <Tab 
              eventKey="wellness" 
              title={
                <span className="d-flex align-items-center justify-content-center">
                  <HeartFill className="me-2" /> Wellness Plan
                </span>
              }
            >
              <div className="p-3">
                <WellnessPlan />
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
}
