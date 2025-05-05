import React from 'react';
import { Row, Col, Modal, Button, Form } from 'react-bootstrap';

export default function AlarmFormModal({
  show,
  onHide,
  formData,
  handleFormChange,
  handleTypeChange,
  handleChecklistChange,
  addChecklistItem,
  removeChecklistItem,
  handleSubmit,
}) {
  const safeFormData = {
    id: formData.id || '',
    type: formData.type || '',
    time: formData.time || '',
    date: formData.date ? formData.date.split('T')[0] : '',
    label: formData.label || '',
    reminder: formData.reminder || '',
    checklist: Array.isArray(formData.checklist) ? formData.checklist : [],
    isEnabled: formData.isEnabled !== undefined ? formData.isEnabled : true,
  };

  const showCalendar = safeFormData.type === 'Therapy'

  const reminderOptions = [
    { label: '1 Hour Before', value: 1 },
    { label: '2 Hours Before', value: 2 },
    { label: '3 Hours Before', value: 3 },
    { label: '4 Hours Before', value: 4 },
    { label: '6 Hours Before', value: 6 },
    { label: '12 Hours Before', value: 12 },
    { label: '24 Hours Before', value: 24 },
  ]; 

  const handleReminderChange = (e) => {
    const offsetHours = parseInt(e.target.value, 10);

    // If there's no time or date, don't update reminder
    if (!safeFormData.date || !safeFormData.time || isNaN(offsetHours)) {
      handleFormChange({
        target: {
          name: 'reminderOffset',
          value: '',
        },
      });
      handleFormChange({
        target: {
          name: 'reminder',
          value: '',
        },
      });
      return;
    }

    const alarmDateTimeString = `${safeFormData.date}T${safeFormData.time}`;
    const alarmDateTime = new Date(alarmDateTimeString);
    const reminderDateTime = new Date(alarmDateTime.getTime() - offsetHours * 60 * 60 * 1000);
    handleFormChange({
      target: {
        name: 'reminderOffset',
        value: offsetHours,
      },
    });
    handleFormChange({
      target: {
        name: 'reminder',
        value: reminderDateTime,
      },
    });
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
            <Form.Select
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
            </Form.Select>
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

            {safeFormData.type === 'Therapy' && showCalendar ? (
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

          {safeFormData.type === 'Therapy' && (
            <Form.Group className="mt-3">
              <Form.Label style={{ color: '#4b0082' }}>Set Reminder</Form.Label>
              <Form.Select
                name="reminderOffset"
                value={safeFormData.reminderOffset}
                onChange={handleReminderChange}
              >
                <option value="">No Reminder</option>
                {reminderOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
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