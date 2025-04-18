import React from 'react';
import { OverlayTrigger, Tooltip, Row, Col, Modal, Button, Form} from 'react-bootstrap';

export default function AlarmFormModal({
  show,
  onHide,
  formData,
  handleFormChange,
  handleTypeChange,
  handleReminder,
  handleChecklistChange,
  addChecklistItem,
  removeChecklistItem,
  handleSubmit,
  showCalendar,
  setShowCalendar
}) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ backgroundColor: '#e6e6fa', color: '#4b0082' }}>
        <Modal.Title className="text-center w-100">
          {formData.id ? 'Edit Your Alarm' : 'Create a New Alarm'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: '#f8f8ff' }}>
        <p className="text-center mb-4" style={{ color: '#4b0082' }}>
          {formData.id
            ? 'Update your alarm to stay on track with your mental health goals.'
            : 'Create a personalized alarm to support your mental health routine.'}
        </p>
        <Form>
          <Form.Group>
            <Form.Label style={{ color: '#4b0082' }}>Choose Alarm Type</Form.Label>
            <Form.Control
              as="select"
              name="type"
              value={formData.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              style={{borderColor: '#4b0082'}}
            >
              <option value="Morning">Rise & Shine</option>
              <option value="Bedtime">Time to Wind Down</option>
              <option value="Visit">Therapy Time</option>
              <option value="Medication">Pill Time</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label style={{ color: '#4b0082' }}>Customize Label</Form.Label>
            <Form.Control
              type="text"
              name="label"
              value={formData.label}
              onChange={handleFormChange}
              placeholder={
                formData.type === "Morning"
                  ? "Begin with Purpose"
                  : formData.type === "Bedtime"
                  ? "Rest and Recharge"
                  : formData.type === "Visit"
                  ? "Upcoming Appointment"
                  : formData.type === "Medication"
                  ? "Take Your Medication"
                  : ""
              }
              style={{ borderColor: '#4b0082' }}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label style={{ color: '#4b0082' }}>
              {formData.type === 'Visit' ? 'Set Date and Time' : 'Set Time'}
            </Form.Label>

            {formData.type === 'Visit' ? (
              <Row className="g-2">
                <Col xs={5}>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    style={{ borderColor: '#4b0082' }}
                  />
                </Col>
                <Col xs={5}>
                  <Form.Control
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleFormChange}
                    style={{ borderColor: '#4b0082' }}
                  />
                </Col>
              </Row>
            ) : (
              <Form.Control
                type="time"
                name="time"
                value={formData.time}
                onChange={handleFormChange}
                style={{ borderColor: '#4b0082' }}
              />
            )}
          </Form.Group>

          <Modal show={showCalendar} onHide={() => setShowCalendar(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Select Date</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowCalendar(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {formData.type === 'Visit' && 
            <Form.Group className="mt-3">
              <Form.Label style={{ color: '#4b0082' }}>Set Reminder</Form.Label>
              <Form.Control
                as="select"
                name="reminder"
                value={formData.reminder || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFormChange(e); 
                
                  if (value) {
                    const hoursBefore = parseInt(value.split(' ')[0]); // Extract the number part from "X hours before"
                
                    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
                    if (!isNaN(selectedDateTime)) {
                      handleReminder(selectedDateTime, hoursBefore);
                    } else {
                      console.warn("Invalid date/time for reminder calculation.");
                    }
                  }
                }}                
                style={{ borderColor: '#4b0082', color: '#4b0082', backgroundColor: '#f8f8ff' }}
              >
                <option value="">No Reminder</option>
                <option value="1 hour before">1 Hour Before</option>
                <option value="2 hours before">2 Hours Before</option>
                <option value="3 hours before">3 Hours Before</option>
                <option value="4 hours before">4 Hours Before</option>
                <option value="6 hours before">6 Hours Before</option>
                <option value="12 hours before">12 Hours Before</option>
                <option value="24 hours before">24 Hours Before</option>
              </Form.Control>
            </Form.Group>
          }

          <Form.Group className="mt-3">
            <Form.Label style={{ color: '#4b0082' }}>Checklist</Form.Label>
            <Button
              variant="outline-info"
              onClick={addChecklistItem}
              style={{
                borderColor: '#4b0082',
                color: '#4b0082',
                backgroundColor: 'transparent',
              }}
              className="mb-3 w-100"
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#d6cadd')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              <i className="bi bi-plus-circle"></i> Add Checklist
            </Button>
            {formData.checklist.map((item, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <Form.Control
                  type="text"
                  value={item}
                  onChange={(e) => handleChecklistChange(index, e.target.value)}
                  style={{ borderColor: '#4b0082' }}
                  placeholder={`Checklist ${index + 1}`}
                  className="me-2"
                />
                <Button
                  variant="outline-danger"
                  onClick={() => removeChecklistItem(index)}
                  style={{ borderColor: '#ff6f61', color: '#ff6f61' }}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </div>
            ))}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: '#e6e6fa' }}>
        <Button variant="secondary" onClick={onHide} style={{ backgroundColor: '#dcdcdc', color: '#4b0082' }}>
          Close
        </Button>
        <Button
          onClick={handleSubmit}
          style={{ backgroundColor: '#4b0082', color: 'white' }}
        >
          {formData.id ? 'Update Alarm' : 'Save Alarm'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
