import React from 'react';
import { Card, Col, Row, Button, Badge, Image } from 'react-bootstrap';
import { HeartPulseFill, PersonHeart, TelephoneFill, Globe, ClockFill, GeoAltFill, Whatsapp } from 'react-bootstrap-icons';

export default function ServiceCard({ service }) {
    return (
        <Card className={`mb-3 shadow-sm border-left-${service.type === 'Emergency' ? 'danger' : 'info'}`}
            style={{
                borderLeft: service.type === 'Emergency' ? '4px solid #dc3545' : '4px solid #0dcaf0',
                transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <Card.Body>
                <Row>
                    <Col xs={12} md={3} className="text-center mb-3 mb-md-0 d-flex align-items-center justify-content-center">
                        {service.image ? (
                            <Image
                                src={service.image}
                                alt={`${service.name} logo`}
                                className="img-fluid"
                                style={{
                                    maxHeight: '120px',
                                    objectFit: 'contain'
                                }}
                            />
                        ) : (
                            <div className="d-flex align-items-center justify-content-center"
                                style={{
                                    height: '120px',
                                    width: '120px',
                                    backgroundColor: service.type === 'Emergency' ? '#ffebee' : '#e3f2fd',
                                    borderRadius: '50%'
                                }}>
                                {service.type === 'Emergency' ?
                                    <HeartPulseFill size={60} className="text-danger" /> :
                                    <PersonHeart size={60} className="text-primary" />
                                }
                            </div>
                        )}
                    </Col>

                    <Col xs={12} md={9}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <Card.Title className="mb-1">
                                    {service.name}
                                    {service.featured && (
                                        <StarFill className="ms-2 text-warning" size={16} />
                                    )}
                                </Card.Title>
                            </div>
                            <Badge
                                bg={service.type === 'Emergency' ? 'danger' : 'info'}
                                className="mb-2"
                            >
                                {service.type}
                            </Badge>
                        </div>

                        <p className="text-muted mb-3">{service.description}</p>

                        <div className="d-flex flex-wrap gap-3 mb-3">
                            <div className="d-flex align-items-center">
                                <GeoAltFill className="me-1 text-muted" />
                                <small>{service.state}</small>
                            </div>
                            <div className="d-flex align-items-center">
                                <ClockFill className="me-1 text-muted" />
                                <small>{service.hours}</small>
                            </div>
                        </div>

                        <Row className="g-2">
                            <Col sm={6}>
                                <Button
                                    variant={service.type === 'Emergency' ? 'danger' : 'primary'}
                                    className="w-100 d-flex align-items-center justify-content-center"
                                    href={`tel:${service.phone}`}
                                >
                                    <TelephoneFill className="me-2" />
                                    {service.phone}
                                </Button>
                            </Col>
                            {service.whatsapp && (
                                <Col sm={6}>
                                    <Button
                                        variant="success"
                                        className="w-100 d-flex align-items-center justify-content-center"
                                        href={`https://wa.me/${service.whatsapp.replace(/[^\d]/g, '')}`}
                                        target="_blank"
                                    >
                                        <Whatsapp className="me-2" />
                                        WhatsApp
                                    </Button>
                                </Col>
                            )}
                            <Col sm={12} className="mt-2">
                                <Button
                                    variant="outline-secondary"
                                    className="w-100 d-flex align-items-center justify-content-center"
                                    href={service.website}
                                    target="_blank"
                                >
                                    <Globe className="me-2" />
                                    Visit Website
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}