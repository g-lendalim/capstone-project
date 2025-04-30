import React, { useState } from 'react';
import {
  Container, Card, Form, Row, Col, Badge, Button, Alert,
  InputGroup, Accordion
} from 'react-bootstrap';
import {
  TelephoneFill,
  HeartPulseFill,
  Search,
  FilterCircleFill,
  InfoCircleFill
} from 'react-bootstrap-icons';
import services from "../hooks/support";
import ServiceCard from "../components/ServiceCard";

export default function EmergencyHotline() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    state: 'all',
    type: 'all',
    availability: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  const filteredServices = services.filter(service => {
    const matchesSearch =
      service.name.toLowerCase().includes(query.toLowerCase()) ||
      service.state.toLowerCase().includes(query.toLowerCase()) ||
      service.type.toLowerCase().includes(query.toLowerCase()) ||
      service.description.toLowerCase().includes(query.toLowerCase());

    const matchesType = filters.type === 'all' || service.type === filters.type;
    const matchesState = filters.state === 'all' || service.state === filters.state;
    const matchesAvailability =
      filters.availability === 'all' ||
      (filters.availability === '24/7' && service.hours === '24/7');

    return matchesSearch && matchesType && matchesState && matchesAvailability;
  });

  const states = ['all', ...new Set(services.map(service => service.state))];



  return (
    <Container className="py-5">
      {/* Emergency Alert Banner */}
      <Alert variant="danger" className="mb-4 shadow">
        <Row className="align-items-center">
          <Col xs={12} md={7}>
            <h2 className="d-flex align-items-center">
              <HeartPulseFill className="me-2" size={30} />
              Need Immediate Help?
            </h2>
            <p className="mb-0">Free, confidential support is available 24/7</p>
          </Col>
          <Col xs={12} md={5} className="mt-3 mt-md-0">
            <Button
              variant="light"
              size="lg"
              className="w-100 d-flex align-items-center justify-content-center"
              href="tel:03-7627 2929"
              style={{ fontWeight: 'bold' }}
            >
              <TelephoneFill className="me-2" size={18} />
              Call Befrienders (03-7627 2929)
            </Button>
          </Col>
        </Row>
      </Alert>

      {/* Search and Filter Section */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form>
            <Row>
              <Col md={9}>
                <InputGroup className="mb-3 mb-md-0">
                  <InputGroup.Text id="search-addon">
                    <Search />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search for help and support services..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search"
                    aria-describedby="search-addon"
                  />
                  {query && (
                    <Button
                      variant="outline-secondary"
                      onClick={() => setQuery('')}
                    >
                      Clear
                    </Button>
                  )}
                </InputGroup>
              </Col>
              <Col md={3}>
                <Button
                  variant="outline-secondary"
                  className="w-100"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FilterCircleFill className="me-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </Col>
            </Row>

            {showFilters && (
              <Row className="mt-3 gx-2">
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Service Type</Form.Label>
                    <Form.Select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                    >
                      <option value="all">All Types</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Counseling">Counseling</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Select
                      value={filters.state}
                      onChange={(e) => handleFilterChange('state', e.target.value)}
                    >
                      <option value="all">All Locations</option>
                      {states
                        .filter(state => state !== 'all')
                        .map((state, idx) => (
                          <option key={idx} value={state}>{state}</option>
                        ))
                      }
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Availability</Form.Label>
                    <Form.Select
                      value={filters.availability}
                      onChange={(e) => handleFilterChange('availability', e.target.value)}
                    >
                      <option value="all">Any Hours</option>
                      <option value="24/7">24/7 Services Only</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}
          </Form>
        </Card.Body>
      </Card>

      {/* Info Card */}
      <Alert variant="info" className="mb-4">
        <div className="d-flex">
          <InfoCircleFill size={20} className="me-2 flex-shrink-0 mt-1" />
          <div>
            <strong>Help is available.</strong> If you're going through a difficult time, reach out to any of these services. You don't have to face your challenges alone.
          </div>
        </div>
      </Alert>

      {/* Services List */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Available Support Services</h3>
          <Badge bg="secondary" pill>
            {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found
          </Badge>
        </div>

        {filteredServices.length === 0 ? (
          <Alert variant="light" className="text-center">
            No services found matching your search criteria. Try adjusting your filters.
          </Alert>
        ) : (
          filteredServices.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))
        )}
      </div>

      {/* FAQ Accordion */}
      <Accordion className="mt-4 mb-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header>How to choose the right service?</Accordion.Header>
          <Accordion.Body>
            <ul className="mb-0">
              <li><strong>Emergency services</strong> are best for immediate crisis situations, suicidal thoughts, or when you need someone to talk to right away.</li>
              <li><strong>Counseling services</strong> offer ongoing support, therapy, and mental health resources for longer-term care.</li>
              <li>Consider the operating hours and whether they offer your preferred communication method (phone, WhatsApp, etc.).</li>
              <li>All services listed are confidential and staffed by trained professionals or volunteers.</li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>What to expect when you call a helpline?</Accordion.Header>
          <Accordion.Body>
            <p>When you call a helpline, a trained counselor or volunteer will:</p>
            <ul className="mb-0">
              <li>Listen to your concerns without judgment</li>
              <li>Help you explore your feelings and situation</li>
              <li>Offer emotional support and guidance</li>
              <li>Provide information about additional resources if needed</li>
              <li>Respect your privacy and maintain confidentiality</li>
            </ul>
            <p className="mt-3 mb-0">There's no right or wrong way to use these services - you can share as much or as little as you feel comfortable with.</p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="text-center mt-4 pb-5">
        <p className="text-muted">
          <small>
            If you're experiencing a life-threatening emergency, please call 999 immediately.
          </small>
        </p>
      </div>
    </Container>
  );
}