import React from 'react';
import { Row, Col, Modal, Button, Form } from 'react-bootstrap';

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
  setShowCalendar,
}) {
  const safeFormData = {
    id: formData.id || '',
    type: formData.type || '',
    time: formData.time || '',
    date: formData.date || '',
    label: formData.label || '',
    reminder: formData.reminder || '',
    checklist: Array.isArray(formData.checklist) ? formData.checklist : [],
    isEnabled: formData.isEnabled !== undefined ? formData.isEnabled : true,
  };

  const handleReminderChange = (e) => {
    const value = e.target.value;
    handleFormChange(e);
    setTimeout(() => {
      if (value && formData.date && formData.time) {
        const hoursBefore = parseInt(value.split(' ')[0]);
        const dateTimeStr = `${formData.date}T${formData.time}:00`;
        const selectedDateTime = new Date(dateTimeStr);

        if (!isNaN(selectedDateTime.getTime())) {
          const reminderTime = new Date(selectedDateTime);
          reminderTime.setHours(reminderTime.getHours() - hoursBefore);
          handleReminder(selectedDateTime, hoursBefore);
        } else {
          console.warn('Invalid date/time for reminder calculation:', dateTimeStr);
        }
      }
    }, 0);
  };

  const handleTimeChange = (e) => {
    const timeValue = e.target.value || '';
    handleFormChange({
      target: {
        name: 'time',
        value: timeValue
      }
    });
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value || '';
    handleFormChange({
      target: {
        name: 'date',
        value: dateValue
      }
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ backgroundColor: '#e6e6fa', color: '#4b0082' }}>
        <Modal.Title className="text-center w-100">
          {safeFormData.id ? 'Edit Your Alarm' : 'Create a New Alarm'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: '#f8f8ff' }}>
        <p className="text-center mb-4" style={{ color: '#4b0082' }}>
          {safeFormData.id
            ? 'Update your alarm to stay on track with your mental health goals.'
            : 'Create a personalized alarm to support your mental health routine.'}
        </p>
        <Form>
          <Form.Group>
            <Form.Label style={{ color: '#4b0082' }}>Choose Alarm Type</Form.Label>
            <Form.Control
              as="select"
              name="type"
              value={safeFormData.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              style={{ borderColor: '#4b0082' }}
            >
              <option value="">Select type</option>
              <option value="Morning">Rise & Shine</option>
              <option value="Bedtime">Time to Wind Down</option>
              <option value="Therapy">Therapy Time</option>
              <option value="Medication">Pill Time</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label style={{ color: '#4b0082' }}>Customize Label</Form.Label>
            <Form.Control
              type="text"
              name="label"
              value={safeFormData.label}
              onChange={handleFormChange}
              placeholder={
                safeFormData.type === 'Morning'
                  ? 'Begin with Purpose'
                  : safeFormData.type === 'Bedtime'
                    ? 'Rest and Recharge'
                    : safeFormData.type === 'Therapy'
                      ? 'Upcoming Appointment'
                      : safeFormData.type === 'Medication'
                        ? 'Take Your Medication'
                        : ''
              }
              style={{ borderColor: '#4b0082' }}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label style={{ color: '#4b0082' }}>
              {safeFormData.type === 'Therapy' ? 'Set Date and Time' : 'Set Time'}
            </Form.Label>

            {safeFormData.type === 'Therapy' ? (
              <Row className="g-2">
                <Col xs={5}>
                  <Form.Control
                    type="date"
                    name="date"
                    value={safeFormData.date}
                    onChange={handleDateChange}
                    style={{ borderColor: '#4b0082' }}
                  />
                </Col>
                <Col xs={5}>
                  <Form.Control
                    type="time"
                    name="time"
                    value={safeFormData.time}
                    onChange={handleTimeChange}
                    style={{ borderColor: '#4b0082' }}
                  />
                </Col>
              </Row>
            ) : (
              <Form.Control
                type="time"
                name="time"
                value={safeFormData.time}
                onChange={handleTimeChange}
                style={{ borderColor: '#4b0082' }}
              />
            )}
          </Form.Group>

          {showCalendar && (
            <div className="mt-3 p-3 border rounded">
              <h6 style={{ color: '#4b0082' }}>Select Date</h6>
              <Form.Control
                type="date"
                name="date"
                value={safeFormData.date}
                onChange={handleDateChange}
              />
              <div className="d-flex justify-content-end mt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowCalendar(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {safeFormData.type === 'Therapy' && (
            <Form.Group className="mt-3">
              <Form.Label style={{ color: '#4b0082' }}>Set Reminder</Form.Label>
              <Form.Control
                as="select"
                name="reminder"
                value={safeFormData.reminder}
                onChange={handleReminderChange}
                style={{
                  borderColor: '#4b0082',
                  color: '#4b0082',
                  backgroundColor: '#f8f8ff',
                }}
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
          )}

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
            {safeFormData.checklist.map((item, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <Form.Control
                  type="text"
                  value={item || ''}
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
        <Button
          variant="secondary"
          onClick={onHide}
          style={{ backgroundColor: '#dcdcdc', color: '#4b0082' }}
        >
          Close
        </Button>
        <Button
          onClick={handleSubmit}
          style={{ backgroundColor: '#4b0082', color: 'white' }}
        >
          {safeFormData.id ? 'Update Alarm' : 'Save Alarm'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}