import React from "react";
import { Container, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { JournalText, PeopleFill, TelephoneForwardFill, HeartFill } from "react-bootstrap-icons";

export default function SupportPage() {
    return (
        <Container className="my-5">
            <h2 className="mb-3 text-center fw-bold">You've Got This <HeartFill className="text-warning ms-2" /></h2>
            <p className="text-center fs-5 mb-4">Every step forward matters. Discover your pathways to feeling better.</p>

            <Row className="mt-5 g-4">
                <Col md={4} className="mb-4">
                    <Card 
                        as={Link} 
                        to="/coping" 
                        className="text-center text-decoration-none h-100 shadow hover-shadow transition"
                        style={{ borderRadius: "12px", borderLeft: "4px solid #4e95ed", transition: "transform 0.3s" }}
                        onMouseOver={e => e.currentTarget.style.transform = "translateY(-5px)"}
                        onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
                    >
                        <Card.Body className="py-4">
                            <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "80px", height: "80px" }}>
                                <JournalText size={50} className="text-primary" />
                            </div>
                            <Card.Title className="fw-bold fs-4 mb-3">Your Strength Toolkit</Card.Title>
                            <Card.Text className="text-muted">
                                Powerful techniques to find calm and build resilience, ready whenever you need them.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} className="mb-4">
                    <Card 
                        as={Link} 
                        to="/contact" 
                        className="text-center text-decoration-none h-100 shadow hover-shadow transition"
                        style={{ borderRadius: "12px", borderLeft: "4px solid #42b883", transition: "transform 0.3s" }}
                        onMouseOver={e => e.currentTarget.style.transform = "translateY(-5px)"}
                        onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
                    >
                        <Card.Body className="py-4">
                            <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "80px", height: "80px" }}>
                                <PeopleFill size={50} className="text-success" />
                            </div>
                            <Card.Title className="fw-bold fs-4 mb-3">Your Support Circle</Card.Title>
                            <Card.Text className="text-muted">
                                People who care about you and are ready to listen, support, and stand by your side.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} className="mb-4">
                    <Card 
                        as={Link} 
                        to="/emergency" 
                        className="text-center text-decoration-none h-100 shadow hover-shadow transition"
                        style={{ borderRadius: "12px", borderLeft: "4px solid #ff7676", transition: "transform 0.3s" }}
                        onMouseOver={e => e.currentTarget.style.transform = "translateY(-5px)"}
                        onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
                    >
                        <Card.Body className="py-4">
                            <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "80px", height: "80px" }}>
                                <TelephoneForwardFill size={50} className="text-danger" />
                            </div>
                            <Card.Title className="fw-bold fs-4 mb-3">Immediate Helpline</Card.Title>
                            <Card.Text className="text-muted">
                                Compassionate professionals ready to help right now, whenever you're feeling overwhelmed.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <div className="mt-5 text-center">
                <p className="fs-5 fw-light">
                    <em>Reaching out takes courage. You're already taking brave steps toward healing.</em>
                </p>
            </div>
        </Container>
    );
}